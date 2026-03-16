precision highp float;

uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  vec4 c = texture2D(tMap, vUv);
  /* Premultiply alpha so ONE/ONE_MINUS_SRC_ALPHA blending is correct */
  gl_FragColor = vec4(c.rgb * c.a, c.a);
}
