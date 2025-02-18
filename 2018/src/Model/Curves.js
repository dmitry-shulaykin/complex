import Complex from "Lib/Complex";
import { Parser } from "Lib/Parser";

let GlobalParser = new Parser();

class Curve {
  constructor(formula, params) {
    this.color = {
      r: Math.round(255 * Math.random()),
      g: Math.round(255 * Math.random()),
      b: Math.round(255 * Math.random())
    };

    this.y = formula;

    const need_params = this.y[0].getParamNames();
    for (let param of need_params) {
      for (let func of this.y) {
        func.setVariable(param, new Complex(0, 0));
      }
    }
    if (params)
      for (let param of params) {
        this.setParam(param.label, param.value);
      }
  }

  getParamNames() {
    return this.y[0].getParamNames();
  }

  getParams() {
    return this.y[0].getParams();
  }

  getParam(paramName) {
    return this.y[0].getParam(paramName);
  }

  setParam(paramName, value) {
    for (let formula of this.y) {
      formula.setVariable(paramName, value);
    }
  }

  getData(model) {
    let data = [];

    for (let i = 0; i < model.matrixSize; i++) {
      for (let j = 0; j < model.matrixSize; j++) {
        const xr = model.start.xr + model.step * i + model.step / 2;
        const xi = model.start.xi + model.step * j + model.step / 2;
        let formulaIndex = 0;
        for (let formula of this.y) {
          formula.setVariable("x", new Complex(xr, xi));
          const y = formula.calc();
          data.push({ xr, xi, yr: y.re, yi: y.im, formula: formulaIndex++ });
        }
      }
    }

    return data;
  }
}

export class Circle extends Curve {
  constructor(params) {
    const formula = [
      GlobalParser.eval("((2*y0)+(0-4*((x-x0)^2-r^2))^(1/2))/2"),
      GlobalParser.eval("((2*y0)-(0-4*((x-x0)^2-r^2))^(1/2))/2")
    ];
    super(formula, params);
  }
}

export class Line extends Curve {
  constructor(params) {
    const formula = [GlobalParser.eval("A*x+B")];
    super(formula, params);
  }
}

export class Parabola extends Curve {
  constructor(params) {
    const formula = [GlobalParser.eval("A*x^2")];
    super(formula, params);
  }
}

export class Hyperbola extends Curve {
  constructor(params) {
    const formula = [GlobalParser.eval("A / x")];
    super(formula, params);
  }
}

const Curves = [
  { name: "Окружность", curve: Circle },
  { name: "Гипербола", curve: Hyperbola },
  { name: "Прямая", curve: Line },
  { name: "Парабола", curve: Parabola }
];

export default Curves;

export class UCurve {
  constructor(formula, params) {
    this.color = {
      r: Math.round(255 * Math.random()),
      g: Math.round(255 * Math.random()),
      b: Math.round(255 * Math.random())
    };

    this.formula = "x*x + y*y = r*r";

    const need_params = this.formula.getParamNames();
    for (let param of need_params) {
      for (let func of this.y) {
        func.setVariable(param, new Complex(0, 0));
      }
    }
    if (params)
      for (let param of params) {
        this.setParam(param.label, param.value);
      }
  }

  getParamNames() {
    return this.formula.getParamNames();
  }

  getParams() {
    return this.formula.getParams();
  }

  getParam(paramName) {
    return this.formula.getParam(paramName);
  }

  setParam(paramName, value) {
    this.formula.setVariable(paramName, value);
  }

  getData(model) {
    let data = [];

    for (let i = 0; i < model.matrixSize; i++) {
      for (let j = 0; j < model.matrixSize; j++) {
        const xr = model.start.xr + model.step * i + model.step / 2;
        const xi = model.start.xi + model.step * j + model.step / 2;
        let formulaIndex = 0;
        for (let formula of this.y) {
          formula.setVariable("x", new Complex(xr, xi));
          const y = formula.calc();
          data.push({ i, j, xr, xi, yr: y.re, yi: y.im, formula: formulaIndex++ });
        }
      }
    }

    return data;
  }
}
