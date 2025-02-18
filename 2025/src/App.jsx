import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import "./App.css";

function App() {
  const rendererRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(1000, 1000);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);

    // const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    const camera = new THREE.OrthographicCamera(
        100 / -16,
        100 / 16,
        100 / 16,
        100 / -16,
        1,
        1000
      );

    camera.position.z = 5;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    const scene = new THREE.Scene();
    scene.add(cube);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    renderer.render(scene, camera);
    rendererRef.current = renderer;

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
  }, []);

  return (
    <>
      <div width={1000} height={1000} ref={containerRef} />
    </>
  );
}

export default App;
