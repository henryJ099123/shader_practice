//square_rect.frag
//contains some functions to draw rectangles/squares on a shader

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


//creates a square centered in frame with border
vec3 square_center(in vec2 v, float border, vec3 fill, vec3 border_fill) {
	vec2 bl = step(vec2(border), v);
    //bl = smoothstep(0.0, border, v);
    float pct = bl.x * bl.y;
    
    vec2 tr = step(vec2(border), 1.0 - v);
    //tr = smoothstep(0.0, border, 1.0-v);
    pct *= tr.x * tr.y;
    
    //returns 0 if on border, returns 1 if not
    float is_on_border = step(0.01, pct);
    
	vec3 color = vec3(pct);
    
    //fills the inner part of the square
    color *= fill;
    
    //fills the border by NOT adding the color if it is in the middle
    color += border_fill * (1.0 - is_on_border);
    
    return color;
}

//creates a rectangle with top/bottom letterboxing of length border_y 
//and right/left letterboxing with length border_x
vec3 rectangle_center(in vec2 v, float border_x, float border_y, vec3 fill, vec3 border_fill) {
    float left = step(border_x, v.x);
    float bottom = step(border_y, v.y);
    float right = step(border_x, 1.0-v.x);
    float top = step(border_y, 1.0-v.y);
    //bl = smoothstep(0.0, border, v);
    //float pct = bl.x * bl.y;
    
    float pct = left * bottom * right * top;
    
    //vec2 tr = step(vec2(border), 1.0 - v);
    //tr = smoothstep(0.0, border, 1.0-v);
    //pct *= tr.x * tr.y;
    
    //returns 0 if on border, returns 1 if not
    float is_on_border = step(0.01, pct);
    
	vec3 color = vec3(pct);
    
    //fills the inner part of the square
    color *= fill;
    
    //fills the border by NOT adding the color if it is in the middle
    color += border_fill * (1.0 - is_on_border);
    
    return color;
}

//draws a square of color 'fill' and side length 'side' on the screen
//bottom-left coordinate is 'coord'
vec3 square_coord(in vec2 v, vec2 coord, float side, vec3 fill) {
    float left = step(coord.x, v.x);
    float right = 1.0 - step(coord.x + side, v.x);
    float bottom = step(coord.y, v.y);
    float top = 1.0 - step(coord.y + side, v.y);
    
    float pct = left * bottom * top * right;
    
    vec3 color = vec3(pct);
    
    return color * fill;
}
//draws a square of color 'fill', width 'side_x', and length 'side_y' on the screen
//bottom-left coordinate is 'coord'
vec3 rect_coord(in vec2 v, vec2 coord, float side_x, float side_y, vec3 fill) {
    float left = step(coord.x, v.x);
    float right = 1.0 - step(coord.x + side_x, v.x);
    float bottom = step(coord.y, v.y);
    float top = 1.0 - step(coord.y + side_y, v.y);
    
    float pct = left * bottom * top * right;
    
    vec3 color = vec3(pct);
    
    return color * fill;
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0); //set background color
    
    //color = square_center(st, 0.044, vec3(0.942,0.995,0.003), vec3(0.429,0.595,0.274));
    //color = rectangle_center(st, 0.292, 0.092, vec3(0.522,1.000,0.333), vec3(0.780,0.638,0.423));
    
    color += rect_coord(st, vec2(0.03,0.72), 0.100, 0.25, vec3(0.830,0.000,0.000));
    color += rect_coord(st, vec2(0.16,0.72), 0.150, 0.25, vec3(0.830,0.000,0.000));
    color += rect_coord(st, vec2(0.16+.15+.03,0.720), 0.45, 0.25, vec3(0.995,0.904,0.551));
    color += square_coord(st, vec2(0.16+.15+.03+.45+.03,0.720), 0.25, vec3(0.995,0.904,0.551));
    color += rect_coord(st, vec2(0.03,0.72-.28), 0.100, 0.25, vec3(0.830,0.000,0.000));
    color += rect_coord(st, vec2(0.16,0.72-.28), 0.150, 0.25, vec3(0.830,0.000,0.000));
    color += rect_coord(st, vec2(0.16+.15+.03,0.720-.28), 0.45, 0.25, vec3(0.995,0.904,0.551));
    color += square_coord(st, vec2(0.16+.15+.03+.45+.03,0.72-.28), 0.25, vec3(0.000,0.101,0.995));
    color += rect_coord(st, vec2(0.030,-0.090), 0.28, .5, vec3(0.995,0.904,0.551));
    color += rect_coord(st, vec2(0.060+.28,-0.090), 0.45, .5, vec3(0.995,0.904,0.551));
    color += rect_coord(st, vec2(0.060+.28+.48,-0.090), 0.5, .5, vec3(0.995,0.904,0.551));
    
    gl_FragColor = vec4(color,1.0);
}

