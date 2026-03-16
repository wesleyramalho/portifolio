precision highp float;

attribute vec2 position;
attribute vec2 uv;

/* (x, y) = bottom-left corner in NDC [-1,1]; (z, w) = width, height in NDC */
uniform vec4 uRect;

varying vec2 vUv;

void main() {
  vUv = uv;
  /* Map local quad [-1,1] → [0,1] then scale to uRect */
  vec2 pos = uRect.xy + (position * 0.5 + 0.5) * uRect.zw;
  gl_Position = vec4(pos, 0.0, 1.0);
}
