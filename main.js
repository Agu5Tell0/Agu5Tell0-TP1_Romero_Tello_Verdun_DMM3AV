// let bottomImg, topImg;
// let trace = [];
// const traceDuration = 150; // Aumentar la duración para un rastro más largo
// const fadeSpeed = 0.001; // Reducir la velocidad de desvanecimiento para que sea más lento
// const traceInterval = 1; // Añadir un punto del rastro cada N frames (menor valor = mayor frecuencia)
// let lastFrameCount = 0;

// function preload() {
//   bottomImg = loadImage('img/imagen_black.png');
//   topImg = loadImage('img/imagen_white.png');
// }

// function setup() {
//   const cnv = createCanvas(1300, 731);
//   cnv.parent('canvas-container');
//   noCursor();
//   frameRate(60)
// }

// function draw() {
//   image(topImg, 0, 0);

//   // Añadir puntos al rastro con mayor frecuencia
//   if (mouseIsPressed && frameCount % traceInterval === 0 && (mouseX !== pmouseX || mouseY !== pmouseY || frameCount === 1)) {
//     trace.push({ x: mouseX, y: mouseY, time: frameCount, alpha: 1 });
//   }

//   loadPixels();
//   bottomImg.loadPixels();
//   let pointSize = 150; // Reducir el tamaño del "pincel"

//   for (let i = trace.length - 1; i >= 0; i--) {
//     let p = trace[i];

//     for (let y = -pointSize / 2; y < pointSize / 2; y++) {
//       for (let x = -pointSize / 2; x < pointSize / 2; x++) {
//         if (x * x + y * y <= (pointSize / 2) * (pointSize / 2)) {
//           let sampleX = int(p.x + x);
//           let sampleY = int(p.y + y);

//           if (sampleX >= 0 && sampleX < bottomImg.width && sampleY >= 0 && sampleY < bottomImg.height) {
//             let index = (sampleY * bottomImg.width + sampleX) * 4;
//             let r = bottomImg.pixels[index];
//             let g = bottomImg.pixels[index + 1];
//             let b = bottomImg.pixels[index + 2];
//             let a = bottomImg.pixels[index + 3];

//             let canvasX = int(p.x + x);
//             let canvasY = int(p.y + y);
//             let canvasIndex = (canvasY * width + canvasX) * 4;

//             if (canvasIndex >= 0 && canvasIndex < pixels.length) {
//               pixels[canvasIndex] = r;
//               pixels[canvasIndex + 1] = g;
//               pixels[canvasIndex + 2] = b;
//               pixels[canvasIndex + 3] = a * p.alpha;
//             }
//           }
//         }
//       }
//     }

//     p.alpha -= fadeSpeed;
//     if (frameCount - p.time > traceDuration || p.alpha <= 0) {
//       trace.splice(i, 1);
//     }
//   }
//   updatePixels();
// }

// function mouseMoved() {
//   cursor('img/brush.png', 20, -10);
// }

// function mouseOut() {
//   noCursor();
// }













let bottomImg, topImg;
let trace = [];
const traceDuration = 200;
const fadeSpeed = 0.001;
const traceInterval = 1;

function preload() {
  bottomImg = loadImage('img/imagen_black.png');
  topImg = loadImage('img/imagen_white.png');
}

function setup() {
  const cnv = createCanvas(1300, 731);
  cnv.parent('canvas-container');
  noCursor();
  frameRate(60);
}

function draw() {
  image(topImg, 0, 0);

  if (
    mouseIsPressed &&
    frameCount % traceInterval === 0 &&
    (mouseX !== pmouseX || mouseY !== pmouseY || frameCount === 1)
  ) {
    trace.push({ x: mouseX, y: mouseY, time: frameCount, alpha: 1 });
  }

  loadPixels();
  bottomImg.loadPixels();
  let pointSize = 150;

  for (let i = trace.length - 1; i >= 0; i--) {
    let p = trace[i];

    for (let y = -pointSize / 2; y < pointSize / 2; y++) {
      for (let x = -pointSize / 2; x < pointSize / 2; x++) {
        let distSq = x * x + y * y;
        let radiusSq = (pointSize / 2) * (pointSize / 2);
        if (distSq <= radiusSq) {
          let sampleX = int(p.x + x);
          let sampleY = int(p.y + y);

          if (
            sampleX >= 0 &&
            sampleX < bottomImg.width &&
            sampleY >= 0 &&
            sampleY < bottomImg.height
          ) {
            let index = (sampleY * bottomImg.width + sampleX) * 4;
            let r = bottomImg.pixels[index];
            let g = bottomImg.pixels[index + 1];
            let b = bottomImg.pixels[index + 2];
            let a = bottomImg.pixels[index + 3];

            let canvasX = int(p.x + x);
            let canvasY = int(p.y + y);
            let canvasIndex = (canvasY * width + canvasX) * 4;

            if (canvasIndex >= 0 && canvasIndex < pixels.length) {
              // Gradiente simple según distancia al centro
              let softness = 1 - distSq / radiusSq;
              let finalAlpha = p.alpha * softness;

              pixels[canvasIndex] = lerp(pixels[canvasIndex], r, finalAlpha);
              pixels[canvasIndex + 1] = lerp(pixels[canvasIndex + 1], g, finalAlpha);
              pixels[canvasIndex + 2] = lerp(pixels[canvasIndex + 2], b, finalAlpha);
              // Alpha no se modifica porque trabajamos con colores mezclados
            }
          }
        }
      }
    }

    p.alpha -= fadeSpeed;
    if (frameCount - p.time > traceDuration || p.alpha <= 0) {
      trace.splice(i, 1);
    }
  }

  updatePixels();
}

function mouseMoved() {
  cursor('img/brush.png', 20, -10);
}

function mouseOut() {
  noCursor();
}
