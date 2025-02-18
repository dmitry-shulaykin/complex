import React from "react";
import { connect } from "react-redux";

import { Action } from "Root/Constants";
import GalleryItem from "Components/GalleryItem";

const GalleryItemStyle = {};

class Gallery extends React.Component {
  render() {
    return (
      <div style={this.props.style}>
        {this.props.sketches.map((sketch, i) => (
          <GalleryItem
            sketch={sketch}
            key={i}
            onDelete={this.props.handleDelete}
            onSelect={this.props.handleSelect}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sketches: state.Gallery
});

const mapDispatchToProps = dispatch => ({
  handleDelete: sketchName => {
    dispatch({
      type: Action.REMOVE_SKETCH,
      sketchName
    });
  },
  handleSelect: sketch => {
    dispatch({
      type: Action.LOAD_SKETCH,
      sketch
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gallery);
