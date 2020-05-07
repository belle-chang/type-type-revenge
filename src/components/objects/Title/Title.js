import { Group } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { ResourceTracker } from 'tracker';


// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as THREE from 'three';


class Title extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // create resource tracker for disposing objects
        this.tracker = new ResourceTracker();
        const track = this.tracker.track.bind(this.tracker);

        this.state = {
            gui: parent.state.gui,
            // fall: this.fall.bind(this),
            paused: false
        };

        // load font for textgeometry
        var loader = new THREE.FontLoader();

        this.color = "rgb(255,255,255)";

        // FOR SOME REASON, CANNOT LOAD FONTS FROM LOCAL FOLDERS... 
        // RESOLVE THIS BY UPLOADING TO GITHUB, USE "RAW" FILES
        // loader.load("/components/objects/letter/fonts/ncaa.json", (font) => {
        loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json', (font) => {

            // var textGeo = track(new THREE.TextGeometry("TAP TAP REVENGE", {
            //     font: font,
            //     size: 2,
            //     height: .25,
            //     curveSegments: 2
            // }));
            // textGeo.center();
            
            // // add geometry -- edges
            // var geo = track(new THREE.EdgesGeometry( textGeo ));
            // // add material
            // var mat = track(new THREE.LineBasicMaterial( { color: this.color, linewidth: 1.5 } ));
            // // create mesh
            // let textMesh = track(new THREE.LineSegments(geo, mat));
            // // randomize position between top left corner and top right corner of the screen
            // // let newx = getRandomInt(-22, 22);
            // textMesh.position.set(0, this.parent.height - 3, 0);
            // // textMesh.rotateZ(Math.PI / 12);
            // // textMesh3.rotateY(Math.PI / 6);
            // // add mesh to scene
            // this.add(textMesh);



            var textGeo1 = track(new THREE.TextGeometry("TYPE TYPE", {
                font: font,
                size: 2,
                height: .25,
                curveSegments: 2
            }));
            textGeo1.center();
            
            // add geometry -- edges
            var geo1 = track(new THREE.EdgesGeometry( textGeo1 ));
            // add material
            var mat1 = track(new THREE.LineBasicMaterial( { color: this.color, linewidth: 1.5 } ));
            // create mesh
            let textMesh1 = track(new THREE.LineSegments(geo1, mat1));
            // randomize position between top left corner and top right corner of the screen
            // let newx = getRandomInt(-22, 22);
            textMesh1.position.set(-5, this.parent.height - 4, 0);
            textMesh1.rotateZ(Math.PI / 9);
            // textMesh1.rotateY(Math.PI / 6);
            let textMesh2 = textMesh1.clone();
            textMesh2.position.x = - 3;
            textMesh2.position.y = this.parent.height - 3;
            // textMesh2.position.z = -5;

            var textGeo3 = track(new THREE.TextGeometry("REVENGE !", {
                font: font,
                size: 2,
                height: .25,
                curveSegments: 2
            }));
            textGeo3.center();
            
            // add geometry -- edges
            var geo3 = track(new THREE.EdgesGeometry( textGeo3 ));
            // add material
            var mat3 = track(new THREE.LineBasicMaterial( { color: this.color, linewidth: 1.5 } ));
            // create mesh
            let textMesh3 = track(new THREE.LineSegments(geo3, mat3));
            textMesh3.position.set(5, this.parent.height - 4, 0);
            textMesh3.rotateZ(Math.PI / 9);
            // textMesh3.rotateY(Math.PI / 6);
            // add mesh to scene
            this.add(textMesh1);
            // this.add(textMesh2);
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
