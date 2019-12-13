function barnScene() {

// We always need a scene

var scene = new THREE.Scene();

// ====================================================================

/* Next, we create objects in our scene. Here, the <q>classic</q>
barn. The front left bottom vertex of the barn is the origin, so, for
example, the x coordinates go from 0 to 20. */

var barnWidth = 20;
var barnHeight = 30;
var barnDepth = 40;

var barnGeometry = TW.createBarn( barnWidth, barnHeight, barnDepth );

// the createMesh function adds a "demo" material to the geometry

var barnMesh = TW.createMesh( barnGeometry );

// the scene is the set of things to render, so add the barn

scene.add(barnMesh);

// ================================================================

// We always need a renderer

var renderer = new THREE.WebGLRenderer();
renderer.domElement.width = 300;
renderer.domElement.height = 300;

TW.mainInit(renderer, scene, {parentID: "barnDiv"});

/* We always need a camera; here we'll use a default orbiting camera.  The
third argument gives the ranges for the coordinates, to help with setting up
the placement of the camera. They need not be perfectly accurate, but if
they are way off, your camera might not see anything, and you'll get a
blank canvas. */

TW.cameraSetup(renderer,
               scene,
               {minx: 0, maxx: barnWidth,
                miny: 0, maxy: 1.5 * barnHeight, // a bit low
                minz: -barnDepth, maxz: 0});
}


window.addEventListener("load", barnScene);

