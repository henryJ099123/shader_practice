#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

mat2 rotate(float theta) {
    return mat2(cos(theta), sin(theta), -sin(theta), cos(theta));
}

vec2 multiply_complex(vec2 z1, vec2 z2) {
    return vec2(z1.x*z2.x-z1.y*z2.y, z1.y*z2.x+z1.x*z2.y);
}

#define ITERATIONS 500
float mandelbrot(in vec2 st) {
    vec2 z = vec2(0.);
    for(int i = 0; i < ITERATIONS; i++) {
        if(dot(z,z) > 5.) return float(i);
        z = multiply_complex(z,z) + st;
    }
    return 0.;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    st.x *= u_resolution.x / u_resolution.y;
    vec2 mouse = u_mouse / u_resolution;
    mouse.x *= u_resolution.x / u_resolution.y;
    mouse.x *= 6.;
    st -= vec2(.7-.73/3., .5+.23/3.);
    st *= 3. * exp(-mouse.x);
    //st *= rotate(u_time * 0.1);
    float ms = mandelbrot(st+vec2(-.715,0.23));

    vec3 color = vec3(0.);
    color = vec3(step(0.02, ms));
    color *= mix(vec3(1.0, 0.4667, .0), vec3(0.2667, 0.0, 1.0), 1.0 - ms / (float(ITERATIONS) / 5.));

    //color += step(-0.002, st.x) * step(st.x, 0.002) + step(-0.002, st.y) * step(st.y, 0.002);

    gl_FragColor = vec4(color, 1.0);
}