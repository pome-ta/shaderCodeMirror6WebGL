precision highp float;
// precision highp int;

uniform vec2 resolution;
uniform float time;

out vec4 fragColor;


int channel;  // 表示するシェーダのチャンネル

// コード 1.4:補間関数の階段化
void main(){
  vec2 pos = gl_FragCoord.xy / resolution.xy;
  vec3[4] col4 = vec3[](
    vec3(1.0, 0.0, 0.0),
    vec3(1.0, 1.0, 0.0),
    vec3(1.0, 0.0, 1.0),
    vec3(1.0, 1.0, 1.0)
  );
  
  float n = 4.0;
  
  pos *= n;
  channel = int(2.0 * gl_FragCoord.x / resolution.x);

  if (channel == 0) {
  // if (true) {
    pos = floor(pos) + step(0.5, fract(pos));
  } else {
    float thr = 0.25 * sin(time);
    // float thr = 0.25;
    pos = floor(pos) + smoothstep(0.25 + thr, 0.75 - thr, fract(pos));
  }

  pos /= n;

  vec3 col = mix(mix(col4[0], col4[1], pos.x), mix(col4[2], col4[3], pos.x), pos.y);

  fragColor = vec4(col, 1.0);
}
