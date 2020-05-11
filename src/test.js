
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/109/three.module.js';
// import * as THREE from "three";

class Title extends THREE.Group {
  constructor() {
    super();
    var loader = new THREE.FontLoader();
    loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json', (font) => {
      var textGeo0 = new THREE.TextGeometry("welcome to", {
          font: font,
          size: 1,
          height: .25,
          curveSegments: 2
      });
      textGeo0.center();

      // add material
      var mat0 = new THREE.MeshNormalMaterial();
      // create mesh
      let textMesh0 = new THREE.Mesh(textGeo0, mat0);
      // randomize position between top left corner and top right corner of the screen
      // let newx = getRandomInt(-22, 22);
      textMesh0.position.set(-7, height - 6, 0);
      textMesh0.rotateZ(Math.PI / 9);

      var textGeo1 = new THREE.TextGeometry("TYPE TYPE", {
          font: font,
          size: 2,
          height: .25,
          curveSegments: 2
      });
      textGeo1.center();

      // add material
      var mat1 = new THREE.MeshNormalMaterial();
      // create mesh
      let textMesh1 = new THREE.Mesh(textGeo1, mat1);
      // randomize position between top left corner and top right corner of the screen
      // let newx = getRandomInt(-22, 22);
      textMesh1.position.set(-3, height - 7, 0);
      textMesh1.rotateZ(Math.PI / 9);


      var textGeo3 = new THREE.TextGeometry("REVENGE !", {
          font: font,
          size: 2,
          height: .25,
          curveSegments: 2
      });
      textGeo3.center();

      // add material
      var mat3 = new THREE.MeshNormalMaterial();

      let textMesh3 = new THREE.Mesh(textGeo3, mat3);
      textMesh3.position.set(5, height - 7, 0);
      textMesh3.rotateZ(Math.PI / 9);
      // textMesh3.rotateY(Math.PI / 6);
      // add mesh to l_scene
      this.add(textMesh0)
      this.add(textMesh1);
      this.add(textMesh3);
    });
  }
}

var container = document.getElementById( 'container' );

var l_cam = new THREE.Perspectivel_cam(75, window.innerWidth / window.innerHeight, 0.1, 1000);
l_cam.position.set(0, 0, 16);
l_cam.lookAt(new THREE.Vector3(0, 0, 0));

// convert l_cam frustum vertical fov from degrees to rads
let fovRad = l_cam.fov * (Math.PI / 180);

// half of height:
var height =
  (l_cam.position.z * Math.sin(fovRad / 2)) /
  Math.sin(Math.PI / 2 - fovRad / 2);

// half of width:
var width = (height / window.innerHeight) * window.innerWidth;

const l_scene = new THREE.Scene();
l_scene.height = height;
l_scene.width = width;


var l_renderer = new THREE.WebGLRenderer({alpha: true});
l_renderer.setClearColor( 0x000000, 0 ); // the default
l_renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(l_renderer.domElement);

var l_title = new Title(l_scene);
l_scene.add(l_title);
var animate = function (timeStamp) {
    requestAnimationFrame(animate);
    for (let children of l_scene.children)
      children.rotation.z = 0.05 * Math.sin(timeStamp / 300);
    l_renderer.render(l_scene, l_cam);
};

animate();
document.getElementById("loader-button").addEventListener("click", clean);
function clean() {
  while (l_scene.children.length > 0) {
    l_scene.remove(l_scene.children[0]);
  }
  document.getElementById("loader").className = "hidden";}
      