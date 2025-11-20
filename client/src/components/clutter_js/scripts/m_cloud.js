/* eslint-disable no-undef */
export default class M_Cloud {
  constructor(p, sel, circs, colors) {
    this.p = p;
    this.sel = sel;
    this.circs = circs;
    this.colors = colors;

    this.partCount = 50;
    this.glideWindow = 0;

    this.angY = [];
    this.angZ = [];
    this.gSpeed = [];
    this.dist = [];

    this.gAccel = 0.15;

    this.xSpace = [];
    this.ySpace = [];
    this.zSpace = [];
    for(var i = 0; i<this.partCount; i++){
      this.xSpace[i] = 0;
      this.ySpace[i] = 0;
      this.zSpace[i] = 0;
      this.angY[i] = this.p.random(2*this.p.PI);
      this.angZ[i] = this.p.random(2*this.p.PI);
      this.gSpeed[i] = this.p.random(10,140);
    }

    this.rColor3D = grabRandomColor();
  }

  glide(){
    for(var i = 0; i<this.partCount; i++){
      this.gSpeed[i] -= this.gSpeed[i] * this.gAccel;
      var nowDist = this.gSpeed[i];

      this.xSpace[i] += nowDist * this.p.sin(this.angZ[i]) * this.p.cos(this.angY[i]);
      this.ySpace[i] += nowDist * this.p.sin(this.angZ[i]) * this.p.sin(this.angY[i]);
      this.zSpace[i] += nowDist * this.p.cos(this.angZ[i]);
    }
    this.glideWindow ++;
  }
  
  display(){

    if (!this.circs[this.sel]) {
      return;
    }

    const p = this.p;
    const pos = this.circs[this.sel].body.position;

    p.push();
      p.translate(pos.x, pos.y);
      p.rotateY(p.frameCount * 0.001);

      // use global bkgdColor (defined by sketch) for now
      p.fill(this.colors.bkgdColor);
      p.stroke(this.rColor3D);
      p.strokeWeight(1);
      for(var i = 0; i<this.partCount; i++){
        p.push();
          p.translate(this.xSpace[i], this.ySpace[i], this.zSpace[i]);
          p.rotateY(-p.frameCount * 0.001);
          p.ellipse(0,0,10,10);
        p.pop();
      }

    p.pop();
  }
}
