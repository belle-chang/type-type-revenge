import { Scene, Color, AnimationObjectGroup } from "three";
import { Letter, Target, Title } from "objects";
import { ResourceTracker } from "tracker";
import { BasicLights } from "lights";
import * as THREE from "three";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import { PositionFinder } from "positioning";
import { HighScore } from "interface";
import SONG from "./grenade.json";

class SeedScene extends Scene {
  constructor(width, height) {
    // Call parent Scene() constructor
    super();

    this.score = new HighScore();

    // keeps track of whether or not the game is still going on
    // or if it is over
    this.over = false;

    // keep track of if game has started
    this.start = false;

    // string version of json file, for now
    // this is star wars theme song
    const starwars =
      "7220 72 106 7223 36 113 7224 24 106 7225 57 122 7225 48 127 7229 40 126 7229 38 77 7278 38 77 7318 67 86 7318 60 90 7339 38 76 7398 38 73 7453 38 71 7479 72 92 7479 65 109 7519 38 70 7579 38 86 7638 74 95 7638 67 126 7638 40 117 7798 72 90 7798 65 97 7958 79 100 7958 67 126 7958 40 109 8118 40 117 8278 65 82 8439 67 103 8439 40 113 8598 72 117 8598 40 109 8758 38 95 8919 70 127 8919 40 109 9059 57 109 9079 48 127 9079 40 109 9238 77 74 9238 69 117 9239 38 82 9398 79 79 9398 67 106 9398 40 106 9558 84 113 9558 69 126 9558 38 62 9559 40 117 9598 38 57 9638 38 61 9679 38 59 9718 65 97 9719 38 55 9758 38 55 9799 38 52 9838 38 58 9879 67 126 9879 38 58 9918 38 70 9958 38 72 9999 38 74 10038 82 118 10038 40 113 10199 81 92 10199 60 90 10358 79 90 10359 65 106 10359 38 88 10518 81 106 10518 67 122 10518 43 117 10518 40 106 10679 77 77 10679 38 90 10838 79 106 10838 43 122 10838 40 97 10989 57 109 10998 24 109 10998 36 103 10998 48 127 11003 40 106 11158 65 95 11319 67 113 11479 69 127 11479 40 92 11634 40 95 11638 65 95 11798 67 122 11803 40 95 11958 38 65 11958 40 100 11999 38 59 12038 38 65 12079 38 66 12118 67 80 12118 60 106 12118 38 66 12158 38 66 12198 38 68 12239 38 73 12278 72 92 12278 65 103 12278 38 55 12318 38 64 12359 38 67 12398 38 80 12439 77 106 12439 67 113 12439 48 126 12439 40 95 12599 72 86 12599 69 109 12599 38 77 12758 79 113 12758 70 127 12758 48 122 12759 40 90 12909 57 113 12918 31 106 12919 43 109 12919 43 122 12923 38 97 13079 72 63 13079 69 100 13079 40 92 13239 77 84 13243 67 117 13243 38 80 13398 81 122 13398 31 97 13398 43 100 13398 43 100 13404 69 127 13404 40 103 13558 72 76 13558 31 95 13558 43 92 13559 43 97 13718 31 100 13718 43 103 13718 38 86 13718 43 126 13724 77 103 13878 67 117 13878 69 62 13878 38 76 13884 31 106 13884 43 113 13884 40 97 13884 43 113 13888 79 113 13918 38 73 13958 38 69 13999 38 65 14038 38 69 14078 38 68 14119 38 68 14158 38 69 14199 38 66 14233 38 67 14278 38 61 14319 38 71 14359 43 92 14359 31 100 14359 38 90 14359 43 106 14363 67 117 14363 79 113 14519 43 77 14519 31 92 14519 40 100 14519 43 100 14523 79 109 14523 67 106 14678 43 86 14678 31 90 14678 38 86 14678 43 106 14683 79 127 14683 67 122 14839 43 88 14839 60 122 14843 48 117 14843 52 103 14843 36 90 14843 40 109 14848 60 103 14849 36 100 14849 24 103 14849 48 126 14853 72 122 15318 60 103 15318 72 122 15318 40 100 15479 38 79 15638 40 80 15678 60 113 15678 72 106 15798 79 126 15798 67 122 15798 38 92 16118 48 86 16248 57 122 16278 40 109 16278 48 126 16519 65 86 16519 77 100 16598 38 97 16638 67 106 16638 79 106 16758 53 88 16758 46 112 16758 58 118 16764 69 109 16764 81 122 16764 62 106 16764 40 127 17078 77 106 17078 65 113 17233 79 103 17234 67 103 17238 55 103 17238 43 79 17238 52 97 17238 60 113 17243 67 117 17244 79 113 17244 36 88 17244 40 117 17323 81 77 17324 69 77 17324 57 77 17398 83 88 17398 71 88 17398 38 86 17403 59 88 17473 84 86 17473 72 86 17473 60 86 17533 86 100 17533 74 100 17538 62 100 17559 40 113 17603 88 90 17609 76 90 17609 64 90 17663 89 80 17669 77 80 17669 65 80 17718 38 82 17719 38 122 17738 91 82 17739 79 82 17744 67 82 17759 38 77 17798 38 80 17809 93 88 17809 81 88 17809 69 88 17838 38 77 17863 95 79 17868 83 79 17868 71 79 17878 38 76 17918 38 74 17938 96 95 17938 84 95 17938 72 95 17958 38 76 17998 38 76 18008 98 97 18009 86 97 18009 74 97 18038 38 77 18079 100 97 18079 88 97 18079 76 97 18079 38 77 18119 38 82 18123 101 88 18123 89 88 18123 77 88 18159 38 86 18188 103 106 18188 91 106 18194 79 106 18198 52 92 18198 43 74 18199 48 127 18204 79 117 18204 67 113 18204 60 117 18204 36 88 18204 38 74 18238 38 72 18278 38 74 18318 38 76 18359 38 74 18398 38 70 18438 38 71 18478 38 73 18518 67 100 18518 79 103 18518 38 80 18558 38 77 18598 38 79 18638 38 90 18678 70 112 18678 79 109 18678 38 127 18683 75 90 18684 82 86 19153 57 122 19158 46 106 19159 39 95 19159 63 126 19159 51 127 19164 58 126 19164 55 103 19164 40 122 19473 38 122 19639 67 103 19639 79 106 19639 38 76 19643 76 103 19643 72 95 19643 43 80 19643 48 122 19648 52 95 19648 60 127 19648 36 100 19648 40 126 19678 38 73 19718 38 71 19758 38 68 19798 38 72 19838 38 65 19878 38 68 19919 38 76 19958 38 76 19998 38 71 20039 38 72 20078 38 74 20118 67 109 20118 79 106 20118 76 100 20118 72 97 20123 38 76 20158 38 59 20199 38 71 20238 38 63 20278 38 73 20318 38 67 20358 38 72 20398 38 70 20439 67 106 20439 72 90 20439 76 95 20439 79 95 20443 38 77 20479 38 69 20518 38 80 20559 38 79 20598 63 126 20598 55 97 20598 51 127 20603 70 126 20603 46 112 20603 39 90 20603 40 127 20608 79 100 20609 75 86 20609 82 95 20918 39 95 20918 46 100 20918 63 127 20918 51 127 20924 82 83 20924 70 126 20924 75 83 20924 55 92 20924 38 122 20928 79 82 21078 57 106 21079 41 109 21079 38 72 21079 41 122 21083 81 92 21083 48 113 21083 65 122 21083 40 127 21088 72 106 21088 77 95 21088 84 97 21118 38 63 21158 38 79 21198 38 64 21239 38 79 21278 38 66 21319 38 79 21359 38 72 21398 38 74 21438 38 74 21479 38 80 21518 38 76 21558 59 46 21558 38 80 21598 38 61 21618 57 60 21639 38 76 21678 59 52 21678 38 64 21719 38 74 21739 57 64 21758 38 66 21799 59 60 21799 38 74 21839 38 62 21858 57 71 21878 38 71 21918 59 56 21918 38 69 21958 38 79 21978 57 62 21998 38 72 22038 59 58 22038 38 77 22078 38 56 22098 57 79 22118 38 73 22159 59 71 22159 38 59 22199 38 82 22218 57 77 22233 38 71 22279 59 69 22279 38 92 22318 38 80 22338 57 80 22359 38 97 22398 59 72 22398 38 90 22438 38 109 22459 57 97 22478 38 109 22494 57 113 22518 53 122 22518 53 109 22518 41 100 22523 53 113 22523 41 113 22524 53 126 22524 40 122 22998 53 103 22998 53 95 22998 41 69 22998 40 86 23004 53 97 23158 53 97 23158 53 92 23158 41 77 23158 38 77 23163 53 100 23319 53 97 23319 53 92 23319 41 92 23319 40 79 23323 53 117 23479 53 122 23479 53 95 23479 58 106 23479 41 113 23483 58 118 23483 38 103 23958 53 109 23958 58 106 23958 53 95 23959 41 86 23964 58 106 23964 40 79 24118 53 97 24118 58 100 24118 53 90 24118 41 88 24124 58 112 24124 38 71 24278 53 113 24278 58 112 24278 53 92 24278 41 100 24283 58 118 24284 40 88 24439 41 113 24443 53 117 24443 53 122 24448 58 112 24448 60 97 24448 53 95 24448 41 113 24454 60 113 24454 38 106 24918 53 97 24918 63 112 24918 58 95 24924 63 106 24924 60 88 24924 53 84 24924 41 90 24924 40 77 25078 53 97 25078 63 106 25078 58 100 25078 60 92 25084 63 106 25084 53 88 25084 41 86 25084 38 74 25238 53 103 25238 63 106 25238 58 100 25238 60 92 25244 63 118 25244 53 88 25244 41 90 25244 40 76 25398 53 106 25398 68 112 25398 58 100 25398 60 90 25403 68 112 25403 63 106 25403 53 90 25403 41 97 25403 38 79 25558 53 103 25558 68 106 25558 58 95 25559 60 86 25564 68 100 25564 63 106 25564 53 84 25564 41 100 25564 40 82 25718 53 106 25718 58 95 25718 68 100 25718 60 86 25723 63 100 25723 53 84 25723 41 103 25723 38 88 25728 68 106 25878 53 109 25878 75 95 25878 68 118 25878 58 106 25883 63 112 25883 60 95 25883 53 92 25883 41 109 25883 40 103 25889 75 106 26038 53 109 26038 75 80 26038 68 112 26043 58 106 26043 63 112 26043 60 92 26043 53 92 26043 41 106 26048 75 95 26048 38 92 26198 53 109 26198 75 90 26198 68 118 26198 63 118 26203 58 112 26203 60 103 26203 53 95 26203 41 113 26203 40 113 26208 75 106 26358 60 117 26358 65 122 26363 53 122 26363 58 73 26363 53 109 26363 41 106 26368 65 97 26368 63 80 26368 53 68 26368 41 117 26373 77 92 26373 65 77 26373 38 126 26838 53 109 26839 70 75 26839 58 71 26843 65 79 26844 63 83 26844 53 70 26844 41 109 26849 65 77 26849 77 84 26849 40 113 26998 53 100 26998 70 80 26998 65 74 26998 58 75 27003 65 77 27003 63 80 27003 53 61 27003 41 97 27003 38 90 27008 77 84 27158 53 109 27158 70 86 27158 65 77 27164 58 83 27164 63 80 27164 53 73 27164 41 113 27164 40 117 27168 65 84 27168 77 95 27318 53 117 27318 70 95 27318 58 95 27318 63 86 27324 65 79 27324 72 90 27324 53 84 27324 41 117 27324 38 126 27328 70 106 27328 82 90 27798 53 92 27804 75 77 27804 70 80 27808 72 82 27808 65 80 27808 58 71 27808 53 70 27808 63 80 27813 75 73 27813 87 100 27813 56 51 27813 41 113 27813 40 113 27958 53 106 27958 58 80 27958 63 86 27963 72 92 27963 53 88 27963 70 95 27963 75 86 27963 65 79 27969 75 77 27969 87 86 27969 41 100 27969 38 103 28119 53 109 28119 58 77 28119 53 77 28119 63 83 28123 75 80 28123 65 86 28123 72 80 28123 70 90 28123 41 117 28128 75 95 28129 87 106 28129 40 122 28258 57 117 28279 65 122 28279 60 117 28283 53 126 28283 58 100 28283 53 109 28283 41 109 28288 77 95 28288 72 100 28288 65 95 28288 63 106 28293 77 103 28293 53 92 28293 70 100 28294 75 55 28294 41 126 28294 38 122 28299 89 113";

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
      spheres: [],
      updateList: [],
      updateSet: new Set(),
      updateListTarget: [], // list of targets that correspond to objects in updateList
      lettersOnScreen: []
    };

