class Render2d {
  constructor(shape, resolutionX, resolutionY, xi, cellSize) {
    this.graphics = createGraphics(
      2 * resolutionX * cellSize,
      2 * resolutionY * cellSize
    );
    this.graphics.translate(resolutionX * cellSize, resolutionY * cellSize);
    this.shape = shape;
    this.xc = resolutionX;
    this.yc = resolutionY;
    this.xi = xi;
    this.cellSize = cellSize;
  }

  render(yi) {
    let matrix = [];
    for (let i = -this.xc; i < this.xc; i++) {
      matrix.push([]);
      for (let j = -this.yc; j < this.yc; j++) {
        matrix[i + this.xc].push(
          this.shape.contain(new Complex(i, this.xi), new Complex(j, yi))
        );
      }
    }
    this.graphics.background(101);

    this.graphics.rect(0, 0, 10, 10);
    fill(255);
    for (let i = -this.xc; i < this.xc; i++) {
      for (let j = -this.yc; j < this.yc; j++) {
        if (matrix[i + this.xc][j + this.yc])
          this.graphics.rect(
            i * this.cellSize,
            j * this.cellSize,
            this.cellSize,
            this.cellSize
          );
      }
    }

    //console.log(matrix);

    return this.graphics;
  }
}
