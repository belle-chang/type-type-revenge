import * as Dat from 'dat.gui';
import { Scene, Color, AnimationObjectGroup } from 'three';
import { Letter, Target } from 'objects';
import { ResourceTracker } from 'tracker';
import { BasicLights } from 'lights';
import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { PositionFinder } from 'positioning';


class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            // gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            key: "",
            spheres: [],
            updateList: [],
            updateListTarget: [] // list of targets that correspond to objects in updateList
        };

        // add position tracker to ensure there aren't any overlapping letters
        this.allPositions = new PositionFinder(-22, 22);

        // Set background to a nice color
        // this.background = new Color(0x7ec0ee);
        this.background = new Color(0x000000);

        // Add meshes to scene
        const lights = new BasicLights();
        this.add(lights);
        // const letter1 = new Letter(this, "a");
        // const target1 = new Target(this, "a", letter1.coords.x);
        // const letter2 = new Letter(this, "b");
        // const target2 = new Target(this, "b", letter2.coords.x);
        // const letter3 = new Letter(this, "c");
        // const target3 = new Target(this, "c", letter3.coords.x);
        // this.add(lights, letter1, target1, letter2, target2, letter3, target3);
    
        // add a new random letter every second, stops after 10th letter to prevent overloading
        var id = setInterval(addLetter, 3000, this);

        function addLetter(scene) {
            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
            }
            let charCode = getRandomInt(97, 123);
            const letter = new Letter(scene, String.fromCharCode(charCode));
            const target = new Target(scene, String.fromCharCode(charCode), letter.coords.x);
            scene.add(letter, target);
            if (scene.state.updateList.length > 10) {
                clearInterval(id);
            }
        }

        // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        // add line for incorrect letter;
        this.tracker = new ResourceTracker();
        const track = this.tracker.track.bind(this.tracker);

        var error_bar = track( new THREE.Mesh(track(new THREE.BoxGeometry(48, .25, 0)), 
                                 track(new THREE.MeshBasicMaterial({color: "red", wireframe: false}))
                                ) );
        error_bar.position.set(0, -12.7, 0)
        error_bar.visible = false;
        this.incorrect = error_bar;
        this.add(error_bar);
         

        // rain effect
        setInterval(makeLine, 60, this);

        function makeLine(scene) {
            // get random position for the line
            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
            }
            
            // add resource tracker to dispose of lines once they have fallen out of the scene
            let rt = new ResourceTracker();
            const track = rt.track.bind(rt);

            // create new line segment object and add to top of scene
            var geometry = track( new THREE.Geometry() );
            var xPos = getRandomInt(-22, 22);
            var yPos = 16;
            var length = getRandomInt(0, 3);
            geometry.vertices.push(track( new THREE.Vector3(xPos, yPos, 0) ), track( new THREE.Vector3(xPos,yPos - length, 0) ));
            var material = track( new THREE.LineBasicMaterial( { color: "rgb(70,70,70)" } ) );
            var line = track( new THREE.LineSegments( geometry, material ) );
            scene.add(line);

            // animate line
            var start = { x : xPos , y : yPos };
            var target = { x : xPos , y : -19 };
            const tween = new TWEEN.Tween(start).to(target, 4500);
            tween.onUpdate(function(){
                line.position.y = start.y;
            });
            tween.start();

            // dispose of line and remove from scene
            tween.onComplete(() => {
                rt.dispose();
                scene.remove(line);
            });
        }
    }


    // add letter object to updateList
    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    // add target object to updateListTarget
    addToUpdateListTarget(object) {
        this.state.updateListTarget.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList, updateListTarget } = this.state;
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        // for (const obj of updateList) {
        //     obj.update(timeStamp);
        // }

        // update each object in updateList
        // passes in corresponding target object to check position values in Letter.js
        for (let i = 0; i < updateList.length; i++) {
            updateList[i].update(timeStamp, updateListTarget[i]);
        }
    }
}

export default SeedScene;
