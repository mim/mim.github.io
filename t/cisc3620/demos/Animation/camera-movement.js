var scene = new THREE.Scene();

var barnWidth = 20;
var barnHeight = 30;
var barnDepth = 40;

var barnGeometry = TW.createBarn( barnWidth, barnHeight, barnDepth );
var barnMesh = TW.createMesh( barnGeometry );

scene.add(barnMesh);

var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer,scene);

// ================================================================
// Camera stuff is all in this object, for easy inspection.

var cam = {};

var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: 0, maxx: barnWidth,
                            miny: 0, maxy: barnHeight, // a bit low
                            minz: -barnDepth, maxz: 0});

// The camera object has methods to position and orient the camera, as
// well as change its shape

cam.object = state.cameraObject;

/* Camera movement along a Bezier 3D curve from high above right to center
 * of the front */

cam.start  = new THREE.Vector3(50,50,50); // high above right
cam.end    = new THREE.Vector3(barnWidth/2, barnHeight/2, 10); // center of the front, but in front
cam.lookAt = new THREE.Vector3(barnWidth/2, barnHeight/2, 0); // center of the front, on the barn

cam.p1 = new THREE.Vector3(25,25,40); // drop left and down, a little in
cam.p2 = new THREE.Vector3(barnWidth/2, barnHeight/2, 30); // come in straight towards the barn

cam.curve = new THREE.CubicBezierCurve3( cam.start, cam.p1, cam.p2, cam.end );

function initialize() {
    globalTime = 0;
    cam.object.position.copy(cam.start);
    cam.object.up.set(0,1,0);
    cam.object.lookAt(cam.lookAt);
    TW.render();
}

function update(dt) {
    globalTime += dt;
    if(globalTime < 1 ) {
        cam.object.position.copy( cam.curve.getPoint(globalTime) );
        cam.object.lookAt(cam.lookAt);
        TW.render();
    } else {
        stopAnimation();
    }
}

// ================================================================
// All the usual animation stuff

var globalTime = 0;
var globalDT = 0.01;

function oneStep() {
    update(globalDT);
}    

var stopRequested = false;    // set to true to have the animation stop itself
var animationId = null;       // so we can cancel the animation if we want

function animate() {
    oneStep();
    if( ! stopRequested ) {
        animationId = requestAnimationFrame(animate);
    }
}

function startAnimation() {
    stopRequested = false;
    if( animationId == null ) {
        animate();
    }
}

function stopAnimation() {
    if( animationId != null ) {
        cancelAnimationFrame(animationId);
        stopRequested = true;
        animationId = null;
    }
}

TW.setKeyboardCallback("0",initialize,"reset animation");
TW.setKeyboardCallback("1",oneStep,"advance by one step");
TW.setKeyboardCallback("g",startAnimation,"go:  start animation");
TW.setKeyboardCallback(" ",stopAnimation,"stop animation");

// ================================================================
// entirely optional

/* The slowness is the log base 2 of the inverse, ranging from 3 (DT=1/8) to
 * 10 (DT=1/1024). */

var guiParams = {slowness: 7};
var gui = new dat.GUI();
gui.add(guiParams, 'slowness',3,10).onChange(function () {
    globalDT = 1/Math.pow(2,guiParams.slowness);
});
