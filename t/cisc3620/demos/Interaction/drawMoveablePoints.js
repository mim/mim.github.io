// We always need a scene.
var scene = new THREE.Scene();

// ================================================================
// 
// We always need a renderer

var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer,scene);

// ================================================================
// New for this series of demos, where we'll eventually set up 
// and control our own camera.

var zzeroPlane = new THREE.Mesh(new THREE.PlaneGeometry(20,20),
                                new THREE.MeshBasicMaterial({color:TW.WHITE}));
zzeroPlane.name = "zzero";
scene.add(zzeroPlane);

var origin = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({color:TW.RED}));
scene.add(origin);

var intersectionObjects = [zzeroPlane];
var points = [];
var currPointObj = null;

var raycaster = new THREE.Raycaster();

var isMouseDown = false;

function onMouseDown(evt) {
    if( ! evt.shiftKey ) return; // only handle shifted mouse transitions
    isMouseDown = true;
    saved_event = evt;
    event.preventDefault();     // don't propagate to higher elements
    var click = convertMousePositionToNDC(evt);
    
    mx = click.x;
    my = click.y;
    mouse.x = mx;
    mouse.y = my;
    var clickNear = new THREE.Vector3( mx, my, 0 );
    var clickFar  = new THREE.Vector3( mx, my, 1 );
    projector.unprojectVector( clickNear, camera);
    projector.unprojectVector( clickFar, camera);

    console.log("looking for intersections");
    var dir = clickFar.clone();
    dir.sub(clickNear).normalize();
    raycaster.set( clickNear, dir );
    intersects = raycaster.intersectObjects(intersectionObjects);
    console.log("found "+intersects.length+" intersections");
    if(intersects.length == 0) {
        console.log('no intersection');
        return;
    }
    if( intersects[0].object == zzeroPlane ) {
        console.log("intersected z0");
        point = intersects[0].point.clone();
        if( Math.abs(point.z) > 0.000001 ) {
            console.log("Something is wrong in this intersection");
        }
        point.z = 0;                // in case there's a tiny, non-zero bit
        currPointObj = addSphereAt(point);
        intersectionObjects.push(currPointObj);
        TW.render();
    } else {
        // matches an existing point? Save it for dragging
        currPointObj = intersects[0].object;
    }
}

function printPoints() {
    var i;
    console.log("[");
    // start at 1 to skip the zzero plane
    for( i=1; i<intersectionObjects.length; i++) {
        p = intersectionObjects[i].position;
        console.log("["+p.x+","+p.y+","+p.z+"],");
    }
    console.log("]");
}

function getPoints() {
    var i;
    var pts = [];
    // start at 1 to skip the zzero plane
    for( i=1; i<intersectionObjects.length; i++) {
        pts.push( intersectionObjects[i].position.clone() );
    }
    return pts;
}
    
var splineObj;

function remakeSplineObj() {
    scene.remove(splineObj);
    var mat = new THREE.MeshBasicMaterial({color: 0x00FF00, opacity: 1});
    curve = new THREE.SplineCurve3 ( getPoints() );
    var geom = new THREE.Geometry();
    geom.vertices = curve.getPoints(50);
    splineObj = new THREE.Line( geom, new THREE.LineBasicMaterial( { color: 0x00ff00 }) );
    splineObj.name = "spline";
    scene.add(splineObj);
    scene.remove(zzeroPlane);
    TW.render();
}


var latheObj;

function remakeLatheObj() {
    scene.remove(latheObj);
    var points = getPoints();
    var alt = [];
    for( var i=0; i<points.length; i++ ) {
        var p = points[i].clone();
        p.z = p.y;
        p.y = 0;
        alt.push(p);
    }
    var geom = new THREE.LatheGeometry( alt );
    var mat1 = new THREE.MeshBasicMaterial({color: 0xFF0000, opacity: 0.6, wireframe: true});
    var mat2 = new THREE.MeshBasicMaterial({color: 0xFF00000});
    latheObj = new THREE.Mesh (geom, mat1);
    latheObj.rotateX(-Math.PI/2);
    latheObj.name = "lathe";
    scene.add(latheObj);
    TW.render();
}

