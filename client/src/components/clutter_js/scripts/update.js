import { getRandomColor } from "../../manageColor";

export function newPalette(p, colors, grfx, M_Grfx, circ){
  
  // get updated colors
  const newColors = getRandomColor(p);

  // assigned new colors to the sketch - explicitly set each property to trigger setters
  colors.bkgdColor = newColors.bkgdColor;
  colors.foreColor = newColors.foreColor;
  colors.typeColor = newColors.typeColor;
  colors.color1 = newColors.color1;
  colors.color2 = newColors.color2;
  colors.color3 = newColors.color3;

  for(var g = 0; g<grfx.length; g++){
    // Recreate graphic object for each index. Use window references for legacy arrays.
    try {
      grfx[g] = new M_Grfx(p, g, circ, window.pg_grfx, window.m_3Dgrfx, colors);
    } catch(e) {
      // If construction fails, leave slot null and continue.
      console.warn('newPalette: failed to recreate M_Grfx for index', g, e);
      grfx[g] = null;
    }
  }

  window.bkgdColor = p.color(colors.bkgdColor).toString('#rrggbb');;
  window.foreColor = p.color(colors.foreColor).toString('#rrggbb');
  window.typeColor = p.color(colors.typeColor).toString('#rrggbb');
  window.color1 = p.color(colors.color1).toString('#rrggbb');
  window.color2 = p.color(colors.color2).toString('#rrggbb');
  window.color3 = p.color(colors.color3).toString('#rrggbb');
}