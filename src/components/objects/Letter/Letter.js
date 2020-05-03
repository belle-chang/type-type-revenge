import { Group, Vector3 } from 'three';
import { Mesh } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { ResourceTracker } from 'tracker';


// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as THREE from 'three';


class Letter extends Mesh {
    constructor(parent, letter) {
        // Call parent Group() constructor
        super();

        // create resource tracker for disposing objects
        this.tracker = new ResourceTracker();
        const track = this.tracker.track.bind(this.tracker);
        // set parent to remove letter from scene
        this.parent = parent;


        this.state = {
            gui: parent.state.gui,
            fall: this.fall.bind(this),
            paused: false
        };
        // name of letter
        this.name = letter;

        // randomize position between top left corner and top right corner of the screen
        // added here in order to access in SeedScene.js to create corresponding target object
        // var newx = getRandomInt(-22, 22);
        var newx = parent.allPositions.add();
        this.coords = new THREE.Vector3(newx, 12, 0);

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
            this.color = getPastelColor();

            // add geometry -- edges
            var geo = track(new THREE.EdgesGeometry( textGeo ));
            // add material
            var mat = track(new THREE.LineBasicMaterial( { color: this.color, linewidth: 1.5 } ));
            // create mesh
            let textMesh = track(new THREE.LineSegments(geo, mat));
            // randomize position between top left corner and top right corner of the screen
            // let newx = getRandomInt(-22, 22);
            textMesh.position.set(newx, 12,0);
            textMesh.rotateY(Math.PI / 9);

            this.textMesh = textMesh;
            
            // add mesh to scene
            this.add(textMesh);

            // this.state.gui.add(this.state, 'fall');

        });


        // get random position for the mesh
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
        }

        // generate random pastel color
        function getPastelColor(){ 
            return "hsl(" + Math.floor(360 * Math.random()) + ',' +
                       Math.floor((25 + 70 * Math.random())) + '%,' + 
                       Math.floor((45 + Math.random())) + '%)'
          }

        parent.addToUpdateList(this);

        // Populate GUI
        // this.state.gui.add(this.state, 'fall');
    }

    // figure out how to make it fill with color when pressed...
    isTyped() {
        // debugger;
        // let update_material = this.tracker.track(new THREE.MeshPhongMaterial( 
        //     { color: this.color, specular: 0xffffff }
        // ));
        // this.target.geometry = update_material;
    }

    // dispose of letter and its target after it falls out of frame
    dispose() {
        this.tracker.dispose();
        // need to add a null check for some reason
        if (this.parent !== null) {
            this.parent.allPositions.clear(this.coords.x);
            this.parent.state.updateList.shift();
            this.parent.remove(this);
            // for some reson when i comment this out, it stops disposing of the targets :()
            this.target.dispose();
        }

    }

    // MOVE FALL TO update() FOR IT TO AUTOMATICALLY FALL!
    fall() {

        // Use timing library for more precice "bounce" animation
        // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        const fallDown = new TWEEN.Tween(this.position)
            .to({ y: -40 }, 5000);

        fallDown.start();
        // after letter finishes falling down, dispose of it
        fallDown.onComplete(() => this.dispose());
    }

    update(timeStamp, target) {
        // Bob back and forth
        // this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        this.target = target;

        // add null check -- idk why but it needs this
        if (this.parent != null) {
            // if falling letter hits its corresponding target object when the correct key is pressed, flash bright background color
            let correct = false;
            if (this.position.y < -1 * (this.coords.y + Math.abs(target.coords.y)) + 1
                && this.position.y > -1 * (this.coords.y + Math.abs(target.coords.y)) - 1
                && this.parent.key == this.name) {
                // new background color is a toned down version of the letter color (orig color is too bright)
                this.parent.background = this.textMesh.material.color.clone().addScalar(-0.4);
                correct = true;
                // this.isTyped();
            }
            
            // return to black background once letter passes through target
            else if (this.position.y < -1 * (this.coords.y + Math.abs(target.coords.y) - 1)
                    && this.position.y > -24) {
                this.parent.background = new THREE.Color(0x000000);
            }

            console.log(this.parent.state.updateList)

            // if falling letter hits corresponding key BUT INCORRECT KEY IS PRESSED --> show error bar
            // if (!correct && (this.parent.key != null) && (this.parent.key != "") && (this.parent.key != this.name)) {
            //     debugger;
            //     if (this.parent.incorrect != null) {
            //         this.parent.incorrect.visible = true;
            //         this.parent.key = "";
            //         setTimeout(() => this.parent.incorrect.visible = false, 300);
            //     }
            // }
        }

        // Advance tween animations, if any exist
        TWEEN.update();
        // uncomment this to move it automatically
        this.fall();
    }
}

export default Letter;
