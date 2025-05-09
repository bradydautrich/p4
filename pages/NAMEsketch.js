//brady dautrich

/*
  This code was developed with the assistance of ChatGPT based on the following prompts:
  1. "can you give me a p5.js name input screen that saves the name to local storage and then goes to another page"
  2. "can you also make the submit button green, and change to a darker green when you hover"
  3. "can you give the input field and button some nicer styling too? light gray background and no outline for the input"
  4. "can you use a custom font like Courier and center the input/button pair horizontally?"
  5. "if the screen resizes can you make sure the input/button stays centered?"
*/

let nameInput;
let submitButton;
let userName = "";
let courier;

function preload() {
  courier = loadFont('CourierStd.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(courier);

  nameInput = createInput();
  nameInput.attribute('placeholder', 'Enter your name');
  nameInput.style('font-family', 'CourierStd');
  nameInput.style('font-size', '16px');
  nameInput.style('background-color', 'lightgray');
  nameInput.style('border', 'none');
  nameInput.style('outline', 'none');
  nameInput.style('padding', '0 10px');
  nameInput.style('line-height', '30px');
  nameInput.size(200, 30);

  submitButton = createButton('Submit');
  submitButton.style('font-family', 'CourierStd');
  submitButton.style('font-size', '16px');
  submitButton.style('color', 'white');
  submitButton.style('background-color', '#6BD424');
  submitButton.style('border', 'none');
  submitButton.style('outline', 'none');
  submitButton.style('line-height', '30px');
  submitButton.size(100, 30);
  submitButton.mousePressed(storeName);
  submitButton.mouseOver(() => {
  submitButton.style('background-color', '#489713');
});
submitButton.mouseOut(() => {
  submitButton.style('background-color', '#6BD424');
});

  
  centerElements();
}

function draw() {
  background(255);
  fill(0);
  textSize(20);
  textFont(courier);
  textAlign(CENTER);
  // text("What's your name?", width / 2, height / 2 - 40);

  // if (userName !== "") {
  //   text(`Hi, ${userName}!`, width / 2, height / 2 + 60);
  // }
}

function storeName() {
  userName = nameInput.value();
  localStorage.setItem("userName", userName); // Store the name in local storage
  window.location.href = "TOS.html"; // Redirect to TOS.html
}


function centerElements() {
  const totalWidth = 200 + 20 + 100; // input width + spacing + button width
  const x = (width - totalWidth) / 2;
  const y = height / 2;

  nameInput.position(x, y);
  submitButton.position(x + 200 + 20, y);
  nameInput.size(200, 30);
  submitButton.size(100, 30);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerElements();
}
