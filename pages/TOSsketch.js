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
var dropdownWidth = 275;
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
  dropdown.option('Click to see Terms of Service');
  dropdown.option('LEAVE ME ALONE');
  dropdown.position(arrowX, arrowY);
  dropdown.size(dropdownWidth, dropdownHeight);
  dropdown.style('font-family', 'CourierStd');
  dropdown.changed(() => {
    if (dropdown.value() === 'LEAVE ME ALONE') {
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

  // Always move if mouse is close, even if overlapping
  if (d < escapeDistance) {
    // Closer = faster escape
    var speed = map(d, escapeDistance, 0, 0, maxSpeed * 2); 
    speed = constrain(speed, 5, maxSpeed * 2); // Always have some minimum speed

    var angle = atan2(arrowY + dropdownHeight/2 - mouseY, arrowX + dropdownWidth/2 - mouseX);

    // Nudge angle if near edge
    if (arrowX < padding) angle -= 0.5;
    if (arrowX > width - padding) angle += 0.5;
    if (arrowY < padding) angle += 0.5;
    if (arrowY > height - padding) angle -= 0.5;

    var escapeVector = createVector(cos(angle), sin(angle)).mult(speed);
    arrowX += escapeVector.x;
    arrowY += escapeVector.y;

    // Keep inside window
    arrowX = constrain(arrowX, padding, windowWidth - padding - dropdownWidth);
    arrowY = constrain(arrowY, padding, windowHeight - padding - dropdownHeight);

    dropdown.position(arrowX, arrowY);
  }
}