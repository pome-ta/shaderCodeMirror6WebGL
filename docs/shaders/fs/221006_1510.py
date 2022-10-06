precision highp float;

uniform vec2 resolution;
uniform float time;

out vec4 fragColor;

// コード 1.3:2 次元区間上の双線形補間
void main(){
  vec2 pos = gl_FragCoord.xy / resolution.xy;

  vec3[4] col4 = vec3[](
    vec3(1.0, 0.0, 0.0),  // 赤
    vec3(0.0, 0.0, 1.0),  // 青
    vec3(0.0, 1.0, 0.0),  // 緑
    vec3(1.0, 1.0, 0.0)   // 黄
  );

  vec3 col = mix(mix(col4[0], col4[1], pos.x), mix(col4[2], col4[3], pos.x), pos.y);

  fragColor = vec4(col, 1.0);
}