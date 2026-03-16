precision highp float;
precision highp sampler2D;

uniform sampler2D tFluid;
uniform vec2 texelSize;
varying vec2 vUv;

void main() {
  vec3 fluid = texture2D(tFluid, vUv).rgb;

  // Chromatic aberration using fluid values as offset
  vec2 aberr = fluid.rg * 0.002;
  float r = texture2D(tFluid, vUv + aberr).r;
  float g = fluid.g;
  float b = texture2D(tFluid, vUv - aberr).b;

  // Tone mapping: compress large values (dx*5 ~ 50-500) into [0,1]
  r = abs(r) / (abs(r) + 1.0);
  g = abs(g) / (abs(g) + 1.0);
  b = abs(b) / (abs(b) + 1.0);

  float brightness = length(vec3(r, g, b));
  float alpha = smoothstep(0.0, 0.15, brightness);

  // Premultiplied alpha for correct blend (ONE, ONE_MINUS_SRC_ALPHA)
  gl_FragColor = vec4(r * alpha, g * alpha, b * alpha, alpha);
}
