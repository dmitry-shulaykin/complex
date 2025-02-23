import { ThreeWrapper } from './components/three-wrapper';

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

function App() {
  return <div className='main-container'>
    <ThreeWrapper mappings={mappings1} />
    <ThreeWrapper mappings={mappings2} />
    <ThreeWrapper mappings={mappings3} />
    <ThreeWrapper mappings={mappings4} />
  </div>
}

export default App;
