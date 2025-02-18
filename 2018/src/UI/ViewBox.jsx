import React from "react";
import { connect } from "react-redux";

import CubicProgram from "ThreePrograms/CubicProgram";
import PolygonProgram from "ThreePrograms/PolygonProgram";
import ThreeWrapper from "Components/ThreeWrapper";

import { Action } from "Root/Constants"

const ViewBoxStyle = ViewBox => {
  return {
    position: "absolute",
    top: ViewBox.props.config.top,
    left: ViewBox.props.config.left,
    width: ViewBox.props.config.width,
    height: ViewBox.props.config.height,
    zIndex: 0,
    border: "1px solid grey"
  };
};

const HeaderStyle = {
  position: "absolute",
  top: 0,
  left: 0
};

class Header extends React.Component {
  constructor(props) {
    super(props);

    // this.state =
    if (this.props.config) {
      this.state = this.props.config;
    }

    this.handleMapChange = this.handleMapChange.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.handleInvertedChange = this.handleInvertedChange.bind(this);
  }

  handleMapChange(e) {
    this.state.mappings[e.target.name].label = e.target.value;
    this.props.onChange(this.state);
  }

  handleModeChange() {
    this.state.renderMethod =
      this.state.renderMethod === "Cubes" ? "Polygons" : "Cubes";
 
    this.props.onChange(this.state);
  }

  handleInvertedChange(e) {
    this.state.mappings[e.target.name].inverted = !this.state.mappings[
      e.target.name
    ].inverted;
    this.props.onChange(this.state);
  }

  render() {
    const mappings = ["x", "y", "z"];
    const mapValues = ["xr", "xi", "yr", "yi"];

    return (
      <div style={HeaderStyle}>
        <select
          name="renderMethod"
          value={this.state.renderMethod}
          onChange={this.handleModeChange}
        >
          <option value="Cubes"> Кубы </option>
          <option value="Polygons"> Полигоны </option>
        </select>
        {mappings.map((mapping, i) => {
          const mappingName = mapping;
          return (
            <div key={i}>
              <label htmlFor={mappingName}>{mapping + ":"}</label>
              <select
                key={i}
                name={mappingName}
                onChange={this.handleMapChange}
                value={this.state.mappings[mapping].label}
              >
                {mapValues.map((mv, i) => (
                  <option key={i} value={mv}>
                    {mv}
                  </option>
                ))}
              </select>
              <input
                type="checkbox"
                name={mappingName}
                onChange={this.handleInvertedChange}
                value={this.state.mappings[mapping].inverted}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

class ViewBox extends React.Component {
  constructor(props){
    super(props);
    this.wrapConfigChange = this.wrapConfigChange.bind(this);
  }

  wrapConfigChange(config){
    this.props.updateConfig(this.props.i, config)
  }

  render() {
    const defaultConfig = {
        renderMethod: "Cubes",
        mappings: {
          x: {
            label: "xr",
            inverted: false
          },
          y: {
            label: "yr",
            inverted: false
          },
          z: {
            label: "xi",
            inverted: false
          }
        }
    };

    const config = this.props.model.projConfigs[this.props.i] || defaultConfig;
    const model = this.props.model.model;
    let program;

    if (config.renderMethod == "Cubes") {
      program = new CubicProgram(
        model,
        config.mappings
      );
    } else {
      program = new PolygonProgram(
        model,
        config.mappings
      );
    }

    return (
      <div style={ViewBoxStyle(this)}>
        <Header onChange={this.wrapConfigChange} config={config} />
        <ThreeWrapper
          camType={this.props.camType}
          camera={this.props.camera}
          program={program}
          width={this.props.config.width}
          height={this.props.config.height}
          i={this.props.i}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    model: state.Model 
  }
};

const mapDispatchToProps = dispatch => {
  return {
    updateConfig: (id, config) => {
      dispatch({
        type: Action.PROJECTION_CONFIG_UPDATE,
        id, config
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewBox);