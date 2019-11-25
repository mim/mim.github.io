/* testing cloth simulation */
		    
var pinsFormation = [];
var pins = [6];

pinsFormation.push( pins );

pins = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
pinsFormation.push( pins );

pins = [ 0 ];
pinsFormation.push( pins );

pins = []; // cut the rope ;)
pinsFormation.push( pins );

pins = [ 0, cloth.w ]; // classic 2 pins
pinsFormation.push( pins );

pins = pinsFormation[ 1 ];


function togglePins() {
	pins = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
	pinsFormation.push( pins );
	
	pins = pinsFormation[ 1 ];
    
	//pins = pinsFormation[ ~~( Math.random() * pinsFormation.length ) ];
    
}
var scene = new THREE.Scene();

//camera and position
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
camera.position.y = 50;
camera.position.z = 625;
//scene.add(camera);

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(); //sets the background to a grayish color
renderer.shadowMapEnabled = true;
document.body.appendChild(renderer.domElement);



//flag material, geometry, and texture
TW.loadTexture('flag2.png',
               function (flagTexture) {
			       // flagTexture.anisotropy = 16;
			       var flagMaterial = new THREE.MeshPhongMaterial( { alphaTest:0.5, 
                                                                     ambient: 0xffffff, 
                                                                     color: 0xffffff, 
                                                                     specular: 0x030303, 
                                                                     emissive: 0x111111,
			                                                         shiness: 10, 
                                                                     map: flagTexture, 
                                                                     side: THREE.DoubleSide});

			       var clothGeometry = new THREE.ParametricGeometry(clothFunction, cloth.w, cloth.h);
			
			       clothGeometry.dynamic = true;
			       clothGeometry.computeFaceNormals();
			
			       //flag mesh
			       
			       object = new THREE.Mesh(clothGeometry, flagMaterial);
			       object.position.set(0,35,0);
			       object.castShadow = true;
			       object.receiveShadow = true;
			       scene.add(object);
			});

// pole

var poleGeo = new THREE.BoxGeometry( 5, 525, 5 );
var poleMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shiness: 100 } );

var mesh = new THREE.Mesh( poleGeo, poleMat );
mesh.position.x = -125;
mesh.position.y = 150;
mesh.receiveShadow = true;
mesh.castShadow = true;
scene.add( mesh );

//skybox
var skyGeometry = new THREE.BoxGeometry(10000,10000,10000);
var skyMaterial = new THREE.MeshBasicMaterial({color: 0x33CCFF, side: THREE.BackSide});
var skybox = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(skybox);




//LIGHTS
var light, materials;

scene.add( new THREE.AmbientLight( 0x666666 ) );

light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
light.position.set( 0, 100, 100 );
light.position.multiplyScalar( 1.3 );

light.castShadow = true;
//light.shadowCameraVisible = true;

light.shadowMapWidth = 2048;
light.shadowMapHeight = 2048;

var d = 300;

light.shadowCameraLeft = -d;
light.shadowCameraRight = d;
light.shadowCameraTop = d;
light.shadowCameraBottom = -d;

light.shadowCameraFar = 1000;
light.shadowDarkness = 0.5;

scene.add( light );

light = new THREE.DirectionalLight( 0x3dff0c, 0.35 );
light.position.set( 0, -1, 0 );

scene.add( light );




// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(900,900); 
var floorTexture = new THREE.ImageUtils.loadTexture( 'grass.jpg' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;

var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
var plane = new THREE.Mesh(planeGeometry,floorMaterial);
plane.receiveShadow = true;


// rotate and position the plane
plane.rotation.x=-0.5*Math.PI;
plane.position.x=15
plane.position.y=-115
plane.position.z=-5

// add the plane to the scene
scene.add(plane);


//camera.lookAt(scene.position);
arrow = new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), 50, 0xff0000 );
arrow.position.set( -400, 0, -200 );
scene.add(arrow);
//adding things to the renderer


controls = new THREE.OrbitControls(camera, renderer.docElement);
var animate = function(){
    requestAnimationFrame(animate);
    
    var time = Date.now();
    
    windStrength = Math.cos(time / 7000) * 20;
    //windStrength = 2000;
    windForce.set( Math.cos(time / 2000), Math.cos(time / 1000), Math.sin(time / 5000)).normalize().multiplyScalar(windStrength);
    //windForce.set( 1, 0, 0).multiplyScalar(windStrength);
    //var arrow = null;
    arrow.setLength(windStrength);
    arrow.setDirection(windForce);
    
    simulate(time); //This turns everything black except the skybox, it also mentions "sphere undefined"
    render(); //this render here makes the whole browser crash
    
}
var render = function () {
	
	// var timer = Date.now() * 0.0002;
    
	var p = cloth.particles;
    
	for ( var i = 0, il = p.length; i < il; i ++ ) {
        
		clothGeometry.vertices[ i ].copy( p[ i ].position );
        
	}
    
	clothGeometry.computeFaceNormals();
	clothGeometry.computeVertexNormals();
    
	clothGeometry.normalsNeedUpdate = true;
	clothGeometry.verticesNeedUpdate = true;
	//requestAnimationFrame(render);
    
	camera.lookAt( scene.position );
	// animate();
	pins = [0, 11, 22, 33, 44, 55, 66, 77, 88, 99, 110 ];
	// togglePins();
	renderer.render(scene, camera);
	
};

animate();
