/* eslint-disable no-undef */
import {
  pgG_star1, pgG_star2, pgG_star3, pgG_star4,
  pgG_spray1, pgG_spray2,
  pgG_gradient1, pgG_gradient2, pgG_gradient3, pgG_gradient4, pgG_gradient5,
  pgG_scribble1, pgG_scribble2
} from './textures.js';

import M_Ring from './m_ring.js';
import M_Cloud from './m_cloud.js';
import M_Sphere from './m_sphere.js';

const gOptionCount = 17;

export default class M_Grfx {
  constructor(p, sel, circs, pg_grfx, m_3Dgrfx, colors) {
    this.p = p;
    this.sel = sel;
    this.circs = circs;
    this.pg_grfx = pg_grfx;
    this.m_3Dgrfx = m_3Dgrfx; 
    this.mode = 0;
    this.colors = colors;

      var rs = this.p.random(gOptionCount * 10);
      this.mode = 0;

      if(rs< 1 *10){
        pgG_star1(sel);
      } else if(rs < 2 * 10){
        pgG_star2(sel);
      } else if(rs < 3 * 10){
        pgG_star3(sel);
      } else if(rs < 4 * 10){
        pgG_star4(sel);
      } else if(rs < 5 * 10){
        pgG_spray1(sel);
      } else if(rs < 6 * 10){
        pgG_spray2(sel);
      } else if(rs < 7 * 10){
        pgG_gradient1(sel);
      } else if(rs < 8 * 10){
        pgG_gradient2(sel);
      } else if(rs < 9 * 10){
        pgG_gradient3(sel);
      } else if(rs < 10 * 10){
        pgG_gradient4(sel);
      } else if(rs < 11 * 10){
        pgG_gradient5(sel);
      } else if(rs < 12 * 10){
        pgG_scribble1(sel);
      } else if(rs < 13 * 10){
        pgG_scribble2(sel);
      } else if(rs < 14 * 10){
        this.mode = 1;
        this.m_3Dgrfx[this.sel] = new M_Ring(this.p, this.sel, this.circs, this.colors);
      } else if(rs < 15 * 10){
        this.mode = 1;
        this.m_3Dgrfx[this.sel] = new M_Cloud(this.p, this.sel, this.circs, this.colors);
      } else if(rs < 16 * 10){
        this.mode = 1;
          this.m_3Dgrfx[this.sel] = new M_Ring(this.p, this.sel, this.circs, this.colors);
        // }
      } else if(rs < 17 * 10){
        this.mode = 1;
        this.m_3Dgrfx[this.sel] = new M_Sphere(this.p, this.sel, this.circs, this.colors);
      }
  }

  display(){
    if (!this.circs[this.sel] || !this.circs[this.sel].body) return; 

    const pos = this.circs[this.sel].body.position;

    if(this.mode==0){
      this.p.push();
        this.p.translate(pos.x, pos.y);
        if (this.pg_grfx[this.sel]) {
          this.p.translate(-this.pg_grfx[this.sel].width/2, -this.pg_grfx[this.sel].height/2);
          this.p.image(this.pg_grfx[this.sel], 0, 0);
        }
      this.p.pop();
    } else {
      if (this.m_3Dgrfx[this.sel]) {
        this.m_3Dgrfx[this.sel].display();
        if(this.m_3Dgrfx[this.sel].glideWindow < 90){
          this.m_3Dgrfx[this.sel].glide();
        }
      }
    }
  }
}