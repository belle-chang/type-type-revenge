import { Scene, Color, AnimationObjectGroup } from "three";
import { Letter, Target, Title, Cube } from "objects";
import { ResourceTracker } from "tracker";
import { BasicLights } from "lights";
import * as THREE from "three";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import { PositionFinder } from "positioning";
import { HighScore } from "interface";
import SONG0 from "./grenade.json";
import SONG1 from "./WiiThemeSong.json";

class SeedScene extends Scene {
  constructor(width, height) {
    // Call parent Scene() constructor
    super();

    this.score = new HighScore();

    // keeps track of whether or not the game is currently running
    this.running = false;

    // keep track of if game is now starting
    this.start = false;

    // keep track of if the game is paused
    this.pause = false;

    // keep track of difficulty (set to zero automatically)
    this.difficulty = 0;

    // use HSL instead of RGB so you can control the glow of the letters in target
    this.noteToColor = {
      0: "hsl(265, 26%, 81%)",
      1: "hsl(204, 100%, 33%)",
      2: "hsl(262, 83%, 51%)",
      3: "hsl(204, 57%, 80%)",
      4: "hsl(179, 33%, 73%)",
      5: "hsl(84, 53%, 59%)",
      6: "hsl(139, 48%, 88%)",
      7: "hsl(53, 100%, 71%)",
      8: "hsl(14, 89%, 69%)",
      9: "hsl(0, 72%, 53%)",
      10: "hsl(324, 100%, 46%)",
      11: "hsl(353, 84%, 88%)"
    };

    // Init state
    this.state = {
      // gui: new Dat.GUI(), // Create GUI for scene
      rotationSpeed: 1,
      key: "",
      updateSet: new Set(),
      updateSetTarget: new Set(),
      lettersOnScreenSet: new Set(),
      timeoutList: [], // all variables set with timeouts
      round: 0
    };

    // create title
    // const title = new Title(this);
    // this.title = title;
    // this.add(title);

    // add position tracker to ensure there aren't any overlapping letters
    this.width = width;
    this.height = height;
    // this.allPositions = new PositionFinder(
    //   -1 * (this.width - 2),
    //   this.width - 2
    // );
    this.allPositions = new PositionFinder(
      -(2.0 / 3.0) * this.width,
      (2.0 / 3.0) * this.width
    );

    // Set background to a nice color
    // this.background = new Color(0x7ec0ee);
    // this.background = new Color(0x000000);

    // Add lights to scene
    const lights = new BasicLights();
    this.lights = lights;
    this.add(lights);

    // Add cube to scene
    // const cube = new Cube(this);
    // this.add(cube);

    // rain effect
    this.rainColor = "rgb(70,70,70)"

    // keep track of which song should play
    this.song = 0;

    // add error bar for incorrect letter
    this.tracker = new ResourceTracker();
    const track = this.tracker.track.bind(this.tracker);
    var error_bar = track(
      new THREE.Mesh(
        track(new THREE.BoxGeometry(48, 0.25, 0)),
        track(new THREE.MeshBasicMaterial({ color: "red", wireframe: false }))
      )
    );
    error_bar.position.set(0, -1 * this.height - 0.25, 0);
    error_bar.visible = false;
    this.incorrect = error_bar;
    this.add(error_bar);
  }
  // ------------------------------------------------------------------------
  // END OF CONSTRUCTOR
  // ------------------------------------------------------------------------

  makeLine(scene, color) {
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
    var geometry = track(new THREE.Geometry());
    var xPos = getRandomInt(-1 * scene.width, scene.width);
    var yPos = scene.height + 4; // add "padding" to make lines start above the top of the screen
    var length = getRandomInt(0, 3);
    geometry.vertices.push(
      track(new THREE.Vector3(xPos, yPos, 0)),
      track(new THREE.Vector3(xPos, yPos - length, 0))
    );
    var material = track(
      new THREE.LineBasicMaterial({ color: color })
    );
    var line = track(new THREE.LineSegments(geometry, material));
    scene.add(line);

    // animate line
    var start = { x: xPos, y: yPos };
    var target = { x: xPos, y: -20 };
    const tween = new TWEEN.Tween(start).to(target, 4500);
    tween.onUpdate(function () {
      line.position.y = start.y;
    });
    tween.start();

    // dispose of line and remove from scene
    tween.onComplete(() => {
      rt.dispose();
      scene.remove(line);
    });
  }

  addLetter(scene, third, color, round) {
    if (round != scene.state.round) return;
    // narrow down width of game screen to 2/3 of computer screen
    let minX = scene.allPositions.minx;
    let maxX = scene.allPositions.maxx;
    // selects a random x position then randomly selects a character based on the x coordinate and number of sections
    // the order of possibleLetters is from left to right on the keyboard, the order matters for selecting
    function getRandomLetter(xPos) {
      let possibleLetters = "qazwsxedcrfvtgbyhnujmikolp";
      let numSections = 3;
      let offset = numSections - 1;
      let fraction = (xPos - minX) / (maxX - minX);
      for (let i = numSections - 1; i >= 1; i--) {
        if (fraction < i / numSections) offset = i - 1;
      }
      return possibleLetters[
        Math.floor((Math.random() / numSections + offset / numSections) * 26)
      ];
    }
    let xPos;
    let length = maxX - minX;
    if (third == 0) {
      xPos = scene.allPositions.add(minX, Math.floor(minX + length / 3));
    } else if (third == 1) {
      xPos = scene.allPositions.add(
        Math.floor(minX + length / 3),
        Math.floor(minX + (2 * length) / 3)
      );
    } else {
      xPos = scene.allPositions.add(Math.floor(minX + (2 * length) / 3), maxX);
    }

    // ensure different characters on the screen at all times
    // remove this if we want to support sentences
    let character = getRandomLetter(xPos);
    while (
      Array.from(scene.state.lettersOnScreenSet).find(
        element => element == character
      ) != undefined
    )
      character = getRandomLetter(xPos);

    const letter = new Letter(scene, character, xPos, color);
    const target = new Target(scene, character, letter.coords.x);
    letter.addTarget(target);

    scene.add(letter, target);
  }

