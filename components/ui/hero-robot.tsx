import { useEffect, useRef, useState } from 'react';
import type { Application } from '@splinetool/runtime';

// Desktop with hardware WebGL: a loader holds the space while the Spline runtime, the scene, and
// its WASM module download in parallel and the scene is built. The loader only animates transform
// and opacity, so it stays smooth while the main thread is busy building the scene. Once the scene
// is ready it is paused until the page is idle, then the loader exits and the scene plays its
// opening camera move as the entrance, with cursor tracking from the first frame.
//
// Everywhere else (phones, tablets, software rendering, or a failed load): a poster that is the
// first frame of a recorded idle loop, and the loop itself once the page has loaded.
// With reduced motion or data saving requested, only the poster is shown.
//
// The inline script in index.html adds the robot-live class before first paint when the device
// can take the live path, so the right layer is visible from the start.

const WASM_PATH = '/spline';
const LOADER_EXIT_MS = 450;
const OFFSCREEN_STOP_DELAY_MS = 15000;
const LOADER_LABEL = 'Waking up your robot friend';
const STAGE_PROGRESS = [0.55, 0.92, 1];
const STAGE_DURATION_MS = [1200, 6000, 300];

type Phase = 'idle' | 'loading' | 'entering' | 'live' | 'fallback';
type NavigatorHints = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

function wantsStaticMedia() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return reducedMotion || Boolean((navigator as NavigatorHints).connection?.saveData);
}

// True when WebGL runs on hardware. Software rendering would pin the CPU.
function hasHardwareWebGL() {
  const gl = document.createElement('canvas').getContext('webgl', { failIfMajorPerformanceCaveat: true });
  gl?.getExtension('WEBGL_lose_context')?.loseContext();
  return Boolean(gl);
}

