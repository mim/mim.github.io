var scene = new THREE.Scene();

var barnWidth = 20;
var barnHeight = 30;
var barnDepth = 40;

var barnGeometry = TW.createBarn( barnWidth, barnHeight, barnDepth );
var barnMesh = TW.createMesh( barnGeometry );

scene.add(barnMesh);

var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer,scene);

