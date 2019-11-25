// Parameters of the scene and animation:
var guiParams = {
    vx: 0.01,
    vy: 0.02,
    vz: 0.04,
    lastparam: null
};

// State variables of the animation
var animationState;

// sets the animationState to its initial setting

function resetAnimationState() {
    animationState = {
        time: 0,
        // rotation angles
        rx: 0,
        ry: 0,
        rz: 0,
        lastParam: null
    };
}

resetAnimationState();

var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();
TW.mainInit(renderer,scene);
TW.cameraSetup(renderer,
               scene, 
               {minx: -5, maxx: 5,
                miny: -5, maxy: 5,
                minz: -5, maxz: 5});

// needs to be a global so we can update its position
var cube;

function makeScene() {
    scene.remove(cube);
    cube = new THREE.Mesh(new THREE.CubeGeometry(2,2,2),
                          new THREE.MeshNormalMaterial());
    scene.add(cube);
}
makeScene();
                
function updateState() {
    animationState.time += 1;
    // increase the total rotations by the user-specified velocity
    animationState.rx += guiParams.vx;
    animationState.ry += guiParams.vy;
    animationState.rz += guiParams.vz;
    // transfer the state info to the cube
    cube.rotation.x = animationState.rx;
    cube.rotation.y = animationState.ry;
    cube.rotation.z = animationState.rz;
}

function firstState() {
    resetAnimationState();
    TW.render();
}

                
function oneStep() {
    updateState();
    TW.render();
}
    
// Stored so that we can cancel the animation if we want
var animationId = null;                

function animate(timestamp) {
    oneStep();
    animationId = requestAnimationFrame(animate);
}

function stopAnimation() {
    if( animationId != null ) {
        cancelAnimationFrame(animationId);
        console.log("Cancelled animation using "+animationId);
    }
}

TW.setKeyboardCallback("0",firstState,"reset animation");
TW.setKeyboardCallback("1",oneStep,"advance by one step");
TW.setKeyboardCallback("g",animate,"go:  start animation");
TW.setKeyboardCallback(" ",stopAnimation,"stop animation");

var gui = new dat.GUI();
gui.add(guiParams,"vx",0,0.5);
gui.add(guiParams,"vy",0,0.5);
gui.add(guiParams,"vz",0,0.5);
