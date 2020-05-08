import { Group, SpotLight, AmbientLight, HemisphereLight } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0xffffff, 1.8, 50, Math.PI/2, 1, 2);
        const ambi = new AmbientLight(0x404040, 0.8);
        const hemi = new HemisphereLight(0xffffff, 0x191919, 1.3);

        dir.position.set(5, 1, 2);
        dir.target.position.set(0, 0, 0);

        this.add(ambi, hemi, dir);
    }
}

export default BasicLights;
