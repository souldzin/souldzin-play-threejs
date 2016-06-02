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

var pages = [
	{
		display: "Test",
		href: "/test"
	},
	{
		display: "Test",
		href: "/test"
	},
	{
		display: "Test",
		href: "/test"
	},
	{
		display: "Test",
		href: "/test"
	},
	{
		display: "Test",
		href: "/test"
	},
	{
		display: "Test",
		href: "/test"
	},
	{
		display: "Test",
		href: "/test"
	},
	{
		display: "Another Test",
		href: "/test"
	}
]

// REQUIRED THREE JS VARIABLES
var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer,
    container,
    controls

// SCREEN VARIABLES
var HEIGHT, WIDTH, mousePos = {x: 0, y: 0};

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
var objects = [];

function createObjects() {
  for(var i = 0; i < pages.length; i++) {

		var geometry = new THREE.BoxGeometry(20, 20, 20);

		var material = new THREE.MeshPhongMaterial({color: 0x3399CC, wireframe: false, shading:THREE.FlatShading});

		var object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;

		object.position.x = Math.random() * 200 - 100;
		object.position.y = Math.random() * 200 - 100;
		object.position.z = Math.random() * 200 - 100;

		scene.add(object);

		objects.push({ mesh: object, speeds: { x: getRandomSpeed(), y: getRandomSpeed(), z: getRandomSpeed() }});
	};
}

function getRandomSpeed() {
    return Math.random() * 4;
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

window.addEventListener('load', init, false);
