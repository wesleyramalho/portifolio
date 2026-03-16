precision highp float;

uniform sampler2D tMap;    /* scene FBO — images, text */
uniform sampler2D tFluid;  /* fluid density */

varying vec2 vUv;

void main() {
  vec3 fluid = texture2D(tFluid, vUv).rgb;

  /* Displaced scene sampling with chromatic aberration */
  vec2 disp  = fluid.rg * 0.0003;
  vec2 aberr = fluid.rg * 0.003;

  float sR = texture2D(tMap, vUv - disp + aberr).r;
  float sG = texture2D(tMap, vUv - disp).g;
  float sB = texture2D(tMap, vUv - disp - aberr).b;
  float sA = texture2D(tMap, vUv - disp).a;

  /* Fluid colour trails (tone-mapped, same as display.frag.glsl) */
  float r = abs(fluid.r) / (abs(fluid.r) + 1.0);
  float g = abs(fluid.g) / (abs(fluid.g) + 1.0);
  float b = abs(fluid.b) / (abs(fluid.b) + 1.0);
  float brightness = length(vec3(r, g, b));
  float trailAlpha = smoothstep(0.0, 0.15, brightness);

  /* Combine: displaced scene blended over trails */
  vec3 color = vec3(sR, sG, sB) * sA + vec3(r, g, b) * trailAlpha * (1.0 - sA);
  float alpha = max(sA, trailAlpha);

  /* Premultiplied alpha — correct for ONE / ONE_MINUS_SRC_ALPHA blend */
  gl_FragColor = vec4(color * alpha, alpha);
}
