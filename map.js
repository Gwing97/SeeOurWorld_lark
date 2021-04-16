
//var local_ip = "192.168.0.107";	//局域网上的本机IP地址，若发布至互联网后，填写公网ip
// var local_ip = "www.skylight.xin";
var local_ip = "localhost";

// 分辨率调整函数

MapControl = function (opts) {
	var me = this;

	me.opts = $.extend(true, {//opts中的配置会覆盖以下默认配置
		isGlobal: true,
		view_center: [100, 35, 10000000],
		orientation: {
			heading: 0,
			pitch: -90,
			roll: 0
		},
		altitude_range: {
			min: 0.0,
			max: 8848.0
		},
		model: "",
		showAtmosphere: true
	}, opts);
	me._init();
};

MapControl.prototype._init = function () {
	var me = this;

	var img_tianditu_rs = new Cesium.ProviderViewModel({
		name: "天地图",
		tooltip: "天地图",
		iconUrl: "images/tianditu.png",
		creationFunction: function () {
			var token = 'c23af70822a130e1822f8464dd6e9fd6'
			// 服务域名
			var tdtUrl = 'https://t{s}.tianditu.gov.cn/'
			// 服务负载子域
			var subdomains=['0','1','2','3','4','5','6','7']

			var providers = []

			providers.push(new Cesium.UrlTemplateImageryProvider({
				url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
				subdomains: subdomains,
				tilingScheme : new Cesium.WebMercatorTilingScheme(),
				maximumLevel : 18
			}))

			providers.push(new Cesium.UrlTemplateImageryProvider({
				url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
				subdomains: subdomains,
				tilingScheme : new Cesium.WebMercatorTilingScheme()
			}))

			providers.push(new Cesium.UrlTemplateImageryProvider({
		        url: tdtUrl + 'DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=' + token,
		        subdomains: subdomains,
		        tilingScheme : new Cesium.WebMercatorTilingScheme(),
				maximumLevel : 18
		    }))

			return providers;
		}
	});

	var img_google_rs = new Cesium.ProviderViewModel({
		name: "Google影像底图",
		tooltip: "Google影像底图",
		iconUrl: "images/GoogleEarth.ico",
		creationFunction: function () {

			var provider = new Cesium.UrlTemplateImageryProvider({
				url: 'https://www.google.com/maps/vt?lyrs=s&x={x}&y={y}&z={z}'
				// subdomains: subdomains
			});
			return provider;
		}
	});

	var img_google_tianditu_rs = new Cesium.ProviderViewModel({
		name: "Google影像底图-带天地图注记",
		tooltip: "Google影像底图-带天地图注记",
		iconUrl: "images/GoogleEarth.ico",
		creationFunction: function () {
			var token = 'c23af70822a130e1822f8464dd6e9fd6'
			// 服务域名
			var tdtUrl = 'https://t{s}.tianditu.gov.cn/'
			// 服务负载子域
			var subdomains_tianditu=['0','1','2','3','4','5','6','7']

			var providers = []

			providers.push(new Cesium.UrlTemplateImageryProvider({
				url: 'https://www.google.com/maps/vt?lyrs=s&x={x}&y={y}&z={z}'
			}))

			providers.push(new Cesium.UrlTemplateImageryProvider({
				url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
				subdomains: subdomains_tianditu,
				tilingScheme : new Cesium.WebMercatorTilingScheme()
			}))

			providers.push(new Cesium.UrlTemplateImageryProvider({
				url: tdtUrl + 'DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=' + token,
				subdomains: subdomains_tianditu,
				tilingScheme : new Cesium.WebMercatorTilingScheme(),
				maximumLevel : 18
			}))

			return providers;
		}
	});

	var img_google_topo = new Cesium.ProviderViewModel({
		name: "Google地形图",
		tooltip: "Google地形图",
		iconUrl: "images/google_map.jpg",
		creationFunction: function () {
			var provider = new Cesium.UrlTemplateImageryProvider({
				url: 'https://www.google.com/maps/vt?lyrs=p&x={x}&y={y}&z={z}'
			});
			return provider;
		}
	});

	var img_osm_topo = new Cesium.ProviderViewModel({
		name: "OpenStreetMap地形图",
		tooltip: "OpenStreetMap地形图",
		iconUrl: "images/OpenStreetMap.ico",
		creationFunction: function () {
			var provider = new Cesium.UrlTemplateImageryProvider({
					url: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38"
//					url: "https://b.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
//					url: "https://b.tile.opentopomap.org/{z}/{x}/{y}.png"
				})
			return provider;
		}
	});

	//var img_arcgis = new Cesium.ProviderViewModel({
	//	name: "ArcGIS地图",		//作为三维地图显示效果并不好
	//	tooltip: "ArcGIS地图",
	//	creationFunction: function () {
	//		var provider = new Cesium.UrlTemplateImageryProvider({
	//				url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}"
	//			})
	//		return provider;
	//	}
	//});

	//必须跨域才能访问
	var img_glc2020 = new Cesium.ProviderViewModel({
		name: "全球30m分辨率土地覆盖_v2020",
		tooltip: "全球30m分辨率土地覆盖_v2020",
		iconUrl: "images/globallandcover.png",
		creationFunction: function () {
			var provider = new Cesium.WebMapServiceImageryProvider({
					url: new Cesium.Resource({
						url: "http://globeland30.org:8088/erdas-apollo/coverage/GlobeLand30_2020"
					}),
					layers: "globeland30_2017_antarctica_0,globeland30_2017_0",
					tileHeight: 256,
					tileWidth: 256,
					srs: 'EPSG:4326',
					parameters: {		//注意带s!!!
						service: 'WMS',
						version: '1.1.1',
						request: 'GetMap',
						style: 'default,default',
						transparent: true,
						TILED: true,
//						exceptions: 'application/vnd.ogc.se_inimage',
						format: 'image/png'
					}
				})
			return provider;
		}
	});

	var img_WorldSoil = new Cesium.ProviderViewModel({
		name: "全球土壤类型 2006",
		tooltip: "全球土壤类型 2006",
		iconUrl: "./images/soil.png",
		creationFunction: function () {
			var provider = new Cesium.WebMapServiceImageryProvider({
					url: "https://maps.isric.org/mapserv?map=/map/wrb.map",
					layers: "MostProbable",
					tileHeight: 256,
					tileWidth: 256,
					parameter: {
						service: 'WMS',
						version: '1.3.0',
						request: 'GetMap',
						style: 'default',
						transparent: 'true',
						format: 'image/png',
						CRS: 'EPSG:4326'
					 }
				})
			return provider;
		}
	});

	var world_terrain = new Cesium.ProviderViewModel({
		name: "全球地形",
		tooltip: "全球地形",
		iconUrl: "./images/CesiumWorldTerrain.png",
		creationFunction:  function () {
			return Cesium.createWorldTerrain()
		}
	});

	var ellipsoid_terrain = new Cesium.ProviderViewModel({
		name: "大地椭球体",
		tooltip: "大地椭球体",
		iconUrl: "./images/Ellipsoid.png",
		creationFunction:  function () {
			var provider = new Cesium.EllipsoidTerrainProvider();
			return provider;
		}
	});

	Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZDk3MTZiMi1mMzlkLTRkMDEtOTZhMC1hMzhlMTkzMzk1YTAiLCJpZCI6NDUxNTksImlhdCI6MTYxNDc3MjYxOH0.Yps8cIDHNn71LokaYQnF0X199E82fr8Xawua_b4opJs";

	me.viewer = new Cesium.Viewer("cesiumContainer",{
		animation: false,	//是否创建动画小器件，左下角仪表
		timeline: false,	//是否显示时间线控件
		geocoder: false,	//是否显示地名查找控件，右上角查询按钮
		fullscreenButton: false,	//是否显示右下角全屏按钮
		navigationHelpButton: false,	//是否显示右上角的帮助按钮
		homeButton: true,	//是否显示Home按钮
		showRenderLoopErrors: false,//如果设为true，将在一个HTML面板中显示错误信息
		sceneModePicker: true,//是否显示3D/2D选择器

		baseLayerPicker: true,//是否显示图层选择器
		scene3DOnly: false,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
		infoBox: false,//是否显示信息框
		selectionIndicator: false,

//		vrButton: true,//VR模式

		imageryProviderViewModels: [
			img_google_tianditu_rs,
			img_google_rs,
			img_google_topo,
			img_osm_topo,
			img_tianditu_rs,
			img_WorldSoil,
			img_glc2020],//可供BaseLayerPicker选择的图像图层ProviderViewModel数组
		terrainProviderViewModels : [world_terrain, ellipsoid_terrain],
//		selectedImageryProviderViewModel: img_ALOS_wmts,//当前地形图层的显示模型，仅baseLayerPicker设为true有意义
//		selectedTerrainProviderViewModel: local_terrain,
//		terrainProvider: Cesium.createWorldTerrain(),		//cesium自带的世界地形

		// 解决截图后图片没有内容，无法得到地图场景的问题
		contextOptions: {
			webgl: {
				alpha: true,
				depth: true,
				stencil: true,
				antialias: true,
				premultipliedAlpha: true,	//通过canvas.toDataURL()实现截图需要将该项设置为true
				preserveDrawingBuffer: true,
				failIfMajorPerformanceCaveat: true
			}
		},
	});

	me.viewer._cesiumWidget._creditContainer.style.display = "none";	//去除版权信息

	// 判断是否支持图像渲染像素化处理
	var supportsImageRenderingPixelated = me.viewer.cesiumWidget._supportsImageRenderingPixelated;
	if (supportsImageRenderingPixelated) {
		// 直接拿到设备的像素比例因子 - 如我设置的1.25
		var vtxf_dpr = window.devicePixelRatio;
		while (vtxf_dpr >= 2.0) { vtxf_dpr /= 2.0; }
		// 设置渲染分辨率的比例因子
		me.viewer.resolutionScale = vtxf_dpr;
	}

	me.viewer.scene.fxaa = true
	me.viewer.scene.postProcessStages.fxaa.enabled = true

	//设置Google遥感影像、全球地形
	me.viewer.baseLayerPicker.viewModel.selectedImagery= me.viewer.baseLayerPicker.viewModel.imageryProviderViewModels[0];
	me.viewer.baseLayerPicker.viewModel.selectedTerrain= me.viewer.baseLayerPicker.viewModel.terrainProviderViewModels[0];

	if(!me.opts.showAtmosphere){
		me.viewer.scene.skyBox.show = false;	//天空盒，即星空贴图
		me.viewer.scene.skyAtmosphere.show = false;	//大气效果

		//隐藏地球默认的蓝色背景
		me.viewer.scene.globe.baseColor = Cesium.Color.TRANSPARENT;
		//隐藏雾效果
		me.viewer.scene.fog.enabled = false;
		//隐藏黑色背景
		//me.viewer.scene.backgroundColor=Cesium.Color.TRANSPARENT;
	}

	//导航栏
	var options = {
		defaultResetView: Cesium.Cartographic.fromDegrees(...me.opts.view_center),
		enableCompass: true,
		enableZoomControls: true,
		enableDistanceLegend: true,
		enableCompassOuterRing: false
	}
	// extend our view by the cesium navigaton mixin
	me.viewer.extend(Cesium.viewerCesiumNavigationMixin, options);

	// 修改home按钮的行为
	me.viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(commandInfo) {
		//飞回指定位置
		me.viewer.camera.flyTo({
			// Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
			// fromDegrees()方法，将经纬度和高程转换为世界坐标
			destination:Cesium.Cartesian3.fromDegrees(...me.opts.view_center),
			orientation:{
				// 指向
				heading: Cesium.Math.toRadians(me.opts.orientation.heading),
				// 视角
				pitch: Cesium.Math.toRadians(me.opts.orientation.pitch),
				roll: Cesium.Math.toRadians(me.opts.orientation.roll)
			}
		});
		// Tell the home button not to do anything
		commandInfo.cancel = true;
	});

	// 设置自定义起始位置
	me.viewer.camera.setView({
		// Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
		// fromDegrees()方法，将经纬度和高程转换为世界坐标
		destination:Cesium.Cartesian3.fromDegrees(...me.opts.view_center),
		orientation:{
			// 指向
			heading: Cesium.Math.toRadians(me.opts.orientation.heading),
			// 视角
			pitch: Cesium.Math.toRadians(me.opts.orientation.pitch),
			roll: Cesium.Math.toRadians(me.opts.orientation.roll)
		}
	});

	//开启光照
	//me.viewer.scene.globe.enableLighting = true;

	//设置时间，调整太阳高度角
	//var utc=Cesium.JulianDate.fromDate(new Date("2021/04/15 02:00:00"));//UTC
	//me.viewer.clockViewModel.currentTime = Cesium.JulianDate.addHours(utc,8,new Cesium.JulianDate());//北京时间=UTC+8=GMT+8

	//调试用选项
	//me.viewer.extend(Cesium.viewerCesiumInspectorMixin);
	//显示帧速
	//me.viewer.scene.debugShowFramesPerSecond = true;

	//添加OSM Building三维建筑数据
	//me.viewer.scene.primitives.add(Cesium.createOsmBuildings());

	// Enable depth testing so things behind the terrain disappear.
	me.viewer.scene.globe.depthTestAgainstTerrain = true;

	var longitude_show = document.getElementById('longitude_show');
	var latitude_show = document.getElementById('latitude_show');
	var altitude_show = document.getElementById('altitude_show');
	var view_height = document.getElementById('view_height_show');
	var canvas = me.viewer.scene.canvas;
	//具体事件的实现
	var ellipsoid = me.viewer.scene.globe.ellipsoid;
	var handler = new Cesium.ScreenSpaceEventHandler(canvas);
	handler.setInputAction( function(movement){
		//捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
		var cartesian = me.viewer.scene.pickPosition(movement.endPosition);
		if(cartesian){
			//将笛卡尔三维坐标转为地图坐标（弧度）
			var cartographic = me.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
			//将地图坐标（弧度）转为十进制的度数
			var log_String = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
			var lat_String = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
			var alti_String = (me.viewer.scene.globe.getHeight(cartographic)).toFixed(2);
			var view_String = (me.viewer.camera.positionCartographic.height/1000).toFixed(2);

			longitude_show.innerHTML = log_String;
			latitude_show.innerHTML = lat_String;
			altitude_show.innerHTML = alti_String;
			view_height.innerHTML = view_String;
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

};

//截图
function saveToFile(scene) {
	let canvas = scene.canvas;
	let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

	let link = document.createElement("a");
	let blob = dataURLtoBlob(image);
	let objurl = URL.createObjectURL(blob);
	link.download = "scene.png";
	link.href = objurl;
	link.click();
}

function dataURLtoBlob(dataurl) {
	let arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}

//定位
function getLocation(earth)
{
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	function success(pos) {
		var crd = pos.coords;

		// console.log('Your current position is:')
		// console.log('Latitude : ' + crd.latitude)
		// console.log('Longitude: ' + crd.longitude)
		// console.log('altitude: ' + crd.altitude);
		// console.log('More or less ' + crd.accuracy + ' meters.')

		if(crd.altitude){
			var altitude = crd.altitude + 5*crd.accuracy
		}else{
			var altitude = 5*crd.accuracy
		}

		earth.viewer.camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(
					crd.longitude,
					crd.latitude,
					altitude
				),
			orientation:{
				// 指向
				heading: Cesium.Math.toRadians(earth.opts.orientation.heading),
				// 视角
				pitch: Cesium.Math.toRadians(earth.opts.orientation.pitch),
				roll: Cesium.Math.toRadians(earth.opts.orientation.roll)
			},
			complete: drawPoint()
		});

		function drawPoint() {
			var helper = new Cesium.EventHelper();
			helper.add(earth.viewer.scene.globe.tileLoadProgressEvent, function (event) {
				//console.log("每次加载矢量切片都会进入这个回调")
				if (event == 0) {
					//console.log("这个是加载最后一个矢量切片的回调")
					earth.viewer.entities.remove(earth.viewer.entities.getById('location'))
					earth.viewer.entities.add({
						id: 'location',
						name: '当前位置',
						position: Cesium.Cartesian3.fromDegrees(
								crd.longitude,
								crd.latitude,
								earth.viewer.scene.globe.getHeight(Cesium.Cartographic.fromDegrees(crd.longitude, crd.latitude))
							),
						point: {
							pixelSize: 10,
							color: Cesium.Color.BLUE,
							outlineColor: Cesium.Color.WHITE,
							outlineWidth: 1,
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
							disableDepthTestDistance: Number.POSITIVE_INFINITY
						},
						label: {
							text: '当前位置',
							font: '18px sans-serif',
							fillColor: Cesium.Color.GOLD,
							style: Cesium.LabelStyle.FILL_AND_OUTLINE,
							outlineWidth: 2,
							verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
							pixelOffset: new Cesium.Cartesian2(20, -20),
							disableDepthTestDistance: Number.POSITIVE_INFINITY
						}
					})
					helper.removeAll()
				}
			});
		}
	};

	function error(err) {
		console.warn('ERROR(' + err.code + '): ' + err.message);
		switch(error.code) {
			case error.PERMISSION_DENIED:
				alert("用户拒绝告知地理位置")
				break;
			case error.POSITION_UNAVAILABLE:
				alert("位置信息不可用")
				break;
			case error.TIMEOUT:
				alert("请求用户地理位置超时")
				break;
			case error.UNKNOWN_ERROR:
				alert("未知错误")
				break;
		}
	}

	navigator.geolocation.getCurrentPosition(success, error, options);
}

