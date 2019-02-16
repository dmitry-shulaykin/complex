import * as React from "react";
import { Formula } from 'src/Lib/Formula';
import { Curve } from 'src/Model/Curves';

const ParamsBoxStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
}

const ParamStyle: React.CSSProperties ={
  border: "1px solid gray",
  margin: "0px 10px 0px 10px",
  minWidth: "50px",
  textAlign: "center"
}

interface IProps {
  curve: Curve;
}

export default class CurveItem extends React.Component<IProps> {
  public render() {
    const curve = this.props.curve;
    // console.log(this.props.curve.getParams().size)
    const params =   this.props.curve.getParams();

    const showParams = []
    for(const param in params){
      if (param !== "x") {
        showParams.push(param);
      }
      // console.log(param)
    }

    const color = curve.color ? `rgb(${curve.color.r},${curve.color.g},${curve.color.b})` : '#FFF';
    // console.log(color);
    return (
      <React.Fragment>
        <div style={{color}}>{curve.name ? curve.name : "Кривая"}</div>
        <div>
          {this.props.curve.formulae.map((formula: Formula, i: number) => (
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
      </React.Fragment>
    );
  }
}