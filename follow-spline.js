var scene, splineCamera;

var targetRotation = 0;

var binormal = new THREE.Vector3();
var normal = new THREE.Vector3();

extrudePath = THREE.Curve.create(
	function( s ) {
		this.scale = ( s === undefined ) ? 10 : s;
	},
	function( t ) {
		t *= Math.PI * 2;
		var tx = ( 2 + Math.cos( 3 * t ) ) * Math.cos( 2 * t ),
			ty = ( 2 + Math.cos( 3 * t ) ) * Math.sin( 2 * t ),
			tz = Math.sin( 3 * t );
		return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );
	}
);

var closed2 = true;
var parent;
var tube, tubeMesh;
var lookAhead;
var scale;
var offset;

function initFollowCamera(sceneVar, offsetVar, lookAheadVar) {
	scene = sceneVar;

	parent = new THREE.Object3D();
	parent.position.y = 100;
	scene.add( parent );

	splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
	parent.add( splineCamera );

	offset = offsetVar || 0;
	lookAhead = lookAheadVar || false;

	return splineCamera;
}


function addTube(spline, segNum, closeBool, radSeg, mesh, scaleVar, geoSide, color) {

	extrudePath = spline;
	var segments = segNum || 100;
	closed2 = closeBool || true;
	var radiusSegments = radSeg || 3;
	mesh = mesh || null;

	if (tubeMesh) parent.remove(tubeMesh);

	tube = new THREE.TubeGeometry(extrudePath, segments, 2, radiusSegments, closed2);

	color = color || 0x2194ce;
	geoSide = geoSide || THREE.DoubleSide;

	addGeometry(tube, mesh, color, geoSide);

	scale = scaleVar || 1;
	tubeMesh.scale.set( scale, scale, scale );

}


function addGeometry(geometry, mesh, color, geoSide) {

	// 3d shape
	if(mesh === null) {
		tubeMesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [
			new THREE.MeshLambertMaterial({
				color: color,
				side: geoSide
			}),
			new THREE.MeshBasicMaterial({
				color: 0x000000,
				opacity: 0.3,
				wireframe: true,
				transparent: true
		})]);
	} else
		tubeMesh = mesh;

	parent.add( tubeMesh );

}


// Animate the camera along the spline
function renderFollowCamera() {
	var time = Date.now();
	var looptime = 20 * 1000;
	var t = ( time % looptime ) / looptime;

	var pos = tube.parameters.path.getPointAt( t );
	pos.multiplyScalar( scale );

	// interpolation
	var segments = tube.tangents.length;
	var pickt = t * segments;
	var pick = Math.floor( pickt );
	var pickNext = ( pick + 1 ) % segments;

	binormal.subVectors( tube.binormals[ pickNext ], tube.binormals[ pick ] );
	binormal.multiplyScalar( pickt - pick ).add( tube.binormals[ pick ] );


	var dir = tube.parameters.path.getTangentAt( t );

	normal.copy( binormal ).cross( dir );

	// We move on a offset on its binormal
	pos.add( normal.clone().multiplyScalar( offset ) );

	splineCamera.position.copy( pos );

	// Using arclength for stablization in look ahead.
	var lookAt = tube.parameters.path.getPointAt( ( t + 30 / tube.parameters.path.getLength() ) % 1 ).multiplyScalar( scale );

	// Camera Orientation 2 - up orientation via normal
	if (!lookAhead)
		lookAt.copy( pos ).add( dir );
	splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
	splineCamera.rotation.setFromRotationMatrix( splineCamera.matrix, splineCamera.rotation.order );

	parent.rotation.y += ( targetRotation - parent.rotation.y ) * 0.05;
}