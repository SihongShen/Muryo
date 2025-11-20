/* eslint-disable no-undef */
export default class M_Ring {
  // constructor now expects a p5 instance `p`, a selection index `sel`, and a reference to the circ array `circs`
  constructor(p, sel, circs) {
    this.p = p;
    this.sel = sel;
    this.circs = circs;

    this.glideWindow = 0;

    this.gSpeed = this.p.random(50,140);
    this.gAccel = 0.15;

    this.r = 0;

    this.rColor3D = grabRandomColor();
  }

  glide(){
    this.gSpeed -= this.gSpeed * this.gAccel;
    this.r += this.gSpeed;

    this.glideWindow ++;
  }

  display(){
    const p = this.p;
    if (!this.circs[this.sel]) return;
    const pos = this.circs[this.sel].body.position;

    p.push();
      p.translate(pos.x, pos.y);
      p.rotateX(p.PI/2);
      p.rotateY(p.atan2(pos.y - p.height/2, pos.x - p.width/2) + p.PI/2);

      p.noFill();
      p.stroke(this.rColor3D);
      p.strokeWeight(1);
      p.ellipse(0,0,this.r, this.r);
    p.pop();
  }
}
