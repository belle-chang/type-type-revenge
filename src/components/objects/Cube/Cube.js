import { Group } from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import MODEL from "./Cube.obj";
import MATERIAL from "./Cube.mtl";
import * as THREE from "three";

class Cube extends Group {
  constructor(parent) {
    // Call parent Group() constructor
    super();

    this.name = "cube";
    // var loader = new THREE.CubeTextureLoader();
    // loader.setPath( '' );

    // var textureCube = loader.load( [
    //     'Motorcycle.png', 'Motorcycle.png',
    //     'Motorcycle.png', 'Motorcycle.png',
    //     'Motorcycle.png', 'Motorcycle.png'
    // ] );
    var cubeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 1
      // envMap: textureCube
    });
    var cubeMaterial = new THREE.MeshPhongMaterial({
      // color: 0x696969,
      color: 0xf7a399,
      // envMap: envMap, // optional environment map
      specular: 0xffe3e0,
      shininess: 100
    });
    var textMaterial = new THREE.MeshPhongMaterial({
      color: 0xfe4a49,
      // envMap: envMap, // optional environment map
      specular: 0xffe3e0,
      shininess: 100
    });
    // Load material and object
    const objloader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    objloader.setMaterials(mtlLoader.parse(MATERIAL)).load(MODEL, obj => {
      // Set base transformation
      obj.scale.multiplyScalar(0.5);
      obj.translateY(parent.height - 4);
      obj.rotateZ(Math.PI / 5);
      //   obj.rotateX(-0.5);
      // obj.rotateY(Math.PI);
      // obj.children[0].material = cubeMat;
      // obj.children[1].material = cubeMat;
      // obj.children[2].material = cubeMat;

      obj.children[0].material = textMaterial; // type type revenge text
      obj.children[1].material = textMaterial; // initials text
      obj.children[2].material = cubeMaterial; // cube
      // console.log(obj.children);
      obj.matrixAutoUpdate = false;
      obj.updateMatrix();

      this.add(obj);
    });

    parent.addToUpdateList(this);
  }

  update() {
    this.rotateY(-0.02);
  }
}

export default Cube;
