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
  float l =  0.1 / length(p);
  outColor = vec4(vec3(l), 1.0);
}
