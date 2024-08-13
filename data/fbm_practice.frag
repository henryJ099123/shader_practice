// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

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

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    //return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        //value += noise(10. * vec2(u_time, u_time));
        st *= 2.;
        amplitude *= 0.5;
    }
    //value += noise(vec2(u_time));
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
	st *= 4.5;
	
    vec3 color = vec3(0.0);
    //float fbm0 = fbm(st+vec2(0.490,0.020)+fbm(st+vec2(-0.240,0.090)+fbm(st+10.*vec2(0.680,0.310))));
    float fbm1 = fbm(st+10.*vec2(0.680,0.310) - 0.2*u_time);
    
    color += mix(vec3(0.0), vec3(0.980,0.318,0.004), fbm1);
    
    float fbm2 = fbm(st+vec2(-0.240,0.090)+fbm1 + 0.3 * u_time);
    
    color += mix(vec3(0.0), vec3(0.3216, 0.3882, 0.349), fbm2);
    
    float fbm0 = fbm(st+vec2(0.490,0.020)+ fbm2+noise(st)*noise(st)+0.3*u_time);
    
    color += mix(vec3(0.276,0.756,1.000), vec3(0.002,0.000,0.170), 1.0 - fbm0);

    gl_FragColor = vec4(color,1.0);
}
