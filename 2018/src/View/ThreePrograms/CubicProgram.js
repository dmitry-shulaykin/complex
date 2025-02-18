import * as THREE from "three";

import Projection3D from "Model/Projection3D";

export default class TestThreeProgram {
  constructor(model, mappings) {
    this.model = model;
    if(!this.model.programs)
      this.model.programs = [];
    this.model.programs.push(this);
    // this.model.subscribe(this.render.bind(this));
    this.mappings = mappings;
    this.needGrid = true;
    this.needAxies = true;
    this.meshes = [];
    this.gridMaterial = new THREE.LineBasicMaterial({
      color: 0xaaaaaa,
    });
    this.xAxiesMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 2
    });
    this.yAxiesMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 2
    });
    this.zAxiesMaterial = new THREE.LineBasicMaterial({
      color: 0x0000ff,
      linewidth: 2
    });

    this.cellSize = 1;
    // this.render();
  }

  generateMesh() {}

  render() {
    // console.log("projecting ");
    this.projection = new Projection3D(this.model, 1, this.mappings);
    // console.log("total model data = " + this.model.data.size);
    this.projection.calcData();
    this.data = this.projection.projData;
    // console.log("total data for geometry = " + this.data.size);

    this.totalSize = this.cellSize * this.model.matrixSize;

    // remove all objects
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }

    // console.log("program setup");

    const materialsMap = new Map();

    const getMatrerial = color => {
      let existing = materialsMap.get(color);

      if (existing) {
        return existing;
      } else {
        let material = new THREE.MeshLambertMaterial({
          color: new THREE.Color(color.r / 255, color.g / 255, color.b / 255)
        });
        materialsMap.set(color, material);
        return material;
      }
    };

    // console.log("generating geometry");
    // console.log(this.data.size);

    let geometry = new THREE.BoxGeometry(1, 1, 1);

    for (let box of this.data) {
      const x = -this.totalSize / 2 + (box.x + 1 / 2) * this.cellSize;
      const y = -this.totalSize / 2 + (box.y + 1 / 2) * this.cellSize;
      const z = -this.totalSize / 2 + (box.z + 1 / 2) * this.cellSize;

      const mat = getMatrerial(box.color);
      // console.log(mat);
      const mesh = new THREE.Mesh(geometry, mat);
      this.meshes.push(mesh)
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
    }

    this.light = new THREE.DirectionalLight(0xffffff, 0.7);
    this.glight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.3);
    this.light.position.set(0, 0, 1).normalize();
    this.light.castShadow = true;
    this.scene.add(this.light);
    this.scene.add(this.glight);

    this.addGrid();
    this.renderer.render(this.scene, this.camera);
    return this.meshes;
  }

  clean(){
    for(let mesh of this.meshes){
        mesh.dispose();
    }
  }

  setup(renderer, scene, camera) {
    // console.log("setup");
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
  }

  addGrid() {
    // const mapLineX = (x, y) => new THREE.Vector3(0, x, y);
    const mapLineY = (x, y) => new THREE.Vector3(x, 0, y);
    const mapLineZ = (x, y) => new THREE.Vector3(x, y, 0);

    let gridGeometry = new THREE.Geometry(),
      xAxiesGeometry = new THREE.Geometry(),
      yAxiesGeometry = new THREE.Geometry(),
      zAxiesGeometry = new THREE.Geometry();

    const addLine = (x1, y1, x2, y2, mapLine, geometry) => {
      geometry.vertices.push(mapLine(x1, y1), mapLine(x2, y2));
    };

    const totalSize = 100;

    const planeGrid = mapLine => {
      for (let i = 0; i < totalSize; i++) {
        for (let j = 0; j < totalSize; j++) {
          const x = -totalSize / 2 + i * this.cellSize;
          const y = -totalSize / 2 + j * this.cellSize;
          addLine(x, y, x + this.cellSize, y, mapLine, gridGeometry);
          addLine(
            x + this.cellSize,
            y,
            x + this.cellSize,
            y + this.cellSize,
            mapLine,
            gridGeometry
          );
          addLine(
            x + this.cellSize,
            y + this.cellSize,
            x,
            y + this.cellSize,
            mapLine,
            gridGeometry
          );
          addLine(x, y + this.cellSize, x, y, mapLine, gridGeometry);
        }
      }
    };

    const mappings = [mapLineY];
    for (let mp of mappings) {
      if (this.needGrid) planeGrid(mp);
    }

    addLine(-100, 0, 100, 0, mapLineY, xAxiesGeometry);
    addLine(0, -100, 0, 100, mapLineZ, yAxiesGeometry);
    addLine(0, -100, 0, 100, mapLineY, zAxiesGeometry);

    let lines = new THREE.LineSegments(gridGeometry, this.gridMaterial);
    this.scene.add(lines);
    this.scene.add(new THREE.LineSegments(xAxiesGeometry, this.xAxiesMaterial));
    this.scene.add(new THREE.LineSegments(yAxiesGeometry, this.yAxiesMaterial));
    this.scene.add(new THREE.LineSegments(zAxiesGeometry, this.zAxiesMaterial));
  }

  update(){
    // 
  }
}