function onMouseMove(evt) {
    if( ! evt.shiftKey ) return; // only handle shifted mouse transitions
    if(!isMouseDown) return;
    saved_event = evt;
    event.preventDefault();     // don't propagate to higher elements
    var click = convertMousePositionToNDC(evt);
    mx = click.x;
    my = click.y;
    mouse.x = mx;
    mouse.y = my;
    var clickNear = new THREE.Vector3( mx, my, 0 );
    var clickFar  = new THREE.Vector3( mx, my, 1 );
    projector.unprojectVector( clickNear, camera);
    projector.unprojectVector( clickFar, camera);

    if( currPointObj == null ) {
        return;
    }
    var dir = clickFar.clone();
    dir.sub(clickNear).normalize();
    raycaster.set( clickNear, dir );
    intersects = raycaster.intersectObject(zzeroPlane);
    if(intersects.length == 0) {
        console.log('no intersection');
        return;
    }
    if( intersects[0].object == zzeroPlane ) {
        var tmp = intersects[0].point.clone();
        if( Math.abs(tmp.z) > 0.000001 ) {
            console.log("Something is wrong in this intersection");
        }
        tmp.z = 0;
        currPointObj.position.copy(tmp);
        TW.render();
    } else {
        console.log("this shouldn't happen");
    }
}

function onMouseUp(evt) {
    isMouseDown = false;
    currPointObj = null;
}


function addSphereAt(pt) {
    var sph = new THREE.Mesh( new THREE.SphereGeometry(0.5),
                              new THREE.MeshNormalMaterial());
    sph.position.copy(pt);
    scene.add(sph);
    return sph;
}

var cameraFOVY = 75;

TW.cameraSetup = function (renderer,scene,scene_bb,inits) {
    /* Sets up a camera for you, based on a scene bounding box (scene_bb),
     * an object with six properties: minx, maxx, miny, maxy, minz,
     * maxz. See cameraSetupParams for more. inits can include fovy */
    if( ! (renderer instanceof THREE.WebGLRenderer ) ) {
        throw "first arg should be a renderer, probably THREE.WebGLRenderer";
    }
    if( ! (scene instanceof THREE.Scene ) ) {
        throw "second arg must be a THREE.Scene";
    }
    var bb = scene_bb;
    if( ! bb ) {
        console.log("without the scene bounding box, I have no idea where to position the camera.\n"+
                    "Please supply a bounding box like {minx: 0, maxx: 100, ...}");
    }
    var fovy = inits && inits.fovy ? inits.fovy : 75;  // default fovy is 75
    if( TW.lastClickTarget === null ) {
        console.warn("It seems that you did not invoke TW.mainInit; doing it for you.");
        TW.mainInit(renderer,scene);
    }
    var canvas = TW.lastClickTarget;
    var state = canvas.TW_state;
    state.sceneBoundingBox = scene_bb;
    var camParams = TW.cameraSetupParams(scene_bb,fovy);
    state.cameraParams = camParams;
    var camera = new THREE.PerspectiveCamera(fovy, canvas.clientWidth/canvas.clientHeight,
                                             0.5 * camParams.near,
                                             2.0 * camParams.far);
    state.cameraObject = camera
    scene.add(camera);

    // adjust size of axisHelper to sceneRadius
    // TODO: position the axisHelper at center of scene, in case origin is off-screen
    var ah = scene.getObjectByName("AxisHelper");
    ah.size = camParams.sceneRadius;
    TW.addSceneBoundingBoxHelper(scene);
    TW.addGroundHelper(scene,bb);

    state.render = function () { renderer.render(scene, camera); }
    TW.render = state.render;

    TW.viewFromFront();
    state.render();
    return state;
};

var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -8, maxx: 8,
                            miny: -8, maxy: 8,
                            minz: -1, maxz: 1},
                           cameraFOVY);

camera = state.cameraObject;
TW.render();

TW.debug = true;  // causes keys to be shown

function togglePaper() {
    if(scene.getObjectByName("zzero") == zzeroPlane) {
        scene.remove(zzeroPlane);
    } else {
        scene.add(zzeroPlane);
    }
    TW.render();
}


var canvas = TW.lastClickTarget;
canvas.addEventListener( 'mousedown', onMouseDown, false );
canvas.addEventListener( 'mousemove', onMouseMove, false );
canvas.addEventListener( 'mouseup', onMouseUp, false );
TW.setKeyboardCallback('p',togglePaper,"toggle paper");
TW.setKeyboardCallback('l',remakeLatheObj,"make lathe object");
TW.setKeyboardCallback('s',remakeSplineObj,"make spline object");

