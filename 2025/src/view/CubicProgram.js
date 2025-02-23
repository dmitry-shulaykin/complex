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

    this.curveMeshes = [];

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
      console.warn("No model passed");
      return;
    }

    this.clearCurveMesh();

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

    
    const chunks = new Map();
    for (const box of this.data) {
      const index = "c" + box.curve + "f" + box.formula;
      const chunk = chunks.get(index);
      if (!chunk) {
        chunks.set(index, [box]);
      } else {
        chunks.get(index).push(box);
      }
    }

    const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);

    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);

    for (const [_chunkLabel, data] of chunks) {
      const material = getMatrerial(data[0].color);
      const mesh = new THREE.InstancedMesh(geometry, material, data.length);
      let counter = 0;
      for (const box of data) {
        const x = -this.totalSize / 2 + (box.x + 1 / 2) * this.cellSize;
        const y = -this.totalSize / 2 + (box.y + 1 / 2) * this.cellSize;
        const z = -this.totalSize / 2 + (box.z + 1 / 2) * this.cellSize;
        const position = new THREE.Vector3(x, y, z);
        const m = new THREE.Matrix4();
        mesh.setMatrixAt(counter, m.compose(position, quaternion, scale))
        counter += 1;
      }
      this.scene.add(mesh);
      this.curveMeshes.push(mesh);
    }
  }

  buildScene() {
    console.log("Building scene");
    this.light = new THREE.DirectionalLight(0xeeeeee, 0.65);
    this.globalLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.05);
    this.light.position.set(0, 0, 1).normalize();
    this.light.castShadow = true;
    this.scene.add(this.light);
    this.scene.add(this.globalLight);

    performance.mark("grid-start");
    this._buildGrid();
    performance.mark("grid-end");
    console.table(performance.measure("grid-start", "grid-end"));

    this.buildModel();
  }

  buildModel() {
    performance.mark("curve-start");
    this._buildCurveMesh();
    performance.mark("curve-end");
    console.table(performance.measure("curve-start", "curve-end"));
  }

  updateLight(pos) {
    this.light.position.set(pos.x, pos.y, pos.z).normalize();
  }

  clear() {
    this.clearCurveMesh();
    this.clearGridMesh();
  }

  clearGridMesh() {
    this._clearMeshes(this.gridMeshes);

    this.gridMaterial.dispose();
    this.xAxiesMaterial.dispose();
    this.yAxiesMaterial.dispose();
    this.zAxiesMaterial.dispose();

    this.scene.remove(this.light);
    this.scene.remove(this.globalLight);
  }

  clearCurveMesh() {
    this._clearMeshes(this.curveMeshes);

    for (const mesh of this.curveMeshes) {
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

    this.materialsMap = new Map();
    this.curveMeshes = [];
  }

  _buildGrid() {
    // const mapLineX = (x, y) => new THREE.Vector3(0, x, y);
    const mapLineY = (x, y, positions) => positions.push(x, 0, y);
    const mapLineZ = (x, y, positions) => positions.push(x, y, 0);

    const gridPositions = [];
    const xAxisPositions = [];
    const yAxisPositions = [];
    const zAxisPositions = [];

    const addLine = (x1, y1, x2, y2, mapLine, positions) => {
      mapLine(x1, y1, positions);
      mapLine(x2, y2, positions);
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

    const mappings = [mapLineY /* mapLineZ */];
    for (let mp of mappings) {
      if (this.needGrid) {
        drawGrid(mp);
      }
    }

    addLine(-100, 0, 100, 0, mapLineY, xAxisPositions);
    addLine(0, -100, 0, 100, mapLineZ, yAxisPositions);
    addLine(0, -100, 0, 100, mapLineY, zAxisPositions);

    const gridGeometry = this._createGeometry(gridPositions);
    const xAxiesGeometry = this._createGeometry(xAxisPositions);
    const yAxiesGeometry = this._createGeometry(yAxisPositions);
    const zAxiesGeometry = this._createGeometry(zAxisPositions);

    const gridMesh = new THREE.LineSegments(gridGeometry, this.gridMaterial);
    const xAxisMesh = new THREE.LineSegments(xAxiesGeometry, this.xAxiesMaterial);
    const yAxisMesh = new THREE.LineSegments(yAxiesGeometry, this.yAxiesMaterial);
    const zAxisMesh = new THREE.LineSegments(zAxiesGeometry, this.zAxiesMaterial);

    this.scene.add(gridMesh);
    this.scene.add(xAxisMesh);
    this.scene.add(yAxisMesh);
    this.scene.add(zAxisMesh);

    this.gridMeshes = [
      gridMesh,
      xAxisMesh,
      yAxisMesh,
      zAxisMesh,
    ];
  }

  _clearMeshes(meshes) {
    console.log("Cleaning meshes, count: ", this.curveMeshes.length);
    for (const mesh of meshes) {
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
  }

  _createGeometry(positions) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.computeBoundingSphere();
    return geometry;
  }
}
