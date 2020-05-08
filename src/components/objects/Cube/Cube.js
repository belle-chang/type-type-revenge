import { Group } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import MODEL from './Cube.obj';
import MATERIAL from './Cube.mtl';
import * as THREE from "three";

class Cube extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        this.name = 'cube';
        // var loader = new THREE.CubeTextureLoader();
        // loader.setPath( '' );

        // var textureCube = loader.load( [
        //     'Motorcycle.png', 'Motorcycle.png',
        //     'Motorcycle.png', 'Motorcycle.png',
        //     'Motorcycle.png', 'Motorcycle.png'
        // ] );
        var cubeMat = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.5, 
            metalness: 1, 
            // envMap: textureCube
            
        });
        var material = new THREE.MeshPhongMaterial( { 
            color: 0x696969,
            // envMap: envMap, // optional environment map
            specular: 0xffffff,
            shininess: 10
        } ) 
        // Load material and object
        const objloader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        objloader.setMaterials(mtlLoader.parse(MATERIAL)).load(MODEL, (obj) => {
            // Set base transformation
            obj.scale.multiplyScalar(0.5);
            obj.translateY(parent.height - 4);
            obj.rotateZ(Math.PI/6);
            obj.rotateX(-0.2);
            // obj.rotateY(Math.PI);
            // obj.children[0].material = cubeMat;
            // obj.children[1].material = cubeMat;
            // obj.children[2].material = cubeMat;
            obj.children[0].material = material;
            obj.children[1].material = material;
            obj.children[2].material = material;
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
