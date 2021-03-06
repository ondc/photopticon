var camera, scene, renderer;
var effect, controls;
var element, container;
var tick;

var clock = new THREE.Clock();

init();
animate();

function init() {

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	element = renderer.domElement;
	container = document.getElementById('example');
	container.appendChild(element);

	effect = new THREE.StereoEffect(renderer);

	scene = new THREE.Scene();

//	cameraRig = new THREE.Object3D();
//	cameraRig.up.set( 0, 0, 1 );
//	scene.add(cameraRig);
	
	camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
	//	camera.position.set(0, 0, 10);
//	camera.up.set( 0, 0, 1 );
	camera.rotateX( Math.PI/2 );
	scene.add(camera);

	controls = new THREE.OrbitControls(camera, element);
	controls.target.set(
		camera.position.x + 0.1,
		camera.position.y,
		camera.position.z
	);
	controls.noZoom = true;
	controls.noPan = true;

	function setOrientationControls(e) {
		
		if ( !e.alpha ) {
			return;
		}

		controls = new THREE.DeviceOrientationControls(camera, true);
		controls.connect();
		controls.update();

		element.addEventListener('click', fullscreen, false);

		window.removeEventListener('deviceorientation', setOrientationControls);
		
	}
	
	window.addEventListener('deviceorientation', setOrientationControls, true);

	window.addEventListener('resize', resize, false);
	setTimeout(resize, 1);

}

function resize() {

	var width = container.offsetWidth;
	var height = container.offsetHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);
	effect.setSize(width, height);

}

function update(dt) {

	resize();

	camera.updateProjectionMatrix();

	if ( controls ) {
		controls.update(dt);
	}

}

function render(dt) {
	effect.render(scene, camera);
}

function animate(t) {

	requestAnimationFrame(animate);

	update(clock.getDelta());
	render(clock.getDelta());

	if ( tick ) tick(clock.getDelta());

}

function fullscreen() {
	if (container.requestFullscreen) {
		container.requestFullscreen();
	} else if (container.msRequestFullscreen) {
		container.msRequestFullscreen();
	} else if (container.mozRequestFullScreen) {
		container.mozRequestFullScreen();
	} else if (container.webkitRequestFullscreen) {
		container.webkitRequestFullscreen();
	}
}

function exampleScene() {

	var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
	light.position.set( 0, 0, 100 );
	scene.add( light );

	var texture = THREE.ImageUtils.loadTexture(
		'textures/patterns/checker.png'
	);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat = new THREE.Vector2(50, 50);
	texture.anisotropy = renderer.getMaxAnisotropy();

	var material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		specular: 0xffffff,
		shininess: 20,
		shading: THREE.FlatShading,
		map: texture
	});

	var geometry = new THREE.PlaneGeometry(1000, 1000);

	var mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

}