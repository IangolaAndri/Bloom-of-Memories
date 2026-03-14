// ─────────────────────────────────────────────────────────
//  SKETCH — p5.js entry points
//  Depends on: dataConfig.js, painting.js
// ─────────────────────────────────────────────────────────
let blobs   = [];
let spawned = 0;
let t       = 0;

let TOTAL_BLOBS    = 750;
const SPAWN_INTERVAL = 2;


// ─────────────────────────────────────────────────────────
//  POOL INITIALISER
// ─────────────────────────────────────────────────────────
function initBlobs() {
  for (let i = 0; i < TOTAL_BLOBS; i++) blobs.push(new PaintBlob());
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  if (ACTIVE_DATASET === 'local') {
    extractLocalData();
    drawGround();
    initBlobs();
  } else {
    drawGround();
    loadDataset(function(ok) {
      if (ok) { drawGround(); initBlobs(); }
      else    { console.warn('[sketch] Data load failed.'); }
    });
  }
}


function draw() {
  t++;
  if (blobs.length === 0) return;
  if (spawned < TOTAL_BLOBS && t % SPAWN_INTERVAL === 0) {
    blobs[spawned].paint();
    spawned++;
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawGround();
  for (let i = 0; i < spawned; i++) blobs[i].paint();
}