//测量空间直线距离
/******************************************* */
measureLineSpace = function(viewer) {

	// 取消双击事件-追踪该位置
	viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
	handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
	var positions = [];
	var poly = null;
	// var tooltip = document.getElementById("toolTip");
	var distance = 0;
	var cartesian = null;
	var floatingPoint;
	// tooltip.style.display = "block";

	handler.setInputAction(function (movement) {
//		 tooltip.style.left = movement.endPosition.x + 3 + "px";
//		 tooltip.style.top = movement.endPosition.y - 25 + "px";
//		 tooltip.innerHTML = '<p>单击开始，右击结束</p>';
		cartesian = viewer.scene.pickPosition(movement.endPosition);
		if(typeof cartesian != "undefined"){
			let ray = viewer.camera.getPickRay(movement.endPosition);
			cartesian = viewer.scene.globe.pick(ray, viewer.scene);
			//cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
			if (positions.length >= 2) {
				if (!Cesium.defined(poly)) {
					poly = new PolyLinePrimitive(positions);
				} else {
					positions.pop();
					// cartesian.y += (1 + Math.random());
					positions.push(cartesian);
				}
				distance = getSpaceDistance(positions);
				// console.log("distance: " + distance);
				// tooltip.innerHTML='<p>'+distance+'米</p>';
			}
		}

	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

	handler.setInputAction(function (movement) {
		// tooltip.style.display = "none";
		// cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
		cartesian = viewer.scene.pickPosition(movement.position);
		if(typeof cartesian != "undefined"){
			let ray = viewer.camera.getPickRay(movement.position);
			cartesian = viewer.scene.globe.pick(ray, viewer.scene);
			if (positions.length == 0) {
				positions.push(cartesian.clone());
			}
			positions.push(cartesian);
			//在三维场景中添加Label
			//   var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
			var textDisance = distance + "米";
			// console.log(textDisance + ",lng:" + cartographic.longitude/Math.PI*180.0);
			floatingPoint = viewer.entities.add({
				name: '空间直线距离',
				// position: Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180,cartographic.height),
				position: positions[positions.length - 1],
				point: {
					pixelSize: 6,
					color: Cesium.Color.BLUE,
					outlineColor: Cesium.Color.WHITE,
					outlineWidth: 1
				},
				label: {
					text: textDisance,
					font: '18px sans-serif',
					fillColor: Cesium.Color.GOLD,
					style: Cesium.LabelStyle.FILL_AND_OUTLINE,
					outlineWidth: 2,
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM + 100,
					pixelOffset: new Cesium.Cartesian2(20, - 20),
					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
					disableDepthTestDistance: Number.POSITIVE_INFINITY
				}
			});
		}
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

	handler.setInputAction(function (movement) {
		handler.destroy(); //关闭事件句柄
		positions.pop(); //最后一个点无效
//		viewer.entities.remove(floatingPoint);
		// tooltip.style.display = "none";
	}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

	var PolyLinePrimitive = (function () {
		function _(positions) {
			this.options = {
				name: '直线',
				polyline: {
					show: true,
					positions: [],
					material: Cesium.Color.CHARTREUSE,
					width: 5,
					clampToGround: true
				}
			};
			this.positions = positions;
			this._init();
		}
		_.prototype._init = function () {
			var _self = this;

			var _update = function () {
				return _self.positions;
			};

			//实时更新polyline.positions
			this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
			viewer.entities.add(this.options);
		};
		return _;
	})();

	//空间两点距离计算函数
	function getSpaceDistance(positions) {
		var distance = 0;
		for (var i = 0; i < positions.length - 1; i++) {
			var point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
			var point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
			/**根据经纬度计算出距离**/
			var geodesic = new Cesium.EllipsoidGeodesic();
			geodesic.setEndPoints(point1cartographic, point2cartographic);
			var s = geodesic.surfaceDistance;
			//console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
			//返回两点之间的距离
			s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
			distance = distance + s;
		}
		return distance.toFixed(2);
	}
}

//****************************测量空间面积************************************************//
measureAreaSpace = function(viewer) {
// 取消双击事件-追踪该位置
	viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
	// 鼠标事件
	handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
	var positions = [];
	var tempPoints = [];
	var polygon = null;
	// var tooltip = document.getElementById("toolTip");
	var cartesian = null;
	var floatingPoint; //浮动点
	// tooltip.style.display = "block";

	handler.setInputAction(function (movement) {
		// tooltip.style.left = movement.endPosition.x + 3 + "px";
		// tooltip.style.top = movement.endPosition.y - 25 + "px";
		// tooltip.innerHTML ='<p>单击开始，右击结束</p>';
		cartesian = viewer.scene.pickPosition(movement.endPosition);
		if(typeof cartesian != "undefined"){
			let ray = viewer.camera.getPickRay(movement.endPosition);
			cartesian = viewer.scene.globe.pick(ray, viewer.scene);
			//cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
			if (positions.length >= 2) {
				if (!Cesium.defined(polygon)) {
					polygon = new PolygonPrimitive(positions);
				} else {
					positions.pop();
					// cartesian.y += (1 + Math.random());
					positions.push(cartesian);
				}
				// tooltip.innerHTML='<p>'+distance+'米</p>';
			}
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

	handler.setInputAction( function (movement) {
		// tooltip.style.display = "none";
		cartesian = viewer.scene.pickPosition(movement.position);
		if(typeof cartesian != "undefined"){
			let ray = viewer.camera.getPickRay(movement.position);
			cartesian = viewer.scene.globe.pick(ray, viewer.scene);
			// cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
			if (positions.length == 0) {
				positions.push(cartesian.clone());
			}
			//positions.pop();
			positions.push(cartesian);
			//在三维场景中添加点
			var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
			var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
			var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
			var heightString = cartographic.height;
			tempPoints.push({lon: longitudeString, lat: latitudeString, hei: heightString});
			floatingPoint = viewer.entities.add({
				name: '多边形面积',
				position: positions[positions.length - 1],
				point: {
					pixelSize: 6,
					color: Cesium.Color.RED,
					outlineColor: Cesium.Color.WHITE,
					outlineWidth: 1,
					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
					disableDepthTestDistance: Number.POSITIVE_INFINITY
				}
			});
		}
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

	handler.setInputAction( function (movement) {
		handler.destroy();
		positions.pop();
		//tempPoints.pop();
		// viewer.entities.remove(floatingPoint);
		// tooltip.style.display = "none";
		//在三维场景中添加点
		// var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
		// var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
		// var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
		// var heightString = cartographic.height;
		// tempPoints.push({ lon: longitudeString, lat: latitudeString ,hei:heightString});

		var textArea = getArea(tempPoints) + "平方公里";
		viewer.entities.add({
			name: '多边形面积',
			position: positions[positions.length - 1],
			// point : {
			//  pixelSize : 5,
			//  color : Cesium.Color.RED,
			//  outlineColor : Cesium.Color.WHITE,
			//  outlineWidth : 2,
			//  heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
			// },
			label: {
				text: textArea,
				font: '18px sans-serif',
				fillColor: Cesium.Color.GOLD,
				style: Cesium.LabelStyle.FILL_AND_OUTLINE,
				outlineWidth: 2,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
				pixelOffset: new Cesium.Cartesian2(20, -20),
				heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
				disableDepthTestDistance: Number.POSITIVE_INFINITY
			}
		});
	}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	var radiansPerDegree = Math.PI / 180.0; //角度转化为弧度(rad)
	var degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度

	//计算多边形面积
	function getArea(points) {
		var res = 0;
		//拆分三角曲面

		for (var i = 0; i < points.length - 2; i++) {
			var j = (i + 1) % points.length;
			var k = (i + 2) % points.length;
			var totalAngle = Angle(points[i], points[j], points[k]);
			var dis_temp1 = distance(positions[i], positions[j]);
			var dis_temp2 = distance(positions[j], positions[k]);
			res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
			// console.log(res);
		}

		return (res / 1000000.0).toFixed(4);
	}

	/*角度*/
	function Angle(p1, p2, p3) {
		var bearing21 = Bearing(p2, p1);
		var bearing23 = Bearing(p2, p3);
		var angle = bearing21 - bearing23;
		if (angle < 0) {
			angle += 360;
		}
		return angle;
	}
	/*方向*/
	function Bearing(from, to) {
		var lat1 = from.lat * radiansPerDegree;
		var lon1 = from.lon * radiansPerDegree;
		var lat2 = to.lat * radiansPerDegree;
		var lon2 = to.lon * radiansPerDegree;
		var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
		if (angle < 0) {
			angle += Math.PI * 2.0;
		}
		angle = angle * degreesPerRadian; //角度
		return angle;
	}

	var PolygonPrimitive = ( function () {
		function _(positions) {
			this.options = {
				name: '多边形',
				polygon: {
					hierarchy: [],
					// perPositionHeight : true,
					material: Cesium.Color.GREEN.withAlpha(0.5),
					// heightReference:20000
				}
			};
			this.hierarchy = {positions};
			this._init();
		}

		_.prototype._init = function () {
			var _self = this;
			var _update = function () {
				return _self.hierarchy;
			};
			//实时更新polygon.hierarchy
			this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
			viewer.entities.add(this.options);
		};
		return _;
	})();

	function distance(point1, point2) {
		var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
		var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
		/**根据经纬度计算出距离**/
		var geodesic = new Cesium.EllipsoidGeodesic();
		geodesic.setEndPoints(point1cartographic, point2cartographic);
		var s = geodesic.surfaceDistance;
		//console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
		//返回两点之间的距离
		s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
		return s;
	}
}

function removeEntities(viewer){
	viewer.entities.removeAll();
}
