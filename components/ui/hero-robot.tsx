import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Application } from '@splinetool/runtime';

const Spline = lazy(() => import('@splinetool/react-spline'));

// The robot is shown in three layers that hand off without a visible change:
// 1. A poster, which is the exact first frame of the idle loop.
// 2. A 12-second idle loop recorded from the scene. It starts once the page has loaded and
//    plays off the main thread, so it keeps moving while anything else is busy.
// 3. The live Spline scene, which adds cursor tracking. It loads in the background when the
//    browser is idle, only on large pointer screens with hardware WebGL.
// The scene plays an opening camera move whenever it starts or resumes, so each time it does,
// the loop is shown on top and the scene only crossfades in once its camera has come to rest.
// The scene is stopped only after the hero has been out of view for a while.
// With reduced motion or data saving requested, only the poster is shown.

const CROSSFADE_MS = 500;
// Settle detection counts rendered frames, so a long main-thread block cannot end it early.
const CAMERA_STILL_FRAMES = 18;
const CAMERA_NEVER_MOVED_FRAMES = 90;
const CAMERA_MAX_FRAMES = 420;
// Short trips away from the hero keep the scene running, so coming back needs no handoff.
const OFFSCREEN_STOP_DELAY_MS = 15000;

type NavigatorHints = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

class SceneErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

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
  const appRef = useRef<Application | null>(null);
  const loopActiveRef = useRef(false);
  const inViewRef = useRef(true);
  const sceneVisibleRef = useRef(false);
  const settleFrameRef = useRef(0);
  const stopTimerRef = useRef(0);
  const stoppedRef = useRef(false);
  const [loadScene, setLoadScene] = useState(false);
  const [sceneVisible, setSceneVisible] = useState(false);
  const [instant, setInstant] = useState(false);

  const clearSettle = useCallback(() => {
    cancelAnimationFrame(settleFrameRef.current);
    settleFrameRef.current = 0;
  }, []);

  const showLoop = useCallback((immediately: boolean) => {
    sceneVisibleRef.current = false;
    loopActiveRef.current = true;
    setInstant(immediately);
    setSceneVisible(false);
    if (inViewRef.current && !wantsStaticMedia()) videoRef.current?.play().catch(() => {});
  }, []);

  // Watches the scene camera every frame and reveals the scene once the camera has moved and then
  // held still. Frames stop in hidden tabs, so nothing is revealed while the tab is hidden.
  const armSettle = useCallback(() => {
    clearSettle();
    const app = appRef.current;
    if (!app || document.hidden || !inViewRef.current) return;
    const camera = app.findObjectByName('Camera 2') ?? app.getAllObjects().find((o) => /camera/i.test(o.name));
    const pose = () => {
      if (!camera) return '';
      const { position: p, rotation: r } = camera;
      return [p.x, p.y, p.z, r.x, r.y, r.z].map((v) => Math.round(v * 2)).join(',');
    };
    let last = pose();
    let moved = false;
    let stillFrames = 0;
    let frames = 0;
    const tick = () => {
      frames += 1;
      const current = pose();
      if (current !== last) {
        moved = true;
        stillFrames = 0;
        last = current;
      } else {
        stillFrames += 1;
      }
      const settled = (moved && stillFrames >= CAMERA_STILL_FRAMES) || (!moved && frames >= CAMERA_NEVER_MOVED_FRAMES) || frames >= CAMERA_MAX_FRAMES;
      if (!settled) {
        settleFrameRef.current = requestAnimationFrame(tick);
        return;
      }
      settleFrameRef.current = 0;
      if (!appRef.current || document.hidden || !inViewRef.current) return;
      sceneVisibleRef.current = true;
      setInstant(false);
      setSceneVisible(true);
    };
    settleFrameRef.current = requestAnimationFrame(tick);
  }, [clearSettle]);

  // Start the idle loop after load.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || wantsStaticMedia()) return;
    return afterLoadWhenIdle(() => {
      loopActiveRef.current = !sceneVisibleRef.current;
      video.muted = true;
      if (loopActiveRef.current && inViewRef.current) video.play().catch(() => {});
    }, 1000);
  }, []);

  // Fetch the live scene in the background on capable desktops.
  useEffect(() => {
    const capable = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches;
    const memory = (navigator as NavigatorHints).deviceMemory;
    if (!capable || wantsStaticMedia() || (memory !== undefined && memory < 4)) return;
    return afterLoadWhenIdle(() => {
      if (hasHardwareWebGL()) setLoadScene(true);
    }, 3000);
  }, []);

  // Off screen: pause the loop at once, and stop the scene after a delay, putting the loop back
  // on top without a transition. Back on screen after a stop: resume the scene and let its
  // opening move play under the loop again.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(([entry]) => {
      const wasInView = inViewRef.current;
      inViewRef.current = entry.isIntersecting;
      const video = videoRef.current;
      if (!entry.isIntersecting) {
        clearSettle();
        video?.pause();
        if (appRef.current && !stopTimerRef.current) {
          stopTimerRef.current = window.setTimeout(() => {
            stopTimerRef.current = 0;
            if (inViewRef.current || !appRef.current) return;
            appRef.current.stop();
            stoppedRef.current = true;
            if (sceneVisibleRef.current) showLoop(true);
          }, OFFSCREEN_STOP_DELAY_MS);
        }
        return;
      }
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = 0;
      if (loopActiveRef.current) video?.play().catch(() => {});
      const app = appRef.current;
      if (!app || wasInView) return;
      if (stoppedRef.current) {
        stoppedRef.current = false;
        app.play();
        armSettle();
      } else if (!sceneVisibleRef.current) {
        armSettle();
      }
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      window.clearTimeout(stopTimerRef.current);
    };
  }, [armSettle, clearSettle, showLoop]);

  // A hidden tab suspends the scene's rendering and animation, so the settle window restarts
  // when the tab is shown again.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) clearSettle();
      else if (appRef.current && !sceneVisibleRef.current) armSettle();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [armSettle, clearSettle]);

  // Once the live scene is showing, stop decoding the loop underneath it.
  useEffect(() => {
    if (!sceneVisible) return;
    const timer = window.setTimeout(() => {
      loopActiveRef.current = false;
      videoRef.current?.pause();
    }, CROSSFADE_MS + 100);
    return () => window.clearTimeout(timer);
  }, [sceneVisible]);

  useEffect(() => clearSettle, [clearSettle]);

  const handleSceneLoad = (app: Application) => {
    appRef.current = app;
    if (inViewRef.current) {
      armSettle();
    } else {
      app.stop();
      stoppedRef.current = true;
    }
  };

  const handleSceneError = () => {
    appRef.current = null;
    clearSettle();
    showLoop(false);
  };

  const transitionDuration = `${instant ? 0 : CROSSFADE_MS}ms`;
  const loopLayer = `absolute inset-0 h-full w-full object-contain object-bottom transition-opacity ease-out ${sceneVisible ? 'opacity-0' : 'opacity-100'}`;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <img
        src={poster}
        srcSet={posterSrcSet}
        sizes="(min-width: 1024px) 600px, (min-width: 640px) 370px, 300px"
        width={575}
        height={658}
        alt=""
        decoding="async"
        className={loopLayer}
        style={{ transitionDuration }}
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
        className={loopLayer}
        style={{ transitionDuration }}
      >
        <source src={videoWebm} type="video/webm; codecs=vp9" />
        <source src={videoMp4} type="video/mp4" />
      </video>
      {loadScene && (
        <SceneErrorBoundary onError={handleSceneError}>
          <Suspense fallback={null}>
            <Spline
              scene={scene}
              onLoad={handleSceneLoad}
              className={`absolute inset-0 h-full w-full transition-opacity ease-out ${sceneVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDuration }}
            />
          </Suspense>
        </SceneErrorBoundary>
      )}
    </div>
  );
}
