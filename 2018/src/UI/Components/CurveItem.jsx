import React from "react";

const CurveItemStyle = {};

const ParamsBoxStyle = {
  display: "flex",
  flexDirection: "row",

}

const ParamStyle ={
  margin: "0px 10px 0px 10px",
  border: "1px solid gray",
  minWidth: "50px",
  textAlign: "center"
}

export default class CurveItem extends React.Component {
  render() {
    const curve = this.props.curve;
    console.log(this.props.curve.getParams().size)
    const params =   this.props.curve.getParams();

    const showParams = []
    for(let param in params){
      if(param != "x") showParams.push(param)
      console.log(param)
    }

    const color = curve.color ? `rgb(${curve.color.r},${curve.color.g},${curve.color.b})` : '#FFF';
    console.log(color);
    return (
      <div style={{ CurveItemStyle }}>
        <div style={{color}}>{curve.name ? curve.name : "Кривая"}</div>
        <div>
          {this.props.curve.y.map((formula, i) => (
            <div key={i}>{"y = " + formula.text}</div>
          ))}
        </div>
        <div style={ParamsBoxStyle}>
          {
            showParams.map((param, i) => (
              <div key={i} style={ParamStyle}>{param + ":" + params[param]}</div>)
            )
          }
        </div>
        <hr />
      </div>
    );
  }
}
