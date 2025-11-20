// adapted from  https://spacetypegenerator.com/clutter
// Use AIs to better fit into the project

/*
  sketch -> exported initializer
  This file now exports `initBackground({ parent, P5, Matter })` which creates a p5 instance (instance mode)
  mounted into `parent` and returns an object with a `remove()` method for cleanup.
*/

import Circ from './scripts/circ';
import M_Grfx from './scripts/m_grfx';
import M_Ring from './scripts/m_ring';
import M_Sphere from './scripts/m_sphere';
import M_Cloud from './scripts/m_cloud';
import { bindTextures, grabRandomColor } from './scripts/textures';
import { newPalette } from './scripts/update'; // 导入您的 newPalette 函数
import { getRandomColor } from '../manageColor'; // 导入 getRandomColor 用于 shufflePalette

// Expose classes globally for m_grfx.js to access
window.M_Ring = M_Ring;
window.M_Sphere = M_Sphere;
window.M_Cloud = M_Cloud;

function aggressiveCanvasCleanup(parentOrId) {
    const parentEl = typeof parentOrId === 'string' ? document.getElementById(parentOrId) : parentOrId;
    
    // 1. 移除默认的 p5 全局 Canvas (如果存在且未包含在父元素中)
    const defaultCanvas = document.getElementById('defaultCanvas0');
    if (defaultCanvas && (!parentEl || !parentEl.contains(defaultCanvas))) {
        console.warn('Aggressively removing orphaned defaultCanvas0.');
        defaultCanvas.remove();
    }
    
    // 2. 清空目标父元素中所有的 Canvas，防止 Canvas 堆叠
    if (parentEl instanceof HTMLElement) {
        Array.from(parentEl.getElementsByTagName('canvas')).forEach(canvas => {
            console.log('Removing existing canvas from parent element:', canvas.id);
            canvas.remove();
        });
    }
}

