// ─────────────────────────────────────────────────────────
//  GROUND — original linen canvas
// ─────────────────────────────────────────────────────────
function drawGround() {
    background(235, 228, 214);
    noStroke();
    for (let i = 0; i < 6000; i++) {
      let v = random(212, 244), a = random(8, 38);
      fill(v, v - random(3), v - random(8), a);
      if (random() > 0.5) rect(random(width), random(height), random(6, 90), 1);
      else                rect(random(width), random(height), 1, random(6, 70));
    }
    for (let i = 0; i < 3000; i++) {
      let v = random(200, 250);
      fill(v, v - random(4), v - random(9), random(6, 20));
      rect(random(width), random(height), random(1, 4), random(1, 4));
    }
  }


// ─────────────────────────────────────────────────────────
//  UNIVERSAL COLOUR PICKER
// ─────────────────────────────────────────────────────────
function pickColor(wantSaturated) {
  if (paintStrokes.length === 0)
    return { r:160, g:120, b:80, brightness:120, saturation:0.4, hue:0.08 };

  let pool = random(paintStrokes);
  if (!pool || pool.strokes.length === 0)
    return { r:160, g:120, b:80, brightness:120, saturation:0.4, hue:0.08 };

  if (wantSaturated) {
    let best = null;
    for (let i=0; i<10; i++) {
      let c = random(pool.strokes);
      if (!best || c.saturation > best.saturation) best = c;
    }
    return best;
  }
  return random(pool.strokes);
}


// ─────────────────────────────────────────────────────────
//  COLOUR HELPERS
// ─────────────────────────────────────────────────────────
function rgbToHue(r, g, b) {
  let rN = r/255, gN = g/255, bN = b/255;
  let maxC = Math.max(rN,gN,bN), minC = Math.min(rN,gN,bN);
  if (maxC === minC) return 0;
  let d = maxC - minC, h = 0;
  if      (maxC === rN) h = ((gN-bN)/d + (gN<bN?6:0)) / 6;
  else if (maxC === gN) h = ((bN-rN)/d + 2) / 6;
  else                  h = ((rN-gN)/d + 4) / 6;
  return h;
}

function makeStroke(r, g, b) {
  let brightness = (r+g+b) / 3;
  let maxC = Math.max(r,g,b), minC = Math.min(r,g,b);
  let saturation = maxC === 0 ? 0 : (maxC-minC) / maxC;
  return { r, g, b, brightness, saturation, hue: rgbToHue(r,g,b) };
}

function poolMetaFromStrokes(strokes) {
  if (!strokes.length) return { warmth:0.5, contrast:0.3, avgBrightness:128 };
  let brights = strokes.map(s => s.brightness);
  let maxB = Math.max(...brights), minB = Math.min(...brights);
  let avgB = brights.reduce((a,v)=>a+v,0) / brights.length;
  let avgHue = strokes.reduce((a,s)=>a+s.hue,0) / strokes.length;
  return {
    warmth:        Math.max(0, 1 - Math.abs(avgHue - 0.08) * 4),
    contrast:      (maxB - minB) / 255,
    avgBrightness: avgB
  };
}


  
  // ─────────────────────────────────────────────────────────
  //  CORE PAINT DAUB 
  // ─────────────────────────────────────────────────────────
  function paintDaub(x, y, r, R, G, B) {
    let dc = drawingContext;

    // LAYER 1 — main body, overlapping strokes
    let numStrokes = floor(r * 1.8);
    for (let i = 0; i < numStrokes; i++) {
      let progress = i / numStrokes;
      let dist  = r * random(0, 1.0) * (1 - progress * 0.3);
      let a     = random(TWO_PI);
      let sx    = x + cos(a) * dist * 0.6;
      let sy    = y + sin(a) * dist * 0.6;
      let sw    = random(r * 0.55, r * 1.1);
      let sh    = sw * random(0.45, 0.85);
      let sR    = constrain(R + random(-22, 22), 0, 255);
      let sG    = constrain(G + random(-18, 18), 0, 255);
      let sB    = constrain(B + random(-15, 15), 0, 255);
      fill(sR, sG, sB, random(55, 140));

      push(); translate(sx, sy); rotate(random(TWO_PI));
      ellipse(0, 0, sw, sh);
      pop();
    }
  
    // LAYER 2 — dry brush gaps (ground showing through)
    let groundC  = color(235, 228, 214);
    let numHoles = floor(r * 0.6);
    for (let i = 0; i < numHoles; i++) {
      let a  = random(TWO_PI);
      let d  = random(r * 0.15, r * 0.82);
      let hx = x + cos(a) * d, hy = y + sin(a) * d;
      let hs = random(r * 0.04, r * 0.14);
      fill(red(groundC) + random(-8,8), green(groundC) + random(-6,6), blue(groundC) + random(-4,4), random(25, 65));
      ellipse(hx, hy, hs * random(0.5, 2.0), hs * random(0.5, 2.0));
    }
    
    // LAYER 3 — oil sheen
    let sx2 = x - r * 0.2, sy2 = y - r * 0.22;
    let sg  = dc.createRadialGradient(sx2, sy2, 0, sx2, sy2, r * 0.55);
    sg.addColorStop(0, 'rgba(255,250,240,0.22)');
    sg.addColorStop(1, 'rgba(255,250,240,0)');
    dc.beginPath(); dc.arc(sx2, sy2, r * 0.55, 0, TWO_PI);
    dc.fillStyle = sg; dc.fill();
  }
  
  
  // ─────────────────────────────────────────────────────────
  //  BLOB CLASS
  //  Only colour and size are influenced by datasetProfile.
  //  The daub rendering is identical for every dataset.
  // ─────────────────────────────────────────────────────────
  class PaintBlob {
    constructor() {
      let p = window.datasetProfile || {};

      let warmth    = p.avgWarmth     !== undefined ? p.avgWarmth     : 0.5;
      let contrast  = p.avgContrast   !== undefined ? p.avgContrast   : 0.4;
      let hueSpread = p.hueSpread     !== undefined ? p.hueSpread     : 0.5;
  
      let col = pickColor(random() > 0.4);
  
      this.x = random(width);
      this.y = random(height);
  
      // Size: subtle contrast scaling
      // High-contrast datasets → slightly wider size range
      let baseR = col.brightness * 0.34 + random(18, 46);
      this.r = constrain(baseR * (0.85 + contrast * 0.3), 24, 90);
  
      // Colour: original jitter + warmth tint + hueSpread variance
      // warmth shifts R warm / B cool across the whole piece
      // hueSpread controls how much extra colour drift is allowed per blob
      let warmShift = (warmth - 0.5) * 30;
      let drift     = hueSpread * 14;  // extra jitter on top of original ±6/±4/±8
      this.R = constrain(col.r + warmShift + random(-drift, drift), 0, 255);
      this.G = constrain(col.g + warmShift + random(-drift, drift), 0, 255);
      this.B = constrain(col.b + warmShift + random(-drift, drift), 0, 255);
    }
  
    paint() { paintDaub(this.x, this.y, this.r, this.R, this.G, this.B); }
  }
