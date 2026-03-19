"use client";

import React, { useEffect, useRef } from "react";

interface Props {
  borderRadius?: number;
  className?: string;
  style?: React.CSSProperties;
}

const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform float uRadius;

varying vec2 vUv;

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p      = (vUv - 0.5) * uResolution;
  vec2 extent = uResolution * 0.5 - 2.0;

  float d      = sdRoundBox(p, extent, uRadius);
  float border = 1.0 - smoothstep(0.0, 5.0, abs(d));
  float ambient = border * 0.10;

  float angle      = atan(p.y, p.x);
  float lightAngle = mod(uTime * 0.85, 6.28318) - 3.14159;
  float delta      = abs(mod(angle - lightAngle + 3.14159, 6.28318) - 3.14159);
  float sweep      = exp(-delta * delta * 6.0);
  float lead       = exp(-max(0.0, delta - 0.15) * max(0.0, delta - 0.15) * 2.5);

  float a = clamp(ambient + border * (sweep * 0.85 + lead * 0.15), 0.0, 1.0);
  vec3  c = mix(vec3(0.82, 0.84, 0.88), vec3(1.0, 1.0, 1.0), sweep);

  gl_FragColor = vec4(c, a);
}
`;

function compile(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("createShader failed (context may be lost)");
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log || "shader compile error");
  }
  return shader;
}

function link(
  gl: WebGLRenderingContext,
  vert: string,
  frag: string,
): WebGLProgram {
  const prog = gl.createProgram();
  if (!prog) throw new Error("createProgram failed");
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, vert));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(prog) || "program link error");
  return prog;
}

export default function GlowBorderCanvas({
  borderRadius = 16,
  className,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
    }) ??
      canvas.getContext("experimental-webgl", {
        alpha: true,
        premultipliedAlpha: false,
      })) as WebGLRenderingContext | null;
    if (!gl || gl.isContextLost()) return;

    let animId: number;
    let mounted = true;

    let prog: WebGLProgram;
    try {
      prog = link(gl, VERT, FRAG);
    } catch (e) {
      console.warn("GlowBorderCanvas:", e);
      return;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    gl.useProgram(prog);
    const posLoc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.BLEND);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uRad = gl.getUniformLocation(prog, "uRadius");

    const syncSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(canvas.offsetWidth * dpr);
      const h = Math.round(canvas.offsetHeight * dpr);
      if (!w || !h || (w === canvas.width && h === canvas.height)) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uRad, borderRadius * dpr);
    };

    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);

    const loop = () => {
      if (!mounted) return;
      animId = requestAnimationFrame(loop);
      // retry every frame until the canvas has layout dimensions
      if (!canvas.width || !canvas.height) {
        syncSize();
        return;
      }
      if (gl.isContextLost()) return;
      gl.uniform1f(uTime, performance.now() / 1000);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      mounted = false;
      cancelAnimationFrame(animId);
      ro.disconnect();
      // Do NOT call loseContext() — React StrictMode remounts the effect and the
      // canvas cannot get a new WebGL context after the previous one was destroyed.
    };
  }, [borderRadius]);

  return <canvas ref={canvasRef} className={className} style={style} />;
}
