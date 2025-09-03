#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

float dist(in vec2 v1, in vec2 v2) {
    return sqrt(pow(v1.x-v2.x,2.) + pow(v1.y-v2.y, 2.));
}

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

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy - vec2(0.5);
    vec2 uv = st + vec2(0.5);
    vec3 color = vec3(0.);
    color = vec3(step(st.y, sin(st.x * 10. * PI)/10. + 0.5));
    color = vec3(1.-step(0.25 + (sin(u_time)/10. + 0.1) + noise(st*10.)/30. + sin(atan(st.y, st.x)*10.+u_time*5.)/(50.+35.*sin(u_time)), dist(st, vec2(0.))));
    color *= vec3(sin((sqrt(dot(st,st))*5.-u_time)*1.8)/2. + 0.5, uv.x, uv.y);
    gl_FragColor = vec4(color, 1.);
}