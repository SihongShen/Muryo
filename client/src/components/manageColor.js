export function getRandomColor(p){
    const rs = p.random(100);
    const colors = {};

    if(rs<10){
    p.print("PALETTE 1");
    colors.bkgdColor = p.color('#f28599');
    colors.foreColor = p.color('#122459');
    colors.typeColor = p.color('#ffffff');
    colors.color1 = p.color('#f2ca50');
    colors.color2 = p.color('#1c4aa6');
    colors.color3 = p.color('#d94625');
  } else if(rs<20){
    p.print("PALETTE 2");
    colors.bkgdColor = p.color('#000000');
    colors.foreColor = p.color('#F25e6B');
    colors.typeColor = p.color('#04BF9D');
    colors.color1 = p.color('#A6468C');
    colors.color2 = p.color('#3321A6');
    colors.color3 = p.color('#04BF9D');
  } else if(rs<30){
    p.print("PALETTE 3");
    colors.bkgdColor = p.color('#ffffff');
    colors.foreColor = p.color('#010440');
    colors.typeColor = p.color('#000000');
    colors.color1 = p.color('#2D7359');
    colors.color2 = p.color('#f2B33D');
    colors.color3 = p.color('#F25749');
  } else if(rs<40){
    p.print("PALETTE 4");
    colors.bkgdColor = p.color('#262626');
    colors.foreColor = p.color('#bfbdb8');
    colors.typeColor = p.color('#ffffff');
    colors.color1 = p.color('#735c40');
    colors.color2 = p.color('#d9d6d0');
    colors.color3 = p.color('#000000');
  } else if(rs<50){
    p.print("PALETTE 5");
    colors.bkgdColor = p.color('#0511f2');
    colors.foreColor = p.color('#010326');
    colors.typeColor = p.color('#ffffff');
    colors.color1 = p.color('#0ff2c9');
    colors.color2 = p.color('#030a8c');
    colors.color3 = p.color('#f2bb13');
  } else if(rs<60){
    p.print("PALETTE 6");
    colors.bkgdColor = p.color('#f2916d');
    colors.foreColor = p.color('#233d8c');
    colors.typeColor = p.color('#102540');
    colors.color1 = p.color('#102540');
    colors.color2 = p.color('#025959');
    colors.color3 = p.color('#f2911b');
  } else if(rs<70){
    p.print("PALETTE 7");
    colors.bkgdColor = p.color('#f2f2f2');
    colors.foreColor = p.color('#f2a7a7');
    colors.typeColor = p.color('#d90404');
    colors.color1 = p.color('#f2dd72');
    colors.color2 = p.color('#d90404');
    colors.color3 = p.color('#000000');
  } else if(rs<80){
    p.print("PALETTE 8");
    colors.bkgdColor = p.color('#0a3a40');
    colors.foreColor = p.color('#f2eadf');
    colors.typeColor = p.color('#ffffff');
    colors.color1 = p.color('#d9857e');
    colors.color2 = p.color('#d9042B');
    colors.color3 = p.color('#f2c84b');
  } else if(rs<90){
    p.print("PALETTE 9");
    colors.bkgdColor = p.color('#f2f2f2');
    colors.foreColor = p.color('#404040');
    colors.typeColor = p.color('#8c8c8c');
    colors.color1 = p.color('#8c8c8c');
    colors.color2 = p.color('#bfbfbf');
    colors.color3 = p.color('#000000');
  } else {
    p.print("PALETTE 10");
    colors.bkgdColor = p.color('#038c65');
    colors.foreColor = p.color('#f2ebdf');
    colors.typeColor = p.color('#8c0303');
    colors.color1 = p.color('#f2811d');
    colors.color2 = p.color('#f20505');
    colors.color3 = p.color('#8c0303');
  }
  return colors;
}