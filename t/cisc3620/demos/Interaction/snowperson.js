/* returns an Object3D containing three spheres for a snowperson.
   the origin for the snowperson is the where the bottom sphere touches the ground
   
   the inits allow you to specify
   r1:  the radius of the top sphere, default 1
   r2:  the radius of the middle sphere, default 2
   r3:  the radius of the bottom sphere, default 3
   mat: the material for all three spheres, default MeshBasic in 0xEEEEEE
*/

function createSnowPerson(inits) {
    var r1 = inits.r1 || 1;
    var r2 = inits.r2 || 2;
    var r3 = inits.r3 || 3;
    var snow = inits.mat || (new THREE.MeshBasicMaterial( {color: 0xEEEEEE} ) );

    var ball3 = new THREE.Mesh( new THREE.SphereGeometry(r3), snow);
    var ball2 = new THREE.Mesh( new THREE.SphereGeometry(r2), snow);
    var ball1 = new THREE.Mesh( new THREE.SphereGeometry(r1), snow);
    ball3.position.y = r3;
    ball2.position.y = r3+r3+r2;
    ball1.position.y = r3+r3+r2+r2+r1;

    var frosty = new THREE.Object3D();
    frosty.add(ball3);
    frosty.add(ball2);
    frosty.add(ball1);
    return frosty;
}
