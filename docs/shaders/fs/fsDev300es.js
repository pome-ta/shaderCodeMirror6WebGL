precision highp float;
precision highp int;

uniform vec2 resolution;
uniform float time;


out vec4 outColor;

const float PI = acos(-1.0);
const float TAU = PI * 2.0;
const float INV_PI = 1.0 / PI;


//start hash
uvec3 k = uvec3(0x456789abu, 0x6789ab45u, 0x89ab4567u);
uvec3 u = uvec3(1, 2, 3);
const uint UINT_MAX = 0xffffffffu;

uint uhash11(uint n) {
 n ^= (n << u.x);
 n ^= (n >> u.x);
 n *= k.x;
 n ^= (n << u.x);
 return n * k.x;
}

float hash11(float p) {
 uint n = floatBitsToUint(p);
 return float(uhash11(n)) / float(UINT_MAX);
}

float random(float x) {
 return hash11(x);
}


float srandom(float x) {
 return 2.0 * hash11(x) -1.0;
}


vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
 return a + b * cos(TAU * (t * c + d));
}


mat2 rotate(float r) {
 float c = cos(r);
 float s = sin(r);
 return mat2(c, s, -s, c);
}



void main(){
 vec2 st = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.x,
resolution.y);
 for (float i = 1.0; i <= 5.0; i += 1.0) {
   st.y += 0.5 * sin(0.5 * float(i) * st.x + 0.1 * time + random(i * 1.53));
   st *= rotate(i * 5.0 * PI * srandom(i * 1.42));
 }
 float y = st.y * (100.0 - tan(time));

 vec3 color = palette(
   st.x * 0.2 + 0.1 * time + 0.9 * sin(0.5 * floor(y * INV_PI)) +
0.1 * random(floor(y * INV_PI)),
   vec3(0.5), vec3(0.5), vec3(1.0),
   vec3(0.0, 0.1, 0.12)) * pow(abs(sin(y)), 0.5);

 outColor = vec4(color, 1.0);
}

