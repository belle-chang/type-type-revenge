import { Group } from 'three';
import { Mesh } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { ResourceTracker } from 'tracker';


// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as THREE from 'three';


class Target extends Mesh {
    constructor(parent, letter, x) {
        // Call parent Group() constructor
        super();

        // create resource tracker for disposing objects
        this.tracker = new ResourceTracker();
        const track = this.tracker.track.bind(this.tracker);
        // set parent to remove letter from scene
        this.parent = parent;

        this.state = {
            gui: parent.state.gui
        };

        // name of letter
        this.name = letter;

        // randomize position between top left corner and top right corner of the screen
        // added here in order to access in SeedScene.js to create corresponding target object
        this.coords = new THREE.Vector3(x, -9, 0);

        // load font for textgeometry
        var loader = new THREE.FontLoader();

        // FOR SOME REASON, CANNOT LOAD FONTS FROM LOCAL FOLDERS... 
        // RESOLVE THIS BY UPLOADING TO GITHUB, USE "RAW" FILES
        // loader.load("src/components/objects/letter/fonts/ncaa.json", (font) => {
        loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json', (font) => {

            var textGeo = track(new THREE.TextGeometry(letter, {

                font: font,
                size: 2,
                height: .25,
                curveSegments: 2

            }));
            textGeo.center();

            this.normalGeometry = textGeo;

            // add geometry -- edges
            var geo = track(new THREE.EdgesGeometry( textGeo ));
            // add material
            var mat = track(new THREE.LineBasicMaterial( { color: "rgb(150,150,150)", linewidth: 0.5 } ));
            // create mesh
            let textMesh = track(new THREE.LineSegments(geo, mat));

            // position between top left corner and top right corner of the screen
            textMesh.position.set(x, -9, 0);
            textMesh.rotateY(Math.PI / 9);

            // add mesh to scene
            this.add(textMesh);

        });

        parent.addToUpdateListTarget(this);

        // Populate GUI
        // this.state.gui.add(this.state);
    }

    // figure out how to make it fill with color when pressed...
    isTyped() {

    }

    // dispose of letter after it falls out of frame
    dispose() {
        this.tracker.dispose();
        this.parent.state.updateListTarget.shift();
        this.parent.remove(this);
    }
    

    fall() {

        // Use timing library for more precice "bounce" animation
        // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        const fallDown = new TWEEN.Tween(this.position)
            .to({ y: -24 }, 5000);

        fallDown.start();
        // after letter finishes falling down, dispose of it
        fallDown.onComplete(() => this.dispose());
        
    }

    move() {
        const fallDown = new TWEEN.Tween(this.position)
        .to({ y: -45 }, 10000).start();
        // fallDown.start();
        // after letter finishes falling down, dispose of it
        fallDown.onComplete(() => this.dispose());
    }

    update(timeStamp) {
        // Bob back and forth
        // this.rotation.z = 0.05 * Math.sin(timeStamp / 300);

        // Advance tween animations, if any exist
        TWEEN.update();
        // uncomment this to move it automatically
        // this.move();

    }
}

export default Target;
