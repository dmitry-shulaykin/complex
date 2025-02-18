import React from "react";
import { connect } from "react-redux";

import { ViewConstants, Action } from "Root/Constants";
import AceEditor from "react-ace";
import Controls from "Components/ConsoleHeader";

import { Toggle } from "Redux/Actions";

import Gallery from "Components/Gallery";

import "brace/mode/javascript";
import "brace/theme/monokai";

class Console extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: this.props.model.code
    };

    this.wrapperBuildModel = this.wrapperBuildModel.bind(this);
    this.wrapperSaveModel = this.wrapperSaveModel.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
  }

  getStyle() {
    return {
      position: "absolute",
      backgroundColor: "#555",
      left: "0px",
      top: ViewConstants.HEADER_HEIGHT + ViewConstants.CONSOLE_CONTROLS,
      color: "white",
      height: this.props.height - ViewConstants.CONSOLE_CONTROLS,
      width: ViewConstants.CONSOLE_WIDTH,
      opacity: "0.5",
      padding: "10px 10px 10px 10px"
    };
  }

  handleCodeChange(newCode) {
    this.setState({ code: newCode });
  }

  wrapperBuildModel() {
    this.props.handleBuildModel(this.state.code);
  }

  wrapperSaveModel() {
    const model = {
      sketchName: this.props.config.sketchName,
      config: this.props.config,
      cams: this.props.cams,
      code: this.props.model.code,
      projConfigs: this.props.model.projConfigs,
      params: this.props.model.model.exportParams(),
      image: this.props.image,
    };
    console.log(model);
    this.props.handleSaveModel(model);
  }

  render() {
    let bar;
    if (this.props.editor.gallery) {
      bar = <Gallery 
        style={this.getStyle()}
      />;
    } else {
      bar = (
        <AceEditor
          style={this.getStyle()}
          mode="javascript"
          theme="monokai"
          value={this.state.code}
          onChange={this.handleCodeChange}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
        />
      );
    }

    return (
      <div style={{ zIndex: 100 }}>
        <Controls
          onBuildModel={this.wrapperBuildModel}
          onClearModel={this.props.handleClearModel}
          onSaveModel={this.wrapperSaveModel}
          onToggleGallery={this.props.handleToggleGallery}
        />
        {bar}
      </div>
    );
  }
}

const mapStateToProps = state => {
  //console.log(state);
  return {
    config: state.ViewsWrapperConfig,
    model: state.Model,
    cams: state.Cams,
    image: state.Image,
    editor: state.Editor
  };
};

const mapDispatchToProps = dispatch => ({
  handleBuildModel: code => {
    dispatch({
      type: Action.BUILD_CODE,
      code
    });
  },
  handleClearModel: () => {
    dispatch({
      type: Action.CLEAR_CODE
    });
  },

  handleSaveModel: exportModel => {
    dispatch({
      sketch: exportModel,
      type: Action.ADD_SKETCH
    });
  },

  handleToggleGallery: () => {
    dispatch(Toggle(Action.UPDATE_EDITOR, "gallery"));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Console);
