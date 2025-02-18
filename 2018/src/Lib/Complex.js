export default class Complex {
  constructor(re, im) {
    this.re = re || 0;
    this.im = im || 0;
  }

  mult(other) {
    const re = this.re * other.re - this.im * other.im,
      im = this.re * other.im + this.im * other.re;
    return new Complex(re, im);
  }

  add(other) {
    return new Complex(this.re + other.re, this.im + other.im);
  }

  sub(other) {
    return new Complex(this.re - other.re, this.im - other.im);
  }

  divide(other) {
    const re = this.re * other.re - this.im * other.im;
    const im = this.im * other.re - this.re * other.im;
    const den = other.re * other.re + other.im * other.im;
    if (den == 0) {
      throw new Error("division by zero!");
    } else {
      return new Complex(re / den, im / den);
    }
  }

  toString() {
    if (this.re == 0 && this.im == 0) return "0";
    else if (this.re == 0) return "" + this.im + "i";
    else if (this.im == 0) return "" + this.re;
    else
      return "" + this.im + (this.re > 0 ? "+" : "-") + Math.abs(this.im) + "i";
  }

  length() {
    return Math.sqrt(this.re * this.re + this.im * this.im);
  }

  equal(other) {
    return this.re == other.re && this.im == other.im;
  }

  square() {
    let polar = this.polar();
    polar.length *= polar.length;
    polar.theta *= 2;
    return Complex.fromPolar(polar);
  }

  polar() {
    if (this.re > 0) {
      this.theta = Math.atan(this.im / this.re);
    } else if (this.re < 0 && this.im >= 0) {
      this.theta = Math.atan(this.im / this.re) + Math.PI;
    } else if (this.re < 0 && this.im < 0) {
      this.theta = Math.atan(this.im / this.re) - Math.PI;
    } else if (this.re == 0 && this.im > 0) {
      this.theta = Math.PI / 2;
    } else if (this.re == 0 && this.im < 0) {
      this.theta = -Math.PI / 2;
    } else {
      //throw Error('polar angle indeterminate');
      this.theta = 0;
    }

    return { theta: this.theta, length: this.length() };
  }

  static fromPolar(polar) {
    return new Complex(
      polar.length * Math.cos(polar.theta),
      polar.length * Math.sin(polar.theta)
    );
  }

  pow(k) {
    const polar = this.polar();

    const root = Complex.fromPolar({
      length: Math.pow(polar.length, k),
      theta: polar.theta * k
    });

    return root;
  }

  sqrt(k) {
    const polar = this.polar();
    let roots = [];

    for (let i = 0; i < k; i++) {
      const root = Complex.fromPolar({
        length: Math.pow(polar.length, 1 / k),
        theta: (polar.theta + 2 * Math.PI * i) / k
      });
      roots.push(root);
    }

    return roots;
  }
}
