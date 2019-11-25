TW.createUVtexture = function (log2size) {
    /* returns an array containing an RGB texture somewhat like the UV_Grid, but
     as a data texture. 
     the upper left is red (1,0,0)
     the upper right is green, (0,1,0)
     the lower left is magenta (1,0,1)
     the lower right is blue (0,0,1)
     So, as we go from top to bottom (increasing t), we increase the blue 
     As we go from left to right (increasing s), we decrease red and green
     Hmm. I'd rather have the lower right be cyan (0,1,1).

    Size is width x height where height = width = 2^log2size
     */
    var height = TW.power2(log2size);
    var width = height;
    var i, j, n = 0, len = width * height * 3;
    var data = new Uint8Array( len );
    data.width = width;
    data.height = height;
    for( i = 0 ; i < len; i++ ) data[i] = 0x80;  // initialize all to 50% gray
     
    // "colors". 
    var RED = 0x00;
    var WHITE = 0xFF;
    var BLUE = 0x00;
    // compute flag specs
    var stripe_height = Math.floor(height / 13);
    if( stripe_height < 1 ) {
        throw "size isn't big enough for 13 stripes: "+height;
    }
    var hoist = stripe_height * 13;
    var fly = Math.floor(hoist * 1.9);      // from flag spec
    // console.log("hoist and fly: "+hoist+", "+fly);

    function doStripe(stripeNum,color) {
        var startrow = stripeNum*stripe_height;
        var nextrow  = (stripeNum+1)*stripe_height;
        var r, c;
        for( r = startrow; r < nextrow; r++ ) {
            for( c = 0 ; c < fly; c++ ) {
                TW.rowMajorAset(data,r,c,color);
            }
        }
    }
    
    // console.log("doing 7 red (black) stripes");
    for( i = 0 ; i < 13 ; i+=2 ) doStripe( i, RED );
    // console.log("doing 6 white stripes");
    for( i = 1 ; i < 13 ; i+=2 ) doStripe( i, WHITE );
    // union
    var unionHoist = 7 * stripe_height;
    var unionFly = Math.round(0.76 * hoist); // from flag spec
    for( i = 0 ; i < unionHoist; i++ )
        for( j = 0 ; j < unionFly; j++ )
            TW.rowMajorAset(data,i,j,BLUE);
    return data;
};

function doFaces(mesh, func) {
    var geom;
    if( mesh instanceof THREE.Mesh ) {
        geom = mesh.geometry;
    } else if ( mesh instanceof THREE.Geometry ) {
        geom = mesh;
    } else {
        throw "invalid arg type, should be Mesh or Geometry: "+mesh;
    }
    var i, verts = geom.vertices, faces = geom.faces, texCoords = geom.faceVertexUvs[0];
    for( i = 0; i < faces.length; i++ ) {
        func(faces[i], texCoords[i], verts);
    }
}

function sphereStats(slicesStacks) {
    var areaRatios = [];
    var spaceAreaSum = 0;
    var textAreaSum = 0;
    var sphere = new THREE.SphereGeometry(1,slicesStacks,slicesStacks);
    var v = new THREE.Vector3();
    var w = new THREE.Vector3();
    var n = new THREE.Vector3();
    doFaces(sphere, function (face, textCoords, verts) {
        v.subVectors(verts[face.a], verts[face.c]);
        w.subVectors(verts[face.b], verts[face.c]);
        n.crossVectors(v,w);
        var spaceArea = 0.5 * n.length();
        // next, area in texture space
        var a = textCoords[0];
        var b = textCoords[1];
        var c = textCoords[2];
        v.set(a.x-c.x, a.y-c.y, 0);
        w.set(b.x-c.x, b.y-c.y, 0);
        n.crossVectors(v,w);
        var textArea = 0.5 * n.length();
        // stats
        areaRatios.push(spaceArea/textArea);
        spaceAreaSum += spaceArea;
        textAreaSum += textArea;
        });
    return { ratios: areaRatios, 
             min: Math.min.apply(null,areaRatios),
             max: Math.max.apply(null,areaRatios),
             spaceAreaSum: spaceAreaSum, 
             textAreaSum: textAreaSum };
}
        
