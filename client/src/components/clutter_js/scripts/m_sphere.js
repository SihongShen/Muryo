/* eslint-disable no-undef */
export default class M_Sphere {
  // constructor now expects (p, sel, circs)
  constructor(p, sel, circs) {
    this.p = p;
    this.sel = sel;
    this.circs = circs;

    this.latCount = 10;
    this.latAng = 2*this.p.PI/this.latCount/2;

    this.glideWindow = 0;

    this.gSpeed = this.p.random(50,140);
    this.gAccel = 0.125;

    this.r = 0;

    this.rColor3D = grabRandomColor();

    this.mode = this.p.round(this.p.random(2));
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

    if(this.mode==0){
      p.push();
        p.translate(pos.x, pos.y);
        p.rotateX(p.PI/2);
        p.rotateY(p.atan2(pos.y, pos.x) + p.PI/2);

        p.noFill();
        p.stroke(this.rColor3D);
        p.strokeWeight(1);
        var animateP = (p.frameCount/120)%1

        for(var i = animateP; i<this.latCount; i++){
          p.push();
            p.rotateY(-i*this.latAng);
            p.ellipse(0,0,this.r, this.r);
          p.pop();
        }
      p.pop();
    } else if(this.mode==1){
      p.push();
        p.translate(pos.x, pos.y);
        p.rotateX(p.PI/2);
        p.rotateY(p.atan2(pos.y, pos.x) + p.PI/2);

        p.noFill();
        p.stroke(this.rColor3D);
        p.strokeWeight(1);

        var animateP = (p.frameCount/120)%1

        for(var j = animateP; j<this.latCount; j++){
          var stepR = p.map(j, 0, this.latCount, 0, p.PI);
          var newRadius = p.sin(stepR) * this.r;

          var newY = p.map(j, 0, this.latCount, this.r/2, -this.r/2);
          p.push();
            p.translate(0, 0, newY);
            p.ellipse(0, 0, newRadius, newRadius);
          p.pop();
        }
      p.pop();
    } else if(this.mode==2){
      p.push();
        p.translate(pos.x, pos.y);
        p.rotateX(p.PI/2);
        p.rotateY(p.atan2(pos.y, pos.x) + p.PI/2);

        p.noFill();
        p.stroke(this.rColor3D);
        p.strokeWeight(1);

        var animateP = (p.frameCount/120)%1

        for(var k = animateP; k<this.latCount; k++){
          var stepR = p.map(k, 0, this.latCount, 0, p.PI);
          var newRadius = p.sin(stepR) * this.r;

          var newY = p.map(p.cos(stepR), 1, -1, -this.r/2, this.r/2);
          p.push();
            p.translate(0, 0, newY);
            p.ellipse(0, 0, newRadius, newRadius);
          p.pop();

          p.push();
            p.rotateX(p.PI/2);
            p.rotateY(k*this.latAng);
            p.ellipse(0,0,this.r, this.r);
          p.pop();
        }
      p.pop();
    }
  }
}
