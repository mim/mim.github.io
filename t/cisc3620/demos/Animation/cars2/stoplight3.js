/* Returns a mesh that includes two methods for simulation. These lights
 * have a duration for green, yellow and red that repeats infinitely.

The initialization params include the following properties and default
values given in makeStoplightDefaults.

*/


var makeStoplightDefaults = {
    radius: 1,
    offset: 3,
    timeRed: 15,
    timeYellow: 5,
    timeGreen: 25
};

function makeStoplight(params) {

    if( typeof params == "undefined" ) {
        return makeStoplightParams();
    } else {
        return makeStoplightParams(params.radius,
                                   params.offset,
                                   params.timeRed,
                                   params.timeYellow,
                                   params.timeGreen);
    }
}

function makeStoplightParams( radius, offset, timeRed, timeYellow, timeGreen ) {
    radius = radius || makeStoplightDefaults.radius;
    offset = offset || makeStoplightDefaults.offset;
    timeRed = timeRed || makeStoplightDefaults.timeRed;
    timeYellow = timeYellow || makeStoplightDefaults.timeYellow;
    timeGreen = timeGreen || makeStoplightDefaults.timeGreen;

    // some pre-computed values
    var redColor = new THREE.Color(THREE.ColorKeywords.red);
    var greenColor = new THREE.Color(THREE.ColorKeywords.green);
    var yellowColor = new THREE.Color(THREE.ColorKeywords.yellow);

    var cycleLength = timeRed+timeGreen+timeYellow;

    // Some core functions

    // returns the color for the given time 0 <= time <= cycleLength;
    function basic(time) {
        if( time < timeRed ) {
            return redColor;
        } else if ( time < timeRed+timeGreen ) {
            return greenColor;
        } else if ( time < cycleLength ) {
            return yellowColor;
        } else {
            throw "invalid time: "+time;
        }
    }

    var startColor = basic(offset);

    // Ready to get to work. Use white for color here, but color will
    // really be set by the "initialize" method.  If you see a white
    // traffic light, it means you forgot to initialize() it.
    
    var mesh = new THREE.Mesh(new THREE.SphereGeometry(radius,8,8),
                              new THREE.MeshBasicMaterial({color: 0xffffff}));

    // Two animation methods to define
    
    mesh.initialize = function () {
        this.material.color = startColor;
        this.time = 0;
    };

    /* This update method uses a phase offset, so that the light doesn't
     * have to be red at time zero. */

    mesh.update = function (dt) {
        this.time += dt;
        var color2 = basic( (this.time+offset) % cycleLength );
        if( color2 != this.material.color ) {
            console.log("at time "+this.time+" light changes to "+color2.getHexString());
            this.material.color = color2;
        }
    }

    return mesh;
}
