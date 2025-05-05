//brady dautrich

/*
  Code assisted by ChatGPT (OpenAI). Prompts that directly influenced this sketch:
 - Make a dropdown that avoids the mouse when it gets too close
 - How can I an option that disables the dropdown and turns it red
 - Keep the dropdown from going off screen
*/

var dropdown;
var arrowX, arrowY;
var escapeDistance = 200;
var maxSpeed = 100;
var padding = 50;
var dropdownWidth = 475;
var dropdownHeight = 30;
var leaveMeAlone = false;
var courier;

function preload(){
  courier = loadFont('CourierStd.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  arrowX = width / 2;
  arrowY = height / 2;

  dropdown = createSelect();
  dropdown.option('You will have to catch me to see the Terms of Service');
  dropdown.option('Stop trying and just agree already');
  dropdown.position(arrowX, arrowY);
  dropdown.size(dropdownWidth, dropdownHeight);
  dropdown.style('font-family', 'CourierStd');
  dropdown.changed(() => {
    if (dropdown.value() === 'Stop trying and just agree already') {
      leaveMeAlone = true;
      dropdown.style('color', 'white');
      dropdown.style('font-weight', 'bold');
      dropdown.elt.disabled = true;
      dropdown.style('background-color', '#990505');
    }
  });
}

function draw() {
  background(255);
}

function mouseMoved() {
  if (leaveMeAlone) return;

  var d = dist(mouseX, mouseY, arrowX + dropdownWidth/2, arrowY + dropdownHeight/2);

  if (d < escapeDistance) {
    let baseAngle = atan2(arrowY + dropdownHeight/2 - mouseY, arrowX + dropdownWidth/2 - mouseX);

    // Add randomness to angle
    let wiggle = random(-PI / 3, PI / 3); // random offset
    let angle = baseAngle + wiggle;

    // Accelerate based on closeness
    let speed = map(d, escapeDistance, 0, maxSpeed / 2, maxSpeed * 2);
    speed = constrain(speed, maxSpeed / 2, maxSpeed * 2);

    let escapeVector = createVector(cos(angle), sin(angle)).mult(speed);

    arrowX += escapeVector.x;
    arrowY += escapeVector.y;

    // Add jitter
    arrowX += random(-5, 5);
    arrowY += random(-5, 5);

    // Bounce off walls with force
    if (arrowX < padding || arrowX > width - padding - dropdownWidth ||
        arrowY < padding || arrowY > height - padding - dropdownHeight) {
      arrowX = random(padding, width - padding - dropdownWidth);
      arrowY = random(padding, height - padding - dropdownHeight);
    }

    dropdown.position(arrowX, arrowY);
  }
}
