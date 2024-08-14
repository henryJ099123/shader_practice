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
	
    vec3 color = vec3(0.0);
    //float fbm0 = fbm(st+vec2(0.490,0.020)+fbm(st+vec2(-0.240,0.090)+fbm(st+10.*vec2(0.680,0.310))));
    float fbm1 = fbm(st+10.*vec2(0.680,0.310) - vec2(0.3, 0.1)*u_time);
    float fbm2 = fbm(st+vec2(-0.240,0.090)+fbm1 + vec2(0.3*sin(st.x+u_time+noise(st)), 0.5 * u_time));
    float fbm3 = fbm(st+vec2(0.490,0.020) + fbm2+0.3*u_time);
     
    //change this value to see different color saturations
    //right now, 0, 1 or not those :D
    //I don't *fully* understand these--mostly just playing with values--but I'm getting there
    int color_choice = 3;
    if(color_choice == 0) {
        //color option 1
        color += mix(vec3(0.), vec3(0.980,0.318,0.004), fbm1);
        color += mix(vec3(0.), vec3(0.3216, 0.3882, 0.349), fbm2);
        color += mix(vec3(0.276,0.756,1.000), vec3(0.002,0.000,0.170), fbm3);
    }
    else if(color_choice == 1) {
        //color option 2
        color = mix(vec3(0.276,0.756,1.000), vec3(0.980,0.318,0.004), fbm1);
        color += mix(color, vec3(0.3216, 0.3882, 0.349), fbm2);
        color *= mix(color, vec3(0.002,0.000,0.170), fbm3);
    }
    else if(color_choice == 2) {
        color = mix(vec3(1.0, 0.2902, 0.4667), vec3(0.9804, 0.4745, 0.0039), fbm1);
        color = mix(color, vec3(0.6157, 0.9765, 0.7412), fbm2);
        color = mix(color, vec3(0.149, 0.0824, 0.4118), fbm3);
    }
    else {
        color -= mix(vec3(1.0, 0.2902, 0.4667), vec3(0.9804, 0.4745, 0.0039), fbm1);
        color += mix(color, vec3(1.0, 1.0, 1.0), fbm2);
        color *= mix(color, vec3(0.2353, 0.0706, 0.4353), fbm3);
    }

    gl_FragColor = vec4(color,1.0);
}
