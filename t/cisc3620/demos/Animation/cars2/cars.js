/* This creates a "car" object that is a mesh with an additional method to
 * help in moving the car. The method updates the car's position based on
 * its position and velocity. In this version, the cars have infinite
 * acceleration. The velocity is a property that you need to define. The
 * cars3 demo has acceleration, but the move() method is much more
 * complicated.

The car object constructor takes only a color, like a property of
THREE.ColorKeywords;

*/

var carSpeed = 3;  // probably should be a parameter

function makeCar(color) {
    var color = color || 0x0;   // default is black.
    var m = new THREE.Mesh( new THREE.BoxGeometry( 2, 3, 1 ),
                            new THREE.MeshBasicMaterial( { color: color } ));
    m.move = function (dt) {
        if( ! this.stopped ) {
            var pos = this.position; // THREE.js built-in
            var vel = this.velocity;
            if( typeof vel == "undefined" )
                throw "velocity not defined: ";
            var speed = vel.length();
            if( speed > 0 ) {
                console.log("moving at "+speed);
                // compute P += V*dt
                var tmpvel = vel.clone();
                tmpvel.multiplyScalar(dt);
                pos.add(tmpvel);
                console.log(globalTime+" car is at "+pos.x.toFixed(2)+","+pos.y.toFixed(2));
            }
        }
    };
    return m;
}

// ================================================================

// This is when the stoplight turns green.
// Coordinate this value with the stoplight code

var stoplightTurnsGreen = 15; 

// ================================================================

function makeOrangeCar() {
    var car = makeCar(THREE.ColorKeywords.orange);
    var initialPosition = new THREE.Vector3(0, -4, 0);
    car.initialize = function () {
        this.stopped = true;
        this.position.copy(initialPosition);
        this.velocity = new THREE.Vector3(0,0,0);
    }
    car.update = function (dt) {
        if( globalTime > stoplightTurnsGreen && this.stopped ) {
            console.log(globalTime + " orange car is starting");
            this.stopped = false;
            this.velocity.y = 1;
        }
        this.move(dt);
        console.log(globalTime+" orange car is now at "+this.position.y.toFixed(2));
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
    }
    car.update = function (dt) {
        if( globalTime > stoplightTurnsGreen && ! this.stopping ) {
            console.log(globalTime + " blue car is stopping");
            this.stopping = true;
            this.velocity.x = 0;
        }
        this.move(dt);
        console.log(globalTime+" blue car is now at "+this.position.x.toFixed(2));
    }
    return car;
}
