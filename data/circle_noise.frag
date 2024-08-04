#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

//theta is in radians!
mat2 rotate(float theta) {
    return mat2(cos(theta), sin(theta), -sin(theta), cos(theta));
}

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

//draws a ring from center with inner radius _inner_rad and width _width
float ring(in vec2 _st, in float _inner_rad, in float _width) {
    return step(_inner_rad, length(_st)) * step(length(_st), _inner_rad + _width);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    st.x *= u_resolution.x / u_resolution.y;

    vec2 mouse = u_mouse / u_resolution;

    //centers the coordinate space
    st -= vec2(0.5);

    //converts to polar
    vec2 polar = vec2(length(st), atan(st.y, st.x));

    //input for noise
    vec2 noise_input = polar * 25.;
    noise_input.r += 2. * u_time; //will allow some scaling with time

    float pct = ring(st, 0.1 + 0.2 * noise(noise_input),  0.2 * noise(noise_input));

    vec3 color = pct * mix(vec3(mouse.x, mouse.y, 1.0), vec3(1.0), 0.5);
    
    //uncomment to see the gradient the mouse moves over
    //color = vec3(st.x + 0.5, st.y + 0.5, 1.0);

    gl_FragColor = vec4(color, 1.0);
}