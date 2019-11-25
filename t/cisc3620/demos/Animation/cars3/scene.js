var progressBar;
var stoplight;
var orangeCar;
var blueCar;

function buildScene(scene) {
        
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(2*halfSize,2*halfSize),
                                new THREE.MeshBasicMaterial({color:THREE.ColorKeywords.darkgreen}));
        
    scene.add(ground);

    // use the global variables, so we can inspect them

    progressBar = makeProgressBar(THREE.ColorKeywords.cyan);
    progressBar.position.set(-halfSize, -halfSize, 2);
    scene.add(progressBar);

    stoplight = makeStoplightParams();
    stoplight.position.set(0,0,0);
    scene.add(stoplight);

    orangeCar = makeOrangeCar();

    blueCar = makeBlueCar();

    scene.add(orangeCar);
    scene.add(blueCar);
}