  // add letter object to updateSet
  addToUpdateSet(object) {
    this.state.updateSet.add(object);
  }

  // add letter object to updateSet
  addToUpdateSetTarget(object) {
    this.state.updateSetTarget.add(object);
  }

  // add letter object to updateSet
  addToLettersOnScreenSet(object) {
    this.state.lettersOnScreenSet.add(object);
  }

  dispose() {
    this.tracker.dispose();
    this.state.updateSet.forEach((k, v) => v.disposeLetter());
    while (this.children.length > 1) {
      if (this.children[1] == this.lights) {
        continue;
      }
      this.remove(this.children[1]);
    }
    this.add(this.incorrect);
  }

  disposeAll() {
    this.tracker.dispose();
    while (this.children.length > 0) {
      this.remove(this.children[0]);
    }
  }

  update(timeStamp) {

    function getColor(){ 
      return "hsl(" + Math.floor(360 * Math.random()) + ',' +
                 (25 + Math.floor(70 * Math.random())) + '%,' + 
                 (45 + Math.floor(10 * Math.random())) + '%)'
    }
    if (this.score.streak >= 50) this.rainColor = 'hsl(153, 100%, 41%)'
    else if (this.score.streak >= 40) this.rainColor = 'hsl(107, 100%, 41%)'
    else if (this.score.streak >= 30) this.rainColor = 'hsl(87, 100%, 41%)'
    else if (this.score.streak >= 20) this.rainColor = "hsl(66, 100%, 41%)"
    else if (this.score.streak >= 10) this.rainColor = "hsl(47, 100%, 41%)"
    else this.rainColor = "rgb(70,70,70)"

    // if it's within 2 miliseconds in either direction, make rain
    if ((timeStamp - this.nextTime) < 100 || ((timeStamp - this.nextTime) > -100) && this.running) {
      // trying to figure out how to do a rainbow
      if (this.score.streak >= 60) this.makeLine(this, getColor());
      else this.makeLine(this, this.rainColor);
      this.nextTime = timeStamp + 80
    }
    // this.title.update(timeStamp);
    // const { updateList, updateListTarget } = this.state;

    // for every 90 indices (30 notes) where info[i] = time, info[i+1] = note, info[i+2] = velocity
    // start game -- only runsonce
    if (this.start) {
      // need to reset score/streak
      this.score.fullReset();
      // console.log(this.score.reset());
      // if another game was currently running
      if (this.running) {
        // alright this is the ratchet solution to make sure we refresh the letters
        this.state.round += 1;
        // but also here's the proper garbage disposal stuff hopefully it works
        for (let i = 0; i < 8; i++) {
          clearTimeout(this.state.timeoutList[i]);
        }
        this.dispose();
        this.state.updateSet.clear();
        this.state.updateSetTarget.clear();
        this.state.lettersOnScreenSet.clear();
        this.state.timeoutList = [];
      }
      this.start = false;
      this.running = true;
      let info;
      let delta;
      if (this.song == 0) {
        info = SONG0.notes;
        if (this.difficulty == 0) delta = 5;
        if (this.difficulty == 1) delta = 3;
        if (this.difficulty == 2) delta = 2;
      }
      else if (this.song == 1) {
        info = SONG1.notes;
        if (this.difficulty == 0) delta = 12;
        if (this.difficulty == 1) delta = 9;
        if (this.difficulty == 2) delta = 7;
      }
      
      for (let i = 6; i < info.length; i += delta) {
        // assuming it takes 4000 ms for letter to fall to its target
        const fallTime = 4000;
        // obtain note from pitch
        let note = (parseInt(info[i].note) - 21) % 12;
        let third;
        // map note to corresponding section of the keyboard, update string of possible letters
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
          parseInt(info[i].time) - fallTime,
          this,
          third,
          this.noteToColor[note],
          this.state.round
        );
        this.state.timeoutList.push(timer);
      }
      this.nextTime = timeStamp;
    }

    // error bar logic
    if (this.key != "" && this.key != undefined) {
      // see if key pressed is any of the letters on the screen
      const found = Array.from(this.state.lettersOnScreenSet).indexOf(this.key);
      // if not turn on error bar
      if (found == -1) {
        this.score.reset();
        this.incorrect.visible = true;
        setTimeout(() => (this.incorrect.visible = false), 300);
      } else {
        // find letter
        let found_letter = Array.from(this.state.updateSet)[found];
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
    for (let i = 0; i < this.state.updateSet.size; i++) {
      let current_letter = Array.from(this.state.updateSet)[i];
      current_letter.update(timeStamp, current_letter.target);

      // clear scene when game is over
      if (this.state.updateSet.size == 0) {
        this.running = false;
        this.dispose();
        this.score.displayScore();
      }
    }
  }
}

export default SeedScene;
