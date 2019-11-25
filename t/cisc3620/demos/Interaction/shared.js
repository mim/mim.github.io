var mouse = new THREE.Vector2();
var canvas;

function convertMousePositionToNDC(event) {
    var mx = event.clientX;
    var my = event.clientY;
    // console.log("click at ("+mx+","+my+")");
    var target = event.target;
    // console.log("clicked on "+target);
    var rect = target.getBoundingClientRect();
    var cx = mx - rect.left;
    var cy = my - rect.top;
    var winXSize = rect.width || (rect.right - rect.left);
    var winYSize = rect.height || (rect.bottom - rect.top);
    var winHalfXSize = winXSize/2;
    var winHalfYSize = winYSize/2;
    // these are in NDC
    var x = (cx - winHalfXSize) / winHalfXSize;
    var y = (winHalfYSize - cy) / winHalfYSize;
    // console.log("clicked on "+target+" at NDC ("+xNDC+","+xNDC+")");
    var click = {mx: mx, my: my,
                 cx: cx, cy: cy,
                 winXSize: winXSize,
                 winYSize: winYSize,
                 x: x, y: y};
    return click;
}

function vectorToString(v) {
    return "("+v.x.toFixed(2)+','+
        v.y.toFixed(2)+','+
        v.z.toFixed(2)+')';
}

function onMouseClick(evt) {
    if( ! evt.shiftKey ) return; // only handle shift-click
    saved_event = evt;
    event.preventDefault();     // don't propagate to higher elements
    var click = convertMousePositionToNDC(evt);
    saved_click = click;
    var clickPositionNear = new THREE.Vector3( click.x, click.y, 0 );
    var clickPositionFar  = new THREE.Vector3( click.x, click.y, 1 );
    var before1 = vectorToString(clickPositionNear);
    var before2 = vectorToString(clickPositionFar);
    clickPositionNear.unproject(camera);
    clickPositionFar.unproject(camera);
    var after1 = vectorToString(clickPositionNear);
    var after2 = vectorToString(clickPositionFar);
    var infoElt = document.getElementById('info');
    infoElt.innerHTML = ("onMouseClick: button "+evt.button
                         +" at "+before1+' and '+before2
                         + " unprojects to "+after1+' and '+after2);
    handleMouseClick(click.x, click.y, clickPositionNear, clickPositionFar );
}

function createLine(a, b) {
    var geom = new THREE.Geometry();
    geom.vertices = [a,b];
    var mat = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors,
                                            linewidth: 5});
    geom.colors = [ new THREE.Color( TW.RED ),
                    new THREE.Color( TW.GREEN ) ];
    return new THREE.Line( geom, mat);
}

var camera;

function drawFrustumRay(mx,my) {
    var clickPositionNear = new THREE.Vector3( mx, my, 0 );
    var clickPositionFar  = new THREE.Vector3( mx, my, 1 );
    console.log("mx: "+mx+" my: "+my);
    clickPositionNear.unproject(camera);
    clickPositionFar.unproject(camera);
    console.log("click near: "+JSON.stringify(clickPositionNear));
    scene.add(createLine(clickPositionNear,clickPositionFar));
}

