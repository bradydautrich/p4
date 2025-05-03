//brady dautrich

/*
  This script was developed with the help of ChatGPT (OpenAI), based on the following prompts:
  - "I want to build a watermark builder in JavaScript using p5.js that has options for custom text, orientation (diagonal or straight), line style (dashed, solid, none), opacity slider, and font selection."
  - "Add options for custom text, orientation (diagonal or straight), line style (dashed, solid, none), opacity slider, and font selection"
  - "Create a live preview window using p5.js with these inputs"
  - "Make sure the watermark can be stored as a transparent image for use on the next page"
  - "Add line weight and line density options to the UI"
  - "why is my sketch not centering properly"
*/


let inputText, fontSelect, fontSizeSelect, textDensitySlider;
let orientationRadio, lineStyleRadio, opacitySlider, lineWeightSelect, lineDensitySlider;
let previewGraphics;
let pageFont;
let fonts = {
  "Courier": "Courier",
  "Arial": "Arial",
  "Times New Roman": "Times New Roman"
};

function preload() {
  pageFont = loadFont('CourierStd.otf');
}

function setup() {
  let canvas = createCanvas(1000, 1000);
  canvas.parent('sketch-holder');

  textAlign(CENTER, CENTER);
  noStroke();
  select('body').style('font-family', 'Courier, monospace');

  let y = 0;

  // --- TEXT SETTINGS ---
  let textSettingsHeader = createElement('h3', 'Text Settings');
  textSettingsHeader.parent('sketch-holder');
  textSettingsHeader.position(20, y);
  y += 50;

  createSpan('Text:').parent('sketch-holder').position(20, y);
  y += 25;
  inputText = createInput('Your Text Here');
  inputText.parent('sketch-holder');
  inputText.position(20, y);
  inputText.style('width', '250px');
  inputText.attribute('placeholder', 'Insert Text');
  inputText.style('background-color', 'lightgray');
  y += 30;

  createSpan('Font:').parent('sketch-holder').position(20, y);
  y += 25;
  fontSelect = createSelect();
  fontSelect.parent('sketch-holder');
  for (let f in fonts) fontSelect.option(f);
  fontSelect.selected('Courier');
  fontSelect.position(20, y);
  fontSelect.style('width', '160px');
  y += 30;

  createSpan('Font Size:').parent('sketch-holder').position(20, y);
  y += 25;
  fontSizeSelect = createSelect();
  fontSizeSelect.parent('sketch-holder');
  fontSizeSelect.option('Small');
  fontSizeSelect.option('Medium');
  fontSizeSelect.option('Large');
  fontSizeSelect.selected('Medium');
  fontSizeSelect.position(20, y);
  fontSizeSelect.style('width', '160px');
  y += 30;

  createSpan('Text Density:').parent('sketch-holder').position(20, y);
  y += 25;
  textDensitySlider = createSlider(50, 300, 150);
  textDensitySlider.parent('sketch-holder');
  textDensitySlider.position(20, y);
  textDensitySlider.style('width', '250px');
  y += 50;

  // --- LINE SETTINGS ---
  createElement('h3', 'Line Settings').parent('sketch-holder').position(20, y);
  y += 50;

  createSpan('Line Style:').parent('sketch-holder').position(20, y);
  y += 25;
  lineStyleRadio = createRadio();
  lineStyleRadio.parent('sketch-holder');
  lineStyleRadio.option('solid');
  lineStyleRadio.option('dashed');
  lineStyleRadio.option('none');
  lineStyleRadio.selected('dashed');
  lineStyleRadio.position(20, y);
  y += 40;

  createSpan('Line Thickness:').parent('sketch-holder').position(20, y);
  y += 25;
  lineWeightSelect = createSelect();
  lineWeightSelect.parent('sketch-holder');
  lineWeightSelect.option('Thin');
  lineWeightSelect.option('Medium');
  lineWeightSelect.option('Thick');
  lineWeightSelect.selected('Medium');
  lineWeightSelect.position(20, y);
  lineWeightSelect.style('width', '160px');
  y += 40;

  createSpan('Orientation:').parent('sketch-holder').position(20, y);
  y += 25;
  orientationRadio = createRadio();
  orientationRadio.parent('sketch-holder');
  orientationRadio.option('straight');
  orientationRadio.option('diagonal');
  orientationRadio.selected('diagonal');
  orientationRadio.position(20, y);
  y += 40;

  createSpan('Line Density:').parent('sketch-holder').position(20, y);
  y += 25;
  lineDensitySlider = createSlider(20, 200, 100);
  lineDensitySlider.parent('sketch-holder');
  lineDensitySlider.position(20, y);
  lineDensitySlider.style('width', '250px');
  y += 50;

  // --- OPACITY SETTINGS ---
  createElement('h3', 'Opacity').parent('sketch-holder').position(20, y);
  y += 50;

  opacitySlider = createSlider(0, 255, 100);
  opacitySlider.parent('sketch-holder');
  opacitySlider.position(20, y);
  opacitySlider.style('width', '250px');
  y += 50;

  // Preview Canvas (offscreen graphics)
  previewGraphics = createGraphics(600, 400);
  previewGraphics.textAlign(CENTER, CENTER);
  previewGraphics.noStroke();

  // OK Button
  let okButton = createButton('OK');
  okButton.parent('sketch-holder');
  okButton.position(width - previewGraphics.width / 2 - 40, previewGraphics.height + 60);
  okButton.style('background-color', '#6BD424');
  okButton.style('color', 'white');
  okButton.style('border', 'none');
  okButton.style('padding', '10px 20px');
  okButton.style('font-size', '16px');
  okButton.style('cursor', 'pointer');
  okButton.mousePressed(storeWatermark);
}

