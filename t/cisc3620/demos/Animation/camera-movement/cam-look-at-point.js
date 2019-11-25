// ================================================================
// Camera stuff is all in this object, for easy inspection.
// This camera moves along a Bezier but always looking at a single point.

var cam = {};

var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: 0, maxx: barnWidth,
                            miny: 0, maxy: barnHeight, // a bit low
                            minz: -barnDepth, maxz: 0});

// The camera object has methods to position and orient the camera, as
// well as change its shape

cam.object = state.cameraObject;

cam.lookPt = new THREE.Vector3(barnWidth/2, barnHeight/2, 0); // center of the front, on the barn

/* Camera movement along a Bezier 3D curve from high above right to center
 * of the front */

cam.start  = new THREE.Vector3(50,50,50); // high above right
cam.p1     = new THREE.Vector3(25,25,40); // drop left and down, a little in
cam.p2     = new THREE.Vector3(barnWidth/2, barnHeight/2, 30); // come in straight towards the barn
cam.end    = new THREE.Vector3(barnWidth/2, barnHeight/2, 10); // center of the front, but in front

cam.curve = new THREE.CubicBezierCurve3( cam.start, cam.p1, cam.p2, cam.end );

// animation API requires these two methods:

cam.object.initialize = function () {
    this.position.copy(cam.start);
    this.up.set(0,1,0);
    this.lookAt(cam.lookPt);
}

cam.object.update = function (dt) {
    if( globalTime < 1 ) {
        this.position.copy( cam.curve.getPoint(globalTime) );
        this.lookAt(cam.lookPt);
    }
}

// ================================================================
// entirely optional

/* The slowness is the log base 2 of the inverse, ranging from 3 (DT=1/8) to
 * 10 (DT=1/1024). */

var guiParams = {slowness: 7};
var gui = new dat.GUI();
gui.add(guiParams, 'slowness',3,10).onChange(function () {
    globalDeltaT = 1/Math.pow(2,guiParams.slowness);
});
