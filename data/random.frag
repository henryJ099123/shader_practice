// random.frag
// move mouse left-right to change threshold of cell shown
//move mouse up-down to mix color between color1 and color2

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
    vec3 color1 = vec3(1., 0., 0.5);
    vec3 color2 = vec3(0.5, 0.3, 1.);
    
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
	vec2 mouse = u_mouse / u_resolution;
    st.x *= 50.0; // Scale the coordinate system by 10
    st.y *= 50.;
    
    float offset = u_time * sin(5.*random(vec2(floor(st.y))));
    
    st.x += offset * 20.;
    vec2 ipos = floor(vec2(st.x, st.y));  // get the integer coords
    vec2 fpos = fract(st);  // get the fractional coords

    // Assign a random value based on the integer coord
    float rand = random(ipos);
    rand = 1.0 - rand*step(mouse.x, rand);
    //vec3 color = rand * vec3(abs(sin(mouse.y)), abs(cos(mouse.y)), 1.0);
    vec3 color = rand * mix(color1, color2, mouse.y);
    // Uncomment to see the subdivided grid
    // color = vec3(fpos,0.0);

    gl_FragColor = vec4(color,1.0);
}

