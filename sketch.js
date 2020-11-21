let CENTRE;
let BLACK;
let ROSOLANC;
let ORANGE;
let GRENADINE;
let COLOUR_LIST;
let colour_count = 0;

let initTheta = 0;
let spirals;

class PointFromCentre {
  constructor(r, theta) {
    this.r = r;
    this.theta = theta;
  }

  get cartesian() {
    return polToCart(this.r, this.theta);
  }

  rotatePoint(angle) {
    this.theta += angle;
  }
}

class SpiralLine {
  constructor(minR, maxR, rStep, theta) {
    // Create points array, with each point spread further from the centre;
    this.points = [];
    for (let r = minR; r < maxR; r += rStep) {
      const p = new PointFromCentre(r, theta);
      this.points.push(p);
    }
  }

  drawLine() {
    beginShape();
    for (let p of this.points) {
      const cart = p.cartesian;
      curveVertex(cart.x, cart.y);
    }
    endShape();
  }

  rotSpiral(rScaleFactor) {
    for (let p of this.points) {
      p.rotatePoint(p.r * rScaleFactor);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  CENTRE = createVector(width / 2, height / 2);
  BLACK = color(0);

  ROSOLANC = color("#b319ab");
  ORANGE = color("#ff5200");
  GRENADINE = color("#ff616b");

  COLOUR_LIST = [ORANGE, GRENADINE, ROSOLANC];

  const biggerDim = Math.max(windowWidth, windowHeight);

  spirals = new Array();
  for (let theta = 0; theta < 2 * PI; theta += PI / 3.0) {
    const spiral = new SpiralLine(10, biggerDim, 10, theta);
    spirals.push(spiral);
  }
}

function draw() {
  background(BLACK);
  noStroke();
  fill(200, 50);
  // initTheta += mouseDistFromCentre() / 2e+3;

  // Test that we can plot circles
  // for (let i = 10; i < 30; i++){
  //   circWalk(plotPolarPoint, width / i, PI / 3.0, initTheta / i);
  // }
  noFill();
  stroke(COLOUR_LIST[colour_count], 10);
  for (let spiral of spirals) {
    spiral.drawLine();
    spiral.rotSpiral(mouseDistFromCentre() / 3e+6);
  }
}

// Plot a wee circle at the given polar coordinates
function plotPolarPoint(r, theta) {
  cart = polToCart(r, theta);
  circle(cart.x, cart.y, 10);
}

// Execute the provided function at points of a circle separated by the given angle.
// Passed function is called with the specified `r` and the current `theta`.
function circWalk(func, r, thetaStep, thetaStart = 0) {
  for (let theta = thetaStart; theta < 2 * PI + thetaStart; theta += thetaStep) {
    func(r, theta);
  }
}

// Convert 2D polar coordinates to Cartesian vector
function polToCart(r, theta) {
  let cart = createVector(r * cos(theta), r * sin(theta));
  cart.add(CENTRE);
  return cart;
}

// Return the square of the magnitude of the mouse's distance from the centre
// of the page
function mouseDistFromCentre() {
  const mouseLoc = createVector(mouseX, mouseY);
  const disp = p5.Vector.sub(CENTRE, mouseLoc);
  return disp.mag() * (disp.x > 0 ? 1 : -1);
}

function mousePressed() {
  colour_count++;
  colour_count = colour_count % COLOUR_LIST.length;
}

function keyPressed() {
  if (keyCode == ENTER) {
    saveCanvas();
  }
}
