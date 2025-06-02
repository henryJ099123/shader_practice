// fbm_practice.frag
// working on some fractal brownian motion

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(1.234,56.789)))*
        123456.789);
}

vec2 sin2(in float x, in float y) {
    return vec2(sin(x), sin(y));
}

//noise function by interpolating between corners of square
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners of square
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = smoothstep(0.,1.,f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

#define ITERATIONS 6
float fbm (in vec2 st) {
    // Initial values
    float val = 0.;
    float amplitude = .5;
    float frequency = 1.5; 
    float amp_scale = .5; //should be less than 1
    float freq_scale = 2.; //should be greater than 1
    
    //number of "octaves" / scaled waves
    for (int i = 0; i < ITERATIONS; i++) {
        val += amplitude * noise(st * frequency);
        frequency *= freq_scale;
        amplitude *= amp_scale;
    }
    return val;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 mouse = u_mouse / u_resolution;
    mouse.x *= u_resolution.x/u_resolution.y;
    st.x *= u_resolution.x/u_resolution.y;
    vec2 rt = st - vec2(0.5);
	st *= 4.5;
    mouse *= 4.5;
    rt = vec2(length(rt) * 10., atan(rt.y, rt.x));
    float time = u_time;

    vec3 color = vec3(0.0, 0.0, 0.0);
    //float fbm0 = fbm(st+vec2(0.490,0.020)+fbm(st+vec2(-0.240,0.090)+fbm(st+10.*vec2(0.680,0.310))));
    float fbm1 = fbm(st*0.65+time/50.);
    float fbm2 = fbm(st*fbm1 + time/25. - cos(time/100.)/1.);
    float fbm3 = fbm(st + fbm2 + vec2(-time/15., time / 15.));
    float fbm4 = fbm(0.5*sin(st*2.) + fbm3 + time/2.);


    //different color variations happening over here!
    color = vec3(1.);
    color = mix(vec3(0.4314, 0.0, 0.0), vec3(0.251, 0.1176, 0.502), fbm1);
    color = mix(color, vec3(1.0, 0.3412, 0.0157), fbm2);
    color = mix(color, vec3(0.0, 0.0, 0.0), fbm3);
    // color = mix(color, vec3(0.4941, 0.0, 0.0), .5*fbm4);
    color *= 1.8;

    //comment out the following line to remove the mouse functionality
    // if (!(u_mouse.x <= 25. || u_mouse.x >= u_resolution.x -25. || u_mouse.y <= 25. || u_mouse.y >= u_resolution.y - 25.)) {
    //     // color = mix(color, color / 2., 1.-smoothstep(0.7, 1., 0.8*length(st-mouse)+fbm3));
    //     color *= mix(vec3(0.0, 0.0, 0.0), vec3(1.) , smoothstep(0.9, 1., 2.*length(st-mouse)+fbm3));
    // }

    // color = mix(color, vec3(0.0, 0.0, 0.0),1. - step(0.1, (length(st-mouse))));

    gl_FragColor = vec4(color,1.0);
}
