import { Mesh } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { ResourceTracker } from 'tracker';


// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as THREE from 'three';


class Letter extends Mesh {
    constructor(parent, letter, x, color) {
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
        // var newx = parent.allPositions.add();
        this.coords = new THREE.Vector3(x, parent.height, 0);

        // load font for textgeometry
        var loader = new THREE.FontLoader();
        // const json = require('json-loader!./fonts/ncaa.json');


        this.color = color;

        // FOR SOME REASON, CANNOT LOAD FONTS FROM LOCAL FOLDERS... 
        // RESOLVE THIS BY UPLOADING TO GITHUB, USE "RAW" FILES
        // loader.load("/components/objects/letter/fonts/ncaa.json", (font) => {
        loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json', (font) => {

            var textGeo = track(new THREE.TextGeometry(letter, {

                font: font,
                size: 2,
                height: .25,
                curveSegments: 2

            }));
            textGeo.center();

            this.normalGeometry = textGeo;

            // this.color = getPastelColor(x, parent);
            
            // add geometry -- edges
            var geo = track(new THREE.EdgesGeometry( textGeo ));
            // add material
            var mat = track(new THREE.LineBasicMaterial( { color: this.color, linewidth: 1.5 } ));
            // create mesh
            let textMesh = track(new THREE.LineSegments(geo, mat));
            // randomize position between top left corner and top right corner of the screen
            // let newx = getRandomInt(-22, 22);
            textMesh.position.set(x, parent.height,0);
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
        function getPastelColor(x, parent) {
          // Uncomment code below to do random colors based on sections of the screen
          // let numSections = 3;
          // let offset = numSections - 1;
          // let fraction = (x - parent.allPositions.minx) / 
          //                 (parent.allPositions.maxx - parent.allPositions.minx);
          // for (let i = numSections - 1; i >= 1; i--) {
          //   if (fraction < i/numSections) offset = i-1;
          // }
          // return (
          //   "hsl(" +
          //   Math.floor(360 * (Math.random()/numSections + offset/numSections)) +
          //   "," +
          //   Math.floor(25 + 70 * (Math.random()/numSections + offset/numSections)) +
          //   "%," +
          //   Math.floor(45 + (Math.random()/numSections + offset/numSections)) +
          //   "%)"
          // );

          // Uncomment code below to do color based on continuous fraction of the x coordinate
          return (
            "hsl(" +
            Math.floor(360 * (x - parent.allPositions.minx) / 
                             (parent.allPositions.maxx - parent.allPositions.minx)) +
            "," +
            Math.floor(25 + 70 * (x - parent.allPositions.minx) / 
                             (parent.allPositions.maxx - parent.allPositions.minx)) +
            "%," +
            Math.floor(45 + (x - parent.allPositions.minx) / 
                             (parent.allPositions.maxx - parent.allPositions.minx)) +
            "%)"
          );}

        parent.addToUpdateList(this);
        parent.addToLettersOnScreen(letter);
        parent.addToUpdateSet(this);

        this.scoreAccountedFor = false;

        // Populate GUI
        // this.state.gui.add(this.state, 'fall');
    }


    // figure out how to make it fill with color when pressed...
    isTyped() {
        // debugger;
        // let update_material = this.tracker.track(new THREE.MeshPhongMaterial( 
        //     { color: this.color, specular: 0xffffff }
        // ));
    }

    // dispose of letter and its target after it falls out of frame
    dispose() {
        this.tracker.dispose();
        // need to add a null check for some reason
        if (this.parent !== null) {
            this.parent.allPositions.clear(this.coords.x);
            // DECIDE WHETHER OR NOT TO USE A SET OR AN ARRAY -- WITH ARRAY WE ARE BANKING ON
            // THE "THIS" OBJECT TO BE AT THE BEGINNING OF THE ARRAY. 
            // set might be more expensive to add to tho???
            this.parent.state.updateSet.delete(this);
            this.parent.state.lettersOnScreen.shift();
            this.parent.state.updateList.shift();
            this.parent.remove(this);
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

    addTarget(target) {
        this.target = target;
    }

    update(timeStamp, target) {
        // Bob back and forth

        // add null check -- idk why but it needs this
        if (this.parent != null && !this.scoreAccountedFor) {
            // if falling letter hits its corresponding target object when the correct key is pressed, flash bright background color
            if (this.position.y < -1 * (this.coords.y + Math.abs(target.coords.y)) + 1
                && this.position.y > -1 * (this.coords.y + Math.abs(target.coords.y)) - 1
                && this.parent.key == this.name) {
                // new background color is a toned down version of the letter color (orig color is too bright)
                // this.parent.background = this.textMesh.material.color.clone().addScalar(-0.4);
                this.parent.score.update();
                this.scoreAccountedFor = true;

              // trying to figure out how to make letter glow lol, to no avail
                // this.target.children[0].material.color = new THREE.Color(0xff0000);
                // this.target.changeColor(this.textMesh.material.color.clone());
                this.target.geoToSolid(this.color);
                this.parent.key = ""
            }
            // // return to black background once letter passes through target
            if (this.position.y < -1 * (this.coords.y + Math.abs(target.coords.y) + 2)
                    && this.position.y > -24
                    && this.parent.key != this.name) {
                this.target.changeColor(0xff0000);
                this.parent.score.reset();
            }
        }
        // else if (this.parent != null && this.scoreAccountedFor) {
        //     if (this.position.y < -1 * (this.coords.y + Math.abs(target.coords.y) + 2)
        //             && this.position.y > -24
        //             && this.parent.key != this.name) {
        //         this.target.changeColor(0xff0000);
        //         this.parent.score.reset();
        //     }
        // }

        // Advance tween animations, if any exist
        TWEEN.update();
        // let it fall automatically
        this.fall();
    }
}

export default Letter;
