import { Action } from "Root/Constants";

const DEFAULT_STATE = [];

export default (state = DEFAULT_STATE, action) => {
  let newSketches;
  const sketch = action.sketch;
  if (action.type === "@@INIT") {
    const sketches = localStorage.getItem("gallery");
    if (sketches) {
      return JSON.parse(sketches);
    } else {
      return DEFAULT_STATE;
    }
  } else if (action.type === Action.ADD_SKETCH) {
    if (state.find(s => s.sketchName === sketch.sketchName)) {
      newSketches = state.map(
        s => (s.sketchName === sketch.sketchName ? sketch : s)
      );
    } else {
      newSketches = state.concat([sketch]);
    }
  } else if (action.type === Action.REMOVE_SKETCH) {
    newSketches = state.filter(sketch => sketch.sketchName != action.sketchName);
  } else return state;

  localStorage.setItem("gallery", JSON.stringify(newSketches));
  return newSketches;
};
