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

  /* Deprecated
  render(graphics) {
    // graphics.resetMatrix();
    graphics.background(251);

    let total_x = this.cell_size * this.model[this.axies_map["x"] + "_rez"];
    let total_y = this.cell_size * this.model[this.axies_map["y"] + "_rez"];
    let total_z = this.cell_size * this.model[this.axies_map["z"] + "_rez"];

    for (let data of this.projA_data) {
      const translate_x = -total_x / 2 + data.x * this.cell_size;
      const translate_y = -total_y / 2 + data.y * this.cell_size;
      const translate_z = +total_z / 2 + data.z * this.cell_size;

      graphics.translate(translate_x, translate_y, translate_z);
      graphics.fill(data.color.r, data.color.g, data.color.b);
      graphics.box(this.cell_size);
      graphics.translate(-translate_x, -translate_y, -translate_z);
    }
    this.drawAxis(graphics, total_z - this.cell_size / 2);

    for (let data of this.projB_data) {
      const translate_x = -total_x / 2 + data.x * this.cell_size;
      const translate_y = -total_y / 2 + data.y * this.cell_size;
      const translate_z = -total_z / 2 + data.z * this.cell_size;

      graphics.translate(translate_x, translate_y, translate_z);
      graphics.fill(data.color.r, data.color.g, data.color.b);
      graphics.box(this.cell_size);
      graphics.translate(-translate_x, -translate_y, -translate_z);
    }
    this.drawAxis(graphics, -total_z + this.cell_size / 2);
    return graphics;
  }

  drawAxis(graphics, pos_z) {
    const translate_x = -this.cell_size / 2;
    const translate_y = -this.cell_size / 2;
    const translate_z = pos_z;

    // Bounding box;
    graphics.stroke(1);

    graphics.translate(translate_x, translate_y, translate_z);

    graphics.fill(0, 0, 0, 0);
    graphics.box(
      this.model[this.axies_map["x"] + "_rez"] * this.cell_size,
      this.model[this.axies_map["y"] + "_rez"] * this.cell_size,
      Math.max(
        this.model[this.axies_map["z"] + "_rez"] * this.cell_size,
        this.model[this.axies_map["u"] + "_rez"] * this.cell_size
      )
    );

    graphics.translate(-translate_x, -translate_y, -translate_z);

    // Axies
    graphics.fill(255);

    graphics.stroke(255, 0, 0);
    graphics.line(0, -1000, 0, 0, 1000, 0);

    graphics.stroke(0, 255, 0);
    graphics.line(0, 0, -1000, 0, 0, 1000);

    graphics.stroke(0, 0, 255);
    graphics.line(-1000, 0, 0, 1000, 0, 0);
    graphics.stroke(0);

    // 0-coord box;
    graphics.box(5);
  }
*/
}
