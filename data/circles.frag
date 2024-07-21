//circle.frag
//circles and distance fields

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 circle(in vec2 v, vec2 coord, float rad) {
    vec2 toCenter = coord - v;
    float pct = length(toCenter);
    pct = step(rad, pct);
    return vec3(pct);
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    float pct = 0.0;

    // a. The DISTANCE from the pixel to the center
    //pct = distance(st,vec2(0.5));

    // b. The LENGTH of the vector
    //    from the pixel to the center
     //vec2 toCenter = vec2(0.850,0.750)-st;
     //pct = length(toCenter);

    // c. The SQUARE ROOT of the vector
    //    from the pixel to the center
    // vec2 tC = vec2(0.5)-st;
    // pct = sqrt(tC.x*tC.x+tC.y*tC.y);

    //pct = step(0.3 + (0.1*abs(sin(5.0*u_time))), pct);
    //pct += sin(u_time);
    vec3 color; //circle(st, vec2(0.310,0.730), 0.216);
    //color *= circle(st, vec2(0.740,0.250), 0.2);
  pct = pow(distance(st,vec2(0.5)), distance(st,vec2(0.5+0.25*sin(2.*u_time),0.5+0.25*cos(2.*u_time))));
    color = vec3(pct);
    color += vec3(0.530,0.000,0.010);
    //color = mix(vec3(0.980,0.154,0.220), color, 1.036);
    //color = smoothstep(0.296, 0.952, color);
    //color = step(0.332, color);
	gl_FragColor = vec4( color, 1.0 );
}

