var THREE = require('three');

// const:
// ------------
var MAX_FPS = 1.0 / 60.0;

// these will be initialized in init()
var scene,
    camera,
    renderer,
    clock,
    frameDelta = 0;

var SHAPE_COUNT = 20;

// REQUIRED THREE JS VARIABLES
var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer,
    container,
    controls

// SCREEN VARIABLES
var HEIGHT, WIDTH, mousePos = {x: 0, y: 0};

// LOADER

// FONT
var fontLoader = new THREE.FontLoader();
var FONT_PATH = "http://threejs.org/examples/fonts/droid/droid_serif_regular.typeface.json";
var globalFont = null;

function createScene() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH/HEIGHT;
  fieldOfView = 50;
  nearPlane = .1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 400;

  clock = new THREE.Clock();

  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  renderer.setSize(WIDTH, HEIGHT);

  renderer.shadowMap.enabled = true;

  container = document.body;
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
}

// MOUSE & SCREEN EVENTS

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

// LIGHTS
var ambientLight, hemisphereLight, shadowLight

function createLights() {
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)

  ambientLight = new THREE.AmbientLight(0xdc8874, .5);

  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 4096;
  shadowLight.shadow.mapSize.height = 4096;

  var ch = new THREE.CameraHelper(shadowLight.shadow.camera);

  //scene.add(ch);
  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(ambientLight);
}

// OBJECTS
var colors = [
    0x3399CC, // blue
    0x4354D4, // purple
    0x2DD777  // green
];
var geometries = [
    getBoxGeometry,
    getSphereGeometry,
    getConeGeometry,
    getRingGeometry,
    getTextGeometry
];
var objects = [];

function createObjects() {
  for(var i = 0; i < SHAPE_COUNT; i++) {

		var geometry = getGeometry(i);

		var material = new THREE.MeshPhongMaterial({color: getColor(i), wireframe: false, shading:THREE.FlatShading});

		var object = new THREE.Mesh(geometry, material);
        object.castShadow = true;
        object.receiveShadow = true;

		object.position.x = Math.random() * 200 - 100;
		object.position.y = Math.random() * 200 - 100;
		object.position.z = Math.random() * 200 - 100;

		scene.add(object);

		objects.push({ mesh: object, speeds: getSpeeds(geometry)});
	};
}

// getRandomSpeeds(geometry) 
// ----------------------------
// get a speed based on the shape of the object
// note: this was added because it was crazy having text rotating around
function getSpeeds(geometry) {
    if(geometry instanceof THREE.TextGeometry) {
        return { x: 0, y: 0, z: 0 };
    } else {
        return { x: getRandomSpeed(), y: getRandomSpeed(), z: getRandomSpeed() };
    }
}

function getRandomSpeed() {
    return Math.random() * 4;
}

function getRandomColor() {
    return getRandomItem(colors);
}

// getColor()
// --------------
// provides the color based on the idx 
// the first index, we use the original color
// else, we use a random color
function getColor(i) {
    if(i === 0) {
        return colors[0];
    } else {
        return getRandomColor();
    }
}

// getGeometry()
// -----------------
// provides the geometry based on the idx
// the first index, we use the original shape
// ekse, we use a random shape
function getGeometry(i) {
    if(i === 0) {
        return getBoxGeometry();        
    } else {
        return getRandomGeometry();
    }
}

function getRandomGeometry() {
    return getRandomItem(geometries)();
}

function getBoxGeometry() {
    var geometry = new THREE.BoxGeometry(20, 20, 20);
    return geometry;
}

function getRingGeometry() {
    return new THREE.RingGeometry (5,10,64);
}

function getSphereGeometry() {
    return new THREE.SphereGeometry( 15, 10, 10 );
}

function getConeGeometry() {
    return new THREE.ConeGeometry( 10, 20, 20 );
}

function getTextGeometry() {
    return new THREE.TextGeometry("Hey John", {
        font: globalFont,
        size: 12,
        height: 10
    });
}

// getRandomItem(array)
// ------------------
// utility function to get a random item in an array
function getRandomItem(array) {
    var max = array.length;
    var idx = Math.floor(Math.random() * max);
    return array[idx];
}

// ANIMATION
function animate() {
	requestAnimationFrame( animate );

    // note:
    // -----
    // the below makes sure that we call onAnimationUpdate() in steps of MAX_FPS
    frameDelta += clock.getDelta();

    while (frameDelta >= MAX_FPS) {
        onAnimationUpdate(MAX_FPS);
        frameDelta -= MAX_FPS;
    }

	renderer.render( scene, camera );
}

function onAnimationUpdate(delta) {
    objects.forEach(function(obj){
        var mesh = obj.mesh;
        for(var dim in obj.speeds) {
            mesh.rotation[dim] += delta * obj.speeds[dim];
        }
    });
}

function init() {
  createScene();
  createLights();
  createObjects();
  animate();
}

fontLoader.load(FONT_PATH, function(font){
    globalFont = font;
    init();
});
