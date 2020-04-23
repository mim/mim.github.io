// Invoke this to add texture coordinates to all the barn vertices.

// I'm showing you this source code conscious that you may study it to
// understand the text coordinates for each vertex and how they are
// set.  You may make use of this code however you like, including
// modifying or re-writing it.

function addTextureCoords(barnGeom) {
    if( ! barnGeom instanceof THREE.Geometry ) {
        throw "not a THREE.Geometry: "+barnGeom;
    }
    // array of face descriptors
    var UVs = [];
    function faceCoords(as,at, bs,bt, cs,ct) {
        UVs.push( [ new THREE.Vector2(as,at),
                    new THREE.Vector2(bs,bt),
                    new THREE.Vector2(cs,ct)] );
    }
    // front
    faceCoords(0,0, 1,0, 1,1);
    faceCoords(0,0, 1,1, 0,1);
    faceCoords(0,1, 1,1, 0.5,1);  // special for the upper triangle

    // back.  Vertices are not quite analogous to the front, alas
    faceCoords(1,0, 0,1, 0,0);
    faceCoords(1,0, 1,1, 0,1);
    faceCoords(0,1, 1,1, 0.5,1);  // special for upper triangle

    //roof
    faceCoords(1,0, 1,1, 0,0);
    faceCoords(1,1, 0,1, 0,0);
    faceCoords(0,0, 1,0, 1,1);
    faceCoords(0,1, 0,0, 1,1);

    // sides
    faceCoords(1,0, 0,1, 0,0);
    faceCoords(1,1, 0,1, 1,0);
    faceCoords(1,0, 1,1, 0,0);
    faceCoords(1,1, 0,1, 0,0);

    // floor
    faceCoords(0,0, 1,0, 0,1);
    faceCoords(1,0, 1,1, 0,1);

    // Finally, attach this to the geometry
    barnGeom.faceVertexUvs = [ UVs ];
}
