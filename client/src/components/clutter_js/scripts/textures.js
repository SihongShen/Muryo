import initBezier from 'p5bezier';

let P = null;
let S = null;


export function bindTextures(p, state){
  P = p;
  S = state;

  // expose legacy global names for backward compatibility with existing code
  window.pgG_star1 = pgG_star1;
  window.pgG_star2 = pgG_star2;
  window.pgG_star3 = pgG_star3;
  window.pgG_star4 = pgG_star4;
  window.pgG_spray1 = pgG_spray1;
  window.pgG_spray2 = pgG_spray2;
  window.pgG_gradient1 = pgG_gradient1;
  window.pgG_gradient2 = pgG_gradient2;
  window.pgG_gradient3 = pgG_gradient3;
  window.pgG_gradient4 = pgG_gradient4;
  window.pgG_gradient5 = pgG_gradient5;
  window.pgG_scribble1 = pgG_scribble1;
  window.pgG_scribble2 = pgG_scribble2;
  window.grabRandomColor = grabRandomColor;
}

function ensureBound(){
  if(!P || !S) throw new Error('textures not bound. Call bindTextures(p, state) first.');
}


//////////////////////////////////////////////
/////////////////////////////       Random Color
//////////////////////////////////////////////

export function grabRandomColor(){
  ensureBound();
  var rs = P.random(100);
  if(rs<25){
    return S.color1;
  } else if(rs<50){
    return S.color2;
  } else if(rs<75){
    return S.color3;
  } else {
    return S.foreColor;
  }
}

//////////////////////////////////////////////
/////////////////////////////       STARS
//////////////////////////////////////////////

export function pgG_star1(g){  // soft sun crest
  ensureBound();
  var thisR = 200;
  var thisIter = 28;
  var thisAng = 2*P.PI/thisIter;

  var rColor1 = grabRandomColor();

  S.pg_grfx[g] = createPG(thisR*1.1, thisR*1.1, P.P2D);

  var pg = S.pg_grfx[g];
  pg.translate(pg.width/2, pg.height/2);

  pg.stroke(rColor1);
  pg.fill(S.bkgdColor);
  pg.beginShape();
    pg.vertex(thisR * 0.55,0);
    for(var i = 0; i <= thisIter; i++){
      var nowRadius = (thisR - (i%2)*thisR/4)/2;

      var x = P.cos(i*thisAng) * nowRadius;
      var y = P.sin(i*thisAng) * nowRadius;

      pg.vertex(x,y);
    }
    pg.vertex(thisR/2,0);
  pg.endShape();
}

export function pgG_star2(g){  // hard eight point
  ensureBound();
  var thisR = 300;
  var thisIter = 16;
  var thisAng = 2*P.PI/thisIter;

  S.pg_grfx[g] = createPG(thisR*1.8, thisR*1.8, P.P2D);
  var pg = S.pg_grfx[g];
  pg.translate(pg.width/2, pg.height/2);

  var rColor2 = grabRandomColor();

  pg.noStroke();
  pg.fill(rColor2);
  pg.beginShape();
    pg.vertex(thisR * 0.9, 0);
    for(var i = 0; i<=thisIter; i++){
      var thisRadius = (thisR - (i%2)*thisR*0.7)/2;

      if(i%4 === 0){
        thisRadius = thisR * 0.9;
      }

      var x = P.cos(i*thisAng) * thisRadius;
      var y = P.sin(i*thisAng) * thisRadius;

      pg.vertex(x,y);
    }
    pg.vertex(thisR * 0.9,0);
  pg.endShape();

  // rColor2.setAlpha(255);
}

export function pgG_star3(g){  // 9 lines
  ensureBound();
  var thisR = 150;
  var thisIter = 18;
  var thisAng = 2*P.PI/thisIter;

  var rColor3 = grabRandomColor();

  S.pg_grfx[g] = createPG(thisR*2, thisR*2, P.P2D);
  var pg = S.pg_grfx[g];
  pg.translate(pg.width/2, pg.height/2);

  pg.stroke(rColor3);
  pg.strokeWeight(1);
  pg.noFill();
  for(var i = 0; i<thisIter; i++){
    var x = P.cos(i*thisAng) * thisR;
    var y = P.sin(i*thisAng) * thisR;

    pg.line(0, 0, x, y);
  }

  // rColor3.setAlpha(255);
}