// Runs the callback once the page has finished loading and the browser is idle.
function afterLoadWhenIdle(callback: () => void, timeout: number) {
  const win = window as IdleWindow;
  let idleId = 0;
  let timerId = 0;
  const schedule = () => {
    if (win.requestIdleCallback) idleId = win.requestIdleCallback(callback, { timeout });
    else timerId = window.setTimeout(callback, 200);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
  return () => {
    window.removeEventListener('load', schedule);
    if (idleId) win.cancelIdleCallback?.(idleId);
    if (timerId) window.clearTimeout(timerId);
  };
}

interface HeroRobotProps {
  scene: string;
  poster: string;
  posterSrcSet: string;
  videoWebm: string;
  videoMp4: string;
  className?: string;
}

export function HeroRobot({ scene, poster, posterSrcSet, videoWebm, videoMp4, className = '' }: HeroRobotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const phaseRef = useRef<Phase>('idle');
  const inViewRef = useRef(true);
  const loopActiveRef = useRef(false);
  const stoppedRef = useRef(false);
  const stopTimerRef = useRef(0);
  const [phase, setPhaseState] = useState<Phase>('idle');
  const [stage, setStage] = useState(0);

  const setPhase = (next: Phase) => {
    phaseRef.current = next;
    setPhaseState(next);
  };

  const startLoop = () => {
    const video = videoRef.current;
    if (!video || wantsStaticMedia()) return;
    loopActiveRef.current = true;
    video.muted = true;
    if (inViewRef.current) video.play().catch(() => {});
  };

  useEffect(() => {
    const root = document.documentElement;
    const canvas = canvasRef.current;
    if (!canvas || !root.classList.contains('robot-live') || !hasHardwareWebGL()) {
      root.classList.remove('robot-live');
      setPhase('fallback');
      return afterLoadWhenIdle(startLoop, 1000);
    }

    setPhase('loading');
    let disposed = false;
    let app: Application | null = null;
    let cancelIdle = () => {};
    let exitTimer = 0;

    const fallBack = () => {
      if (disposed) return;
      root.classList.remove('robot-live');
      setPhase('fallback');
      cancelIdle = afterLoadWhenIdle(startLoop, 1000);
    };

    // Warms the HTTP cache for the module the runtime fetches while it starts.
    fetch(`${WASM_PATH}/process.wasm`).catch(() => undefined);
    Promise.all([
      import('@splinetool/runtime'),
      fetch(scene).then((response) => {
        if (!response.ok) throw new Error(`Scene request failed with ${response.status}`);
        return response.arrayBuffer();
      }),
    ])
      .then(async ([{ Application: SplineApplication }, sceneData]) => {
        if (disposed) return;
        setStage(1);
        // Let the new stage paint before the scene build occupies the main thread.
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        if (disposed) return;
        app = new SplineApplication(canvas, { wasmPath: WASM_PATH });
        await app.start(sceneData);
        if (disposed) return;
        // Hold the scene until the page is quiet, so the entrance plays without hitches.
        // Playing it again later restarts the opening camera move from the beginning.
        app.stop();
        appRef.current = app;
        setStage(2);
        cancelIdle = afterLoadWhenIdle(() => {
          if (disposed) return;
          setPhase('entering');
          exitTimer = window.setTimeout(() => {
            if (disposed || !appRef.current) return;
            if (inViewRef.current) appRef.current.play();
            else stoppedRef.current = true;
            setPhase('live');
          }, LOADER_EXIT_MS);
        }, 600);
      })
      .catch(fallBack);

    return () => {
      disposed = true;
      cancelIdle();
      window.clearTimeout(exitTimer);
      appRef.current = null;
      app?.dispose();
    };
  }, [scene]);

  // Off screen: pause the loop, and stop the scene after a delay. Back on screen: resume.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(([entry]) => {
      const wasInView = inViewRef.current;
      inViewRef.current = entry.isIntersecting;
      const video = videoRef.current;
      if (!entry.isIntersecting) {
        video?.pause();
        if (appRef.current && phaseRef.current === 'live' && !stoppedRef.current && !stopTimerRef.current) {
          stopTimerRef.current = window.setTimeout(() => {
            stopTimerRef.current = 0;
            if (inViewRef.current || !appRef.current) return;
            appRef.current.stop();
            stoppedRef.current = true;
          }, OFFSCREEN_STOP_DELAY_MS);
        }
        return;
      }
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = 0;
      if (loopActiveRef.current) video?.play().catch(() => {});
      if (!wasInView && stoppedRef.current && appRef.current && phaseRef.current === 'live') {
        stoppedRef.current = false;
        appRef.current.play();
      }
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      window.clearTimeout(stopTimerRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} data-phase={phase} className={`robot relative ${className}`}>
      <div className="robot-loop absolute inset-0">
        <img
          src={poster}
          srcSet={posterSrcSet}
          sizes="(min-width: 1024px) 600px, (min-width: 640px) 370px, 300px"
          width={575}
          height={658}
          alt=""
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain object-bottom"
        />
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-contain object-bottom"
        >
          <source src={videoWebm} type="video/webm; codecs=vp9" />
          <source src={videoMp4} type="video/mp4" />
        </video>
      </div>

      <div className="robot-loader absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <div className="robot-buddy">
          <span className="robot-buddy-antenna" />
          <div className="robot-buddy-head">
            <div className="robot-buddy-eyes">
              <span className="robot-buddy-eye" />
              <span className="robot-buddy-eye" />
            </div>
          </div>
        </div>
        <span className="robot-buddy-shadow" />
        <p className="mt-7 text-sm font-semibold text-slate-200">{LOADER_LABEL}</p>
        <div className="mt-3 h-1 w-40 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full w-full origin-left rounded-full bg-gradient-to-r from-blue-500 to-cyan-300 transition-transform ease-out ${stage === 0 ? 'robot-progress-start' : ''}`}
            style={{ transform: `scaleX(${STAGE_PROGRESS[stage]})`, transitionDuration: `${STAGE_DURATION_MS[stage]}ms` }}
          />
        </div>
      </div>

      <canvas ref={canvasRef} aria-hidden="true" className="robot-canvas absolute inset-0 h-full w-full" />
    </div>
  );
}
