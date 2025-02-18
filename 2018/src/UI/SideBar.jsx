import React from "react";

import { ViewConstants } from "Root/Constants";
import CurveBox from "Components/CurveBox";
import ProjectionPosition from "Components/ProjectionPosition";

const SidebarStyle = {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#555",
  color: "white",
  height: "100%",
  width: ViewConstants.SIDEBAR_WIDTH
};

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={SidebarStyle}>
        <ProjectionPosition model={this.props.model} />
        <CurveBox model={this.props.model} />
      </div>
    );
  }
}
