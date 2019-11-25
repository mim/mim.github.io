/* Returns a mesh that includes two methods for simulation. Simplified
   stoplight with only red/green. See stoplight3 for a more sophisticated
   version.

The initialization params include the following properties and default
values given in makeStoplightDefaults.

*/

var makeStoplightDefaults = {
    radius: 1,
    timeRed: 15,
    timeGreen: 25
};

function makeStoplightParams( radius, timeRed, timeGreen ) {
    radius = radius || makeStoplightDefaults.radius;
    timeRed = timeRed || makeStoplightDefaults.timeRed;
    timeGreen = timeGreen || makeStoplightDefaults.timeGreen;

    // some pre-computed values
    var redColor = new THREE.Color(THREE.ColorKeywords.red);
    var greenColor = new THREE.Color(THREE.ColorKeywords.green);

    var cycleLength = timeRed+timeGreen;

    // Some core functions

    // returns the color for the given time 0 <= time <= cycleLength;
    function basic(time) {
        if( time < timeRed ) {
            return redColor;
        } else if ( time < cycleLength ) {
            return greenColor;
        } else {
            throw "invalid time: "+time;
        }
    }

    var startColor = basic(0);

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
        var color2 = basic( this.time % cycleLength );
        if( color2 != this.material.color ) {
            console.log("at time "+this.time+" light changes to "+color2.getHexString());
            this.material.color = color2;
        }
    }

    return mesh;
}
