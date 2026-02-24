// ─────────────────────────────────────────────────────────
//  SKETCH — p5.js entry points
//  Depends on: dataConfig.js, painting.js
// ─────────────────────────────────────────────────────────

let blobs   = [];
let spawned = 0;
let t       = 0;

const TOTAL_BLOBS    = 750;
const SPAWN_INTERVAL = 2;   // frames between each daub (lower = faster)

// ─────────────────────────────────────────────────────────
//  POOL INITIALISER
// ─────────────────────────────────────────────────────────
function initBlobs() {
  blobs = []; spawned = 0; t = 0;
  for (let i = 0; i < TOTAL_BLOBS; i++) blobs.push(new PaintBlob());
}

// ─────────────────────────────────────────────────────────
//  p5 LIFECYCLE
// ─────────────────────────────────────────────────────────

// preload() is defined in dataConfig.js (handles local image loading)

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  if (USE_LOCAL_DATASET) {
    extractPaintData();
    drawGround();
    initBlobs();
  } else {
    drawGround(); // show linen while waiting for file / CSV picker
    loadUnsplashData(function(ok) {
      if (ok) { drawGround(); initBlobs(); }
    });
  }
}

function draw() {
  t++;
  if (blobs.length === 0) return; // waiting for data
  if (spawned < TOTAL_BLOBS && t % SPAWN_INTERVAL === 0) {
    blobs[spawned].paint();
    spawned++;
  }
}

function mousePressed() {
  if (USE_LOCAL_DATASET || paintStrokes.length > 0) {
    drawGround();
    initBlobs();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawGround();
  for (let i = 0; i < spawned; i++) blobs[i].paint();
}