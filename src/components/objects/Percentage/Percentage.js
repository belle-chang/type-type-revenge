import { Group } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { ResourceTracker } from 'tracker';


// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as THREE from 'three';


class Percentage extends Group {
    constructor(percentage) {
      super();
      this.tracker = new ResourceTracker();
      const track = this.tracker.track.bind(this.tracker);

      this.state ={};

      let colors = {
        red: "hsl(0,100%,15%)",
        orange: "hsl(30,100%,15%)",
        yellow: "hsl(60,100%,15%)",
        green: "hsl(110,100%,15%)",
        blue: "hsl(240,100%,15%)",
        indigo: "hsl(280,100%,15%)",
        violet: "hsl(320,100%,15%)"
      }

      var loader = new THREE.FontLoader();
      loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json', (font) => {
        var textGeo = track(new THREE.TextGeometry(percentage 
          + "%", {
            font: font,
            size: 5,
            height: .5,
            curveSegments: 2
        }));
        textGeo.center();
  
        // add material
        let color;
        if (percentage >= 90) color = colors.green;
        else if (percentage >= 70) color = colors.orange;
        else if (percentage >= 40) color = colors.yellow;
        else color = colors.red;

        var phong = track( new THREE.MeshLambertMaterial( {
          color: color,
        } ));
        var mat = track(new THREE.MeshNormalMaterial());
        // create mesh
        let textMesh = track(new THREE.Mesh(textGeo, phong));
        // randomize position between top left corner and top right corner of the screen
        // let newx = getRandomInt(-22, 22);
        // textMesh0.position.set(-.2, .5, 0);
        textMesh.position.set(0,-1,0);
        // console.log(key_mesh.position);
        // textMesh0.rotateZ(Math.PI / 9);
        // textMesh0.rotateX( -Math.PI / 3.25 );
        // textMesh0.rotateZ( Math.PI / 4 );

        this.state.percentage = textMesh;
        this.add(textMesh);
      });
      
    }  

    dispose() {
      this.tracker.dispose();
    }

    update() {
        // Bob back and forth
        // this.rotation.z = 0.05 * Math.sin(timeStamp / 300);

        // Advance tween animations, if any exist
        // TWEEN.update();
        // this.impress();
    }
}

export default Percentage;
