import * as THREE from "three";

import Projection3D from "../model/Projection3D";

export default class CubicProgram {
  constructor(renderer, scene, model, mappings) {
    this.model = model;
    this.renderer = renderer;
    this.scene = scene;
    this.mappings = mappings; // Optional
    this.needGrid = true;
    this.needAxies = true;

    this.meshes = [];
    this.gridMaterial = new THREE.LineBasicMaterial({
      color: 0xaaaaaa,
    });
    this.xAxiesMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 2,
    });
    this.yAxiesMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 2,
    });
    this.zAxiesMaterial = new THREE.LineBasicMaterial({
      color: 0x0000ff,
      linewidth: 2,
    });

    this.cellSize = 1;
    this.materialsMap = new Map();
  }

  _buildCurveMesh() {
    if (!this.model) {
      return;
    }

    this.cleanCurveMesh();

    this.totalSize = this.cellSize * this.model.matrixSize;
    this.projection = new Projection3D(this.model, 1, this.mappings);
    this.projection.calcData();
    this.data = this.projection.projData;

    const getMatrerial = (color) => {
      let existing = this.materialsMap.get(color);

      if (existing) {
        return existing;
      } else {
        let material = new THREE.MeshLambertMaterial({
          color: new THREE.Color(color.r / 255, color.g / 255, color.b / 255),
        });
        this.materialsMap.set(color, material);
        return material;
      }
    };

    let geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
    for (let box of this.data) {
      const x = -this.totalSize / 2 + (box.x + 1 / 2) * this.cellSize;
      const y = -this.totalSize / 2 + (box.y + 1 / 2) * this.cellSize;
      const z = -this.totalSize / 2 + (box.z + 1 / 2) * this.cellSize;
      const mat = getMatrerial(box.color);
      const mesh = new THREE.Mesh(geometry, mat);
      this.meshes.push(mesh);
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
    }
  }

  buildScene() {
    console.log('Building scene');
    this.light = new THREE.DirectionalLight(0xeeeeee, 0.65);
    this.globalLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.05);
    this.light.position.set(0, 0, 1).normalize();
    this.light.castShadow = true;
    this.scene.add(this.light);
    this.scene.add(this.globalLight);

    performance.mark('grid')
    this._buildGrid();
    performance.mark('curve')
    this._buildCurveMesh();
    performance.mark('finish');

    console.table([
      performance.measure('grid', 'curve'),
      performance.measure('curve', 'finish')
    ]);
  }

  updateLight(pos) {
    this.light.position.set(pos.x, pos.y, pos.z).normalize();
  }

  cleanCurveMesh() {
    console.log("Cleaning curve mesh", this.meshes.length);

    for (const mesh of this.meshes) {
      if (!mesh) {
        continue;
      }

      try {
        mesh.geometry?.dispose();
        this.scene.remove(mesh);
      } catch (error) {
        console.warn("Failed to dispose mesh.", mesh, error);
      }
    }

    for (const material of this.materialsMap.values()) {
      try {
        material?.dispose();
      } catch (error) {
        console.warn("Failed to dispose material.", material, error);
      }
    }

    this.meshes = [];
  }

  _buildGrid() {
    // const mapLineX = (x, y) => new THREE.Vector3(0, x, y);
    const mapLineY = (x, y) => new THREE.Vector3(x, 0, y);
    const mapLineZ = (x, y) => new THREE.Vector3(x, y, 0);

    const gridGeometry = new THREE.BufferGeometry();
    const xAxiesGeometry = new THREE.BufferGeometry();
    const yAxiesGeometry = new THREE.BufferGeometry();
    const zAxiesGeometry = new THREE.BufferGeometry();

    const gridPositions = [];
    const xAxisPositions = [];
    const yAxisPositions = [];
    const zAxisPositions = [];

    const addLine = (x1, y1, x2, y2, mapLine, positions) => {
      const a = mapLine(x1, y1);
      const b = mapLine(x2, y2);
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    };

    const totalCells = 50;

    const drawGrid = (mapLine) => {
      for (let i = -totalCells; i <= totalCells; i++) {
        const a = i * this.cellSize;
        const b = totalCells * this.cellSize;
        addLine(a, -b, a, b, mapLine, gridPositions);
        addLine(-b, a, b, a, mapLine, gridPositions);
      }
    };

    const mappings = [mapLineY];
    for (let mp of mappings) {
      if (this.needGrid) {
        drawGrid(mp);
      }
    }
    
    addLine(-100, 0, 100, 0, mapLineY, xAxisPositions);
    addLine(0, -100, 0, 100, mapLineZ, yAxisPositions);
    addLine(0, -100, 0, 100, mapLineY, zAxisPositions);

    gridGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(gridPositions, 3)
    );
    gridGeometry.computeBoundingSphere();

    xAxiesGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(xAxisPositions, 3)
    )
    xAxiesGeometry.computeBoundingSphere();

    yAxiesGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(yAxisPositions, 3)
    )
    yAxiesGeometry.computeBoundingSphere();

    zAxiesGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(zAxisPositions, 3)
    )
    zAxiesGeometry.computeBoundingSphere();

    let lines = new THREE.LineSegments(gridGeometry, this.gridMaterial);
    this.scene.add(lines);
    this.scene.add(new THREE.LineSegments(xAxiesGeometry, this.xAxiesMaterial));
    this.scene.add(new THREE.LineSegments(yAxiesGeometry, this.yAxiesMaterial));
    this.scene.add(new THREE.LineSegments(zAxiesGeometry, this.zAxiesMaterial));
  }
}
