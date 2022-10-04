precision highp float;

uniform vec2 resolution;

out vec4 fragColor;

// コード 1.1:2 つのベクトルをつなぐ線形補間
void main(){
  vec2 pos = gl_FragCoord.xy / resolution.xy;
  vec3 RED = vec3(1.0, 0.0, 0.0);
  vec3 BLUE = vec3(0.0, 0.0, 1.0);
  vec3 col = mix(RED, BLUE, pos.x);
  fragColor = vec4(col, 1.0);
}
