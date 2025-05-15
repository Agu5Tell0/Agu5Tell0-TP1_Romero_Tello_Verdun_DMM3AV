let bottomImg, topImg;
let brushSize = 100;
let brushSoftness = 0.2;
let isDragging = false;
let refreshTimeout;

let isResetting = false;
let resetStartTime = 0;
let resetDuration = 2000;
let resetProgress = 0;

let buffer;

function preload() {
  bottomImg = loadImage('img/imagen_black.png');
  topImg = loadImage('img/imagen_white.png');
}

function setup() {
  const cnv = createCanvas(1300, 731);
  cnv.parent('canvas-container');

  buffer = createGraphics(width, height);
  buffer.image(topImg, 0, 0);
}

function draw() {
  image(bottomImg, 0, 0);
  image(buffer, 0, 0);

  if (isResetting) {
    let elapsed = millis() - resetStartTime;
    resetProgress = constrain(elapsed / resetDuration, 0, 1);

    let radius = resetProgress * dist(0, 0, width, height);

    buffer.push();
    buffer.noStroke();
    buffer.drawingContext.save();
    buffer.drawingContext.beginPath();
    buffer.drawingContext.arc(width / 2, height / 2, radius * 2, 0, TWO_PI);
    buffer.drawingContext.clip();
    buffer.image(topImg, 0, 0);
    buffer.drawingContext.restore();
    buffer.pop();

    if (resetProgress >= 1) {
      isResetting = false;
    }
  }
}

function mousePressed() {
  isDragging = true;
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
  isResetting = false;
}

function mouseReleased() {
  isDragging = false;
  refreshTimeout = setTimeout(() => {
    resetCanvas();
  }, 6000);
}

function mouseDragged() {
  let gradient = drawingContext.createRadialGradient(
    mouseX, mouseY, brushSize * 0.3,
    mouseX, mouseY, brushSize
  );

  gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
  gradient.addColorStop(brushSoftness, 'rgba(0, 0, 0, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  buffer.drawingContext.save();
  buffer.drawingContext.globalCompositeOperation = 'destination-out';
  buffer.drawingContext.fillStyle = gradient;
  buffer.drawingContext.beginPath();
  buffer.drawingContext.arc(mouseX, mouseY, brushSize, 0, TWO_PI);
  buffer.drawingContext.fill();
  buffer.drawingContext.restore();
}

function resetCanvas() {
  isResetting = true;
  resetStartTime = millis();
}