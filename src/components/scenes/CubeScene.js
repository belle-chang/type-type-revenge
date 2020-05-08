import { Scene, Color, AnimationObjectGroup } from "three";
import { Letter, Target, Title, Cube } from "objects";
import { ResourceTracker } from "tracker";
import { BasicLights } from "lights";
import * as THREE from "three";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import { PositionFinder } from "positioning";
import { HighScore } from "interface";
import SONG from "./grenade.json";

class CubeScene extends Scene {
  constructor(width, height) {
    // Call parent Scene() constructor
    super();
    // keeps track of whether or not the game is currently running
    this.running = false;
    this.height = height;
    this.width = width;
    // keep track of if game is now starting
    this.start = false;
    // Init state
    this.state = {
      // gui: new Dat.GUI(), // Create GUI for scene
      rotationSpeed: 1,
      key: "",
      updateList: [],
      updateSet: new Set(),
      updateListTarget: [], // list of targets that correspond to objects in updateList
      lettersOnScreen: [],
      timeoutList: [], // all variables set with timeouts,
      round: 0
    };

    // Set background to a nice color
    // this.background = new Color(0x7ec0ee);
    // this.background = transparent;

    // Add lights to scene
    const lights = new BasicLights();
    this.lights = lights;
    this.add(lights);

    // create title
    // const title = new Title(this);
    // this.title = title;
    // this.add(title);

    // Add cube to scene
    const cube = new Cube(this);
    this.add(cube);

  }

  // add letter object to updateList
  addToUpdateList(object) {
    this.state.updateList.push(object);
  }

  // add letter object to updateSet
  addToUpdateSet(object) {
    this.state.updateSet.add(object);
  }

  // add target object to updateListTarget
  addToUpdateListTarget(object) {
    this.state.updateListTarget.push(object);
  }

  addToLettersOnScreen(object) {
    this.state.lettersOnScreen.push(object);
  }

  dispose() {
    this.tracker.dispose();
    while (this.children.length > 2) {
      if (
        this.children[this.children.length - 1] == this.title ||
        this.children[this.children.length - 1] == this.lights
      )
        continue;
      if (this.children[this.children.length - 1] instanceof Letter) {
        this.children[this.children.length - 1].disposeLetter();
      }
      this.remove(this.children[this.children.length - 1]);
    }
  }

  disposeAll() {
    this.tracker.dispose();
    while (this.children.length > 0) {
      this.remove(this.children[0]);
    }
  }

  update(timeStamp) {
    // this.title.update(timeStamp);
    const { updateList, updateListTarget } = this.state;

    // for every 90 indices (30 notes) where info[i] = time, info[i+1] = note, info[i+2] = velocity
    // start game -- only runsonce
    if (this.start) {
      // if another game was currently running
      if (this.running) {
        // alright this is the ratchet solution to make sure we refresh the letters
        this.state.round += 1;
        // but also here's the proper garbage disposal stuff hopefully it works
        for (let i = 0; i < this.state.timeoutList; i++) {
          clearTimeout(this.state.timeoutList[i]);
        }
        this.dispose();
        this.state.updateList = [];
        this.state.updateSet.clear();
        this.state.updateListTarget = [];
        this.state.lettersOnScreen = [];
        this.state.timeoutList = [];
      }
      this.start = false;
      this.running = true;
      for (let i = 4; i < this.info.length; i += 2) {
        // assuming it takes 4000 ms for letter to fall to its target
        const fallTime = 4000;
        // obtain note from pitch
        let note = (parseInt(this.info[i].note) - 21) % 12;
        let third;
        // map note to corresponding section of the keyboard, update string of possible letters
        // TODO: generate xPos that corresponds to section on keyboard
        if (note >= 0 && note <= 3) {
          third = 0;
        } else if (note <= 7) {
          third = 1;
        } else {
          third = 2;
        }
        // add a random letter from "letters" string after specified time
        var timer = setTimeout(
          this.addLetter,
          parseInt(this.info[i].time) - fallTime,
          this,
          third,
          this.noteToColor[note],
          this.state.round
        );
        this.state.timeoutList.push(timer);
      }
    }

    // error bar logic
    if (this.key != "" && this.key != undefined) {
      // see if key pressed is any of the letters on the screen
      const found = this.state.lettersOnScreen.indexOf(this.key);
      // if not turn on error bar
      if (found == -1) {
        this.score.reset();
        this.incorrect.visible = true;
        //         this.parent.key = "";
        setTimeout(() => (this.incorrect.visible = false), 300);
      } else {
        // find letter
        let found_letter = updateList[found];
        // if found letter is before target, turn on error bar
        if (
          found_letter.position.y >
          -1 *
            (found_letter.coords.y + Math.abs(found_letter.target.coords.y)) +
            1.5
        ) {
          this.score.reset();
          this.incorrect.visible = true;
          this.key = "";
          setTimeout(() => (this.incorrect.visible = false), 300);
        }
        // if found letter has already been pressed, turn on error bar
        if (found_letter.target.state.mesh.visible) {
          this.score.reset();
          found_letter.target.changeColor(0xff0000);
          this.incorrect.visible = true;
          this.key = "";
          setTimeout(() => (this.incorrect.visible = false), 300);
        }
      }
    }

    // update each object in updateList
    // passes in corresponding target object to check position values in Letter.js
    for (let i = 0; i < updateList.length; i++) {
      updateList[i].update(timeStamp, updateListTarget[i]);

      // clear scene when game is over
      if (updateList.length == 0) {
        this.running = false;
        this.dispose();
        // ADD SCOREBOARD HERE!
      }
    }
  }
}

export default CubeScene;
