class Point {
  constructor(x, y) {
    this.value = [x, y];
    this.x = this.value[0];
    this.y = this.value[1];
  }
}

class Vector {
  constructor(a, b) {
    if (a instanceof Point && b instanceof Point) this.fromPoints(a, b);
    else this.fromCoords(a, b);
  }

  fromPoints(start, end) {
    // Creating a vector with: P to Q = W(q1 - p1, q2 - p2), but as the
    // Y axis is inverted, the formula is:  P to Q = W(q1 - p1, q2 + p2)
    this.value = [end.x - start.x, end.y + start.y];
    this.x = this.value[0];
    this.y = this.value[1];
  }

  fromCoords(x, y) {
    this.value = [x, y];
    this.x = this.value[0];
    this.y = this.value[1];
  }

  magnitude() {
    this.mag = Math.abs(Math.sqrt(this.x * this.x + this.y * this.y));
    return Round(this.mag);
  }

  normalized() {
    if (!this.mag) this.magnitude();

    return new Vector(Round(this.x / this.mag), Round(this.y / this.mag));
  }
}
