class Array4D {
  constructor(n, m, w, h) {
    this.length1 = n;
    this.length2 = m;
    this.length3 = w;
    this.length4 = h;

    this._data = Array(n * m * w * h);
    this.map((a, b) => (b = 0));
  }

  _offset(x, y, z, u) {
    const xoffset = x * this.length2 * this.length3 * this.length4;
    const yoffset = y * this.length3 * this.length4;
    const zoffset = z * this.length4;
    const uoffset = u;
    return xoffset + yoffset + zoffset + uoffset;
  }

  get(x, y, z, u) {
    return this._data[this._offset(x, y, z, u)];
  }

  set(x, y, z, u, val) {
    this._data[this._offset(x, y, z, u)] = val;
  }

  map(func) {
    for (let i = 0; i < this.length1; i++) {
      for (let j = 0; j < this.length2; j++) {
        for (let k = 0; k < this.length3; k++) {
          for (let l = 0; l < this.length4; l++) {
            this._data[this._offset(i, j, k, l)] = func(
              [i, j, k, l],
              this._data[this._offset(i, j, k, l)]
            );
          }
        }
      }
    }
  }
}
