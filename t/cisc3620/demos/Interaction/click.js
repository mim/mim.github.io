// We always need a scene.
var scene = new THREE.Scene();

// ====================================================================

/* Next, we create objects in our scene. */

var house1 = TW.createMesh( TW.createBarn(2,3,3) );
house1.position.set(4,0,3);
scene.add(house1);

var house2 = TW.createMesh( TW.createBarn(2,3,3) );
house2.position.set(3,0,7);
house2.rotation.y = Math.PI/2;
scene.add(house2);

var house3 = TW.createMesh( TW.createBarn(2,3,3) );
house3.position.set(8,0,5);
house3.rotation.y = -Math.PI/4;
scene.add(house3);

var tree1 = createTree({trunkRadius: 0.2, trunkHeight: 1, coneRadius: 2, coneHeight: 6});
tree1.position.set(8,0,10);
scene.add(tree1);

var tree2 = createTree({trunkRadius: 0.3, trunkHeight: 1.5, coneRadius: 3, coneHeight: 8});
tree2.position.set(12,0,10);
scene.add(tree2);

var frosty = createSnowPerson({r3: 0.5, r2: 0.4, r1: 0.3});
frosty.position.set(3,0,9);
scene.add(frosty);

// ground
var ground = new THREE.Mesh( new THREE.PlaneGeometry(20,20),
                             new THREE.MeshBasicMaterial({color:THREE.ColorKeywords.green}));
ground.position.set(6,0,6);
ground.rotateX(-1*Math.PI/2);
scene.add(ground);

// ================================================================
// 
// We always need a renderer

var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer,scene);

// ================================================================
// New for this series of demos, where we'll eventually set up 
// and control our own camera.

var mouse = new THREE.Vector2();
var canvas;

function onMouseClick(evt) {
    saved_event = evt;
    event.preventDefault();     // don't propagate to higher elements
    mouse.x =      (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -1 * (event.clientY / window.innerHeight) * 2 + 1;
    drawFrustumRay(mouse.x, mouse.y);
}
document.addEventListener( 'click', onMouseClick, false );

function createLine(a, b) {
    var geom = new THREE.Geometry();
    geom.vertices = [a,b];
    return new THREE.Line( geom, new THREE.LineBasicMaterial({color:0xFFFFFF}) );
}

var camera;
var projector = new THREE.Projector();

function drawFrustumRay(mx,my) {
    var clickPositionNear = new THREE.Vector3( mx, my, 1 );
    var clickPositionFar  = new THREE.Vector3( mx, my, 0 );
    console.log("mx: "+mx+" my: "+my);
    projector.unprojectVector( clickPositionNear, camera);
    projector.unprojectVector( clickPositionFar, camera);
    console.log("click near: "+JSON.stringify(clickPositionNear));
    scene.add(createLine(clickPositionNear,clickPositionFar));
}

// ================================================================
// cross hairs.  Should use sprites instead.

function createCrosshairs() {
    var max = 0.9;
    var left   = new THREE.Vector3( -max, 0, 0 );
    var right  = new THREE.Vector3( +max, 0, 0 );
    var top    = new THREE.Vector3( 0, +max, 0 );
    var bottom = new THREE.Vector3( 0, -max, 0 );
    projector.unprojectVector( left, camera );
    projector.unprojectVector( right, camera );
    projector.unprojectVector( top, camera );
    projector.unprojectVector( bottom, camera );
    scene.add( createLine( left, right ) );
    scene.add( createLine( top, bottom ) );
}

var cameraFOVY = 75;

var camParams = TW.cameraSetupParams({minx: 0, maxx: 12,
                                      miny: 0, maxy: 4,
                                      minz: 0, maxz: 12},
    cameraFOVY);

var cameraAt  = camParams.center;
var cameraVPN = new THREE.Vector3(0,0,-1);
var cameraVRP = new THREE.Vector3(cameraAt.x, cameraAt.y, cameraAt.z + camParams.cameraRadius);
var cameraVUP = new THREE.Vector3(0,1,0);
var cameraVRight = new THREE.Vector3(1,0,0);

canvas = TW.lastClickTarget;
var camera = new THREE.PerspectiveCamera(cameraFOVY,
                                         canvas.clientWidth/canvas.clientHeight,
                                         0.5 * camParams.near,
                                         2.0 * camParams.far);
camera.position.copy(cameraVRP);
camera.lookAt(cameraAt);
scene.add(camera);

var state = TW.lastClickTarget.TW_state;
state.render = function () { renderer.render(scene, camera); }

// createCrosshairs();
TW.render();

TW.debug = true;  // causes keys to be shown
// TW.setKeyboardCallback("?",TW.showKeyboardCallbacks,"show keyboard callbacks");
