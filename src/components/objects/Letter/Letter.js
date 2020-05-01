import { Group } from 'three';
import { Mesh } from 'three';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as THREE from 'three';

class Letter extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        this.name = 'letter';
        var loader = new THREE.FontLoader();

        loader.load("src/components/objects/letter/fonts/ncaa.json", (font) => {

            var textGeo = new THREE.TextGeometry("A", {

                font: font,
                size: 5,
                height: .5,
                curveSegments: 5

            });
            textGeo.center();
            var textMat = new THREE.MeshPhongMaterial({color: 0x8123d9});

            var textMesh = new THREE.Mesh(textGeo, textMat);
            textMesh.position.y = 2.5;
            this.add(textMesh);
        

        });
    }
}

export default Letter;