function draw() {
  background(255);

  drawPreview();

  image(previewGraphics, width - previewGraphics.width - 40, 40);
}

function storeWatermark() {
  const dataURL = previewGraphics.canvas.toDataURL(); // Save with transparent background
  localStorage.setItem('wmImage', dataURL);
  // alert("Watermark saved! You can now use it on the next page.");
  window.location.href = "crawl.html";
}

function drawPreview() {
  previewGraphics.clear(); // Clear to make it transparent
  previewGraphics.fill(220); // Optional, but ensures empty space isn't filled (transparency)

  const textVal = inputText.value();
  const fontVal = fonts[fontSelect.value()];
  const fontSize = fontSizeSelect.value();
  const lineWeight = lineWeightSelect.value();
  const orient = orientationRadio.value();
  const lineStyle = lineStyleRadio.value();
  const opacity = opacitySlider.value();
  const lineSpacing = lineDensitySlider.value();
  const spacingX = textDensitySlider.value();
  const spacingY = textDensitySlider.value();

  // Font size mapping
  let size;
  if (fontSize === 'Small') size = 16;
  else if (fontSize === 'Medium') size = 24;
  else size = 36;
  previewGraphics.textSize(size);
  previewGraphics.textFont(fontVal);
  previewGraphics.fill(0, opacity);

  // Line weight mapping
  let weight;
  if (lineWeight === 'Thin') weight = 1;
  else if (lineWeight === 'Medium') weight = 2;
  else weight = 4;
  previewGraphics.strokeWeight(weight);

  // Draw lines
  if (lineStyle !== 'none') {
    previewGraphics.stroke(0, opacity);
    if (lineStyle === 'dashed') {
      previewGraphics.drawingContext.setLineDash([10, 10]);
    } else {
      previewGraphics.drawingContext.setLineDash([]);
    }

    if (orient === 'straight') {
      for (let x = 0; x < previewGraphics.width; x += lineSpacing) {
        previewGraphics.line(x, 0, x, previewGraphics.height);
      }
    } else {
      for (let i = -previewGraphics.width; i < previewGraphics.width; i += lineSpacing) {
        previewGraphics.line(i, 0, i + previewGraphics.width, previewGraphics.height);
      }
    }
  }

  previewGraphics.drawingContext.setLineDash([]);
  previewGraphics.noStroke();

  // Draw text grid
  for (let x = 0; x < previewGraphics.width + spacingX; x += spacingX) {
    for (let y = 0; y < previewGraphics.height + spacingY; y += spacingY) {
      previewGraphics.push();

      let yIndex = Math.floor(y / spacingY);
      let offsetX = (orient === 'straight') ? (yIndex % 3) * (spacingX / 3) : 0;

      previewGraphics.translate(x + offsetX, y);

      if (orient === 'diagonal') {
        previewGraphics.rotate(-PI / 4);
      }

      previewGraphics.text(textVal, 0, 0);
      previewGraphics.pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
