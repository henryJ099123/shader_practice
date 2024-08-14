#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

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
    st -= vec2(.8, .5);
    st *= 2.5;// / u_time;
    //st.x -= u_time / 10.;
    //st.y += 0.7;
    vec3 color = vec3(0.);
    float ms = mandelbrot(st);
    color = vec3(step(0.02, ms));
    color *= mix(vec3(1.0, 0.4667, .0), vec3(0.2667, 0.0, 1.0), 1.0 - ms / (float(ITERATIONS) / 20.));

    //color += step(-0.01, st.x) * step(st.x, 0.01) + step(-0.01, st.y) * step(st.y, 0.01);

    gl_FragColor = vec4(color, 1.0);
}