    // create title
    const title = new Title(this);
    this.title = title;
    this.add(title);

    // add position tracker to ensure there aren't any overlapping letters
    this.width = width;
    this.height = height;
    this.allPositions = new PositionFinder(
      -1 * (this.width - 2),
      this.width - 2
    );

    // Set background to a nice color
    // this.background = new Color(0x7ec0ee);
    this.background = new Color(0x000000);

    // Add lights to scene
    const lights = new BasicLights();
    this.add(lights);

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
      var geometry = track(new THREE.Geometry());
      var xPos = getRandomInt(-1 * scene.width, scene.width);
      var yPos = scene.height + 4; // add "padding" to make lines start above the top of the screen
      var length = getRandomInt(0, 3);
      geometry.vertices.push(
        track(new THREE.Vector3(xPos, yPos, 0)),
        track(new THREE.Vector3(xPos, yPos - length, 0))
      );
      var material = track(
        new THREE.LineBasicMaterial({ color: "rgb(70,70,70)" })
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

    // convert string into array of numbers
    // var info = starwars.split(" ");
    this.info = SONG.notes;

    // version of addLetter that takes in a string of possible letters
    function noteToLetter(scene, letters, color) {
      let xPos = scene.allPositions.add();
      let character = letters[Math.floor(Math.random() * letters.length)];
      while (
        scene.state.lettersOnScreen.find(element => element == character) !=
        undefined
      ) {
        character = letters[Math.floor(Math.random() * letters.length)];
      }
      const letter = new Letter(scene, character, xPos, color);
      const target = new Target(scene, character, letter.coords.x);
      letter.addTarget(target);
      scene.add(letter, target);
    }

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

  addLetter(scene, third, color) {
    // selects a random x position then randomly selects a character based on the x coordinate and number of sections
    // the order of possibleLetters is from left to right on the keyboard, the order matters for selecting
    function getRandomLetter(xPos) {
      let possibleLetters = "qazwsxedcrfvtgbyhnujmikolp";
      let numSections = 3;
      let offset = numSections - 1;
      let fraction =
        (xPos - scene.allPositions.minx) /
        (scene.allPositions.maxx - scene.allPositions.minx);
      for (let i = numSections - 1; i >= 1; i--) {
        if (fraction < i / numSections) offset = i - 1;
      }
      return possibleLetters[
        Math.floor((Math.random() / numSections + offset / numSections) * 26)
      ];
    }
    let xPos;
    let length = scene.allPositions.maxx - scene.allPositions.minx;
    if (third == 0) {
      xPos = scene.allPositions.add(
        scene.allPositions.minx,
        Math.floor(scene.allPositions.minx + length / 3)
      );
    } else if (third == 1) {
      xPos = scene.allPositions.add(
        Math.floor(scene.allPositions.minx + length / 3),
        Math.floor(scene.allPositions.minx + (2 * length) / 3)
      );
    } else {
      xPos = scene.allPositions.add(
        Math.floor(scene.allPositions.minx + (2 * length) / 3),
        scene.allPositions.maxx
      );
    }

    // ensure different characters on the screen at all times
    // remove this if we want to support sentences
    let character = getRandomLetter(xPos);
    while (
      scene.state.lettersOnScreen.find(element => element == character) !=
      undefined
    )
      character = getRandomLetter(xPos);

    const letter = new Letter(scene, character, xPos, color);
    const target = new Target(scene, character, letter.coords.x);
    letter.addTarget(target);

    scene.add(letter, target);
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
    while (this.children.length > 1) {
      if (this.children[this.children.length - 1] == this.title) continue;
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
    this.title.update(timeStamp);
    const { updateList, updateListTarget } = this.state;

    // for every 90 indices (30 notes) where info[i] = time, info[i+1] = note, info[i+2] = velocity
    // start game -- only runsonce
    if (this.start) {
      // this.dispose();
      this.start = false;
      // this.over = false;
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
        setTimeout(
          this.addLetter,
          parseInt(this.info[i].time) - fallTime,
          this,
          third,
          this.noteToColor[note]
        );
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
        this.over = true;
        this.dispose();
        // ADD SCOREBOARD HERE!
      }
    }
  }
}

export default SeedScene;
