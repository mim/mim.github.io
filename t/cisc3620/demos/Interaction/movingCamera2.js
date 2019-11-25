function makeDrivingCamera(renderer, scene_bb, fovy, moveStep, turnStep) {
    var camParams = TW.cameraSetupParams(scene_bb, fovy);
    var canvas = renderer.domElement;
    var ar = canvas.clientWidth/canvas.clientHeight;
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
    camera.vright = new THREE.Vector3(1,0,0);

    // ================================================================

    camera.moveForward = function () {
        this.position.addScaledVector( this.vpn, this.moveStep );
        this.at.addScaledVector( this.vpn, this.moveStep );
        this.lookAt(this.at);
    };
    camera.moveBackward = function () {
        this.position.addScaledVector( this.vpn, -1 * this.moveStep );
        this.at.addScaledVector( this.vpn, -1 * this.moveStep );
        this.lookAt(this.at);
    };

    camera.moveRight = function () {
        this.position.addScaledVector( this.vright, this.moveStep );
        this.at.addScaledVector( this.vright, this.moveStep );
        this.lookAt(this.at);
    };

    camera.moveLeft = function () {
        this.position.addScaledVector( this.vright, -1 * this.moveStep );
        this.at.addScaledVector( this.vright, -1 * this.moveStep );
        this.lookAt(this.at);
    };
        
    // ================================================================

    camera.rotateBy = function (angle) {
        // change the coordinates of VPN. Awesome that THREE.js has this method
        this.vpn.applyAxisAngle( this.up, angle );
        this.vright.applyAxisAngle( this.up, angle );
        this.at.addVectors( this.position, this.vpn );
        this.lookAt(this.at);
    };
        
    // this isn't really a method (no 'this'); it's a function that closes over 'camera'
    camera.rotateTo = function(event) {
        if( ! event.shiftKey) return; 
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
        angle = camera.turnStep * angle;           // to adjust the velocity a bit
        camera.rotateBy( click_info.x > 0 ?
                         -1 * angle :
                         angle );
    };

    // this isn't really a method (no 'this'); it's a function that closes over 'camera'
    camera.onKeyPress = function (event) {
        var ch = String.fromCharCode(event.keyCode);
        switch (ch) {
        case 'w': camera.moveForward(); break;
        case 's': camera.moveBackward(); break;
        case 'd': camera.moveRight(); break;
        case 'a': camera.moveLeft(); break;
        case 'q': camera.rotateBy( Math.PI/8 ); break;
        case 'e': camera.rotateBy( -1 * Math.PI/8 ); break;
        }
    };

    // Set up event handlers
    document.removeEventListener('keypress', TW.onkeypress);
    document.removeEventListener('click', TW.storeClickTarget);
    document.addEventListener('keypress', camera.onKeyPress );
    document.addEventListener('click', camera.rotateTo );
    document.addEventListener('mousemove', camera.rotateTo );
    return camera;
}

// ================================================================

function makeFlyingCamera(renderer, scene_bb, fovy, moveStep, turnStep) {
    var camera = makeDrivingCamera(renderer, scene_bb, fovy, moveStep, turnStep);
    
    // ================================================================

    camera.orientToClick = function(to) {
        to.unproject(this);
        console.log('EYE: ',JSON.stringify(this.position));
        console.log('AT: ',JSON.stringify(this.at));
        console.log('old VPN: ',JSON.stringify(this.vpn));
        console.log('old VUP: ',JSON.stringify(this.up));
        console.log('old VRIGHT: ',JSON.stringify(this.vright));
        console.log('to: ',JSON.stringify(to));
        var m = new THREE.Matrix4();
        m.lookAt(this.position, to, this.up);
        this.vpn.applyMatrix4(m);
        this.vright.applyMatrix4(m);
        this.at.addVectors( this.position, this.vpn );
        console.log('new VPN: ',JSON.stringify(this.vpn));
        console.log('new VUP: ',JSON.stringify(this.up));
        console.log('new VRIGHT: ',JSON.stringify(this.vright));
    };

    camera.orientToEvent = function(event) {
        var click_info = TW.convertMousePositionToNDC(event);
        var to = new THREE.Vector3(click_info.x, click_info.y, 0);
        camera.orientToClick(to);
    };

    // Set up event handlers
    document.removeEventListener('click', camera.rotateTo );
    document.removeEventListener('mousemove', camera.rotateTo );
    document.addEventListener('click', camera.orientTo );
    document.addEventListener('mousemove', camera.orientTo );
    return camera;
}
