/*
precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

out vec4 outColor;

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  vec3 color = vec3(p, abs(sin(time)));
  outColor = vec4(color, 1.0, 1.0);
}
*/

precision highp float; uniform vec2 resolution; uniform vec2 mouse; uniform float time; uniform sampler2D backbuffer; void main(){vec2 r=resolution,p=(gl_FragCoord.xy*2.-r)/min(r.x,r.y)-mouse;for(int i=0;i<8;++i){p.xy=abs(p)/abs(dot(p,p))-vec2(.9+cos(time*.2)*.4);}gl_FragColor=vec4(p.xxy,1);}