export function pgG_star4(g){  // soft sun crest
  ensureBound();
  var thisR = 300;
  var thisIter = 28;
  var thisAng = 2*P.PI/thisIter;

  var rColor4 = grabRandomColor();

  S.pg_grfx[g] = createPG(thisR*1.1, thisR*1.1, P.P2D);
  var pg = S.pg_grfx[g];
  pg.translate(pg.width/2, pg.height/2);

  pg.stroke(rColor4);
  pg.fill(S.bkgdColor);
  pg.beginShape();
    pg.vertex(thisR * 0.55,0);
    for(var i = 0; i <= thisIter; i++){
      var nowRadius = (thisR - (i%2)*thisR/16)/2;

      var x = P.cos(i*thisAng) * nowRadius;
      var y = P.sin(i*thisAng) * nowRadius;

      pg.vertex(x,y);
    }
    pg.vertex(thisR/2,0);
  pg.endShape();

  // rColor4.setAlpha(255);
}
//////////////////////////////////////////////
/////////////////////////////       SPRAYS
//////////////////////////////////////////////

export function pgG_spray1(g){
  ensureBound();
  var thisSize = 1200;
  var thisIter = 1000;

  var rColor5 = grabRandomColor();

  S.pg_grfx[g] = createPG(thisSize, thisSize, P.P2D);
  var pg = S.pg_grfx[g];
  pg.translate(pg.width/2, pg.height/2);

  pg.fill(rColor5);
  pg.noStroke();

  for(var i = 0; i<thisIter; i++){
    var a = P.random(0,2*P.PI);
    var dist = P.random(-thisSize/4, thisSize/2);

    var x = P.cos(a) * dist;
    var y = P.sin(a) * dist;

    pg.ellipse(x,y, 2, 2);
  }

  // rColor5.setAlpha(255);
}

export function pgG_spray2(g){
  ensureBound();
  var thisSize = 800;
  var thisIter = 1500;

  var rColor6 = grabRandomColor();

  S.pg_grfx[g] = createPG(thisSize, thisSize, P.P2D);
  var pg = S.pg_grfx[g];
  pg.translate(pg.width/2, pg.height/2);

  pg.fill(rColor6);
  pg.noStroke();

  for(var i = 0; i<thisIter; i++){
    var a = P.random(0,2*P.PI);
    var dist = P.random(-thisSize/4, thisSize/2);

    var x = P.cos(a) * dist;
    var y = P.sin(a) * dist;

    pg.ellipse(x,y, 2, 2);
  }

  // rColor6.setAlpha(255);
}

//////////////////////////////////////////////
/////////////////////////////       GRADIENTS
//////////////////////////////////////////////

export function pgG_gradient1(g){
  ensureBound();
  var thisSize = P.round(P.random(800,1400));
  var thisIter = Math.floor(thisSize/10);

  var rColor7 = grabRandomColor();
  rColor7.setAlpha(1);

  S.pg_grfx[g] = createPG(thisSize, thisSize, P.P2D);
  var pg = S.pg_grfx[g];
  pg.translate(pg.width/2, pg.height/2);

  pg.noStroke();

  for(var i = 0; i<thisIter; i++){
    var nowR = P.map(i, 0, thisIter, 0, thisSize*0.9);

    pg.fill(rColor7);
    pg.ellipse(0,0, nowR, nowR);
  }

  // rColor7.setAlpha(255);
}

export function pgG_gradient2(g){
  ensureBound();
  var thisSize = P.round(P.random(250,600));
  var thisIter = P.round(thisSize * 0.25);

  var rColor8 = S.bkgdColor;
  rColor8.setAlpha(50);

  S.pg_grfx[g] = createPG(thisSize, thisSize, P.P2D);
  var pg = S.pg_grfx[g];
  pg.translate(pg.width/2, pg.height/2);

  pg.noStroke();

  for(var i = 0; i<thisIter; i++){
    var nowR = P.map(i, 0, thisIter, 0, thisSize*0.9);

    pg.fill(rColor8);
    pg.ellipse(0,0, nowR, nowR);
  }

  // rColor8.setAlpha(255);
}

