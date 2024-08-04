#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//pseudo-random code
float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

//function to create noise
float noise (in vec2 st) {
    vec2 ipos = floor(st);
    vec2 fpos = fract(st);

    float a = random(ipos);
    float b = random(ipos + vec2(1.0, 0.0));
    float c = random(ipos + vec2(1.0, 1.0));
    float d = random(ipos + vec2(0.0, 1.0));

    vec2 u = smoothstep(0.0, 1.0, fpos);

    //bilinear interpolation - would work the same if we did two vertical
    //      linear interpolations first and horizontally connected them too
    float r_dc = mix(d, c, u.x);
    float r_ab = mix(a, b, u.x);
    float p = mix(r_ab, r_dc, u.y);

    return p;
}

float rect(in vec2 _st, in vec2 bot_left, float w, float h) {
    return step(bot_left.x, _st.x) * step(_st.x, bot_left.x + w) * step(bot_left.y, _st.y) * step(_st.y, bot_left.y + h);
}

// float rect_texture(in vec2 _st, in vec2 bot_left, float w, float h, float fuzz) {
//     float noisiness = 0.01 * sin(noise(_st * 10));

//     float left = step(bot_left.x + 0.01 * sin(noise(_st * 10000.)), _st.x);
//     float right = step(_st.x, bot_left.x + w);
//     float top = step(_st.y, bot_left.y + h);
//     float bot = step(bot_left.y, _st.y);

//     return left * right * top * bot;
// }

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    st.x *= u_resolution.x / u_resolution.y;

    float ret = 0.0;

    float inp = noise(st * 1000.);

    inp = inp * 2. * PI;

    float fuzz = 0.003 * sin(inp);

    ret += rect(st, vec2(0.4, 0.6) + fuzz, 0.2, 0.3);

    vec3 color = vec3(0.0);

    color += vec3(ret);

    gl_FragColor = vec4(color, 1.0);
}