export function initBackground({ parent = 'p5-root', P5 = window.p5, Matter = window.Matter } = {}){
  if (!P5) {
    throw new Error('p5 not provided to initBackground');
  }

  // Aggressively clean up any existing canvases before creating a new p5 instance
  aggressiveCanvasCleanup(parent);

  const Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

  // shared sketch state (will be closed over by the p5 instance)
  let color1, color2, color3;
  let bkgdColor, foreColor, typeColor;

  // color object for passing to newPalette
  const colors = {
    get bkgdColor(){ return bkgdColor; },
    set bkgdColor(v){ bkgdColor = v; },
    get foreColor(){ return foreColor; },
    set foreColor(v){ foreColor = v; },
    get typeColor(){ return typeColor; },
    set typeColor(v){ typeColor = v; },
    get color1(){ return color1; },
    set color1(v){ color1 = v; },
    get color2(){ return color2; },
    set color2(v){ color2 = v; },
    get color3(){ return color3; },
    set color3(v){ color3 = v; }
  };

  let alphaStep = 0;

  let grfx = [];
  let pg_grfx = [];
  let m_3Dgrfx = [];

  // Expose variables globally for m_grfx.js to access
  window.gOptionCount = 17;
  window.m_3Dgrfx = m_3Dgrfx;
  window.pg_grfx = pg_grfx;
  window.grabRandomColor = grabRandomColor;

  // lightweight state object with getters so textures can read current values
  const STATE = {
    get pg_grfx(){ return pg_grfx; },
    get typeColor(){ return typeColor; },
    get bkgdColor(){ return bkgdColor; },
    get foreColor(){ return foreColor; },
    get color1(){ return color1; },
    get color2(){ return color2; },
    get color3(){ return color3; },
    get grfx(){ return grfx; },
    get circ(){ return circ; }
  };

  let engine;
  let runner;
  let circ = [];
  let mConstraint;

  // container element
  const container = (typeof parent === 'string') ? document.getElementById(parent) || document.body : parent;

  // p5 实例的引用，在 setup 中赋值
  let p5Instance;

    // helper: convert a p5.Color to hex (returns null if color missing)
    function colorToHex(c) {
    if (!c || !c.levels) return null;
    
    const [r, g, b] = c.levels;
    const toHex = v => v.toString(16).padStart(2, '0');
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
  
  const sketch = (p) => {
    // No preload needed - we removed all font/text loading

    p.setup = () => {
      p5Instance = p; // 捕获 p5 实例
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      try {
        if (container && container.appendChild) {
          // ensure canvas is a child of container
          p.canvas.parentElement && container.appendChild(p.canvas.parentElement);
        }
      } catch(e){
        // ignore
      }

      engine = Engine.create();
      runner = Runner.create();

      Runner.run(runner, engine);

      // static bounds
      window.groundBot = Bodies.rectangle(p.width/2, p.height + 40, p.width, 80, {isStatic:true});
      window.groundRight = Bodies.rectangle(p.width + 40, p.height/2, 80, p.height, {isStatic:true});
      window.groundTop = Bodies.rectangle(p.width/2, -40, p.width, 80, {isStatic:true});
      window.groundLeft = Bodies.rectangle(-40, p.height/2, 80, p.height, {isStatic:true});

      Composite.add(engine.world, [window.groundBot, window.groundRight, window.groundTop, window.groundLeft]);

      bkgdColor = p.color('#000000');
      typeColor = p.color('#ffffff');

      foreColor = p.color('#f2b90f');
      color1 = p.color('#0f5cbf');
      color2 = p.color('#25d964');
      color3 = p.color('#f24f13');

      // Expose bkgdColor globally for m_cloud.js to access
      window.bkgdColor = bkgdColor;

      p.frameRate(30);
      p.textureMode(p.NORMAL);

      // bind textures to this p5 instance and state (only graphics textures, no text)
      try {
        bindTextures(p, STATE);
      } catch(e){
        // binding failed — textures will throw if used
        console.warn('bindTextures failed', e);
      }

      // randomize initial palette once to avoid always showing the same black/white background
      try {
        if (!window.__clutter_initialPaletteSet) {
          newPalette(p, colors, grfx, M_Grfx, circ);
          window.bkgdColor = colors.bkgdColor;
          window.__clutter_initialPaletteSet = true;
            console.log({bkgd: colorToHex(bkgdColor), fore: colorToHex(foreColor), type: colorToHex(typeColor), c1: colorToHex(color1), c2: colorToHex(color2), c3: colorToHex(color3)});
        }
      } catch(e) {
        // ignore palette errors during setup
      }

      // generate initial graphics after palette has been applied so textures use the palette
      for(let g = 0; g < 16; g++){
        generateGrfx();
      }
    };

    p.draw = () => {
      p.background(bkgdColor);

      p.translate(-p.width/2, -p.height/2);

      engine.world.gravity.scale = 0.0000;

      // grfx - 3D
      p.push();
        for(let g = 0; g < grfx.length; g++){
          const gf = grfx[g];
          if(gf && gf.mode === 1){
            try { gf.display(); } catch(e) { console.warn('grfx.display() error for index', g, e); }
          }
        }
      p.pop();

      // grfx - 2D
      p.push();
        for(let g = 0; g < grfx.length; g++){
          const gf = grfx[g];
          if(gf && gf.mode === 0){
            try { gf.display(); } catch(e) { console.warn('grfx.display() error for index', g, e); }
          }
        }
      p.pop();

      for(let i = 0; i < circ.length; i++){
        try {
          if (circ[i] && typeof circ[i].show === 'function') circ[i].show();
        } catch(e) {
          console.warn('circ.show() error for index', i, e);
        }
      }

      if(alphaStep > 0){
        alphaStep -= 0.075;
      }

      if(alphaStep < 0.1 && alphaStep > -0.1){
        alphaStep = 0;
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);

      Matter.Body.setPosition(window.groundBot, { x: p.width/2, y: p.height + 40 });
      Matter.Body.setPosition(window.groundRight, { x: p.width + 40, y: p.height/2 });
      Matter.Body.setPosition(window.groundTop, { x: p.width/2, y: -40 });
      Matter.Body.setPosition(window.groundLeft, { x: -40, y: p.height/2 });
    };

    function generateGrfx(){
        const idx = grfx.length;
        var xRan = p.random(-30,30);
        var yRan = p.random(-30,30);
        circ.push(new Circ(p, engine, Bodies, Composite, p.width/2 + xRan, p.height/2 + yRan, 80));
        grfx[idx] = new M_Grfx(p, idx, circ, pg_grfx, m_3Dgrfx, colors);
    }
  };

  // create the p5 instance
  const p5InstanceRef = new P5(sketch, container);

  return {
    // ---------------------------------------------------------------------
    // EXPOSE newPalette METHOD (like original code)
    // ---------------------------------------------------------------------
    newPalette(){
      // Following original logic: directly update colors and recreate grfx objects
      if (!p5Instance) {
          console.warn('Cannot shuffle: p5 instance not ready.');
          return;
      }
      
      try {
        // 1. Get new random colors (mimicking original newPalette logic)
        const newColors = getRandomColor(p5Instance);
        
        // 2. Directly update color variables (like original code: bkgdColor = color('#...'))
        bkgdColor = newColors.bkgdColor;
        foreColor = newColors.foreColor;
        typeColor = newColors.typeColor;
        color1 = newColors.color1;
        color2 = newColors.color2;
        color3 = newColors.color3;
        
        // 3. Update global background color (for m_cloud.js and other global access)
        window.bkgdColor = bkgdColor;
        
        // 4. Remove old canvas elements from DOM before clearing arrays
        // p5.js createGraphics creates canvas elements that need to be properly removed
        for(let i = 0; i < pg_grfx.length; i++){
          try {
            if (pg_grfx[i]) {
              // Use p5's remove method if available, otherwise remove from DOM directly
              if (typeof pg_grfx[i].remove === 'function') {
                pg_grfx[i].remove();
              } else if (pg_grfx[i].canvas && pg_grfx[i].canvas.parentNode) {
                pg_grfx[i].canvas.parentNode.removeChild(pg_grfx[i].canvas);
              }
            }
          } catch(e){
            // If removal fails, try direct DOM removal as fallback
            try {
              if (pg_grfx[i] && pg_grfx[i].canvas && pg_grfx[i].canvas.parentNode) {
                pg_grfx[i].canvas.parentNode.removeChild(pg_grfx[i].canvas);
              }
            } catch(e2){}
          }
        };
        
        // 5. Clear cached graphics and 3D objects (textures need to be regenerated with new colors)
        // This is critical - old textures have old colors baked in
        pg_grfx.length = 0;
        m_3Dgrfx.length = 0;
        window.pg_grfx = pg_grfx;
        window.m_3Dgrfx = m_3Dgrfx;
        
        // 6. Recreate all grfx objects with new colors
        // Original code: for(var g = 0; g<grfx.length; g++){ grfx[g] = new M_Grfx(g); }
        for(let g = 0; g < grfx.length; g++){
          try {
            grfx[g] = new M_Grfx(p5Instance, g, circ, pg_grfx, m_3Dgrfx, colors);
          } catch(inner){
            grfx[g] = null;
          }
        };
        
        // 7. Force immediate background update
        p5Instance.background(bkgdColor);
      } catch(e){
        console.warn('newPalette failed', e);
      }
    },
    // ---------------------------------------------------------------------
    
    // Original remove method
    remove(){
      try {
        if (runner && engine) {
          Runner.stop(runner);
        }
      } catch(e){}
      try { p5InstanceRef.remove(); } catch(e){}
      // Clean up global references
      try {
        delete window.gOptionCount;
        delete window.m_3Dgrfx;
        delete window.pg_grfx;
        delete window.M_Ring;
        delete window.M_Sphere;
        delete window.M_Cloud;
        delete window.bkgdColor;
        delete window.grabRandomColor;
        // DELETE THE OLD GLOBAL HOOK
        delete window.__clutter_shuffle; 
        delete window.__clutter_initialPaletteSet;
      } catch(e){}
    },

    getColors(){
        return {
            bkgdColor: colorToHex(bkgdColor),
            foreColor: colorToHex(foreColor),
            typeColor: colorToHex(typeColor),
            color1: colorToHex(color1),
            color2: colorToHex(color2),
            color3: colorToHex(color3),
        }
    },
}
}