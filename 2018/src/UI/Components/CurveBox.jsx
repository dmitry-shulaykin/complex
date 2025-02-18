import React from "react";
import { connect } from "react-redux";

import CurveItem from "Components/CurveItem";

const CardStyle = {
  backgroundColor: "#333",
  padding: "5px",
  margin: "10px 5px 10px 5px",
  border: "1px solid gray"
}

class CurveBox extends React.Component {
  render() {
    let array = Array.from(this.props.model.model.curves);
    return (
      <div style={CardStyle}>
        <div>
          {array.map((curve, i) => (
            <CurveItem key={i} curve={curve} />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    model: state.Model
  }
};

export default connect(
  mapStateToProps
)(CurveBox);
