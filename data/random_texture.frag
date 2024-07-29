//random_texture.frag
//simply displays a random texture using heavily compressed sine waves

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 st) {
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

    //bilinear interpolation -- explanation of the math to get here below
    float ret = (1.-u.x)*(1.-u.y)*a + u.x*(1.-u.y)*b + (1.-u.x)*u.y*d + u.x*u.y*c;

    //here is the breakdown of how to get this:
    //************ BREAKDOWN OF BILINEAR INTERPOLATION ********//
    // square:
    //          D ------ C
    //           |      |
    //           |      |
    //           |      |
    //         A  ------ B
    //first, linearly interpolate between A, B to find a point r_ab on segment AB
    //then, linearly interpolate between D, C to find a point r_dc on segment DC
    //these first two linear interpolations are using the x-axis to interpolate
    //lastly, we linearly interpolate between these two points we found (r_ab, r_dc)
    //      along the y-axis
    //this produces a linear interpolation between all four points of the square
    //interpolating all the values inside the square based on the four corners!!
    //************ BREAKDOWN OF BILINEAR INTERPOLATION OVER ********//

    float r_dc = mix(d, c, u.x);
    float r_ab = mix(a, b, u.x);
    float p = mix(r_ab, r_dc, u.y);

    vec3 color = vec3(noise(st));

    gl_FragColor = vec4(color, 1.0);
}