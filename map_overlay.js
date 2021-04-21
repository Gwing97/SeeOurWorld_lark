Cesium.Viewer.prototype.addOverlay = function (overlay) {
	overlay.setViewer(this);
	this._container.appendChild(overlay.element);
};

/**
 * 3D场景气泡框,new 出来后要记得添加进去
 * @param opt {Object}
 * @param opt.id {property} id
 * @param opt.element {document.element} element元素
 * @param opt.position {Array} 气泡框初始化的位置，可以不传
 *
 * @constructor
 */

Overlay = function (opt) {
	opt = opt || {};
	var me = this;
	/**
	 * @type {string|number} overlay id
	 */
	this.id = opt.id;
	/**
	 * @type {document.element} overlay的内容元素
	 */
	this.element = opt.element;
	/**
	 * @type {Array} 保存Popup框的x,y坐标
	 */
	this.position = opt.position;

	this._worldPosition = null;
	/**
	 * @type {*} popup框相对于原点偏移像素值
	 */
	this.offset = opt.offset;
	/**
	 * @type {Cesium.Cartesian2}
	 */
	this.scratch = new Cesium.Cartesian2();
	/**
	 *
	 * @type {Cesium.Viewer}
	 * @private
	 */
	this._viewer = null;

	/**
	 * @private
	 * 初始化Popup框
	 */
	var init = function () {
		
	};
	/**
	 * 设置关联的cesium viewer
	 * @param viewer
	 */
	this.setViewer = function (viewer) {
		me._viewer = viewer;
		me._viewer.scene.preRender.addEventListener(function () {
			if (me.element.style.display !== "none") {
				me.update();
			};
		});
	};
	/**
	 * 获取关联的cesium viewer
	 * @return {Cesium.Viewer}
	 */
	this.getViewer = function () {
		return this._viewer;
	};
	/**
	 * 设置位置
	 * @param position{Array}
	 */
	this.setPosition = function (position) {
		if (!position) {
			me.close();
			return;
		}
		if (position instanceof Array) {
			position[0] = position[0] || 0;
			position[1] = position[1] || 0;
			position[2] = position[2] || 0;
			position = Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]);
		}
		if (!me.getViewer()) {
			return;
		}
		var canvasPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(me.getViewer().scene, position);
		if (Cesium.defined(canvasPosition)) {
			me.element.style.bottom = (12 + window.innerHeight - canvasPosition.y) + 'px';
			me.element.style.left = canvasPosition.x - 48 + 'px';
			me.show();
		}
		me._worldPosition = position;
	};

	this.update = function () {
		me.setPosition(me._worldPosition);
	};
	/**
	 *
	 * @return {Array}
	 */
	this.getPosition = function () {
		return me.position;
	};

	this.close = function () {
		me.element.style.display = "none";
	};

	this.show = function () {
		me.element.style.display = "block";
	};
	
	this.flyTo = function () {
		me._viewer.camera.flyTo({
			destination: me._worldPosition
//			orientation:{
//				// 指向
//				heading: Cesium.Math.toRadians(earth.opts.orientation.heading),
//				// 视角
//				pitch: Cesium.Math.toRadians(earth.opts.orientation.pitch),
//				roll: Cesium.Math.toRadians(earth.opts.orientation.roll)
//			},
		});
	};

	init();
};
