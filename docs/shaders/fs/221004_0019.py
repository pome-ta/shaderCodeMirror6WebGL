precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

out vec4 outColor;


/* dev */
void main(){
  vec2 r = resolution;
  vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
  // p += vec2(cos(time * 5.0), sin(time)) * 0.5;
  vec3 destColor = vec3(0.0);
  for (float i = 0.0; i < 6.0; i++) {
    float j = i + 1.0;
    vec2 q = p + vec2(cos(time * j), sin(time * j)) * 0.5;
    destColor += 0.05 / length(q); 
  }
  outColor = vec4(destColor, 1.0);
}
