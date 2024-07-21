//ui.frag
//playing with circles, rings, and arcs, and rotation
//has many reusable functions
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate(float theta) {
    return mat2(cos(theta), sin(theta), -sin(theta), cos(theta));
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

float get_angle_normed(in vec2 uv) {
    return atan(uv.y, uv.x) / 2.0 / PI + 0.5;
}

float circle(in vec2 _st, in float _radius) {
    return 1.0 - step(_radius, length(_st));
}

// float circle_polar(in vec2 _rtheta, in float _radius) {
//     return 1.0 - step(_radius, length(vec2()))
// }

float ring(in vec2 _st, in float _inner_rad, in float _width) {
    return step(_inner_rad, length(_st)) * step(length(_st), _inner_rad + _width);
}

//_pct_arc is %age of circumference the arc contains
//aka angle of the arc but in normed angle
float arc(in vec2 _center, in float _rad, in float _thickness, in float _pct_arc, in float _rotation) {
    _center *= rotate(_rotation);
    float angle = get_angle_normed(_center);
    
    //radius outward
    float is_on_arc = step(_rad, length(_center)) * step(length(_center), _rad + _thickness);
    
    //what's on the arc
    is_on_arc *= step(angle, _pct_arc);
    
    return is_on_arc;
}

// float box(in vec2 _st, in vec2 _size){
//     _size = vec2(0.5) - _size*0.5;
//     vec2 uv = smoothstep(_size,
//                         _size+vec2(0.001),
//                         _st);
//     uv *= smoothstep(_size,
//                     _size+vec2(0.001),
//                     vec2(1.0)-_st);
//     return uv.x*uv.y;
// }

// float cross(in vec2 _st, float _size){
//     return  box(_st, vec2(_size,_size/4.)) +
//             box(_st, vec2(_size/4.,_size));
// }

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    st -= vec2(0.5);
    
    //st *= rotate(0.5);
    vec2 polar = vec2(0.0);
    polar.r = length(st);
    polar.g = get_angle_normed(st);
    
    vec3 color = vec3(0.0);
	

//     st -= vec2(0.5);
//     st = scale( vec2(sin(u_time)+1.0) ) * st;
//     st += vec2(0.5);

//     // Show the coordinates of the space on the background
//     // color = vec3(st.x,st.y,0.0);

//     // Add the shape on the foreground
//     color += vec3(cross(st,0.2));
    
    //arcs in the center
    color += vec3(arc(st, 0.08, 0.02, 0.2, 0.2));
    color += vec3(arc(st, 0.08, 0.02, 0.2, PI+0.2));
    color += vec3(arc(st, 0.08, 0.02, 0.2, PI/2.0+0.2));
    color += vec3(arc(st, 0.08, 0.02, 0.2, -PI/2.0+0.2));
    
    //rings
	color += vec3(ring(st, 0.4, 0.025));
    color += vec3(ring(st, 0.28, 0.025));
    
    //center circle
    color += circle(st, 0.01);
    
    //outside circles
    for(int i = 0; i < 4; i++) {
    	color += circle(vec2(st.x+0.45*cos(float(i)*PI/2.), st.y + 0.45*sin(float(i)*PI/2.)), 0.010);
    }
    
    //lines within rings
	float pct = step(0.32, polar.r) * step(polar.r, 0.38);
    pct *= step(0.02, mod(polar.g, 0.05)) - step(0.03, mod(polar.g, 0.05));
    color += vec3(pct);
    
    gl_FragColor = vec4(color,1.0);
}

