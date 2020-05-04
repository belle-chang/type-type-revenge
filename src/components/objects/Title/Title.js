import { Mesh } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { ResourceTracker } from 'tracker';


// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as THREE from 'three';


class Title extends Mesh {
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


    // // figure out how to make it fill with color when pressed...
    // isTyped() {
    //     // debugger;
    //     // let update_material = this.tracker.track(new THREE.MeshPhongMaterial( 
    //     //     { color: this.color, specular: 0xffffff }
    //     // ));
    // }

    // // dispose of letter and its target after it falls out of frame
    // dispose() {
    //     this.tracker.dispose();
    //     // need to add a null check for some reason
    //     if (this.parent !== null) {
    //         this.parent.allPositions.clear(this.coords.x);
    //         // DECIDE WHETHER OR NOT TO USE A SET OR AN ARRAY -- WITH ARRAY WE ARE BANKING ON
    //         // THE "THIS" OBJECT TO BE AT THE BEGINNING OF THE ARRAY. 
    //         // set might be more expensive to add to tho???
    //         this.parent.state.updateSet.delete(this);
    //         this.parent.state.lettersOnScreen.shift();
    //         this.parent.state.updateList.shift();
    //         this.parent.remove(this);
    //         this.target.dispose();
    //     }
    // }

    // // MOVE FALL TO update() FOR IT TO AUTOMATICALLY FALL!
    // fall() {

    //     // Use timing library for more precice "bounce" animation
    //     // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
    //     // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
    //     const fallDown = new TWEEN.Tween(this.position)
    //         .to({ y: -40 }, 5000);

    //     fallDown.start();
    //     // after letter finishes falling down, dispose of it
    //     fallDown.onComplete(() => this.dispose());

    // }

    // addTarget(target) {
    //     this.target = target;
    // }

    // update(timeStamp, target) {
    //     // Bob back and forth

    //     // add null check -- idk why but it needs this
    //     if (this.parent != null && !this.scoreAccountedFor) {
    //         // if falling letter hits its corresponding target object when the correct key is pressed, flash bright background color
    //         if (this.position.y < -1 * (this.coords.y + Math.abs(target.coords.y)) + 1
    //             && this.position.y > -1 * (this.coords.y + Math.abs(target.coords.y)) - 1
    //             && this.parent.key == this.name) {
    //             // new background color is a toned down version of the letter color (orig color is too bright)
    //             // this.parent.background = this.textMesh.material.color.clone().addScalar(-0.4);
    //             this.parent.score.update();
    //             this.scoreAccountedFor = true;

    //           // trying to figure out how to make letter glow lol, to no avail
    //             // this.target.children[0].material.color = new THREE.Color(0xff0000);
    //             // this.target.changeColor(this.textMesh.material.color.clone());
    //             this.target.geoToSolid(this.color);
    //             this.parent.key = ""
    //         }
    //         // // return to black background once letter passes through target
    //         if (this.position.y < -1 * (this.coords.y + Math.abs(target.coords.y) + 2)
    //                 && this.position.y > -24
    //                 && this.parent.key != this.name) {
    //             this.target.changeColor(0xff0000);
    //             this.parent.score.reset();
    //         }
    //     }
    //     // else if (this.parent != null && this.scoreAccountedFor) {
    //     //     if (this.position.y < -1 * (this.coords.y + Math.abs(target.coords.y) + 2)
    //     //             && this.position.y > -24
    //     //             && this.parent.key != this.name) {
    //     //         this.target.changeColor(0xff0000);
    //     //         this.parent.score.reset();
    //     //     }
    //     // }

    //     // Advance tween animations, if any exist
    //     TWEEN.update();
    //     // let it fall automatically
    //     this.fall();
    // }
    update() {
        // Bob back and forth
        this.rotation.z = 0.05 * Math.sin(timeStamp / 300);

        // Advance tween animations, if any exist
        // TWEEN.update();
        // uncomment this to move it automatically
        // this.move();

    }
}

export default Title;
