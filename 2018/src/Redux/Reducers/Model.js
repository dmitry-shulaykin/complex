import { Action } from "Root/Constants";
import { DEFAULT_CODE } from "Root/Constants";

import Model from "Model/Model.js";
import * as Curves from "Model/Curves";
import { Parser, Formula } from "Lib/Parser";
import Complex from "Lib/Complex";

const DEFAULT_STATE = {
  model: new Model(),
  code: DEFAULT_CODE,
  projConfigs: []
};

function buildModel(code, params) {
  try {
    console.log('build new model');
    const userFunction = eval(code);
    const newModel = userFunction(
      Model,
      Curves,
      Complex,
      Parser,
      Formula,
      params
    );
    return newModel;
  } catch (err) {
    console.log(err);
  }
}

export default (state = DEFAULT_STATE, action) => {
  if (action.type === Action.BUILD_CODE) {
    const params = state.model.exportParams();
    delete state.model.data;
    return {
      ...state,
      model: buildModel(action.code, params),
      code: action.code
    };
  } else if (action.type === Action.CHANGE_MATRIX_PROPS) {
    const label = action.label;
    const value = action.value;
    const model = state.model;

    if (label == "matrixSize") {
      model.matrixSize = parseInt(value);
    } else if (label == "size") {
      model.size = parseInt(value);
    } else {
      model.center[label] = parseInt(value);
    }

    const newModel = new Model(model.exportParams(), model.curves);
    delete state.model;
    return {
      ...state,
      model: newModel
    };
  } else if (action.type === Action.CLEAR_MODEL) {
    return  {
      model: new Model(),
      code: DEFAULT_CODE,
      projConfigs: []
    };
  } else if (action.type === Action.PROJECTION_CONFIG_UPDATE) {
    let projConfigs = [];
    for (let i = 0; i < state.projConfigs.length; i++) {
      projConfigs[i] = state.projConfigs[i];
    }
    projConfigs[action.id] = action.config;
    return { ...state, projConfigs };
  } else if(action.type === Action.LOAD_SKETCH){
    console.log(action);
    return {
        model: buildModel(action.sketch.code, action.sketch.params),
        projConfigs: action.sketch.projConfigs,
        code: action.sketch.code,
    };
  }
  return state;
};
