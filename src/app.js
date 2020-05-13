/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import * as THREE from "three";
import { WebGLRenderer, PerspectiveCamera, Vector3, Scene } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SeedScene, CubeScene } from "scenes";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import mp3 from "./sounds/grenade.mp3";
import wii_mp3 from "./sounds/WiiThemeSong.mp3";
import { Title, Key } from "objects";
import { BasicLights } from "lights";

// Initialize core ThreeJS components
let muted = true;
let playing = false;

// const camera = new PerspectiveCamera();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new WebGLRenderer({ antialias: true });
renderer.setClearColor(0xffffff, 0);
// Set up camera
camera.position.set(0, 0, 16);
camera.lookAt(new Vector3(0, 0, 0));

// convert camera frustum vertical fov from degrees to rads
let fovRad = camera.fov * (Math.PI / 180);

// half of height:
var height =
  (camera.position.z * Math.sin(fovRad / 2)) /
  Math.sin(Math.PI / 2 - fovRad / 2);

// half of width:
var width = (height / window.innerHeight) * window.innerWidth;

// initialize scene
let scene = new SeedScene(width, height);

// Set up renderer, canvas, and minor CSS adjustments
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.toneMapping = THREE.LinearToneMapping;
// renderer.setClearColor(0x000000,0.0);
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = "block"; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = "hidden"; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = false;
// controls.enablePan = false;
// controls.minDistance = 16;
// controls.maxDistance = 16;
// controls.update();

let cubeScene = new CubeScene(width, height);
let cubePass = new RenderPass(cubeScene, camera);
cubePass.clear = false;
cubePass.clearDepth = true;
let cubeComposer = new EffectComposer(renderer);
cubeComposer.addPass(cubePass);

// ADD POSTPROCESSING EFFECT SUPPORT
var composer = new EffectComposer(renderer);
// first and mandatory pass
composer.addPass(new RenderPass(scene, camera));

// add glow
// resolution, strength, kernel size, sigma?
var bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  3,
  0.5,
  0.1
);
bloomPass.renderToScreen = true;
composer.addPass(bloomPass);
// composer.addPass(cubePass);

// Resize Handler
const windowResizeHandler = () => {
  const { innerHeight, innerWidth } = window;
  renderer.setSize(innerWidth, innerHeight);
  // composer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};
windowResizeHandler();

window.addEventListener("resize", windowResizeHandler, false);
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
document.getElementById("start").addEventListener("click", start);
// document.getElementById("start-over").addEventListener("click", startOver);
document.getElementById("restart-button").addEventListener("click", startOver);
document.getElementById("grenade").addEventListener("click", setGrenade);
document.getElementById("wii").addEventListener("click", setWii);
document.getElementById("easy").addEventListener("click", setEasy);
document.getElementById("medium").addEventListener("click", setMedium);
document.getElementById("hard").addEventListener("click", setHard);
document
  .getElementById("volume-controls")
  .addEventListener("click", toggleVolume);
document
  .getElementById("instructions-open")
  .addEventListener("click", openInstructions);
document
  .getElementById("instructions-close")
  .addEventListener("click", closeInstructions);
// when key is pressed save event key to key parameter of SeedScene
function handleKeyDown(event) {
  if (
    event.key == "p" &&
    document.getElementById("loader").style.display != "none"
  )
    fly();
  else {
    if (!event.metaKey && !event.altKey && !event.controlKey)
      scene.key = event.key;
  }
}

// once key is lifted, set SeedScene key to default value
function handleKeyUp(event) {
  scene.key = "";
}

// code below is taken from the Three.js website
// create an AudioListener and add it to the camera
var listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
var sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
var audioLoader = new THREE.AudioLoader();
// loadGrenade();

// if it's a reload
window.onload = function () {
  var reloading = sessionStorage.getItem("reloading");
  if (reloading) {
    sessionStorage.removeItem("reloading");
    scene.start = true;
    closeInstructions();
    sound.setVolume(0.5);
    sound.play();
    playing = true;
  }
};

// Render loop
const onAnimationFrameHandler = timeStamp => {
  composer.render(timeStamp);
  renderer.autoClear = false;
  cubeComposer.render(timeStamp);
  //   renderer.autoClear = false;
  // renderer.render(cubeScene, camera);
  scene.update && scene.update(timeStamp);
  if (!scene.running) {
    document.getElementById("volume").className = "mute mute-container hidden";
    document.getElementById("mute").className = "mute mute-container hidden";
  }
  cubeScene.update && cubeScene.update(timeStamp);

  window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

function toggleVolume() {
  // if it's muted, turn volume up
  if (muted) {
    if (!playing) {
      sound.play();
      playing = true;
    }
    sound.setVolume(0.5);
    muted = false;
    document.getElementById("volume").className = "mute mute-container";
    document.getElementById("mute").className = "mute mute-container hidden";
  }
  // if it's not muted, change volume to 0
  else {
    sound.setVolume(0);
    muted = true;
    document.getElementById("mute").className = "mute mute-container";
    document.getElementById("volume").className = "mute mute-container hidden";
  }
  // dunno what this is -- it's not in seedscene either lol
  // scene.playing = playing;
}

function loadGrenade() {
  audioLoader.load(mp3, function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(0.5);
  });
}

function loadWii() {
  audioLoader.load(wii_mp3, function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(0.5);
  });
}

