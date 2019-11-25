
function makeMovingCamera(renderer, scene_bb, fovy, moveStep, turnStep) {
    var camParams = TW.cameraSetupParams(scene_bb, fovy);
    var canvas = renderer.domElement;
    var ar = canvas.clientWidth/canvas.clientHeight;
    console.log("ar: "+ar);
    var camera = new THREE.PerspectiveCamera(fovy, ar,
                                             0.5 * camParams.near,
                                             2.0 * camParams.far);
    
    // basic setup
    var center = camParams.center;
    camera.position.set(center.x, center.y, center.z + camParams.cameraRadius);
    camera.up.set(0,1,0);
    camera.lookAt(center);

    // getting ready to move
    camera.moveStep = moveStep;
    camera.turnStep = THREE.Math.degToRad(turnStep);
    camera.vpn = new THREE.Vector3(0,0,-1);
    camera.at = new THREE.Vector3();
    camera.at.addVectors( camera.position, camera.vpn );
    camera.vright = new THREE.Vector3(0,0,1);
    camera.forward = function () {
        this.position.addScaledVector( this.vpn, this.moveStep );
        this.at.addScaledVector( this.vpn, this.moveStep );
        this.lookAt(this.at);
    };
    camera.backward = function () {
        this.position.addScaledVector( this.vpn, -1 * this.moveStep );
        this.at.addScaledVector( this.vpn, -1 * this.moveStep );
        this.lookAt(this.at);
    };
    var yaxis = new THREE.Vector3(0,1,0);
    camera.rotateBy = function (angle) {
        // change the coordinates of VPN. Awesome that THREE.js has this method
        this.vpn.applyAxisAngle( yaxis, angle );
        this.at.addVectors( this.position, this.vpn );
        this.lookAt(this.at);
    }
        
    camera.left = function () {
        this.rotateBy( this.turnStep );
    };
    camera.right = function () {
        this.rotateBy( -1 * this.turnStep );
    };
        
    // Set up event handlers
    document.removeEventListener('keypress', TW.onkeypress);
    document.removeEventListener('keypress', TW.storeClickTarget);
    document.addEventListener('keypress', function (evt) { onKeyPress(evt, camera); });
    document.addEventListener('click', function (evt) { rotateTo(evt, camera) } );
    document.addEventListener('mousemove', function (evt) { if(!evt.shiftKey) return; rotateTo(evt, camera); });
    return camera;
}

function rotateTo(event, camera) {
    var click_info = TW.convertMousePositionToNDC(event);
    var to = new THREE.Vector3(click_info.x, click_info.y, 0);
    to.unproject(camera);
    // console.log('to unprojected is '+JSON.stringify(to));
    var v = new THREE.Vector3();
    v.subVectors(to, camera.position);
    // console.log('vector to TO is '+JSON.stringify(v));
    to.y = v.y;                 // flatten the TO vector into the same Y plane as the VPN
    var angle = v.angleTo(camera.vpn);
    // console.log('angle is '+THREE.Math.radToDeg(angle));
    angle = angle/10;           // to decrease the velocity a bit
    camera.rotateBy( click_info.x > 0 ?
                     -1 * angle :
                     angle );
}

function onKeyPress(event, camera) {
    var ch = String.fromCharCode(event.keyCode);
    switch (ch) {
    case 'w': camera.forward(); break;
    case 's': camera.backward(); break;
    case 'd': camera.right(); break;
    case 'a': camera.left(); break;
    }
}


