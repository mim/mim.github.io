/* Kelsey Reiman
   Summer 2014 
   
   Creates a cube with a different texture on each face.
*/

var scene = new THREE.Scene();
var canvas = {width: 400, height: 400};
var camera = new THREE.PerspectiveCamera(75,canvas.width/canvas.height, 0.1,1000);
var renderer = new THREE.WebGLRenderer();

renderer.setClearColor( 0xffffff );
renderer.setSize(window.innerWidth,window.innerHeight);


document.body.appendChild(renderer.domElement);

//create a cube
var geometry = new THREE.BoxGeometry(1,1,1);

//create a different material for each face, and load a different image for each face
var material1 = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('mikeypics/mikey1.jpg') } );
var material2 = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('mikeypics/mikey2.jpg') } );
var material3 = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('mikeypics/mikey3.jpg') } );
var material4 = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('mikeypics/mikey4.jpg') } );
var material5 = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('mikeypics/mikey5.jpg') } );
var material6 = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('mikeypics/mikey6.jpg') } );

//create an array of the materials you just created
var materials = [material5,material2,material3,material4,material1,material6];

// create a new material that holds the array of materials
var meshFaceMaterial = new THREE.MeshFaceMaterial( materials );

//create a mesh object using the box geometry and the material you just created
var cube = new THREE.Mesh(geometry, meshFaceMaterial);
scene.add(cube);

camera.position.z = 2;

var controls = new THREE.OrbitControls( camera, renderer.domElement );

function render(){
	requestAnimationFrame(render);
	//cube.rotation.x += 0.02; 
	//cube.rotation.y += 0.02;
	renderer.render(scene,camera);
	}
	
render();	