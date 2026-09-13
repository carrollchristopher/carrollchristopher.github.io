import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Application } from '@splinetool/runtime';

const Spline = lazy(() => import('@splinetool/react-spline'));

// The Spline runtime is roughly 600 KB gzipped and the scene file is 1.3 MB, so the hero
// shows a static poster of the scene first. The live scene is fetched only on large,
// mouse-driven screens with hardware WebGL, after the first interaction, and never when
// the visitor asks for reduced motion or reduced data. It pauses while scrolled out of view.

const INTERACTION_EVENTS = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// True when the browser can run WebGL on hardware. Software rendering would pin the CPU.
function hasHardwareWebGL() {
  const gl = document.createElement('canvas').getContext('webgl', { failIfMajorPerformanceCaveat: true });
  gl?.getExtension('WEBGL_lose_context')?.loseContext();
  return Boolean(gl);
}

function useShouldLoadScene() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const capable = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!capable || reducedMotion || saveData || !hasHardwareWebGL()) return;

    const load = () => {
      INTERACTION_EVENTS.forEach((event) => window.removeEventListener(event, load));
      setShouldLoad(true);
    };
    INTERACTION_EVENTS.forEach((event) => window.addEventListener(event, load, { passive: true }));
    return () => INTERACTION_EVENTS.forEach((event) => window.removeEventListener(event, load));
  }, []);

  return shouldLoad;
}

interface SplineSceneProps {
  scene: string;
  poster: string;
  posterSrcSet: string;
  className?: string;
}

export function SplineScene({ scene, poster, posterSrcSet, className = '' }: SplineSceneProps) {
  const shouldLoad = useShouldLoadScene();
  const [app, setApp] = useState<Application | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!app || !container) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) app.play();
      else app.stop();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [app]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <img
        src={poster}
        srcSet={posterSrcSet}
        sizes="(min-width: 1024px) 600px, (min-width: 640px) 360px, 290px"
        width={583}
        height={658}
        alt=""
        decoding="async"
        fetchPriority="low"
        className={`absolute inset-0 h-full w-full object-contain object-bottom transition-opacity duration-700 ${app ? 'opacity-0' : 'opacity-100'}`}
      />
      {shouldLoad && (
        <SceneErrorBoundary>
          <Suspense fallback={null}>
            <Spline
              scene={scene}
              onLoad={setApp}
              className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${app ? 'opacity-100' : 'opacity-0'}`}
            />
          </Suspense>
        </SceneErrorBoundary>
      )}
    </div>
  );
}
