import React from "react";
import { connect } from "react-redux";

import { Action } from "Root/Constants";
import TrackCam from "Lib/TrackCam";
import * as THREE from "three";

const ViewBoxStyle = ViewBox => {
  return {
    width: ViewBox.props.width,
    height: ViewBox.props.height
  };
};

class ThreeWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(this.props.width, this.props.height);
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.canvasPlaceholder = React.createRef();
  }

  componentDidMount() {
    const mount = this.canvasPlaceholder.current;
    mount.appendChild(this.renderer.domElement);
    this.setState();
  }

  clearScene(){
    if(!this.scene)
      return;
    // TODO fix memory leak
    console.log("clearing");
    if(this.scene){
      const scene = this.scene;
      for ( let i = scene.children.length - 1; i >= 0 ; i-- ) {
        const obj = scene.children[i];

        if(obj.geometry){
          obj.geometry.dispose();
        }
        if(obj.material){
          obj.material.dispose();
        }
        if(obj.texture){
          obj.texture.dispose();
        }
        scene.remove(obj);
        delete scene.children[i];
      }
    }

    delete this.scene
  }

  updateImage(renderer) {
    this.props.updateImage(renderer.domElement.toDataURL());
  }

  render() {
    this.clearScene()

    const placeHolder = (
      <div style={ViewBoxStyle(this)} ref={this.canvasPlaceholder} />
    );

    const mount = this.canvasPlaceholder.current;


    if (!mount) return placeHolder;

    let camera;
    if (!this.props.camera) {
      camera = new TrackCam(
        this.props.width,
        this.props.height,
        this.props.camType,
        this.props.i
      );
    } else camera = this.props.camera;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.8, 0.8, 0.8);

    camera.setup(mount);

    // console.log("rendering ");
    // this.clear();
    // console.log(this.camera);

    camera.addSubscriber(() => {
      //this.program.update(this.camera.camera);
      this.renderer.render(scene, camera.camera);
      this.props.program.update();
    });

    this.renderer.setSize(this.props.width, this.props.height);
    this.props.program.setup(this.renderer, scene, camera.camera);
    this.props.program.render();
    camera.update(this.renderer, scene);

    this.updateImage(this.renderer);
    this.scene = scene
    //console.log(this.camera.camera.aspect);
    return placeHolder;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  updateImage: img =>
    dispatch({
      type: Action.UPDATE_IMAGE,
      image: img
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThreeWrapper);