async function start() {
  closeInstructions();
  if (scene.song == 0) {
    loadGrenade();
  } else if (scene.song == 1) {
    loadWii();
  }
  await new Promise(r => setTimeout(r, 1200));
  scene.start = true;
  if (playing) sound.stop(); // so that song starts from beginning w/ new game
  sound.play();
  playing = true;
  muted = false;
  sound.setLoop(false);
  document.getElementById("volume").className = "mute mute-container";
  document.getElementById("percent-score").className = "hidden";
}

function closeInstructions() {
  document.getElementById("instructions").className = "instructions hidden";
  if (scene.running && scene.pause) {
    scene.pause = false;
  }
}

// literally same but closes different box
function startOver() {
  scene.start = true;
  if (playing) sound.stop(); // so that song starts from beginning w/ new game
  sound.play();
  playing = true;
  muted = false;
  sound.setLoop(false);
  //   closeGameOver();
  document.getElementById("volume").className = "mute mute-container";
  document.getElementById("percent-score").className = "hidden";
}

// function closeGameOver() {
//   document.getElementById("game-over").className = "instructions hidden";
// }

function setGrenade() {
  scene.song = 0;
  document.getElementById("grenade").className = "active";
  document.getElementById("wii").className = "";
  // loadGrenade();
}

function setWii() {
  scene.song = 1;
  document.getElementById("wii").className = "active";
  document.getElementById("grenade").className = "";
  // loadWii();
}

function setEasy() {
  scene.difficulty = 0;
  document.getElementById("easy").className = "active";
  document.getElementById("medium").className = "";
  document.getElementById("hard").className = "";
}

function setMedium() {
  scene.difficulty = 1;
  document.getElementById("medium").className = "active";
  document.getElementById("easy").className = "";
  document.getElementById("hard").className = "";
}

function setHard() {
  scene.difficulty = 2;
  document.getElementById("hard").className = "active";
  document.getElementById("easy").className = "";
  document.getElementById("medium").className = "";
}

function openInstructions() {
  if (scene.running) {
    scene.pause = true;
  }
  // the actual opening of instructions is done in index.html
}

//---------------------------------------------------
// LOADER PAGE
//---------------------------------------------------
var container = document.getElementById("container");

var l_cam = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
l_cam.position.set(0, 0, 16);
l_cam.lookAt(new THREE.Vector3(0, 0, 0));

const l_scene = new THREE.Scene();
l_scene.height = height;
l_scene.width = width;

// const controls = new OrbitControls(l_cam, container);
// controls.enableDamping = false;
// controls.enablePan = false;
// controls.minDistance = 16;
// controls.maxDistance = 16;
// controls.update();

var l_renderer = new THREE.WebGLRenderer({ alpha: true });
l_renderer.setClearColor(0x000000, 0); // the default
l_renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.toneMapping = THREE.LinearToneMapping;
// renderer.setClearColor(0x000000,0.0);
l_renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(l_renderer.domElement);

let stop_loader = false;
var l_title = new Title(height);
var key = new Key(height, "p");
var key1 = new Key(height, "l");
var key2 = new Key(height, "a");
var key3 = new Key(height, "y");
key.position.set(-6, height - 18.5, 0);
key1.position.set(-2, height - 18.5, 0);
key2.position.set(2, height - 18.5, 0);
key3.position.set(6, height - 18.5, 0);
l_scene.add(l_title);
l_scene.add(key);
l_scene.add(key1);
l_scene.add(key2);
l_scene.add(key3);
l_scene.add(new BasicLights());
var animate = function (timeStamp) {
  if (!stop_loader) {
    requestAnimationFrame(animate);
    // for (let children of l_scene.children)
    //   children.rotation.z = 0.05 * Math.sin(timeStamp / 300);
    l_title.rotation.z = 0.05 * Math.sin(timeStamp / 300);
    l_title.update();
    l_renderer.render(l_scene, l_cam);
    // key.update();
  }
};

animate();
function clean() {
  l_title.tracker.dispose;
  while (l_scene.children.length > 0) {
    l_scene.remove(l_scene.children[0]);
  }
  stop_loader = true;
  // document.getElementById("loader").className = "hidden";
  fade(document.getElementById("loader"));
}

function fly() {
  // scene.
  key.update(true);
  // key.update();
  setTimeout(() => key1.update(true), 700);
  setTimeout(() => key2.update(true), 1400);
  setTimeout(() => key3.update(true), 2100);
  setTimeout(() => clean(), 4700);
}

// https://stackoverflow.com/questions/6121203/how-to-do-fade-in-and-fade-out-with-javascript-and-css
function fade(element) {
  var op = 1; // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.1) {
      clearInterval(timer);
      element.style.display = "none";
    }
    element.style.opacity = op;
    element.style.filter = "alpha(opacity=" + op * 100 + ")";
    op -= op * 0.1;
  }, 20);
}
