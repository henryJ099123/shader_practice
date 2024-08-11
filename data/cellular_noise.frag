//cellular_noise.frag
//playing with cellular noise and some
//REALLY annoying 

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.141592653589793

vec2 random2( vec2 p ) {
    return fract(sin(
        vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)))
                    )*43758.5453);
}

vec3 hardlines_voronoi(vec2 st) {
    vec2 ipos = floor(st);
    vec2 fpos = fract(st);
    
    float mdist = 8.0;
    vec2 mdiff;
    
    for(int i = -1; i <= 1; i++) {
        for(int j = -1; j <= 1; j++) {
            vec2 n = vec2(float(i), float(j));
            vec2 rPoint = random2(n + ipos);
            vec2 diff = rPoint + n - fpos;
            float dist = dot(diff, diff);
            if(dist < mdist) {
                mdist = dist;
                mdiff = diff;
            } 
		}
    }
    
    mdist = 8.0;
    for(int i = -1; i <= 1; i++) {
        for(int j = -1; j <= 1; j++) {
            vec2 n = vec2(float(i), float(j));
            vec2 rPoint = random2(n + ipos);
            vec2 diff = rPoint + n - fpos;
            float dist = dot(diff, diff);
            
            if(dot(mdiff-diff, mdiff-diff) > 0.0001) {
                mdist = min(mdist, abs(dot(0.5*(mdiff+diff), normalize(mdiff-diff))));
            }
		}
    }
    return vec3(mdist, mdiff);
}

vec3 hardlines_voronoi_with_point(vec2 st, vec2 point) {
    vec2 ipos = floor(st);
    vec2 fpos = fract(st);
    
    float mdist = 8.0;
    vec2 mdiff;
    for(int i = -1; i <= 1; i++) {
        for(int j = -1; j <= 1; j++) {
        	vec2 n = vec2(float(i), float(j));
            vec2 rPoint = random2(n + ipos);
            //rPoint = 0.5+0.5 * sin(u_time+2.*PI*rPoint);
            vec2 diff = rPoint + n - fpos;
            float dist = dot(diff, diff);
            if(dist < mdist) {
                mdist = dist;
                mdiff = diff;
            } 
		}
    }
    vec2 pointDiff = point - fpos - ipos;
	if(dot(pointDiff, pointDiff) < mdist) {
        mdist = dot(pointDiff, pointDiff);
        mdiff = pointDiff;
	}
    
    mdist = 8.0;
    for(int i = -1; i <= 1; i++) {
        for(int j = -1; j <= 1; j++) {
            vec2 n = vec2(float(i), float(j));
            vec2 rPoint = random2(n + ipos);
            //rPoint = 0.5+0.5 * sin(u_time+2.*PI*rPoint);
            vec2 diff = rPoint + n - fpos;
            float dist = dot(diff, diff);
            
            if(dot(mdiff-diff, mdiff-diff) > 0.0001) {
                mdist = min(mdist, abs(dot(0.5*(mdiff+diff), normalize(mdiff-diff))));
            }
		}
    }
    return vec3(mdist, mdiff);
}

vec2 transform(in vec2 uv, float scale, vec2 translate) {
    uv -= translate;
    uv = vec2(length(uv), atan(uv.y, uv.x));
    uv.y = uv.y/2./PI + 0.5;
    //uv.y = .5-.5*cos(2.*uv.y*PI);
    //uv.y = 1.-pow((2.*(uv.y-0.5)),2.);
    uv *= scale;
	//uv.x -= u_time;
    return uv;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    const float SCALE = 6.;
    vec2 mouse = u_mouse / u_resolution;
    vec3 color = vec3(0.0);
    
//     st -= 0.5;
    
//     st = vec2(length(st), atan(st.y, st.x));
//     st.y = st.y/2./PI + 0.5;
//     st *= SCALE;
    st = transform(st, SCALE, vec2(0.5));
	mouse = transform(mouse, SCALE, vec2(0.5));
    
	vec3 voronoi = hardlines_voronoi_with_point(st, mouse);

    color += vec3(step(voronoi.x, 0.02));

//     // Show isolines
//     color -= abs(sin(80.0*m_dist))*0.07;

	//color += step(length(voronoi.yz), 0.02);
    
   //color.r += step(0.98, fract(st.x)) + step(0.98, fract(st.y));// + step(st.y, 4.936);

    gl_FragColor = vec4(color,1.0);
}
