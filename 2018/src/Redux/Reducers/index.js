import { combineReducers } from "redux";

import ViewsWrapperConfig from "Reducers/ViewsWrapperConfig";

import Gallery from "Reducers/Gallery.js";
import Model from "Reducers/Model.js";
import Cams from "Reducers/Cams.js";
import Image from "Reducers/Image.js";
import Editor from "Reducers/Editor.js";

export default combineReducers({
  Editor,
  ViewsWrapperConfig,
  Gallery,
  Model,
  Cams,
  Image
});
