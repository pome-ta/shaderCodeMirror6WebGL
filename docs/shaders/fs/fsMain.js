precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

//out vec4 outColor;

float plot(vec2 st) {
  return smoothstep(0.01, 0.0, abs(st.y - st.x));
}

void main(){
  vec2 r = resolution, p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y) - mouse;
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  for (int i=0; i<8; ++i) {
    p.xy = abs(p) / abs(dot(p, p)) - vec2(0.2 + cos(time * 0.2) * 0.1);
  }
  float pct = plot(uv);
  // float line = (1.0 - pct) * 1.0 + pct * abs(sin(time));
  float line = pct * abs(tan(time));
  vec3 color = vec3(uv, line); 
  // outColor = vec4(p.xxy, 1.0);
  //outColor = vec4(color, 1.0);
  gl_FragColor = vec4(color, 1.0);
}
