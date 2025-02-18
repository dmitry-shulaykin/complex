import React from "react";

const GalleryItemStyle = {
    wrap: "nowrap",
    height: "110px",
    backgroundColor: "#333",
    padding: "5px",
    margin: "5px 0px 5px 0px",
    border: "1px solid gray",
    opacity: "1.0"
};

const ImageStyle = {
    width: "auto",
    height: "100px",
    margin: "0px 20px 0px 0px"
}

const CodeStyle = {
    maxHeight: "50px",
    fontSize: "12px",
    overflow: "hidden"
}

export default class GalleryItem extends React.Component {
  constructor(props){
      super(props);

      this.handleDelete = this.handleDelete.bind(this);
      this.handleSelect = this.handleSelect.bind(this);
  }

  render() {
    const sketch = this.props.sketch;
    return (
      <div style={GalleryItemStyle}>
        <div style={{display: "flex", flexDirection: "row"}}> 
        <img style={ImageStyle} src={sketch.image}/>
        <div style={{display: "flex", flexDirection: "column"}}>
            <div>{sketch.sketchName}</div>
            <div style={CodeStyle}>{sketch.code}</div>
            <div style={{display: "flex", flexDirection: "row-reverse", paddingTop: "10px"}}>
                <button onClick={this.handleDelete}> Delete </button>
                <button onClick={this.handleSelect}> Load </button>
            </div>
        </div>
        </div>
      </div>
    );
  }

  handleDelete(){
    this.props.onDelete(this.props.sketch.sketchName)
  }

  handleSelect(){
    this.props.onSelect(this.props.sketch);  
  }
  
}
