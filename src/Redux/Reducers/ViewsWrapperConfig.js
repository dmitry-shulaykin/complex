import { Action } from "Root/Constants";

const DEFAULT_STATE = {
  editor: true,
  views: "4",
  singleCam: false,
  camType: "Ortho",
  sketchName: "sketch"
};

export default (state = DEFAULT_STATE, action) => {
  if (action.type === Action.LOAD_SKETCH) {
    return action.sketch.config;
  } else if (action.type === Action.VIEW_WRAPPER_CHANGED) {
    if (action.applyChanges) {
      return action.applyChanges(state);
    }
  }
  return state;
};
