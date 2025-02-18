import React from "react";

import { ViewConstants } from "Root/Constants";


export default class Controls extends React.Component {
    constructor(props) {
      super(props);
    }
  
    getStyle() {
      return {
        display: "flex",
        flexDirection: "row",
        position: "absolute",
        top: ViewConstants.HEADER_HEIGHT,
        width: ViewConstants.CONSOLE_WIDTH + 20,
        height: ViewConstants.CONSOLE_CONTROLS
      };
    }
  
    getItemStyle() {
      return { flexGrow: "1", height: ViewConstants.CONSOLE_CONTROLS };
    }
  
    render() {
      return (
        <div style={this.getStyle()}>
          <button style={this.getItemStyle()} onClick={this.props.onBuildModel}>
            Построить
          </button>
          <button style={this.getItemStyle()} onClick={this.props.onSaveModel}>
            Сохранить
          </button>
          <button style={this.getItemStyle()} onClick={this.props.onClearModel}>
            Очистить
          </button>
          <button style={this.getItemStyle()} onClick={this.props.onToggleGallery}>
            Галерея
          </button>
        </div>
      );
    }
  }

