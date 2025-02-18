import React from "react";
import { connect } from "react-redux";

import Header from "UI/Header";
import ViewsWrapper from "UI/ViewsWrapper";
import Sidebar from "UI/SideBar";
import Console from "UI/Console";

import { ViewConstants } from "Root/Constants";

const AppStyle = {
  display: "flex",
  flexDirection: "column"
};

const ContentStyle = {
  display: "flex",
  flexDirection: "row",
  backgroundColor: "#FFF",
  color: "black"
};

 class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: window.innerWidth - ViewConstants.SIDEBAR_WIDTH,
      height: window.innerHeight - ViewConstants.HEADER_HEIGHT
    };

    window.onresize = this.handleResize.bind(this);
  }

  handleResize() {
    this.setState(() => ({
      width: window.innerWidth - ViewConstants.SIDEBAR_WIDTH,
      height: window.innerHeight - ViewConstants.HEADER_HEIGHT
    }));
  }

  render() {
    const model = this.props.model.model;
    const editor = this.props.editor.editor ? (
      <Console
        height={this.state.height}
      />
    ) : null;

    return (
      <div style={AppStyle}>
        <Header />
        <div style={ContentStyle}>
          {editor}
          <ViewsWrapper
            model={model}
            width={this.state.width}
            height={this.state.height}
          />
          <Sidebar model={model} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    model: state.Model,
    editor: state.Editor
  }
};


export default connect(
  mapStateToProps
)(App);
