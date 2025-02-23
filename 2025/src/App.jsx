import { useState, useCallback } from 'react';

import { ThreeWrapper } from './components/three-wrapper';
import { Sidebar } from './components/sidebar';
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

const initialCode = `(Model, Curves, Complex, Parser, Formula) => {
  let model = new Model({ matrixSize: 50 });
  model.addCurve(
    new Curves.Circle([
      { label: "x0", value: new Complex(0, 0) },
      { label: "y0", value: new Complex(0, 0) },
      { label: "r",  value: new Complex(1, 0) },
    ]),
  );
  return model;
}`;


function App() {
  const [code, setCode] = useState(initialCode);
  const [model, setModel] = useState(buildModel(initialCode));

  const handleCodeChange = useCallback((value) => {
    setCode(value);
  }, []);

  const handleBuild = useCallback((value) => {
    setModel(buildModel(value));
  }, []);

  return <div className='app'>
    <div className='sidebar'>
      <Sidebar 
        code={code}
        onCodeChange={handleCodeChange}
        onBuild={handleBuild}
      />
    </div>
    <div className='main-container'>
      <ThreeWrapper mappings={mappings1} model={model} />
      <ThreeWrapper mappings={mappings2} model={model} />
      <ThreeWrapper mappings={mappings3} model={model} />
      <ThreeWrapper mappings={mappings4} model={model} />
    </div>
  </div>

}

export default App;
