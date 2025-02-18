import React from "react";
import { connect } from "react-redux";

import { Action } from "Root/Constants";

class Parameter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.default || 0
    };
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    });
    this.props.onChange(this.props.label, e.target.value);
  }

  render() {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end"}}>
        <div>{this.props.label + ":"}</div>
        <input
          style={{ marginLeft: "5px", width: "50px", height: "20px"}}
          type="text"
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
        />
      </div>
    );
  }
}

const ProjectionPositionStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  flexWrap: "wrap"
};

const CardStyle = {
  backgroundColor: "#333",
  padding: "5px",
  margin: "10px 5px 10px 5px",
  border: "1px solid gray"
};

export class ProjectionPosition extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const model = this.props.model.model;
    const params = [
      { label: "matrixSize", value: model.matrixSize },
      { label: "size", value: model.size },
      { label: "xr", value: model.center.xr },
      { label: "xi", value: model.center.xi },
      { label: "yr", value: model.center.yr },
      { label: "yi", value: model.center.yi }
    ];

    return (
      <div style={CardStyle}>
        <div style={{ textAlign: "center" }}>Projection Position</div>
        <div style={ProjectionPositionStyle}>
          {params.map((param, i) => (
            <Parameter
              key={i}
              label={param.label}
              default={param.value}
              onChange={this.props.handleChange}
            />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    model: state.Model
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleChange: (label, value) => {
      dispatch({
        type: Action.CHANGE_MATRIX_PROPS,
        label,
        value
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectionPosition);
