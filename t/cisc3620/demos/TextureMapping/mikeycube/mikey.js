/* Kelsey Reiman
   Summer 2014 
   
   Creates a cube with a different texture on each face.

   Modified by Scott to use the newer texture loader, Fall 2016
*/

var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer,scene);

var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -1, maxx: 1,
                            miny: -1, maxy: 1,
                            minz: -1, maxz: 1});

var modifyFront = false;

var mikeyCube; 

function makeMikeyCube() {
    TW.loadTextures(
        [ 'mikeypics/mikey1.jpg', 'mikeypics/mikey2.jpg', 
          'mikeypics/mikey3.jpg', 'mikeypics/mikey4.jpg',        
          'mikeypics/mikey5.jpg', 'mikeypics/mikey6.jpg' ],
        function (textures) {
            // create an array of materials from these textures
            var mats = [];
            for( var i=0; i < textures.length; i++ ) {
                textures[i].wrapS = THREE.RepeatWrapping;
                textures[i].wrapT = THREE.RepeatWrapping;
                mats.push(new THREE.MeshBasicMaterial( {map: textures[i]} ));
            }
            // create a cube using MeshFaceMaterial, one material for each face
            var cube = new THREE.Mesh( new THREE.BoxGeometry(2,2,2),
                                       new THREE.MeshFaceMaterial( mats ) );
            if(modifyFront) doModifyFront(cube);
            scene.remove(mikeyCube);
            scene.add(cube);
            mikeyCube = cube;
            TW.render();
        });
}

makeMikeyCube();

function doModifyFront(cube) {
    var geom = cube.geometry;
    var faces = geom.faces;
    var UVs = geom.faceVertexUvs[0];
    for( var i = 0; i < faces.length; i++ ) {
        var face = faces[i];
        // modify the (s,t) parameters to give 2x3 pattern on front face (4)
        if( face.materialIndex == 4 ) {
            var faceUV = UVs[i];
            // for all three vertices
            for( j = 0; j < 3; j++ ) {
                var UV = faceUV[j];
                UV.x = 2*UV.x;
                UV.y = 3*UV.y;
            }
        }
    }
    /*
    document.getElementById('info').innerHTML = 
     "<pre>"+TW.stringifyGeometry(geom)+"</pre>";
     */
}

TW.setKeyboardCallback('p',function () { modifyFront = !modifyFront;
                                         makeMikeyCube(); },
                       "pattern on front of cube");