export function pgG_gradient3(g){
  ensureBound();
  var thisSize = 350;
  var thisIter = 150;

  S.pg_grfx[g] = createPG(thisSize, thisSize, P.P2D);

  var rColor9 = grabRandomColor();
  rColor9.setAlpha(1);

  var pg = S.pg_grfx[g];
  pg.translate(pg.width/2, pg.height/2);

  pg.noStroke();

  for(var i = 0; i<thisIter; i++){
    var nowR = P.map(i, 0, thisIter, 0, thisSize*0.9);

    pg.fill(rColor9);
    pg.ellipse(0,0, nowR, nowR);
  }

  // rColor9.setAlpha(255);
}

export function pgG_gradient4(g){
  ensureBound();
  var thisSize = P.round(P.random(400,800));
  var thisIter = P.round(thisSize * 0.25);

  S.pg_grfx[g] = createPG(thisSize, thisSize, P.P2D);

  var rColor12 = S.bkgdColor;
  var addColor = grabRandomColor();
  rColor12.setAlpha(15);

  var pg = S.pg_grfx[g];
  pg.translate(pg.width/2, pg.height/2);

  pg.noStroke();

  for(var i = 0; i<thisIter; i++){
    var nowR = P.map(i, 0, thisIter, thisSize*0.9, 0);
    if(i === 0 ){
      pg.fill(addColor);
    } else {
      pg.fill(rColor12);
    }
    pg.ellipse(0,0, nowR, nowR);
  }

  // rColor12.setAlpha(255);
}

export function pgG_gradient5(g){
  ensureBound();
  var thisSize = P.round(P.random(800,1400));
  var thisIter = Math.floor(thisSize/10);

  var rColor13 = grabRandomColor();
  rColor13.setAlpha(1);

  S.pg_grfx[g] = createPG(thisSize, thisSize, P.P2D);
  var pg = S.pg_grfx[g];
  pg.translate(pg.width/2, pg.height/2);

  pg.noStroke();

  for(var i = 0; i<thisIter; i++){
    var nowR = P.map(i, 0, thisIter, 0, thisSize*0.9);

    pg.fill(rColor13);
    pg.ellipse(0,0, nowR, nowR);
  }

  // rColor13.setAlpha(255);
}

//////////////////////////////////////////////
/////////////////////////////       SCRIBBLE
//////////////////////////////////////////////

export function pgG_scribble1(g){
  ensureBound();
  var thisSize = 2000;
  var thisIter = 12;

  var rColor10 = grabRandomColor();

  S.pg_grfx[g] = createPG(thisSize * 1.5, thisSize * 1.5, P.P2D);
  var pg = S.pg_grfx[g];
  pg.translate(pg.width/2, pg.height/2);

  pg.noFill();
  pg.stroke(rColor10);
  pg.strokeWeight(0.5);

  pg.beginShape();
  pg.vertex(thisSize/4,0);

  var pX = thisSize/4;
  var pY = 0;
  var pXH = 0;
  var pYH = thisSize/8;

  var currentAng = 0;
  for(var i = 0; i<thisIter; i++){
    currentAng += P.random(P.PI/2, P.PI * 2);
    var nowR = P.random(thisSize/8, thisSize/2);
    var nowH = P.random(thisSize/16, thisSize/4);

    var x = P.cos(currentAng) * nowR;
    var y = P.sin(currentAng) * nowR;
    var xH = P.cos(currentAng + P.PI/2) * nowH;
    var yH = P.sin(currentAng + P.PI/2) * nowH;

    pg.bezierVertex(pX + pXH, pY + pYH, x - xH, y - yH, x, y);
    pX = x;
    pY = y;
    pXH = xH;
    pYH = yH;
  }
  pg.endShape();

  // rColor10.setAlpha(255);
}

