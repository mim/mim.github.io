/* sets up our bucolic little town */

// ====================================================================
// New tree function

function createTree(trunkRadius, trunkHeight, coneRadius, coneHeight) {
    // returns a mesh object, with origin at the center of the base of the
    // trunk.
    var tree = new THREE.Object3D();
    var cone = new THREE.Mesh( new THREE.CylinderGeometry(0,coneRadius,coneHeight),
                               new THREE.MeshBasicMaterial({color: THREE.ColorKeywords.darkgreen}));
    cone.position.y = coneHeight/2+trunkHeight;
    tree.add(cone);
    var trunk = new THREE.Mesh( new THREE.CylinderGeometry(trunkRadius,trunkRadius,trunkHeight),
                                new THREE.MeshBasicMaterial({color: THREE.ColorKeywords.brown}));
    trunk.position.y = trunkHeight/2;
    tree.add(trunk);
    return tree;
}

// ====================================================================

/* Next, we create objects in our scene. */

var house1 = TW.createMesh( TW.createBarn(2,3,3) );
house1.position.set(4,0,3);
scene.add(house1);

var house2 = TW.createMesh( TW.createBarn(2,3,3) );
house2.position.set(3,0,7);
house2.rotation.y = Math.PI/2;
scene.add(house2);

var house3 = TW.createMesh( TW.createBarn(2,3,3) );
house3.position.set(8,0,5);
house3.rotation.y = -Math.PI/4;
scene.add(house3);

var tree1 = createTree(0.2,1,2,6);
tree1.position.set(8,0,10);
scene.add(tree1);

var tree2 = createTree(0.3,1.5,3,8); // big tree
tree2.position.set(12,0,10);
scene.add(tree2);

var r3 = 0.5, r2 = r3*0.8, r1 = r2*0.6;
var snow = new THREE.MeshBasicMaterial({color: 0xEEEEEE});

var snow3 = new THREE.Mesh( new THREE.SphereGeometry(r3,30), snow);
var snow2 = new THREE.Mesh( new THREE.SphereGeometry(r2,30), snow);
var snow1 = new THREE.Mesh( new THREE.SphereGeometry(r1,30), snow);

snow3.position.set(3,r3,9);
snow2.position.set(3,r3+r3+r2,9);
snow1.position.set(3,r3+r3+r2+r2+r1,9);

scene.add(snow3);
scene.add(snow2);
scene.add(snow1);

// ground
var ground = new THREE.Mesh( 
    new THREE.PlaneGeometry(12,12),
    new THREE.MeshBasicMaterial({ color: THREE.ColorKeywords.green,
                                  side: THREE.DoubleSide
                                }) );
ground.position.set(6,0,6);
ground.rotation.x = -Math.PI/2;
scene.add(ground);
