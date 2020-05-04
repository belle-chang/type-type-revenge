/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import * as THREE from "three";
import { WebGLRenderer, PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SeedScene } from "scenes";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import mp3 from "./sounds/WiiThemeSong.mp3";
// import $ from 'jquery';

// Initialize core ThreeJS components

// const camera = new PerspectiveCamera();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new WebGLRenderer({ antialias: true });

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
const scene = new SeedScene(width, height);

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

// Render loop
const onAnimationFrameHandler = timeStamp => {
  // controls.update();
  // renderer.render(scene, camera);
  composer.render(timeStamp);
  scene.update && scene.update(timeStamp);
  window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

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

// when key is pressed save event key to key parameter of SeedScene
function handleKeyDown(event) {
  if (!event.metaKey && !event.altKey && !event.controlKey)
    scene.key = event.key;
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
audioLoader.load(mp3, function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});

// $.getJSON( "./json/exampleSong.json", function( json ) {
//     console.log( "JSON Data: " + json.notes[ 3 ].note );
//    });