export function pgG_scribble2(g){
  ensureBound();
  var thisSize = P.round(P.random(150,400));
  var thisIter = 20;

  var rColor11 = grabRandomColor();

  S.pg_grfx[g] = createPG(thisSize * 1.5, thisSize * 1.5, P.P2D);
  var pg = S.pg_grfx[g];
  pg.translate(pg.width/2, pg.height/2);

  pg.noFill();
  pg.stroke(rColor11);
  pg.strokeWeight(0.5);

  // Attempt to use p5bezier if it's available. Build a points array and call its draw.
  var pX = thisSize/4;
  var pY = 0;
  var pXH = 0;
  var pYH = thisSize/8;

  var points = [];
  points.push([pX, pY]);

  var currentAng = 0;
  for(var i = 0; i<thisIter; i++){
    currentAng += P.PI/2 + P.random(-1, 1);
    var nowR = thisSize/2 - P.random(thisSize/4);
    var nowH = P.random(thisSize/4, thisSize/3);

    var x = P.cos(currentAng) * nowR;
    var y = P.sin(currentAng) * nowR;
    var xH = P.cos(currentAng + P.PI/2) * nowH;
    var yH = P.sin(currentAng + P.PI/2) * nowH;

    // Defensive: if numeric values are invalid, advance and skip pushing this point
    if (!isFinite(x) || !isFinite(y)){
      pX = x; pY = y; pXH = xH; pYH = yH;
      continue;
    }

    points.push([x, y]);

    pX = x;
    pY = y;
    pXH = xH;
    pYH = yH;
  }

  // initialize/bezier painter if available for this pg
  S.__beziers = S.__beziers || {};
  var bezierPainter = S.__beziers[g] || null;
  if (!bezierPainter) {
    try {
      if (typeof window.initBezier === 'function') {
        bezierPainter = window.initBezier(pg.canvas);
      } else if (window.p5bezier && typeof window.p5bezier === 'object' && typeof window.p5bezier.init === 'function') {
        bezierPainter = window.p5bezier.init(pg.canvas);
      } else if (window.p5bezier && typeof window.p5bezier.draw === 'function') {
        bezierPainter = window.p5bezier;
      }
    } catch(e) {
      bezierPainter = null;
    }
    S.__beziers[g] = bezierPainter;
  }

  if (bezierPainter && typeof bezierPainter.draw === 'function'){
    try {
      bezierPainter.draw(points);
    } catch(e) {
      // fallback to manual bezier segments if the p5bezier draw fails
      // eslint-disable-next-line no-console
      console.warn('p5bezier draw failed, falling back to manual segments', e);
      for(var j=1;j<points.length;j++){
        var a = points[j-1];
        var b = points[j];
        if (typeof pg.bezier === 'function') {
          // draw a simple cubic with control approximations
          try { pg.bezier(a[0], a[1], (a[0]+b[0])/2, (a[1]+b[1])/2, (a[0]+b[0])/2, (a[1]+b[1])/2, b[0], b[1]); } catch(e){ try{ pg.line(a[0], a[1], b[0], b[1]); }catch(e){} }
        } else {
          try{ pg.line(a[0], a[1], b[0], b[1]); }catch(e){}
        }
      }
    }
  // } else {
  //   // fallback: draw as manual bezier/lines segments
  //   for(var k=1;k<points.length;k++){
  //     var pA = points[k-1];
  //     var pB = points[k];
  //     try {
  //       if (typeof pg.bezier === 'function') {
  //         pg.bezier(pA[0], pA[1], (pA[0]+pB[0])/2, (pA[1]+pB[1])/2, (pA[0]+pB[0])/2, (pA[1]+pB[1])/2, pB[0], pB[1]);
  //       } else {
  //         pg.line(pA[0], pA[1], pB[0], pB[1]);
  //       }
  //     } catch(e) {
  //       // ignore segment errors
  //     }
  //   }
  }

  // rColor11.setAlpha(255);
}

// --- helper: safe createGraphics with P2D fallback ---
function createPG(w, h){
 // use the p5 instance directly, avoid touching P.createGraphics
  const p5inst = P;   // rename for safety

  // choose renderer safely
  const renderer = (p5inst && p5inst.P2D) ? p5inst.P2D : undefined;

  // first try with P2D
  let pg = p5inst.createGraphics(w, h, renderer);

  // if renderer not supported, pg may not have methods; fallback to no renderer arg
  if (!pg || typeof pg.vertex !== "function") {
    pg = p5inst.createGraphics(w, h);
  }

  return pg;
}