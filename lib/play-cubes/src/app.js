var THREE = require('three');



var scene, camera, renderer;

var geometry, material, mesh;

var objects = [];



var pages = [

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

		var material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: false});



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

}



function animate() {



	requestAnimationFrame( animate );



	// mesh.rotation.x += 0.01;

	// mesh.rotation.y += 0.02;



	renderer.render( scene, camera );



}

