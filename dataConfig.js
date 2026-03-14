// ─────────────────────────────────────────────────────────
//  DATASET CONFIGURATION
//  'local'    → local photos folder
//  'unsplash' → Unsplash Lite colors.csv + photos.csv
// ─────────────────────────────────────────────────────────
const ACTIVE_DATASET = 'local';

// ── Local config
const LOCAL_TOTAL_IMAGES = 33;
const LOCAL_IMAGE_PREFIX = 'photos/img';
const LOCAL_IMAGE_DIGITS = 3;

// ── Unsplash config
const UNSPLASH_COLORS_PATH = 'unsplash-research-dataset-lite-latest/colors.csv000';

// ─────────────────────────────────────────────────────────
//  SHARED STATE
// ─────────────────────────────────────────────────────────
let images       = [];
let paintStrokes = [];
// window.datasetProfile:
// {
//   avgWarmth      : 0–1    warm (amber/red) vs cool (blue/cyan)
//   avgContrast    : 0–1    tonal range within pools
//   hueSpread      : 0–1    how diverse the hue range is
// }



// ─────────────────────────────────────────────────────────
//  DATASET ENTRY POINT
// ─────────────────────────────────────────────────────────
function loadDataset(onReady) {
  if (ACTIVE_DATASET === 'local') {
    extractLocalData();
    onReady(true);
  } else if (ACTIVE_DATASET === 'unsplash') {
    loadUnsplashData(onReady);
  } else {
    console.warn('[dataConfig] Unknown dataset:', ACTIVE_DATASET);
    onReady(false);
  }
}


// ─────────────────────────────────────────────────────────
//  LOCAL DATASET LOADER
// ─────────────────────────────────────────────────────────
function preload() {
  if (ACTIVE_DATASET !== 'local') return;
  for (let i = 1; i <= LOCAL_TOTAL_IMAGES; i++)
    images.push(loadImage(`${LOCAL_IMAGE_PREFIX}${nf(i,LOCAL_IMAGE_DIGITS)}.jpg`));
}

function extractLocalData() {
  paintStrokes = [];
  for (let img of images) {
    img.resize(80, 0);
    img.loadPixels();
    let strokes = [];
    for (let j = 0; j < img.pixels.length; j += 4) {
      let r=img.pixels[j], g=img.pixels[j+1], b=img.pixels[j+2];
      strokes.push(makeStroke(r, g, b));
    }
    if (strokes.length === 0) continue;
    paintStrokes.push({ strokes, ...poolMetaFromStrokes(strokes) });
  }
  window.datasetProfile = buildProfile(paintStrokes);
}


// ─────────────────────────────────────────────────────────
//  UNSPLASH DATASET LOADER
// ─────────────────────────────────────────────────────────
function loadUnsplashData(onReady) {
  Promise.all([
    fetch(UNSPLASH_COLORS_PATH)
      .then(r => { if (!r.ok) throw new Error(`colors HTTP ${r.status}`); return r.text(); }),
  ])
  .then(([colorsText]) => {
    onReady(parseColorsCSV(colorsText));
  })
  .catch(err => { console.error('[Unsplash]', err); onReady(false); });
}

function parseColorsCSV(text) {
  let lines = text.replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n');
  if (lines.length < 1) return false;

  let cols = lines[0].split('\t').map(h=>h.trim().toLowerCase());
  let hasHeader = cols.includes('red') || cols.includes('photo_id');

  let idIdx, redIdx, greenIdx, blueIdx, scoreIdx;
  if (hasHeader) {
    idIdx    = cols.indexOf('photo_id');
    redIdx   = cols.indexOf('red');
    greenIdx = cols.indexOf('green');
    blueIdx  = cols.indexOf('blue');
    scoreIdx = cols.indexOf('score');
  } else {
    idIdx=0; redIdx=2; greenIdx=3; blueIdx=4; scoreIdx=7;
  }

  if (redIdx===-1||greenIdx===-1||blueIdx===-1) {
    console.warn('[Unsplash] Cannot find r/g/b columns'); return false;
  }

  let photoMap  = new Map();
  let startLine = hasHeader ? 1 : 0;

  for (let i = startLine; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;
    let parts = line.split('\t');
    if (parts.length <= Math.max(redIdx, greenIdx, blueIdx)) continue;

    let r = parseInt(parts[redIdx],10), g = parseInt(parts[greenIdx],10), b = parseInt(parts[blueIdx],10);
    if (isNaN(r)||isNaN(g)||isNaN(b)||r<0||r>255||g<0||g>255||b<0||b>255) continue;

    let score   = scoreIdx>=0 && parts[scoreIdx] ? parseFloat(parts[scoreIdx])||1 : 1;
    let photoId = idIdx>=0 ? parts[idIdx].trim() : `row_${i}`;

    if (!photoMap.has(photoId)) photoMap.set(photoId, []);
    photoMap.get(photoId).push({ r, g, b, score });
  }

  if (photoMap.size === 0) { console.warn('[Unsplash] 0 photos parsed'); return false; }

  paintStrokes = [];
  for (const [, entries] of photoMap) {
    let strokes = [];
    for (let e of entries) {
      let repeats = Math.max(1, Math.round(e.score * 20));
      for (let k=0; k<repeats; k++) strokes.push(makeStroke(e.r, e.g, e.b));
    }
    if (!strokes.length) continue;
    paintStrokes.push({ strokes, ...poolMetaFromStrokes(strokes) });
  }

  console.log(`[Unsplash] ${photoMap.size} photos · ${paintStrokes.length} pools`);
  window.datasetProfile = buildProfile(paintStrokes);
  return true;
}


// ─────────────────────────────────────────────────────────
//  UNIVERSAL PROFILE BUILDER
// ─────────────────────────────────────────────────────────
function buildProfile(pools) {
  let n = pools.length;
  if (n === 0) return {avgWarmth:0.5, avgContrast:0.4, hueSpread:0.5 };

  totalWarmth=0, totalContrast=0;
  let allHues = [];

  for (let p of pools) {
    if (!p.strokes || p.strokes.length === 0) continue;
    for (let c of p.strokes) {
      allHues.push(c.hue);
    }
    totalWarmth   += p.warmth   !== undefined ? p.warmth   : 0.5;
    totalContrast += p.contrast !== undefined ? p.contrast : 0.3;
  }

  allHues.sort((a,b)=>a-b);
  let hueSpread = allHues.length > 1 ? allHues[allHues.length-1] - allHues[0] : 0;

  let profile = {
    avgWarmth:     totalWarmth / n,
    avgContrast:   totalContrast / n,
    hueSpread:     Math.min(hueSpread, 1)
  };

  console.log('[datasetProfile]', profile);
  return profile;
}

