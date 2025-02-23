import { ThreeWrapper } from './components/three-wrapper';
import { buildModel } from './model/build-model';

import './App.css'

const mappings1 = {
  x: { label: "xr", inverted: false },
  y: { label: "yr", inverted: false },
  z: { label: "xi", inverted: false }
}

const mappings2 = {
  x: { label: "xr", inverted: false },
  y: { label: "yi", inverted: false },
  z: { label: "xi", inverted: false }
}

const mappings3 = {
  x: { label: "xi", inverted: false },
  y: { label: "yr", inverted: false },
  z: { label: "yi", inverted: false }
}

const mappings4 = {
  x: { label: "xr", inverted: false },
  y: { label: "yr", inverted: false },
  z: { label: "yi", inverted: false }
}

const code = `(Model, Curves, Complex, Parser, Formula, params) => {
  let model = new Model(params);
  model.addCurve(
  new Curves.Circle([
      { label: "x0", value: new Complex(0, 0) },
      { label: "y0", value: new Complex(0, 0) },
      { label: "r",  value: new Complex(1, 0) }
  ])
  );
  return model;
}`

const model = buildModel(code, { matrixSize: 42 });

function App() {
  return <div className='main-container'>
    <ThreeWrapper mappings={mappings1} model={model} />
    <ThreeWrapper mappings={mappings2} model={model} />
    <ThreeWrapper mappings={mappings3} model={model} />
    <ThreeWrapper mappings={mappings4} model={model} />
  </div>
}

export default App;
