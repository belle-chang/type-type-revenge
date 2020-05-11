import { Group } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { ResourceTracker } from 'tracker';


// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as THREE from 'three';


class Key extends Group {
    constructor(height, letter) {
      super();
      this.tracker = new ResourceTracker();
      const track = this.tracker.track.bind(this.tracker);

      // https://stackoverflow.com/questions/49481332/how-to-create-3d-trapezoid-in-three-js
      var key_geometry = track(new THREE.CylinderGeometry( 0.8 / Math.sqrt( 2 ), 1 / Math.sqrt( 2 ), .5, 4, 1 )); // size of top can be changed
      key_geometry.rotateY( Math.PI / 4 );
      key_geometry.rotateX( Math.PI / 2 );
      // key_geometry.rotateX( Math.PI / 5 );
      key_geometry.computeFlatVertexNormals();
      // var key_material = track(new THREE.MeshNormalMaterial());
      // Then, when you create the mesh, you can scale it:

      var material = track(new THREE.MeshPhongMaterial( { ambient: 0x050505, color: 0xfcfce8, specular: 0x555555, shininess: 30 } ));


      let key_mesh = track(new THREE.Mesh( key_geometry, material ));
      this.state = {};
      this.state.key = key_mesh;
      

      key_mesh.scale.set( 2.5, 2.5, 2.5 );
      this.add(key_mesh);

      var loader = new THREE.FontLoader();
      loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json', (font) => {
        var textGeo0 = track(new THREE.TextGeometry(letter, {
            font: font,
            size: 1.5,
            height: .5,
            curveSegments: 2
        }));
        textGeo0.center();
  
        // add material
        var mat0 = track(new THREE.MeshNormalMaterial());
        // create mesh
        let textMesh0 = track(new THREE.Mesh(textGeo0, mat0));
        // randomize position between top left corner and top right corner of the screen
        // let newx = getRandomInt(-22, 22);
        // textMesh0.position.set(-.2, .5, 0);
        textMesh0.position.set(0,0,.85);
        // console.log(key_mesh.position);
        // textMesh0.rotateZ(Math.PI / 9);
        // textMesh0.rotateX( -Math.PI / 3.25 );
        // textMesh0.rotateZ( Math.PI / 4 );

        this.state.letter = textMesh0;
        this.add(textMesh0);
      });

      // this.rotateY();
      // this.rotateX(-Math.PI / 4.5);
      this.rotateX(- Math.PI/.5);
      this.rotateY(Math.PI/7);
      // this.rotateX(Math.PI / 5);

      // this.rotateZ(.1);
      // this.scale.set(1,1,1);      
      this.position.set(0,1,0)
      
    }  

    dispose() {
      this.tracker.dispose();
    }

    rotate() {
      const rt = new TWEEN.Tween( this.rotation ).to( {  y:0}, 1000 ).start()
    }

    impress() {
      const impress = new TWEEN.Tween(this.state.letter.position).to({ z: .38 }, 1000);
      // const impress = new TWEEN.Tween(this.state.letter.position).to({ z: 0 }, 1000);
      console.log("executing");
      impress.start();
      // after letter finishes falling down, dispose of it
      impress.onComplete(() => this.rotate());
      // this.fallDown = fallDown;

    }

    update() {
        // Bob back and forth
        // this.rotation.z = 0.05 * Math.sin(timeStamp / 300);

        // Advance tween animations, if any exist
        TWEEN.update();
        this.impress();
    }
}

export default Key;
