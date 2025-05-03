//brady dautrich

/*
  Code assisted by ChatGPT (OpenAI). Prompts that directly influenced this sketch:
  - "what about a bunch of copy right "c" symbols that coagulate to form words"
  - "Can you make it so when the user hovers over the symbols they get pushed by it but return to their location after?"
  - "Can you make them stop jittering when they're settled?"
  - "nah nah nah, I want the mouse to be able to push them whenever, but when the particle has been at or very near to its correct location for a moment, I want it to stop shaking."
  - "how do I edit this code [...] so that my cursor has not just a wider push radius, but STRONGER?"
  Generated using p5.js and open-source font "Source Code Pro".
*/

var particles = [];
var font;
var fontSize = 150;
var line1 = "ALL RIGHTS";
var line2 = "RESERVED";

function preload() {
  font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  adjustFontSizeToFit();

  var bounds1 = font.textBounds(line1, 0, 0, fontSize);
  var bounds2 = font.textBounds(line2, 0, 0, fontSize);

  var totalHeight = bounds1.h + bounds2.h + 30;
  var startY = (height - totalHeight) / 2;

  var x1 = (width - bounds1.w) / 2;
  var y1 = startY + bounds1.h;

  var x2 = (width - bounds2.w) / 2;
  var y2 = y1 + bounds2.h + 30;

  var textPoints1 = font.textToPoints(line1, x1, y1, fontSize, {
    sampleFactor: 0.067,
    simplifyThreshold: 0
  });

  var textPoints2 = font.textToPoints(line2, x2, y2, fontSize, {
    sampleFactor: 0.067,
    simplifyThreshold: 0
  });

  for (var p of textPoints1.concat(textPoints2)) {
    particles.push(new Particle(random(width), random(height), p.x, p.y));
  }

  textFont(font);
  noStroke();
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function adjustFontSizeToFit() {
  var testSize = fontSize;
  var bounds1 = font.textBounds(line1, 0, 0, testSize);
  var bounds2 = font.textBounds(line2, 0, 0, testSize);
  while (max(bounds1.w, bounds2.w) > width * 0.9) {
    testSize -= 5;
    bounds1 = font.textBounds(line1, 0, 0, testSize);
    bounds2 = font.textBounds(line2, 0, 0, testSize);
  }
  fontSize = testSize;
}

function draw() {
  background(255);

  for (var p of particles) {
    // Stronger cursorpush with wider radius
    var d = dist(mouseX, mouseY, p.pos.x, p.pos.y);
    
    if (d < 50) {
      var cursorpush = p5.Vector.sub(p.pos, createVector(mouseX, mouseY));
      cursorpush.setMag(180 / (d + 1));
      p.vel.add(cursorpush);
      p.settled = false;
      p.lastDisturbed = millis(); // update disturbance time
  }


    p.update();
    p.show();
  }
}

class Particle {
  constructor(x, y, tx, ty) {
    this.pos = createVector(x, y);
    this.target = createVector(tx, ty);
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.acc = createVector();
    this.settled = false;
    this.lastDisturbed = -Infinity;
    this.settledAt = -1;
  }

  update() {
    var toTarget = p5.Vector.sub(this.target, this.pos);
    var distToTarget = toTarget.mag();

    if (distToTarget < 2 && this.vel.mag() < 0.3) {
      if (!this.settled) {
        this.settled = true;
        this.settledAt = millis(); // mark when it settles
      }
      this.pos = this.target.copy();
      this.vel.set(0, 0);
    } else {
      this.settled = false;
      this.settledAt = -1; // reset if disturbed
      toTarget.setMag(0.5);
      this.acc.add(toTarget);
      this.vel.add(this.acc);
      this.vel.mult(0.85);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
  }

  show() {
    let fadeDuration = 1500; // 3 seconds fade
    let alpha;

    if (this.settled && this.settledAt !== -1) {
      let timeSinceSettled = millis() - this.settledAt;
      alpha = map(timeSinceSettled, 0, fadeDuration, 255, 0);
      alpha = constrain(alpha, 0, 255);
    } else {
      alpha = 255; // fully red while moving
    }

    let col = lerpColor(color(255, 0, 0), color(0), 1 - alpha / 255);
    fill(col);

    textSize(24);
    text('©', this.pos.x, this.pos.y);
  }
}
