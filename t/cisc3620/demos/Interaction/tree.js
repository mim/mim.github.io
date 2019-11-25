/* Returns an Object3D for an evergreen tree, as a cylinder (the trunk) and a cone.
 The inits allow you to specify:
 trunkRadius (default 1)
 trunkHeight (default 3)
 coneRadius  (default 4)
 coneHeight  (default 10)
 trunkMaterial (default basic brown)
 coneMaterial  (default basic darkgreen)

@author Scott D. Anderson

*/

function createTree(inits) {
    var trunkRadius = inits.trunkRadius || 1;
    var trunkHeight = inits.trunkHeight || 3;
    var coneRadius  = inits.coneRadius || 4;
    var coneHeight  = inits.coneHeight || 10;
    trunkMaterial = inits.trunkMaterial || 
        (new THREE.MeshBasicMaterial( { color: THREE.ColorKeywords.brown } ));
    coneMaterial = inits.coneMaterial || 
        (new THREE.MeshBasicMaterial( { color: THREE.ColorKeywords.darkgreen } ));
    // whew, inits over
    var tree = new THREE.Object3D();
    var cone = new THREE.Mesh( new THREE.CylinderGeometry(0,coneRadius,coneHeight),
                               coneMaterial );
    cone.position.y = coneHeight/2+trunkHeight;
    tree.add(cone);
    var trunk = new THREE.Mesh( new THREE.CylinderGeometry(trunkRadius,trunkRadius,trunkHeight),
                                trunkMaterial );
    trunk.position.y = trunkHeight/2;
    tree.add(trunk);
    return tree;
}
