export default class Circ {
  constructor(p, engine, Bodies, Composite, x, y, d) {
    this.p = p;
    this.engine = engine;
    this.Bodies = Bodies;
    this.Composite = Composite;
    this.d = d;

    const options = {
      friction: 1.0,
      frictionAir: 0.05,
      // use p.random when available, fallback to Math.random
      force: { x: (p && p.random) ? p.random(-0.22, 0.22) : (Math.random() * 0.44 - 0.22), y: (p && p.random) ? p.random(-0.22, 0.22) : (Math.random() * 0.44 - 0.22) }
    };

    this.body = this.Bodies.circle(x, y, d / 2, options);
    this.Composite.add(this.engine.world, this.body);
  }
}
