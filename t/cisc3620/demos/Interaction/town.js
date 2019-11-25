/* adds a town to the scene, consisting of a 20x20 green ground plane,
with the origin in the middle, and three houses, two trees and a
snowman. The y coordinate ranges from 0 to 9.5.

*/

function makeTown(scene) {

    var inner = new THREE.Object3D();

    /* Next, we create objects in our scene.
     Their x and z coordinates range from 0 to 12. */

    var house1 = TW.createMesh( TW.createBarn(2,3,3) );
    house1.position.set(4,0,3);
    inner.add(house1);

    var house2 = TW.createMesh( TW.createBarn(2,3,3) );
    house2.position.set(3,0,7);
    house2.rotation.y = Math.PI/2;
    inner.add(house2);

    var house3 = TW.createMesh( TW.createBarn(2,3,3) );
    house3.position.set(8,0,5);
    house3.rotation.y = -Math.PI/4;
    inner.add(house3);

    var tree1 = createTree({trunkRadius: 0.2, trunkHeight: 1, coneRadius: 2, coneHeight: 6});
    tree1.position.set(8,0,10);
    inner.add(tree1);

    var tree2 = createTree({trunkRadius: 0.3, trunkHeight: 1.5, coneRadius: 3, coneHeight: 8});
    tree2.position.set(12,0,10);
    inner.add(tree2);

    var frosty = createSnowPerson({r3: 0.5, r2: 0.4, r1: 0.3});
    frosty.position.set(3,0,9);
    inner.add(frosty);

    var outer = new THREE.Object3D();
    inner.position.set(-6,0,-6);    // origin is now in the center of everything
    outer.add(inner);

    var ground = new THREE.Mesh( new THREE.PlaneGeometry(20,20),
                                 new THREE.MeshBasicMaterial({color:THREE.ColorKeywords.green}));
    ground.rotateX(-1*Math.PI/2);
    outer.add(ground);

    scene.add(outer);
}

