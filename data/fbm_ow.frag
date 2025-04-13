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
    st.x *= u_resolution.x/u_resolution.y;
	st *= 4.5;

    float time = u_time;

    vec3 color = vec3(0.0, 0.0, 0.0);
    //float fbm0 = fbm(st+vec2(0.490,0.020)+fbm(st+vec2(-0.240,0.090)+fbm(st+10.*vec2(0.680,0.310))));
    float fbm1 = fbm(st+5.*vec2(-0.5,1.5)*.05*cos(0.125*time) - 2.*vec2(0.25, 0.1)*time);
    float fbm2 = fbm(st+vec2(-0.240,0.090)+0.5*fbm1+ vec2(-0.5 * time, 0.3*sin(st.y+time+noise(st))));
    float fbm3 = fbm(st+vec2(0.490,0.020)*fbm2 + vec2(0.5, 0.5)*0.1*sin(1.5*time) + 0.1*time + fbm1);
     
    //different color variations happening over here!
    int picker = 0;
    if(picker == 0) {
        color += mix(vec3(0.8627, 0.502, 0.0863), vec3(0.0706, 0.2784, 0.098), fbm1);
        color += mix(vec3(0.9176, 0.4431, 0.4431), vec3(0.6039, 0.0471, 0.5294), fbm2);
        color *= mix(color, vec3(0.0, 0.0, 0.0), fbm3);
    }
    else {
        color += mix(vec3(0.0863, 0.8627, 0.7451), vec3(0.0706, 0.2784, 0.098), fbm1);
        color += mix(color, vec3(0.6039, 0.0471, 0.5294), fbm2);
        color *= mix(color, vec3(0.0392, 0.149, 0.4471), fbm3);
    }

    gl_FragColor = vec4(color,1.0);
}
