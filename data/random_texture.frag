//random_texture.frag
//simply displays a random texture using heavily compressed sine waves

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    st.x *= u_resolution.x / u_resolution.y;

    st *= 6.0;

    vec2 ipos = floor(st);
    vec2 fpos = fract(st);

    float a = random(ipos);
    float b = random(ipos + vec2(1.0, 0.0));
    float c = random(ipos + vec2(1.0, 1.0));
    float d = random(ipos + vec2(0.0, 1.0));

    vec2 u = smoothstep(0.0, 1.0, fpos);

    //float ret = mix(a, b, fpos.x) * mix(b, c, fpos.y) * mix(d, c, fpos.x) * mix(a, d, fpos.y);
    // float ret = mix(a, b, u.x) + (d - a) * u.y * (1.0 - u.x) + (c - b) * u.x * u.y;
    // ret = a-a*u.x+b*u.x+d*u.y-a*u.y+(a+c-d-b)*u.x*u.y; 

    //bilinear interpolation
    float ret = (1.-u.x)*(1.-u.y)*a + u.x*(1.-u.y)*b + (1.-u.x)*u.y*d + u.x*u.y*c;
    vec3 color = vec3(ret);

    gl_FragColor = vec4(color, 1.0);
}