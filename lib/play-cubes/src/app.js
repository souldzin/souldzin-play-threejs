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

var objects = [];

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

init();

animate();

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );

	camera.position.z = 1000;

	for(var i = 0; i < pages.length; i++) {

		var geometry = new THREE.BoxGeometry(200, 200, 200);

		var material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});

		var object = new THREE.Mesh(geometry, material);

		object.position.x = Math.random() * 2000 - 2000;

		object.position.y = Math.random() * 2000 - 2000;

		object.position.z = Math.random() * 2000 - 2000;

		scene.add(object);

		objects.push(object);
	};

	renderer = new THREE.WebGLRenderer();

	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

    clock = new THREE.Clock();

    window.addEventListener( 'resize', onWindowResize, false );
}


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

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onAnimationUpdate(delta) {
    objects.forEach(function(obj){
        obj.rotation.x += delta * 2;
        obj.rotation.y += delta * 2;
    });
}
