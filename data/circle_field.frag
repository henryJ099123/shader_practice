//circle_fields.frag
//some more cool circle animations

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);
  float d = 0.0;

  // Remap the space to -1. to 1.
  st = st *2.-1.;

  // Make the distance field
  d = length( abs(st) - 0.3);
   //d = length( min(abs(st)-.3,0.) );
  // d = length( max(abs(st)-.3,0.) );

  // Visualize the distance field
     color =  vec3(sin(d*15. - 5.*u_time));
     color = step(0.746, color);
     color = 1.0 - color;
    //simple masking!
    vec3 color_white = step(0.001, color);
    vec3 color_black = 1.0 - color_white;
    color_white *= vec3(0.5 + 0.5*sin(u_time), 0.5 + 0.5*cos(u_time), 0.5 + 0.5*cos(-u_time));
    color_black *= vec3(0.5 + 0.5*cos(2.0*u_time), 0.5 + 0.5*sin(2.0*u_time), 0.5 + 0.5*cos(3.0*u_time));
    color = color_white + color_black;
  //color = vec3(fract(d*10.));
  gl_FragColor = vec4(color, 1.0);

  // Drawing with the distance field
  // gl_FragColor = vec4(vec3( step(.3,d) ),1.0);
  // gl_FragColor = vec4(vec3( step(.3,d) * step(d,.4)),1.0);
  // gl_FragColor = vec4(vec3( smoothstep(.3,.4,d)* smoothstep(.6,.5,d)) ,1.0);
}

