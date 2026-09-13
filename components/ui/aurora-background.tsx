import { useEffect, useRef, useState } from 'react';

// Full-screen aurora shader drawn with plain WebGL: one triangle and one fragment shader.
// GLSL ES 1.00 has no tanh, so the shader carries a small polyfill.
//
// Cost controls:
// - The context is requested with failIfMajorPerformanceCaveat, so machines that would
//   render WebGL in software get no canvas and keep the static CSS background instead.
// - The drawing buffer is a fraction of the viewport; the effect is soft, so the browser's
//   upscale is not visible.
// - Frames are capped at 30 per second and stop while the tab is hidden.
// - With prefers-reduced-motion a single still frame is drawn.

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform float iTime;
uniform vec2 iResolution;

#define NUM_OCTAVES 3

vec4 tanh4(vec4 x) {
  vec4 e2 = exp(2.0 * x);
  return (e2 - 1.0) / (e2 + 1.0);
}

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);
  float res = mix(
    mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
    mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
  return res * res;
}

float fbm(vec2 x) {
  float v = 0.0;
  float a = 0.3;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * noise(x);
    x = rot * x * 2.0 + shift;
    a *= 0.4;
  }
  return v;
}

void main() {
  vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
  vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
  vec2 v;
  vec4 o = vec4(0.0);
  float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

  for (float i = 0.0; i < 35.0; i++) {
    v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5 + vec2(sin(iTime * 3.0 + i) * 0.003, cos(iTime * 3.5 - i) * 0.003);
    float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0));
    vec4 auroraColors = vec4(
      0.1 + 0.3 * sin(i * 0.2 + iTime * 0.4),
      0.3 + 0.5 * cos(i * 0.3 + iTime * 0.5),
      0.7 + 0.3 * sin(i * 0.4 + iTime * 0.3),
      1.0
    );
    vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 0.8)) / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
    float thinnessFactor = smoothstep(0.0, 1.0, i / 35.0) * 0.6;
    o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
  }

  o = tanh4(pow(o / 100.0, vec4(1.6)));
  gl_FragColor = o * 1.5;
}`;

const FRAME_INTERVAL_MS = 1000 / 30;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const AuroraBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
      failIfMajorPerformanceCaveat: true,
    });
    if (!gl || gl.isContextLost()) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertexShader || !fragmentShader || !program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uTime = gl.getUniformLocation(program, 'iTime');
    const uResolution = gl.getUniformLocation(program, 'iResolution');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frameId = 0;
    let resizeId = 0;
    let lastFrame = 0;
    let time = 0;
    let shown = false;
    let lost = false;

    const draw = () => {
      if (lost) return;
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        setVisible(true);
      }
    };

    const resize = () => {
      resizeId = 0;
      const scale = window.innerWidth < 768 ? 0.35 : 0.5;
      const width = Math.max(1, Math.round(window.innerWidth * scale));
      const height = Math.max(1, Math.round(window.innerHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        gl.uniform2f(uResolution, width, height);
        draw();
      }
    };

    const onResize = () => {
      if (!resizeId) resizeId = requestAnimationFrame(resize);
    };

    const frame = (now: number) => {
      frameId = requestAnimationFrame(frame);
      if (lastFrame && now - lastFrame < FRAME_INTERVAL_MS) return;
      time += lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0;
      lastFrame = now;
      draw();
    };

    const stop = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      lastFrame = 0;
    };

    const start = () => {
      if (lost || frameId || document.hidden || reducedMotion.matches) return;
      frameId = requestAnimationFrame(frame);
    };

    const onVisibilityChange = () => (document.hidden ? stop() : start());
    const onMotionChange = () => (reducedMotion.matches ? stop() : start());
    // A lost context is not restored; the static CSS background stays in place instead.
    const onContextLost = () => {
      lost = true;
      stop();
      setVisible(false);
    };

    resize();
    draw();
    start();
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.addEventListener('change', onMotionChange);
    canvas.addEventListener('webglcontextlost', onContextLost);

    return () => {
      stop();
      if (resizeId) cancelAnimationFrame(resizeId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reducedMotion.removeEventListener('change', onMotionChange);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 -z-10 h-full w-full pointer-events-none transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};

export default AuroraBackground;
