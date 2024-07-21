PShader shader;
String filename = "shader.frag";

void settings() throws IllegalArgumentException {
  size(640, 640, P2D);
  if (args != null) {
    //System.out.println(args[0]);
    if (args.length > 1)
      throw new IllegalArgumentException("Too many arguments");
    else
      filename = args[0];
  }
}

//will execute
void setup() {
  //size(640, 640, P2D);
  noStroke();
  System.out.println(filename);
  shader = loadShader(filename);
}

void draw() {
  shader.set("u_resolution", float(width), float(height));
  shader.set("u_mouse", float(mouseX), float(mouseY));
  shader.set("u_time", millis() / 1000.0);
  shader(shader);
  rect(0,0,width,height); 
}
