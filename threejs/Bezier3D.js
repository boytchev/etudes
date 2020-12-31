/**
 * @author boytchev
 *
 * See MEIRO project.
 *
 **/
 
 Bezier3D = function (n, material, precision) {
	this.n = n;
	var points = [];
	for (var i = 0; i < n; i++) {
		points.push([]);
		for (var j = 0; j < n; j++)
			points[i].push(new THREE.Vector4(i - (this.n - 1) / 2, 0, j - (this.n - 1) / 2, 1));
	}
	var knots = [];
	for (var i = 0; i < 2 * n; i++)
		knots.push((i < n) ? 0 : 1);
	var that = this;
	this.surface = new THREE.NURBSSurface(n - 1, n - 1, knots, knots, points);
	function getSurfacePoint(u, v, target) {
		return that.surface.getPoint(u, v);
	}
	if (!precision) precision = 10;
	this.geometry = new THREE.ParametricBufferGeometry(getSurfacePoint, precision, precision);
	this.material = material?material:new THREE.MeshLambertMaterial();
	THREE.Mesh.call(this, this.geometry, this.material);
}



Bezier3D.prototype = Object.create(THREE.Mesh.prototype);



Bezier3D.prototype.setControlPointXYZ = function (i, j, x, y, z) {
	var p = this.surface.controlPoints;
	p[i][j].x = x;
	p[i][j].y = y;
	p[i][j].z = z;
}



Bezier3D.prototype.setControlPoint = function (i, j, v) {
	var p = this.surface.controlPoints;
	p[i][j].x = v.x;
	p[i][j].y = v.y;
	p[i][j].z = v.z;
}



Bezier3D.prototype.controlPoints = function() {
	return this.surface.controlPoints;
}



Bezier3D.prototype.recalculate = function () {
	var EPS = 0.00001;
	var normal = new THREE.Vector3();
	var p0 = new THREE.Vector3(),
	p1 = new THREE.Vector3();
	var pu = new THREE.Vector3(),
	pv = new THREE.Vector3();
	var geom = this.geometry;
	var pos = geom.attributes.position.array;
	var nor = geom.attributes.normal.array;
	var param = geom.parameters;
	var i,
	j,
	k = 0,
	m = 0;
	for (i = 0; i <= param.stacks; i++) {
		var v = i / param.stacks;
		for (j = 0; j <= param.slices; j++) {
			var u = j / param.slices;
			p0 = param.func(u, v);
			pos[k++] = p0.x;
			pos[k++] = p0.y;
			pos[k++] = p0.z;
			if (u - EPS >= 0) {
				p1 = param.func(u - EPS, v);
				pu.subVectors(p0, p1);
			} else {
				p1 = param.func(u + EPS, v);
				pu.subVectors(p1, p0);
			}
			if (v - EPS >= 0) {
				p1 = param.func(u, v - EPS);
				pv.subVectors(p0, p1);
			} else {
				p1 = param.func(u, v + EPS);
				pv.subVectors(p1, p0);
			}
			normal.crossVectors(pu, pv).normalize();
			nor[m++] = normal.x;
			nor[m++] = normal.y;
			nor[m++] = normal.z;
		}
	}
	geom.attributes.position.needsUpdate = true;
	geom.attributes.normal.needsUpdate = true;
}
