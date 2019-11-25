/* This camera is designed to move either along VPN (in the direction the
camera is facing) or VRIGHT (to the camera's right).

The rotateTo function rotates the camera to face the location of the
event. It does this by using the NDC (normalized device coordinates) as
fractions of the FOVY and FOVX.  The FOVX is computed when the camera is
created.

The function below is common to both flying (both pan and tilt) and
driving (pan only).  "Pan" means to turn left/right in a horizontal plane
(perpendicular to Vup).  "Tilt" means to turn up/down in a vertical plane
(perpendicular to VRIGHT and in the plane that contains both VUP and
VPN.  */

function makeCommonCamera(renderer, scene_bb, fovy, moveStep, turnStep, isFlying) 
{
    var camParams = TW.cameraSetupParams(scene_bb, fovy);
    var canvas = renderer.domElement;
    var ar = canvas.clientWidth/canvas.clientHeight;
    var camera = new THREE.PerspectiveCamera(fovy, ar,
                                             0.5 * camParams.near,
                                             2.0 * camParams.far);
    
    // compute and store fovx, for use by rotateTo()
    var fovy_half_rad = 0.5 * THREE.Math.degToRad(fovy); // half angle, in radians
    var frustum_height = 2 * camParams.near * Math.tan( fovy_half_rad ); // in world coordinates
    var frustum_width = ar * frustum_height; // also in world coordinates
    var fovx_half_rad = Math.atan(0.5 * frustum_width / camParams.near); // in radians
    camera.fovy_half_rad = fovy_half_rad;
    camera.fovx_half_rad = fovx_half_rad;
    
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

    // method to rotate around Vup, thereby panning left/right. 
    // Positive rotations pan to the left
    camera.panBy = function (angle) {
        // change the coordinates of VPN. Awesome that THREE.js has this method
        this.vpn.applyAxisAngle( this.up, angle );
        this.vright.applyAxisAngle( this.up, angle );
        this.at.addVectors( this.position, this.vpn );
        this.lookAt(this.at);
    };
        
    // method to rotate around Vright, thereby tilting up/down.  Positive
    // rotations tilt up. This method is disabled for driving cameras.
    camera.tiltBy = function (angle) {
        if( ! isFlying ) return;
        // change the coordinates of VPN. Awesome that THREE.js has this method
        this.vpn.applyAxisAngle( this.vright, angle );
        this.up.applyAxisAngle( this.vright, angle );
        this.at.addVectors( this.position, this.vpn );
        this.lookAt(this.at);
    };

    // this isn't really a method (no 'this'); it's a function that closes
    // over 'camera'. It rotates the camera to face the location of the
    // event object (e.g. a mouse click).

    camera.rotateTo = function(event) {
        if( ! event.shiftKey) return; 
        var click_info = TW.convertMousePositionToNDC(event);
        // here's a very different approach. We'll use the FOV_Y (and also
        // compute a FOV_X and use that), and the NDC x and y coordinates
        // are just fractions of those angles.  We can then use the
        // panBy() and tiltBy() methods.
        var tilt_angle = camera.fovy_half_rad * click_info.y;
        var pan_angle  = camera.fovx_half_rad * click_info.x * -1;
        console.log('tilting by '+THREE.Math.radToDeg(tilt_angle));
        console.log('panning by '+THREE.Math.radToDeg(pan_angle));
        camera.panBy( pan_angle );
        camera.tiltBy( tilt_angle );
    };

    // this isn't really a method (no 'this'); it's a function that closes
    // over 'camera'
    camera.onKeyPress = function (event) {
        var ch = String.fromCharCode(event.keyCode);
        switch (ch) {
        case 'w': camera.moveForward(); break;
        case 's': camera.moveBackward(); break;
        case 'd': camera.moveRight(); break;
        case 'a': camera.moveLeft(); break;
        case 'j': camera.panBy( +1 * Math.PI/8 ); break;
        case 'l': camera.panBy( -1 * Math.PI/8 ); break;
        case 'i': camera.tiltBy( +1 * Math.PI/8 ); break;
        case 'k': camera.tiltBy( -1 * Math.PI/8 ); break;
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

function makeDrivingCamera(renderer, scene_bb, fovy, moveStep, turnStep) {
    return makeCommonCamera(renderer, scene_bb, fovy, moveStep, turnStep, false);
}

function makeFlyingCamera(renderer, scene_bb, fovy, moveStep, turnStep) {
    return makeCommonCamera(renderer, scene_bb, fovy, moveStep, turnStep, true);
}
