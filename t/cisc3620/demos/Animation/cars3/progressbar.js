/* Returns a mesh that includes two methods for simulation. This progress bar
   just grows in length during the simulation.

*/

function makeProgressBar(color) {
    if( typeof color == "undefined" ) {
        color = THREE.ColorKeywords.white;
    }
    var start = new THREE.Vector3(0,0,0);
    var end = new THREE.Vector3(0,0,0);
    var geom = new THREE.Geometry();
    geom.vertices = [ start, end ];
    var mesh = new THREE.Line( geom, new THREE.LineBasicMaterial({color: color, linewidth: 5}) );

    // Two animation methods to define
    
    // resets the x coordinate of the end to 0.
    
    mesh.initialize = function () {
        this.time = 0;
        this.geometry.vertices[1].x = 0;
        this.geometry.verticesNeedUpdate = true;
    };

    mesh.update = function (dt) {
        this.time += dt;
        this.geometry.vertices[1].x = this.time;
        this.geometry.verticesNeedUpdate = true;
    }

    return mesh;
}
