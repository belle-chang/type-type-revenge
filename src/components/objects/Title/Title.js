import { Group } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { ResourceTracker } from 'tracker';


// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as THREE from 'three';


class Title extends THREE.Group {
    constructor(height) {
      super();
      this.tracker = new ResourceTracker();
        const track = this.tracker.track.bind(this.tracker);

      var loader = new THREE.FontLoader();
      loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json', (font) => {
        var textGeo0 = track(new THREE.TextGeometry("welcome to", {
            font: font,
            size: 1,
            height: .25,
            curveSegments: 2
        }));
        textGeo0.center();
  
        // add material
        var mat0 = track(new THREE.MeshNormalMaterial());
        // create mesh
        let textMesh0 = track(new THREE.Mesh(textGeo0, mat0));
        // randomize position between top left corner and top right corner of the screen
        // let newx = getRandomInt(-22, 22);
        textMesh0.position.set(-7, height - 6, 0);
        textMesh0.rotateZ(Math.PI / 9);
  
        var textGeo1 = track(new THREE.TextGeometry("TYPE TYPE", {
            font: font,
            size: 2,
            height: .25,
            curveSegments: 2
        }));
        textGeo1.center();
  
        // add material
        var mat1 = track(new THREE.MeshNormalMaterial());
        // create mesh
        let textMesh1 = track(new THREE.Mesh(textGeo1, mat1));
        // randomize position between top left corner and top right corner of the screen
        // let newx = getRandomInt(-22, 22);
        textMesh1.position.set(-3, height - 7, 0);
        textMesh1.rotateZ(Math.PI / 9);
  
  
        var textGeo3 = track(new THREE.TextGeometry("REVENGE !", {
            font: font,
            size: 2,
            height: .25,
            curveSegments: 2
        }));
        textGeo3.center();
  
        // add material
        var mat3 = track(new THREE.MeshNormalMaterial());
  
        let textMesh3 = track(new THREE.Mesh(textGeo3, mat3));
        textMesh3.position.set(5, height - 7, 0);
        textMesh3.rotateZ(Math.PI / 9);
        // textMesh3.rotateY(Math.PI / 6);
        // add mesh to l_scene
        this.add(textMesh0)
        this.add(textMesh1);
        this.add(textMesh3);
      });
    }  

    update(timeStamp) {
        // Bob back and forth
        this.rotation.z = 0.05 * Math.sin(timeStamp / 300);

        // Advance tween animations, if any exist
        // TWEEN.update();
        // uncomment this to move it automatically
        // this.move();

    }
}

export default Title;
