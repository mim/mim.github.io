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
scene.add(zzeroPlane);

var points = [];

var raycaster = new THREE.Raycaster();

function handleMouseClick(mx,my,clickNear,clickFar) {
    var dir = clickFar.clone();
    dir.sub(clickNear).normalize();
    raycaster.set( clickNear, dir );
    intersects = raycaster.intersectObject(zzeroPlane);
    if(intersects.length == 0) {
        console.log('no intersection');
        return;
    }
    point = intersects[0].point.clone();
    if( Math.abs(point.z) > 0.000001 ) {
        console.log("Something is wrong in this intersection");
    }
    point.z = 0;                // in case there's a tiny, non-zero bit
    points.push(point);
    addSphereAt(point);
    TW.render();
}

document.addEventListener( 'click', onMouseClick, false );

function addSphereAt(pt) {
    var sph = new THREE.Mesh( new THREE.SphereGeometry(0.5),
                              new THREE.MeshNormalMaterial());
    sph.position.copy(pt);
    scene.add(sph);
}

var cameraFOVY = 75;

var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -10, maxx: 10,
                            miny: -10, maxy: 10,
                            minz: -1, maxz: 1},
                           cameraFOVY);

camera = state.cameraObject;
TW.render();

TW.debug = true;  // causes keys to be shown
