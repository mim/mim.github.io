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
    ballRadius: 5,
    ballBouncePeriod: 3,  // time to bounce once, in arbitrary time units
    maxBallHeight: 8,     // of the center
    deltaT: 0.035,        // time between steps, in arbitrary time units
    ballVelocityX: 0.8,
    ballInitialX: 50,
    ballBounceFactor: 0.8, 
    ballAngularVelocity: TW.degrees2radians(3),
    ballInitialAngle: -Math.PI/4,
    deltaT: 1,
    lastparam: null
};


var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();
TW.mainInit(renderer,scene);
TW.cameraSetup(renderer,scene, {minx: -50, maxx: 50,
                                miny: 0, maxy: guiParams.maxBallHeight+guiParams.ballRadius,
                                minz: -guiParams.ballRadius, maxz: guiParams.ballRadius});

var ball;                       // needs to be a global so we can update its position

TW.isPowerOf2 = function(x) {
    // Clever way to check if an integer is a power of two. If it's not a
    // positive integer; you're out of luck, so check for that before
    // using this. For our application (image dimensions), it works fine.
    // when we subtract 1 from an power of two, we get something that
    // shares no bits with it, so the bitwise and is false.  If it's not a
    // power of two, the borrow doesn't affect the larger power of two, so
    // the bitwise and is true.  See
    // http://www.exploringbinary.com/ten-ways-to-check-if-an-integer-is-a-power-of-two-in-c/
    return ((x != 0) && !(x & (x-1)));
}

TW.createStripesTexture = function (colors) {
    // returns an array containing a texel for each color in colors, which
    // must be an array whose length is a power of two.
    if( ! TW.isPowerOf2(colors.length) )
        throw "Length not a power of two: "+colors;
    var width = colors.length;
    var height = 1;
    var i, j, n = 0, len = width * height * 3;
    var data = new Uint8Array( len );
    data.width = width;
    data.height = height;
    for(i = 0; i < width; i++ ) {
        var c = colors[i];
        if( typeof c == 'number' ) {
            TW.rowMajorAsetRGB(data,0,i, 0xFF&(c>>16), 0xFF&(c>>8), 0xFF&(c));
        } else if( c instanceof THREE.Color ) {
            TW.rowMajorAsetRGB(data,0,i, c.r, c.g, c.b);
        } else {
            throw "dunno how to handle color: " + c;
        }
    }
    return data;
};

TW.createIrishDataTexture = function () {
    var data = TW.createStripesTexture( [TW.ORANGE, TW.WHITE, TW.GREEN, TW.WHITE,
                                         TW.ORANGE, TW.WHITE, TW.GREEN, TW.WHITE ] );
    var obj = new THREE.DataTexture( data, 8, 1, THREE.RGBFormat);
    obj.minFilter = THREE.NearestFilter;
    obj.magFilter = THREE.NearestFilter;
    obj.needsUpdate = true;
    return obj;
};                                         

function cylinderAroundZ(radius) {
    var obj = new THREE.Object3D();
    var cyl = new THREE.CylinderGeometry(radius,radius,20);
    // add colorful texture?
    var mat = new THREE.MeshBasicMaterial();
    mat.map = TW.createIrishDataTexture();
    var cylMesh = new THREE.Mesh(cyl,mat);
    cylMesh.rotateX(Math.PI/2);
    obj.add(cylMesh);
    var axes = new THREE.AxisHelper(30);
    obj.add(axes);
    return obj;
}

function printTextureParams(quad) {
    var elt = quad.faceVertexUvs[0]; // dunno why they have this 1-elt array
    console.log("face0: "+JSON.stringify(elt[0]));
    console.log("face1: "+JSON.stringify(elt[1]));
}
    
// Took this from demos/TextureMapping/PlaneTutor.html
function updateTextureParams(quad, sMin, sMax, tMin, tMax) {
    var elt = quad.faceVertexUvs[0]; // dunno why they have this 1-elt array
    var face0 = elt[0];
    face0[0] = new THREE.Vector2(sMin,tMax);
    face0[1] = new THREE.Vector2(sMin,tMin);
    face0[2] = new THREE.Vector2(sMax,tMax);
    var face1 = elt[1];
    face1[0] = new THREE.Vector2(sMin,tMin);
    face1[1] = new THREE.Vector2(sMax,tMin);
    face1[2] = new THREE.Vector2(sMax,tMax);
    printTextureParams(quad);
    quad.uvsNeedUpdate = true;
}

