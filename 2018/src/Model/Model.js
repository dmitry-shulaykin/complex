const LABELS = ["xr", "xi", "yr", "yi"];

export default class Model {
  constructor(params = {}, curves = new Set()) {
    this.matrixSize = params.matrixSize || 31;
    this.size = params.size || 4.0;

    this.center = {};
    LABELS.map(
      label =>
        (this.center[label] = params.center ? params.center[label] || 0 : 0)
    );
    this.initBox();
    this.curves = curves;
    this.data = new Set();

    // Array of functions to call, after rebuild model
    this.onRebuild = new Set();
    this.rebuild();
    /*
    this.addCurve(
      new Circle([
        { label: "x0", value: new Complex(0, 0) },
        { label: "y0", value: new Complex(0, 0) },
        { label: "r",  value: new Complex(1, 0) }
      ])
    );
    */
  }
  exportParams(){
    return {
      center: this.center,
      matrixSize: this.matrixSize,
      size: this.size
    }
  }

  initBox() {
    this.start = {};
    LABELS.map(
      label => (this.start[label] = this.center[label] - this.size / 2)
    );

    this.end = {};
    LABELS.map(label => (this.end[label] = this.center[label] + this.size / 2));

    this.step = this.size / this.matrixSize;
  }

  rebuild() {
    this.initBox();
    this.data = new Set();
    for (let curve of this.curves) {
      if (!curve.disabled) this.renderCurve(curve);
    }

    if (this.onRebuild) {
      for (let callback of this.onRebuild) {
        callback();
      }
    }
  }

  subscribe(callback) {
    this.onRebuild.add(callback);
  }

  unsubscribe(callback) {
    this.onRebuild.delete(callback);
  }

  backupCurves() {
    // !TODO save state to local storage
    // console.log();
    // window.localStorage.setItem("curves", JSON.stringify([...this.curves]));
    // let curves = window.localStorage.getItem("curves");
    // console.log("backuping curves");
  }
    // console.log(curves);

  tryLoadLocalStorage() {
    // !TODO load state from local storage
    let curves = window.localStorage.getItem("curves");
    if (JSON.parse(curves).entries) {
      this.curves = new Map(JSON.parse(curves));
    }
  }

  addCurve(curve) {
    curve.index = this.curves.size;
    this.curves.add(curve);
    this.renderCurve(curve);
    this.backupCurves();
    this.rebuild();
  }

  disableCurve(curve) {
    curve = this.curves.get(curve);
    if (curve) {
      curve.disabled = true;
      this.rebuild();
    }
  }

  removeCurve(curve) {
    this.curves.delete(curve);
    this.rebuild();
  }

  cleanCurves() {
    // TODO fix this
    // workaround
    window.location.reload();
    // this.curves.clear();
  }

  renderCurve(curve) {
    const data = curve.getData(this);
    // console.log(data);
    this.addData(data, curve.index);
  }

  addData(data, curveIndex) {
    if (!(data instanceof Array)) {
      let inBoundaries = true;
      LABELS.map(
        label =>
          (inBoundaries &=
            data[label] >= this.start[label] && data[label] <= this.end[label])
      );

      //console.log(inBoundaries);
      if (1) {
        let rastrData = {};
        LABELS.map(
          label =>
            (rastrData[label] = Math.floor(
              (data[label] - this.start[label]) / this.step
            ))
        );
        rastrData.curve = curveIndex;
        rastrData.formula = data.formula;
        rastrData.i = data.i;
        rastrData.j = data.j
        this.data.add(rastrData);
      } else {
        //console.log('not in bounds');
      }
    } else {
      // console.log("data is not a single point");
      // console.table(data);
      for (let k of data) {
        this.addData(k, curveIndex);
      }
    }
  }

  getData() {
    return this.data;
  }

  __debugData() {
    this.data.sort((a, b) => {
      return a.xr - b.xr != 0
        ? a.xr - b.xr
        : a.xi - b.xi != 0
          ? a.xi - b.xi
          : a.yr - b.yr != 0
            ? a.yr - b.yr
            : a.yi - b.yi;
    });

    console.table(this.data);
  }
}
