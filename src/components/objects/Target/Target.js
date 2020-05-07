import { Group, Color } from 'three';
import { Mesh } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { ResourceTracker } from 'tracker';


// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as THREE from 'three';


class Target extends Group {
    constructor(parent, letter, x, color) {
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
            var phong = track( new THREE.MeshLambertMaterial( {
                color: 0xffffff,
            } ));
            let mesh = track( new THREE.Mesh(textGeo, phong) );
            mesh.position.set(x, -1 * (parent.height - 3), 0);
            mesh.rotateY(Math.PI / 9);
            mesh.visible = false;
            this.add(mesh);

            // add geometry -- edges
            var geo = track(new THREE.EdgesGeometry( textGeo ));
            // add material
            var mat = track(new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 0.5 } ));
            // create mesh
            let textMesh = track(new THREE.LineSegments(geo, mat));

            // position between top left corner and top right corner of the screen
            // textMesh.position.set(x, -9, 0);
            textMesh.position.set(x, -1 * (parent.height - 3), 0);
            textMesh.rotateY(Math.PI / 9);

            // add mesh to scene
            this.add(textMesh);
            this.state.mesh = mesh;
            this.state.edgesMesh = textMesh;

        });

        parent.addToUpdateListTarget(this);
        parent.addToUpdateSetTarget(this);

    }

    geoToSolid(color) {
        let ind = color.lastIndexOf("%")
        let l = color.slice(ind - 2, ind);

        // darken color so it's not too bright 
        let new_color = color.replace(l, 9);
        this.state.mesh.material.color = new Color(new_color);
        this.state.mesh.visible = true;
    }

    changeColor(color) {
        this.state.edgesMesh.material.color = new Color(color);
    }

    // dispose of letter after it falls out of frame
    disposeTarget(reload) {
        // debugger;
        this.tracker.dispose();
        if (this.parent != null) {

            this.parent.state.updateSetTarget.delete(this);
            // if (reload) {
            //     this.parent.state.updateListTarget.pop()
            // }
            // if (!reload) {
            //     this.parent.state.updateListTarget.shift();
            // }
            this.parent.remove(this);
        }
    }
}

export default Target;
