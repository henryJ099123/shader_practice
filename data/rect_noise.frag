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

float fuzzy_rect(in vec2 _st, in vec2 bot_left, float w, float h, float fuzz) {
    float left = smoothstep(bot_left.x, fuzz + bot_left.x, _st.x);
    float right = 1.0 - smoothstep(bot_left.x - fuzz + w, bot_left.x + w, _st.x);
    float bot = smoothstep(bot_left.y, fuzz + bot_left.y, _st.y);
    float top = 1.0 - smoothstep(bot_left.y - fuzz + h, bot_left.y + h, _st.y);

    return left * right * top * bot;
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

    //different fuzziness adjustors using noise
    float fuzz = 0.02 * noise(st * 100. * sin((u_time)));
    float fuzz2 = 0.02 * noise(st * 100. + u_time);
    float fuzz3 = (0.5 + 0.25 * sin(1.5 * u_time)) * noise(vec2(st.x * 100., st.y * 20. - 5. * u_time));

    float ret = 0.0;

    //left rectangle
    ret = rect(st, vec2(0.1, 0.3) + fuzz, 0.2, 0.3);

    //top right rectangle
    ret += fuzzy_rect(st, vec2(0.7, 0.7), 0.2, 0.3, fuzz2);

    //bottom middle rectangle
    //stretchiness achieved by scaling the x and y coordinates differently
    //see `fuzz3` above
    ret += fuzzy_rect(st, vec2(0.5, 0.1), 0.1, fuzz3, 0.01);

    vec3 color = vec3(0.0);
    color += vec3(ret);// * vec3(noise(st * 10. * abs(sin(u_time))), noise(st * 20. - u_time), noise(st * 30. + u_time));
    gl_FragColor = vec4(color, 1.0);
}