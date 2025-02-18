import React from "react";
import { connect } from "react-redux";

import ViewBox from "UI/ViewBox";
import { ViewConstants } from "../Constants";
import TrackCam from "../Lib/TrackCam";

const ViewsWrapperStyle = ViewBox => {
  return {
    width: ViewBox.props.width,
    height: ViewBox.props.height
  };
};

class ViewsWrapper extends React.Component {
  constructor(props) {
    console.log("constructing viewbox wrapper");
    super(props);

    this.globCamera = React.createRef();
  }

  getConfigs(numViews) {
    if (numViews == "1") {
      const width = this.props.width,
        height = this.props.height;

      const top = ViewConstants.HEADER_HEIGHT;
      return {
        width,
        height,
        configs: [
          {
            top,
            left: 0,
            width: this.props.width,
            height: this.props.height,
            model: this.props.model
          }
        ]
      };
    } else if (numViews == "2") {
      const top = ViewConstants.HEADER_HEIGHT;
      const width = this.props.width / 2,
        height = this.props.height;
      return {
        width,
        height,
        configs: [
          {
            top,
            left: 0,
            width,
            height,
            model: this.props.model
          },
          {
            top,
            left: this.props.width / 2,
            width,
            height,
            model: this.props.model
          }
        ]
      };
    } else {
      const topTop = ViewConstants.HEADER_HEIGHT;
      const botTop = ViewConstants.HEADER_HEIGHT + this.props.height / 2;

      const width = this.props.width / 2,
        height = this.props.height / 2;
      return {
        width,
        height,
        configs: [
          {
            top: topTop,
            left: 0,
            width,
            height,
            model: this.props.model
          },
          {
            top: topTop,
            left: this.props.width / 2,
            width,
            height,
            model: this.props.model
          },
          {
            top: botTop,
            left: 0,
            width,
            height,
            model: this.props.model
          },
          {
            top: botTop,
            left: this.props.width / 2,
            width,
            height,
            model: this.props.model
          }
        ]
      };
    }
  }

  render() {
    const res = this.getConfigs(this.props.config.views);

    if (this.props.config.singleCam) {
      this.camera = new TrackCam(
        res.width,
        res.height,
        this.props.config.camType,
        'global'
      );
      let mount = this.globCamera.current;
      this.camera.setup(mount);
    }

    return (
      <div style={ViewsWrapperStyle(this)} ref={this.globCamera}>
        {res.configs.map((config, i) => (
          <ViewBox
            camera={this.props.config.singleCam ? this.camera : null}
            key={i}
            i={i}
            config={config}
            // programConfig={this.props.programsConfig[i]}
            model={this.props.model}
            camType={this.props.config.camType}
            onChange={this.handleChange}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    config: state.ViewsWrapperConfig
  }
};

export default connect(
  mapStateToProps
)(ViewsWrapper);
