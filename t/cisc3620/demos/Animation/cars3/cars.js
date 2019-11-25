/* This creates a "car" object that is a mesh with an additional method to
 * help in moving the car. The method updates the car's position based on
 * its position, velocity and acceleration. The latter two are new
 * properties that you need to define.

The car object constructor takes only a color, like a property of
THREE.ColorKeywords;

*/

var carSpeed = 15;

function makeCar(color) {
    var color = color || 0x0;   // default is black.
    var m = new THREE.Mesh( new THREE.BoxGeometry( 6, 9, 3 ),
                            new THREE.MeshBasicMaterial( { color: color } ));
    m.move = function (dt) {
        if( ! this.stopped ) {
            var pos = this.position; // THREE.js built-in
            var vel = this.velocity;
            if( typeof vel == "undefined" )
                throw "velocity not defined: ";
            var acc = this.acceleration;
            if( typeof acc == "undefined" )
                throw "acceleration not defined: ";
            var accmag = acc.length();
            var speed = vel.length();
            if( accmag > 0 ) {
                console.log(globalTime+" changing velocity by: "+accmag);
                console.log(globalTime+" curr velocity is: "+vel.length());
                var tmpacc = acc.clone();
                tmpacc.multiplyScalar(dt);
                var oldvel = vel.clone();
                vel.add(tmpacc);
                speed = vel.length(); // updated speed
                if( speed == 0 || oldvel.dot(vel) < 0 ) {
                    console.log(globalTime+" acceleration has reversed our velocity, so stop");
                    this.stopped = true;
                    vel.set(0,0,0);
                    acc.set(0,0,0);
                } else if ( speed >= carSpeed ) {
                    // we don't want to speed up indefinitely; only until we hit top speed
                    console.log(globalTime+" car reached top speed");
                    acc.set(0,0,0);
                }
                console.log(globalTime+" new velocity is "+speed);
            }

            if( speed > 0 ) {
                console.log("moving at "+speed);
                var tmpvel = vel.clone();
                tmpvel.multiplyScalar(dt);
                pos.add(tmpvel);
                console.log(globalTime+" car is at "+pos.x+","+pos.y);
            }
        }
    };
    return m;
}

// ================================================================

// This is when the stoplight turns green.
// Coordinate this value with the stoplight code

var stoplightTurnsGreen = 6; 

// ================================================================

function makeOrangeCar() {
    var car = makeCar(THREE.ColorKeywords.orange);
    var initialPosition = new THREE.Vector3(0, -4, 0);
    car.initialize = function () {
        this.stopped = true;
        this.position.copy(initialPosition);
        this.velocity = new THREE.Vector3(0,0,0);
        this.acceleration = new THREE.Vector3(0,0,0);
    }
    car.update = function (dt) {
        if( globalTime > stoplightTurnsGreen && this.stopped ) {
            console.log(globalTime + " orange car is starting");
            this.stopped = false;
            this.acceleration.y = 1;
        }
        this.move(dt);
        console.log(globalTime+" orange car is now at "+this.position.y);
    }
    return car;
}

// ================================================================

function makeBlueCar() {
    var car = makeCar(THREE.ColorKeywords.blue);
    // the global halfSize will be defined when this function is invoked.
    // at the extreme left, facing to the right
    var initialPosition = new THREE.Vector3(-halfSize-2, 0, 0);
    car.initialize = function () {
        this.stopped = false;
        this.stopping = false;
        this.position.copy(initialPosition);
        this.rotateZ( Math.PI/2 );
        this.velocity = new THREE.Vector3(carSpeed,0,0);
        this.acceleration = new THREE.Vector3(0,0,0);
    }
    car.update = function (dt) {
        if( globalTime > stoplightTurnsGreen && ! this.stopping ) {
            console.log(globalTime + " blue car is stopping");
            this.stopping = true;
            this.acceleration.x = -1;
        }
        this.move(dt);
        console.log(globalTime+" blue car is now at "+this.position.x);
    }
    return car;
}
