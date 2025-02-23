import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Model from '../model/Model';
import Program from '../view/CubicProgram';
import { Circle } from '../model/Curves';
import Complex from '../model/Complex';

import './three-wrapper.css';

export function ThreeWrapper(props) {
  const rendererRef = useRef();
  const containerRef = useRef();

  useLayoutEffect(() => {
    const width = Math.floor(containerRef.current.parentNode.offsetWidth / 2);
    const height = Math.floor(containerRef.current.parentNode.offsetHeight / 2);

    console.log('container size', width, height);

    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);

    // const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    const camera = new THREE.OrthographicCamera(
      width / -16,
      width / 16,
      height / 16,
      height / -16,
      1,
      1000
    );

    camera.position.z = 100;

    const scene = new THREE.Scene();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    const model = new Model({
      matrixSize: 40,
    });
    model.addCurve(
      new Circle([
        { label: "x0", value: new Complex(0, 0) },
        { label: "y0", value: new Complex(0, 0) },
        { label: "r",  value: new Complex(1, 0) }
      ])
    );
    const program = new Program(
      renderer,
      scene,
      model,
      props.mappings
    );

    program.render();

    renderer.render(scene, camera);
    rendererRef.current = renderer;

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);

    return () => {
      program.clean(); // Seems like disposing does not work (
      renderer.dispose();
      containerRef.current.innerHTML = '';
      window.removeEventListener('resize', resizeHandler);
    }
  }, []);

  return (<div
    className='three-wrapper'
    ref={containerRef}
  />);
}
