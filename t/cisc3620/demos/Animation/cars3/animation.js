var globalTime = 0;
var globalDeltaT = 1;
var reportTime = false;

// Global function named for the method that gets invoked on each scene
// object that supports it.

function initialize() {
    globalTime = 0;
    var kids = scene.children, len = kids.length, i;
    for( i = 0 ; i < len; i++ ) {
        var kid = kids[i];
        if( typeof kid.initialize === "function" ) {
            kid.initialize();
        }
    }
    TW.render();
}

// Global function named for the method that gets invoked on each scene
// object that supports it.


function update(dt) {
    globalTime += dt;
    if(reportTime) console.log("Time is now "+globalTime);
    var kids = scene.children, len = kids.length, i;
    for( i = 0 ; i < len; i++ ) {
        var kid = kids[i];
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


