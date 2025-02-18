export const ViewConstants = {
  HEADER_HEIGHT: 35,
  SIDEBAR_WIDTH: 300,
  CONSOLE_CONTROLS: 30,
  CONSOLE_WIDTH: 500
};

export const DEFAULT_CODE = `(Model, Curves, Complex, Parser, Formula, params) => {
      let model = new Model(params);
      model.addCurve(
        new Curves.Circle([
          { label: "x0", value: new Complex(0, 0) },
          { label: "y0", value: new Complex(0, 0) },
          { label: "r",  value: new Complex(1, 0) }
        ])
      );
      return model;
    }`;

export const Action = {
  VIEW_WRAPPER_CHANGED: "view_wrapper_changed",
  BUILD_CODE: "build_code",
  CLEAR_MODEL: "clear_model",
  CHANGE_MATRIX_PROPS: "change_matrix_props",
  PROJECTION_CONFIG_UPDATE: "projection_config_update",
  UPDATE_CAMERA: "update_camera",
  TOGGLE_GALLERY: "toggle_gallery",
  CLEAR_CODE: "clear_code",
  ADD_SKETCH: "add_story",
  REMOVE_SKETCH: "remove_story",
  LOAD_SKETCH: "load_story",
  UPDATE_IMAGE: "update_image",
  UPDATE_EDITOR: "update_editor"
}