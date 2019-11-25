// We always need a scene.
var scene = new THREE.Scene();

// ================================================================
// 
// We always need a renderer

var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer,scene);

makeTown(scene);

// ================================================================
// New for this series of demos, where we'll eventually set up 
// and control our own camera.

function handleMouseClick(mx,my,clickNear,clickFar) {
    scene.add(createLine(clickNear,clickFar));
}

document.addEventListener( 'click', onMouseClick, false );

var camera;

var cameraFOVY = 75;

var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -6, maxx: 6,
                            miny: 0, maxy: 4,
                            minz: -6, maxz: 6},
                           cameraFOVY);

camera = state.cameraObject;
TW.render();

// ================================================================
var spinning = false;

var animID = null;

function firstState() {
    scene.rotation.y = 0;
    TW.render();
}

function oneStep() {
    scene.rotation.y += TW.degrees2radians(2);
    TW.render();
}

function stopAnimation() {
    if( animID == null ) {
        console.log("no animation to stop");
    } else {
        cancelAnimationFrame(animID);
        animID = null;
    }
}

function spinY() {
    oneStep();
    animID = requestAnimationFrame(spinY);
}

function startSpinY() {
    if( spinning ) {
        stopAnimation();
    }
    animID = requestAnimationFrame(spinY);
}

function stopAnimation() {
    if( animID != null ) {
        cancelAnimationFrame(animID);
    }
}

TW.debug = true;  // causes keys to be shown
TW.setKeyboardCallback('0',firstState,"reset animation");
TW.setKeyboardCallback('1',oneStep,"advance by one step");
TW.setKeyboardCallback('Y',startSpinY,"spin around Y");
TW.setKeyboardCallback('s',startSpinY,"spin around Y");
TW.setKeyboardCallback(' ',stopAnimation,"spin around Y");