function makeScene() {
    scene.remove(ball);
    var ballMat = new THREE.MeshNormalMaterial();
    // var ballG =  new THREE.SphereGeometry(guiParams.ballRadius,30,30);
    // ball = new THREE.Mesh(ballG,ballMat);
    ball = cylinderAroundZ(guiParams.ballRadius);
    ball.position.y = guiParams.ballRadius;
    scene.add(ball);
    
    // ground
    groundPlane = new THREE.PlaneGeometry(100,20);
    var s = 100/(2*Math.PI*guiParams.ballRadius);
    console.log("can roll "+s+" revolutions");
    // set new texture coords:
    updateTextureParams( groundPlane, 0, s, 0, 1 );
    irish = TW.createIrishDataTexture();
    irish.wrapS = THREE.RepeatWrapping;
    irish.wrapT = THREE.RepeatWrapping;
    irish.needsUpdate = true;
    var groundMat = new THREE.MeshBasicMaterial({color: THREE.ColorKeywords.white, map: irish});
    ground = new THREE.Mesh(groundPlane,groundMat);
    ground.rotateX(-Math.PI/2);
    ground.rotateZ(Math.PI);    // reverse direction, so material goes right to left
    scene.add(ground);
}
makeScene();
                
// ================================================================

// State variables of the animation
var animationState;

function resetAnimationState() {
    animationState = {
        ballAngle: guiParams.ballInitialAngle,
        ballX: guiParams.ballInitialX,
        time: 0,
        lastParam: null
    };
    ball.position.x = guiParams.ballInitialX;
    ball.rotation.set(0,0,0);
    ball.rotateZ(guiParams.ballInitialAngle);
}

resetAnimationState();

function firstState() {
    resetAnimationState();
    TW.render();
}

function updateBallPosition(time) {
    //rescale the Time dimension so that P, the period of bouncing, maps to pi
    // var angle = time * Math.PI / guiParams.ballBouncePeriod; 
    //     var abs_cos = Math.abs(Math.cos(angle));
    //     var decay = Math.pow(guiParams.ballBounceFactor,time);
    //     var height = abs_cos * decay
    //     var ballHeight = TW.linearMap(height, 0, 1, guiParams.ballRadius, guiParams.maxBallHeight);
    //     ball.position.y = ballHeight;
    //     ballX = guiParams.ballInitialX + guiParams.ballVelocityX * time;
    //     ball.position.x = ballX;
    //     return ballHeight;

    var deltaAngle = guiParams.ballAngularVelocity * guiParams.deltaT;
    animationState.ballAngle += deltaAngle; // in radians
    // if the ball w/ radius R rotates by r radians, the ball rolls R * r units but to the *left*
    animationState.ballX += -1 * guiParams.ballRadius * deltaAngle;
    ball.position.x = animationState.ballX;
    ball.rotateZ(deltaAngle);
    // ball.rotation.z = animationState.ballAngle;
    console.log("time is "+time+": deltaAngle is "+deltaAngle+" ball is now at "+ball.position.x+" and "+ball.rotation.z);
}


function updateState() {
    // changes the time and everything in the state that depends on it
    animationState.time += guiParams.deltaT;
    updateBallPosition(animationState.time);
}
                
function oneStep() {
    updateState();
    TW.render();
}
    

var animationId = null;                // so we can cancel the animation if we want

function animate(timestamp) {
    oneStep();
    animationId = requestAnimationFrame(animate);
}

function stopAnimation() {
    if( animationId != null ) {
        cancelAnimationFrame(animationId);
    }
}

TW.setKeyboardCallback("0",firstState,"reset animation");
TW.setKeyboardCallback("1",oneStep,"advance by one step");
TW.setKeyboardCallback("g",animate,"go:  start animation");
TW.setKeyboardCallback(" ",stopAnimation,"stop animation");

var gui = new dat.GUI();
// gui.add(guiParams,"ballRadius",0.5,10).onChange(function(){makeScene();firstState();TW.render();});
gui.add(guiParams,"deltaT",0.1,10).step(0.1);
