// ─────────────────────────────────────────────────────────
//  GROUND — raw linen canvas texture
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
  //  CORE PAINT DAUB
  // ─────────────────────────────────────────────────────────
  function paintDaub(x, y, r, R, G, B) {
    let dc = drawingContext;
    let Rd = constrain(R - 50, 0, 255), Gd = constrain(G - 50, 0, 255), Bd = constrain(B - 46, 0, 255);
  
    // LAYER 2 — main body, overlapping strokes
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
  
    // LAYER 3 — dry brush gaps (ground showing through)
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
  
    // LAYER 4 — bristle drag lines (clipped to blob boundary)
    let brushDir = random(TWO_PI);
    let numLines = floor(r * 1.4);
    dc.save();
    dc.beginPath(); dc.arc(x, y, r * 1.02, 0, TWO_PI); dc.clip();
    for (let i = 0; i < numLines; i++) {
      let perp   = brushDir + HALF_PI;
      let spread = r * random(-0.85, 0.85);
      let lx = x + cos(perp) * spread, ly = y + sin(perp) * spread;
      let llen = random(r * 0.3, r * 0.9);
      if (random() < 0.3) llen *= random(0.2, 0.6);
      let off = random(-r * 0.2, r * 0.2);
      let lx0 = lx + cos(brushDir) * (off - llen / 2), ly0 = ly + sin(brushDir) * (off - llen / 2);
      let lx1 = lx + cos(brushDir) * (off + llen / 2), ly1 = ly + sin(brushDir) * (off + llen / 2);
      let lR = constrain(R + random(-20, 30), 0, 255);
      let lG = constrain(G + random(-16, 24), 0, 255);
      let lB = constrain(B + random(-14, 20), 0, 255);
      dc.beginPath(); dc.moveTo(lx0, ly0); dc.lineTo(lx1, ly1);
      dc.strokeStyle = `rgba(${~~lR},${~~lG},${~~lB},${random(0.08, 0.26).toFixed(2)})`;
      dc.lineWidth = random(0.5, 2.2); dc.lineCap = 'round'; dc.stroke();
    }
    dc.restore();
    noStroke();
  
    // LAYER 5 — impasto edge buildup (inside boundary)
    let edgeCount = floor(r * 2.2);
    for (let i = 0; i < edgeCount; i++) {
      let a  = random(TWO_PI);
      let ed = r * random(0.72, 0.94);
      let ex = x + cos(a) * ed, ey = y + sin(a) * ed;
      let ew = random(r * 0.05, r * 0.14), eh = ew * random(0.4, 1.0);
      fill(Rd, Gd, Bd, random(40, 90));
      push(); translate(ex, ey); rotate(a + random(-0.5, 0.5));
      ellipse(0, 0, ew, eh);
      pop();
    }
  
    // LAYER 6 — oil sheen
    let sx2 = x - r * 0.2, sy2 = y - r * 0.22;
    let sg  = dc.createRadialGradient(sx2, sy2, 0, sx2, sy2, r * 0.55);
    sg.addColorStop(0, 'rgba(255,250,240,0.22)');
    sg.addColorStop(1, 'rgba(255,250,240,0)');
    dc.beginPath(); dc.arc(sx2, sy2, r * 0.55, 0, TWO_PI);
    dc.fillStyle = sg; dc.fill();
  }
  
  // ─────────────────────────────────────────────────────────
  //  BLOB CLASS
  // ─────────────────────────────────────────────────────────
  class PaintBlob {
    constructor() {
      let col = pickColor(random() > 0.4);
      this.x  = random(width);
      this.y  = random(height);
      this.r  = constrain(col.brightness * 0.34 + random(18, 46), 24, 90);
      this.R  = constrain(col.r + random(-6, 14), 0, 255);
      this.G  = constrain(col.g + random(-4,  8), 0, 255);
      this.B  = constrain(col.b + random(-8,  4), 0, 255);
    }
    paint() { paintDaub(this.x, this.y, this.r, this.R, this.G, this.B); }
  }