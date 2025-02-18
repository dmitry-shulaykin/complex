export default class Projection3D {
  constructor(model, cellSize, mappings) {
    this.totalSize = model.matrixSize;
    this.data = model.data;

    // Used for color
    this.curves = model.curves;

    this.cellSize = cellSize;

    this.projData = new Set();

    if (mappings) {
      this.axies = mappings;
    } else {
      this.axies = {
        x: { label: "xr", inverted: false },
        y: { label: "yr", inverted: false },
        z: { label: "xi", inverted: false }
      };
    }
    this.calcData();
  }

  calcData() {
    for (let value of this.data) {
      let curve;
      for (let el of this.curves) {
        if (el.index == value.curve) {
          curve = el;
        }
      }
      this.projData.add({
        x:
          value[this.axies["x"].label] * (this.axies["x"].inverted ? -1 : 1) +
          (this.axies["x"].inverted ? Math.round(this.totalSize - 1) : 0),
        y:
          value[this.axies["y"].label] * (this.axies["y"].inverted ? -1 : 1) +
          (this.axies["y"].inverted ? Math.round(this.totalSize - 1) : 0),
        z:
          value[this.axies["z"].label] * (this.axies["z"].inverted ? -1 : 1) +
          (this.axies["z"].inverted ? Math.round(this.totalSize - 1) : 0),
        curve: value.curve,
        formula: value.formula,
        color: curve.color
      });
    }
  }
}
