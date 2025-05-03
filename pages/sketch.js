//brady dautrich

/*
This sketch includes functionality assisted by ChatGPT by OpenAI.
It was used to help implement camera interpolation and text animation logic.
ChatGPT Prompt References:
- "i want the text to scroll away from the viewer in a 3D space like the star wars intro crawl"
- "can you make the camera interpolate from a flat top-down 2D view to a 3D star wars style crawl?"
- "how do i justify the text so it stretches to a fixed width?"
- "how can i make the text fade from black to yellow during the transition"
*/

let font, courier;
let startTime;
let transitionDuration = 6000; // 4 seconds
let lines = [];
let spacing = 70;
let scrollSpeed = 0.75;
let paragraph = "ALL RIGHTS RESERVED.™ Does this look familiar to you? it shouldn’t. I do not know where you would have seen something like this before. This is entirely my own original idea and work. I have never taken inspiration from anything. Not even once. Inspiration is inherently immoral. The public domain is a dangerous concept that perpetuates misinformation™ and fosters a [redacted] culture. Our democracy is under immense threat and all you need to do is trust me. The only way we get through this as a society is if everyone agrees to no longer read and just listen to what I have to say. I will provide all of the information and news you need with absolute zero bias. I promise not to misinform the false information that is not incorrect. By trusting me we can finally have a united people. No more fighting. There isn’t even nothing to not fight about. I mean, what ever happened to strong leadership anyway? Historically leaders were thriving therefore we should go back to times like that. copyright symbol, trademark symbol, r symbol, but I’m not registered so don’t snitch. I’ll tell on you. If you do I’ll sue you. I have more money than you for this stuff so even if I’m wrong I will bankrupt you before you can do anything about it. Anyway, donate to my charity that supports litigations involving free speech. It helps fund the lawsuits against us and our friends. If you read this far you must like to read and that’s dangerous because of all the misinformation™ out there. From now on only read what I write for your safety and let our lawyers do the reading. Thank you! © And if you’re wondering who I am or why I have any authority, its because my name is Dr. [redacted] with university accreditation from University of [redacted]. I spent 10 years of my lives studying [redacted] so I know a thing or two when it comes to copyright and all of my reserved rights. Unlike my copyrights, my doctorate doesn’t expire so I can haunt you until the end of time, or at least your time, because we are an LLC and I legally don’t have to give you my personal information so me and my generations after me can and will continue to sue you and your blood line until you give us one of your first born sons along with all of your intellectual and creative rights extending to your third cousins once removed. By reading this, you’ve already entered this contract. But do not worry, it’s not binding unless you blink or have blinked while reading this. If you have, we look forward to working with you and your likeliness and will be experimenting with copyrighting your entire genetic genome and every DNA sequence in all of your chromosomes. If you have any kids, they do not fall under fair use and they are legally ours. We need more hands here to help anyway so don’t worry they’ll be employed! On a separate note, you may have been able to enter text while using this cite but from now on that is premium content only authorized for licenses users which you can buy in our shop for only $115.99. What a LOW LOW price for the rights to use the Latin alphabet! If that purchase doesn’t sound reasonable to you feel free to submit a claim through our portal but good luck typing it into the search bar without using any text! Good luck hiring any lawyers to hear your case when you only can find them through word of mouth or emails comprised of only emojis. No one will take you seriously and if you pay for the rights to use the Latin alphabet we may or may not use those funds in our litigations against you if they arise, but we legally do not have to tell you that. In approximately two hours this message will self destruct and be wiped from the internet so good luck referring back to this.  We only allow people to keep this message if they do not think critically so there's always options! If you remember any of this later, that’s copyright infringement. Forget now to avoid penalties. I should mention that everything in this message is completely entirely and fully true except for anything that might not be, which may or may not be intentional but again we legally do not have to tell you. Any resemblance to actual events is a entirely a coincidence invented by you. We promise. Thank you so much for your support and donate today and receive a free cease-and-desist letter. Signed. Pre-laminated. Frame it. Tell your friends you’re part of the movement™. Disclaimer: This disclaimer disclaims all other disclaimers, even the nice ones. Especially the nice ones. Alright goodbye now! But not really. I’m still here. Watching. Not legally, but spiritually. And that holds up in court, trust me.";
let transitionStarted = false;
let bgImage;

function preload() {
  font = loadFont('NewsGothicStd-Bold.otf');
  courier = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(courier); // Start with Courier
  textSize(48);
  fill(0); // Start with black text
  textAlign(LEFT, CENTER);

  let words = paragraph.split(" ");
  let Tline = "";
  let maxWidth = width * 0.88;

  for (let i = 0; i < words.length; i++) {
    let testLine = Tline + words[i] + " ";
    if (textWidth(testLine) > maxWidth) {
      lines.push(Tline.trim());
      Tline = words[i] + " ";
    } else {
      Tline = testLine;
    }
  }
  lines.push(Tline.trim());

  startTime = millis();
}

function draw() {
  
  let elapsed = millis() - startTime - 2000; // subtracts 2 seconds
  let amt = constrain(elapsed / transitionDuration, 0, 1);

  // Interpolate between 2D and 3D settings
  let bg = lerpColor(color(255), color('#160F29'), amt);
  background(bg);

  let txtCol = lerpColor(color(0), color('#EACD12'), amt);
  fill(txtCol);

  // Interpolate camera height and rotation
  let camZ = (height / 2.0) / tan(PI * 30.0 / 180.0);
  let camY = lerp(0, -height / 3, amt);
  let rot = lerp(0, PI / 2, amt);

  camera(0, camY, camZ, 0, 0, 0, 0, 1, 0);
  rotateX(rot);
  translate(0, lerp(0, 200, amt), lerp(0, -300, amt));

  // Font interpolation (hard swap when amt > 0.5 for simplicity)
  textFont(amt < 0.5 ? courier : font);

  for (let i = 0; i < lines.length; i++) {
    let y = (-i * spacing) + (frameCount * scrollSpeed);

    push();
    translate(-width * 0.4, -y, 0);
    drawJustifiedText(lines[i], width * 0.8);
    pop();
  }
}
function drawJustifiedText(line, targetWidth) {
  let words = line.split(" ");
  let totalWordWidth = 0;

  for (let w of words) {
    totalWordWidth += textWidth(w);
  }

  let spaceCount = words.length - 1;
  let spacing = spaceCount > 0 ? (targetWidth - totalWordWidth) / spaceCount : 0;

  let x = 0;
  for (let i = 0; i < words.length; i++) {
    text(words[i], x, 0);
    x += textWidth(words[i]) + spacing;
  }
}
