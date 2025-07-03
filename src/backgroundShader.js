export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.8);
  }
`;

export const fragmentShader = `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec2 uResolution;

  // Hash function for pseudo-randomness
  vec4 hash4(vec4 p) {
    p = vec4(dot(p, vec4(127.1, 311.7, 74.7, 99.4)),
             dot(p, vec4(269.5, 183.3, 246.1, 113.5)),
             dot(p, vec4(113.5, 271.9, 124.6, 44.7)),
             dot(p, vec4(419.2, 371.9, 174.6, 224.7)));
    return fract(sin(p) * 43758.5453);
  }
    float voronoi4D(vec4 x) {
    vec4 p = floor(x);
    vec4 f = fract(x);
    float res = 1.0;

      for (int i = -1; i <= 1; i++)
    for (int j = -1; j <= 1; j++)
    for (int k = -1; k <= 1; k++)
    for (int l = -1; l <= 1; l++) {
      vec4 b = vec4(float(i), float(j), float(k), float(l));
      vec4 r = b - f + hash4(p + b) - 0.5;
      float d = dot(r, r);
      res = min(res, d);
    }
    return res;
  }

  void main() {
    vec2 uv = vUv * 100.0;
    uv.x *= uResolution.x / uResolution.y;
    uv *= 4.0;
    uv += 1.0;
    
    float z = sin(uTime*0.1)*2.0;
    float w = cos(uTime*0.1)*1.5;

    vec4 pos = vec4(uv.x, uv.y, z, w);

    float n = voronoi4D(pos);

    float intensity = smoothstep(0.9, 1.0, n);
    vec3 color = mix(uColor1, uColor2, intensity);
    gl_FragColor = vec4(color, 1.0);
  }
`;
