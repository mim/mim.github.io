var globalTime = 0;
var globalDeltaT = 1;
var reportTime = false;

// Global function named for the method that gets invoked on each scene
// object that supports it.  This iterates over all the objects in the
// scene, and if the object supports an .initialize() method, it invokes
// it.

function initialize() {
    globalTime = 0;
    var kids = scene.children;
    var len = kids.length;
    for( var i = 0 ; i < len; i++ ) {
        var kid = kids[i];
        // this tests whether the kid has an initialize() method
        if( typeof kid.initialize === "function" ) {
            // if so, invoke it.
            kid.initialize();
        }
    }
    TW.render();
}

// Global function named for the method that gets invoked on each scene
// object that supports it. This iterates over all the objects in the
// scene, and if the object supports an .update() method, it invokes it.

function update(dt) {
    globalTime += dt;
    if(reportTime) console.log("Time is now "+globalTime);
    var kids = scene.children;
    var len = kids.length;
    for( var i = 0 ; i < len; i++ ) {
        var kid = kids[i];
        // this tests whether the kid has an update() method
        if( typeof kid.update === "function" ) {
            kid.update(dt);
        }
    }
    TW.render();
}

function oneStep() {
    update(globalDeltaT);
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

// ================================================================
// UI for animation

TW.setKeyboardCallback("0",initialize,"reset animation");
TW.setKeyboardCallback("1",oneStep,"advance by one step");
TW.setKeyboardCallback("g",startAnimation,"go:  start animation");
TW.setKeyboardCallback(" ",stopAnimation,"stop animation");
