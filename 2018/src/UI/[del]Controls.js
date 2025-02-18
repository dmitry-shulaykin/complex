import { Circle, Parabola, Hyperbola, Line } from "Curves/Curves.js";

export default class Controls {
  constructor(app) {
    this.mode = "proj";

    this.slice_mode_button = select(".sliceMode");
    this.grid_mode_button = select(".gridMode");
    this.proj_mode_button = select(".projMode");

    this.data_viz_slice_slider = select(".simpleDataVizSliceSelector");
    this.data_viz_slice_slider.attribute("min", 0);
    this.data_viz_slice_slider.attribute("max", model.yi_rez);
    this.data_viz_slice_input = select(".simpleDataVizSliceSelectorValue");

    this.data_viz_slice_slider.mouseMoved(() => {
      this.data_viz_slice_input.value(this.data_viz_slice_slider.value());
    });

    this.data_viz_slice_input.input(() => {
      this.data_viz_slice_slider.value(this.data_viz_slice_input.value());
    });

    this.model_rebuild = select(".rebuildModel");
    this.model_rebuild.mouseClicked(() => {
      app.rebuild();
    });

    this.curveType = select(".curveType");
    this.cleanCurves = select(".cleanCurves");
    this.cleanCurves.mouseClicked(() => {
      if (this.curveItem) this.curveItem.destroy();
      app.cleanCurves();
      app.rebuild();
    });

    this.createCurve = document.getElementsByClassName("createCurve")[0];
    this.createCurve.onclick = () => {
      if (this.curveItem) {
        this.curveItem.destroy();
      }
      const getCurve = () => {
        switch (this.curveType.value()) {
          case "circle":
            return new Circle();
          case "parabola":
            return new Parabola();
          case "hyperbola":
            return new Hyperbola();
          case "line":
            return new Line();
        }
      };
      let new_curve = getCurve();

      this.curveItem = new CurveItem(new_curve);
      app.model.addCurve(new_curve);
      app.rebuild();
    };

    this.initModelInput(app);

    this.update = this.update.bind(this);
  }

  update(app) {
    // if (this.slice_mode_button.elt.checked) {
    //   this.mode = 'slice';
    // } else if (this.grid_mode_button.elt.checked) {
    //    this.mode = 'grid';
    // } else if (this.proj_mode_button.elt.checked) {
    this.mode = "proj";
    //}

    // app.simple_data_visualizer.slice_index =
    //  this.data_viz_slice_input.value() - 0;
  }

  initModelInput(app) {
    let params = [
      { name: ".xrResVal", param: "xr_rez" },
      { name: ".xiResVal", param: "xi_rez" },
      { name: ".yrResVal", param: "yr_rez" },
      { name: ".yiResVal", param: "yi_rez" },
      { name: ".xrStartVal", param: "xr_start" },
      { name: ".xiStartVal", param: "xi_start" },
      { name: ".yrStartVal", param: "yr_start" },
      { name: ".yiStartVal", param: "yi_start" },
      { name: ".xrEndVal", param: "xr_end" },
      { name: ".xiEndVal", param: "xi_end" },
      { name: ".yrEndVal", param: "yr_end" },
      { name: ".yiEndVal", param: "yi_end" }
    ];

    for (let param of params) {
      select(param.name).value(app.model[param.param]);
      select(param.name).changed(() => {
        app.model[param.param] = select(param.name).value() - 0;

        this.data_viz_slice_slider.attribute("max", model.yi_rez);
        //app.rebuild();
      });
    }
  }
}

class CurveItem {
  createEquations() {
    let equationsDiv = document.createElement("div");

    for (let formula of this.curve.y) {
      let equationLabel = document.createElement("span");
      equationLabel.innerHTML = "y=";

      let equationInput = document.createElement("input");
      equationInput.setAttribute("value", formula.text);
      equationInput.setAttribute("class", "curveEquationInput");
      equationsDiv.appendChild(equationLabel);
      equationsDiv.appendChild(equationInput);
    }
    return equationsDiv;
  }

  createParam(param) {
    let paramDiv = document.createElement("div");
    paramDiv.setAttribute("class", "param");

    let pn = document.createElement("div");
    pn.setAttribute("class", "paramName");
    pn.innerHTML = param;

    let i = document.createElement("input");
    i.setAttribute("class", "paramInput");
    i.setAttribute("value", this.curve.getParam(param).toString());
    i.setAttribute("disabled", "true");

    paramDiv.appendChild(pn);
    paramDiv.appendChild(i);
    return paramDiv;
  }

  createParams() {
    this.params = this.curve.getParamNames();
    const paramsBox = document.createElement("div");

    for (let param of this.params) {
      paramsBox.appendChild(this.createParam(param));
    }
    return paramsBox;
  }

  destroy() {
    // app.removeCurve(this.curve);
    let myNode = document.getElementsByClassName("curveEquations")[0];
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }

    myNode = document.getElementsByClassName("curveParams")[0];
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
  }

  constructor(curve) {
    this.curve = curve;
    select(".curveProjA").style(
      "background-color",
      "rgb(" +
        curve.colorA.r +
        "," +
        curve.colorA.g +
        "," +
        curve.colorA.b +
        ")"
    );
    select(".curveProjB").style(
      "background-color",
      "rgb(" +
        curve.colorB.r +
        "," +
        curve.colorB.g +
        "," +
        curve.colorB.b +
        ")"
    );

    let container = document.createElement("div");

    container.setAttribute("class", "curveItem");

    document
      .getElementsByClassName("curveEquations")[0]
      .appendChild(this.createEquations());
    document
      .getElementsByClassName("curveParams")[0]
      .appendChild(this.createParams());

    this.widget = container;
  }
}
