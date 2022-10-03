precision highp float;

uniform vec2 resolution;

out vec4 fragColor;

// コード 0.4:glsl-canvas におけるフラグメント座標とビューポート解像度
void main(){
  vec2 pos = gl_FragCoord.xy / resolution.xy;
  fragColor = vec4(1.0, pos, 1.0);
}
