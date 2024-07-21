//fragment shader which draws a moving rainbow to the screen

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);
vec3 white = vec3(1.0);

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) -
          smoothstep( pct, pct+0.01, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec3 pct;
    
    float adv = st.x + u_time;
    
    pct.r = clamp(0.5 + cos(2.0*PI*adv), 0.0, 1.0);
    pct.g = clamp(0.5 + sin(2.0*PI*(adv-1.0/12.0)), 0.0, 1.0);
    pct.b = clamp(0.5 + sin(2.0*PI*(adv - 5.0/12.0)), 0.0, 1.0);

    // pct.r = smoothstep(0.0,1.0, st.x);
    // pct.g = sin(st.x*PI);
    // pct.b = pow(st.x,0.5);
	color = pct;
    //color = mix(colorA, colorB, pct);

    // Plot transition lines for each channel
//    color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
  //  color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
    //color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));

    gl_FragColor = vec4(color,1.0);
}

