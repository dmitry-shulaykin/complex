import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import Program from '../view/CubicProgram';


import './three-wrapper.css';

export function ThreeWrapper(props) {
  const { mappings, model } = props;
  const rendererRef = useRef();
  const containerRef = useRef();

  useLayoutEffect(() => {
    const width = Math.floor(containerRef.current.parentNode.offsetWidth / 2);
    const height = Math.floor(containerRef.current.parentNode.offsetHeight / 2);

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
    scene.background = new THREE.Color(0.8, 0.8, 0.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    const program = new Program(
      renderer,
      scene,
      model,
      mappings,
    );

    program.buildScene();

    renderer.render(scene, camera);
    rendererRef.current = renderer;

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      program.updateLight(camera.position)
      renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);

    return () => {
      console.log('Unmounting component, doing major cleanup');
      program.clear();
      renderer.dispose();
      containerRef.current.innerHTML = '';
    }
  }, []);

  return (<div
    className='three-wrapper'
    ref={containerRef}
  />);
}
