// Probably add this to TW soon.

TW.linearMap = function(x,minx,maxx,miny,maxy) {
    //Transforms x from [minx,maxx] to y in [miny,maxy]
    //t is in [0,1]
    t = (x-minx)/(maxx-minx);
    y = t*(maxy-miny)+miny;
    return y;
};

// Parameters of the scene and animation:
var guiParams = {
    ballRadius: 1,
    ballBouncePeriod: 3,  // time to bounce once, in arbitrary time units
    maxBallHeight: 8,     // of the center
    deltaT: 0.035,        // time between steps, in arbitrary time units
    lastparam: null
};

// State variables of the animation
var animationState;

// sets the animationState to its initial setting

function resetAnimationState() {
    animationState = {
        ballHeight: guiParams.maxBallHeight, // fall from highest height
        time: 0,
        lastParam: null
    };
}

resetAnimationState();

var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();
TW.mainInit(renderer,scene);
TW.cameraSetup(renderer,
               scene, 
               {minx: -guiParams.ballRadius, maxx: guiParams.ballRadius,
                miny: 0, maxy: guiParams.maxBallHeight+guiParams.ballRadius,
                minz: -guiParams.ballRadius, maxz: guiParams.ballRadius});

// needs to be a global so we can update its position
var ball;
var ground;

function makeScene() {
    scene.remove(ball);
    var ballMat = new THREE.MeshNormalMaterial();
    var ballG =  new THREE.SphereGeometry(guiParams.ballRadius,30,30);
    ball = new THREE.Mesh(ballG,ballMat);
    scene.add(ball);
    scene.remove(ground);
    ground = new THREE.Mesh( new THREE.PlaneGeometry(10,10),
                             new THREE.MeshBasicMaterial({color:0x009900}) );
    ground.position.set(0,-guiParams.ballRadius,0);
    ground.rotation.x = -Math.PI/2;
    scene.add(ground);
}
makeScene();
                
function setBallPosition(time) {
    // rescale the Time dimension so that 
    // P, the period of bouncing, maps to pi
    var angle = time * Math.PI / guiParams.ballBouncePeriod; 
    var abs_cos = Math.abs(Math.cos(angle));
    var ballHeight = TW.linearMap(abs_cos, 0, 1, 
                                  guiParams.ballRadius, guiParams.maxBallHeight);
    ball.position.y = ballHeight;
    return ballHeight;
}

function firstState() {
    resetAnimationState();
    animationState.ballHeight = setBallPosition(animationState.time);
    TW.render();
}

function updateState() {
    // changes the time and everything in the state that depends on it
    animationState.time += guiParams.deltaT;
    var time = animationState.time;
    var ballHeight = setBallPosition(time);
    console.log("time is now "+time+" and ball is at height "+ballHeight);
    animationState.ballHeight = ballHeight;
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
gui.add(guiParams,"ballRadius",0.1,3)
    .onChange(function(){ makeScene(); TW.render(); });
gui.add(guiParams,"deltaT",0.001,0.999).step(0.001);
gui.add(guiParams,"ballBouncePeriod",1,30).step(1);
