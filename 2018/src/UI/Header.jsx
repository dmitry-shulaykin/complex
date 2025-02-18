import React from "react";
import { connect } from "react-redux";
import { ViewConstants, Action } from "Root/Constants";
import { Change, Toggle } from "Redux/Actions";

const HeaderStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#333",
  width: "100%",
  color: "white",
  height: ViewConstants.HEADER_HEIGHT,
  border: "1px border gray"
};

const LogoStyle = {
  fontSize: "1.3em",
  margin: "0px 10px 0px 10px"
};

const Margin = {
  margin: "0px 10px 0px 10px"
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sketchName: this.props.config.sketchName
    };

    this.wrapperSketchNameChange = this.wrapperSketchNameChange.bind(this);
    this.handleSketchNameInput = this.handleSketchNameInput.bind(this);
  }

  handleSketchNameInput(e) {
    this.setState({ sketchName: e.target.value });
  }

  wrapperSketchNameChange() {
    this.props.handleSketchNameChange(this.state.sketchName);
  }

  render() {
    return (
      <div style={HeaderStyle}>
        <div style={LogoStyle}>Complex</div>
        <button style={Margin} onClick={this.props.handleConsole}>
          Editor
        </button>
        <div style={Margin}>
          <label htmlFor="screensValue">Views:</label>
          <select
            name="screensValue"
            value={this.props.config.views}
            onChange={this.props.handleScreenValue}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="4">4</option>
          </select>
        </div>
        <div style={Margin}>
          <label htmlFor="singleCam">SingleCam:</label>
          <input
            type="checkbox"
            name="singleCam"
            checked={this.props.config.singleCam}
            onClick={this.props.handleSingleCam}
          />
        </div>
        <div style={Margin}>
          <label htmlFor="camType">Camera:</label>
          <select
            name="camType"
            value={this.props.config.camType}
            onChange={this.props.handleCamType}
          >
            <option value="Ortho">Ortho</option>
            <option value="Perspective">Perspective</option>
          </select>
        </div>
        <div style={Margin}>
          <input
            type="text"
            placeholder="Sketch Name"
            value={this.state.sketchName}
            onChange={this.handleSketchNameInput}
          />
          <button onClick={this.wrapperSketchNameChange}>Change</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    config: state.ViewsWrapperConfig
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleConsole: () => {
      dispatch(Toggle(Action.UPDATE_EDITOR, "editor"));
    }, 
    handleScreenValue: e => {
      dispatch(Change(Action.VIEW_WRAPPER_CHANGED, { views: e.target.value }));
    }, 
    handleSingleCam: () => {
      dispatch(Toggle(Action.VIEW_WRAPPER_CHANGED, "singleCam"));
    },
    handleCamType: e => {
      dispatch(
        Change(Action.VIEW_WRAPPER_CHANGED, { camType: e.target.value })
      );
    },
    handleSketchNameChange: sketchName => {
      dispatch(Change(Action.VIEW_WRAPPER_CHANGED, { sketchName }));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
