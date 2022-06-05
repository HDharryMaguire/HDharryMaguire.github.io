require([
	"esri/config",
	"esri/Map",
	"esri/views/MapView",
	"esri/layers/FeatureLayer",
	"esri/Graphic",
	"esri/layers/GeoJSONLayer",
	"esri/geometry/geometryEngine",
	"esri/core/watchUtils",
    "esri/widgets/LayerList",
    "esri/widgets/TimeSlider",
	"esri/widgets/Expand",
	"esri/widgets/Legend",
	"esri/layers/GraphicsLayer"
	], 
	function (esriConfig, Map, MapView, FL, Graphic, GeoJSONLayer,geometryEngine,watchUtils, LayerList, TimeSlider,Expand,Legend,GraphicsLayer) {

		esriConfig.apiKey = "AAPK56e3ac027f044c4089d8ceec232fc05dYaOuzVRzm8tMRqvzOvDvIEevbqJ85yppn9PacU6cy4duurJrVK9wo_8BcWO8i8bi";
		
		//基础底图
		var map = new Map({
			basemap: "streets" ,// Basemap layer service
			//layers: [resultsLayer]
		});
		//主视图
		var view = new MapView({
			map: map,
			center: [139.746, 35.680], // Longitude, latitude
			zoom: 5, // Zoom level
			container: "viewDiv" // Div element
		});	
		var map2 = new Map({
			basemap: "topo-vector"
		});
		//附图（左）
		var view2 = new MapView({
			map: map2,
			center: [139.746, 35.680], // Longitude, latitude
			zoom: 5, // Zoom level
			container: "viewDiv2",
		});
		
//1.可以同时出现两幅地图，对其中任意一幅地图做浏览操作（平移缩放)，另外一幅地图都会响应并保持一致。
		//该功能见5

				
//2.切换底图
		//四种basemap类型
		document.getElementById("streets").addEventListener("click", function () {
		    map.basemap = "streets";
		});	
		document.getElementById("osm").addEventListener("click", function () {
		    map.basemap = "osm";
		});	
		document.getElementById("oceans").addEventListener("click", function () {
		    map.basemap = "oceans";
		});	
		document.getElementById("hybrid").addEventListener("click", function () {
		    map.basemap = "hybrid";
		});			
		
//3.能够动态加载专题图层。可以显示图层的数量，控制图层的显示与关闭。能够删除图层。
		//引用图层url
		var layer_population = new FL({//人口
			url: "https://services.arcgis.com/wlVTGRSYTzAbjjiC/arcgis/rest/services/prefectureboundaries2021/FeatureServer",
			popupTemplate:{title:"{KEN}",
			content:[
				{
					type: "fields",
					fieldInfos:[
						{
							fieldName: "KEN_ENG",
							label: "英文名"
						}
					]
					
				}
			]
			}
		});
		
		var layer_wind = new FL({//风向与风速
			url: "https://services.arcgis.com/wlVTGRSYTzAbjjiC/arcgis/rest/services/amedas_latest_value_2/FeatureServer",
			popupTemplate:{title:"{kjName}",
			content:[
				{
					type: "fields",
					fieldInfos:[
						{
							fieldName: "windDirection",
							label: "风向"
						},
						{
							fieldName: "wind",
							label: "风速"
						}
					]
					
				}
			]
			}
		});
		
		var layer_temperature = new FL({//气温
			url: "https://services.arcgis.com/wlVTGRSYTzAbjjiC/arcgis/rest/services/amedas_latest_value_view/FeatureServer",
			popupTemplate:{title:"{kjName}",
			content:[
				{
					type: "fields",
					fieldInfos:[
						{
							fieldName: "temperature",
							label: "实时气温"
						}
					]
					
				}
			]
			}
		});
		
		var layer_rainfall = new FL({//降水量
			url: "https://services.arcgis.com/wlVTGRSYTzAbjjiC/arcgis/rest/services/amedas_latest_value_1/FeatureServer",
			popupTemplate:{title:"{kjName}",
			content:[
				{
					type: "fields",
					fieldInfos:[
						{
							fieldName: "precipitation10m",
							label: "降水量（10min）"
						},
						{
							fieldName: "precipitation1h",
							label: "降水量（1h）"
						},
						{
							fieldName: "precipitation3h",
							label: "降水量（3h）"
						},
						{
							fieldName: "precipitation24h",
							label: "降水量（24h）"
						}
					]
					
				}
			]
			}
		});
		var layer_hurricane = new FL({//飓风
			url: "https://services.arcgis.com/wlVTGRSYTzAbjjiC/ArcGIS/rest/services/IBTrACS_v4_japan_time/FeatureServer/0",
			popupTemplate:{title:"{kjName}",
			content:[
				{
					type: "fields",
					fieldInfos:[
						{
							fieldName: "time",
							label: "年份"
						},
						{
							fieldName: "NAME",
							label: "飓风名称"
						}
					]
					
				}
			]
			}
		});

		//创建图例
		var legend = new Legend({
		  view: view,
		  layerInfos: [
			{
			  layer: layer_wind
			},
			{
			  layer: layer_temperature
			},
			{
			  layer: layer_rainfall
			},
			{
			  layer: layer_hurricane
			}
		  ]
		});
	


		//图例可隐藏
		var legendExpand = new Expand({
		  expandTooltip: "Show Legend",
		  expanded: false,
		  view: view,
		  content: legend
		});
        view.ui.add(legendExpand, "bottom-left");
        const legendExpand2 = new Expand({
          expandIconClass: "esri-icon-legend",
          expandTooltip: "Legend",
          view: view,
          content: legend,
          expanded: false
        });
        view.ui.add(legendExpand2, "top-left");

		
		//添加图层
		document.getElementById("Add_layer1").addEventListener("click", function () {
			map.add(layer_population);
		});
		
		document.getElementById("Add_layer2").addEventListener("click", function () {
			map.add(layer_wind);
		});

		document.getElementById("Add_layer3").addEventListener("click", function () {
			map.add(layer_temperature);
		});

		document.getElementById("Add_layer4").addEventListener("click", function () {
			map.add(layer_rainfall);
		});
		document.getElementById("Add_layer5").addEventListener("click", function () {
			map.add(layer_hurricane);
		});

		//删除图层
		document.getElementById("Remove_layer1").addEventListener("click", function () {
			view.map.remove(layer_population);
		});
		
		document.getElementById("Remove_layer2").addEventListener("click", function () {
			view.map.remove(layer_wind);
		});

		document.getElementById("Remove_layer3").addEventListener("click", function () {
			view.map.remove(layer_temperature);
		});

		document.getElementById("Remove_layer4").addEventListener("click", function () {
			view.map.remove(layer_rainfall);
		});	
		document.getElementById("Remove_layer5").addEventListener("click", function () {
			view.map.remove(layer_hurricane);
		});
			
		//显示图层数目
	    view.map.allLayers.on("change", function (event) {
			var num = event.target.length - 1;
			document.getElementById("Layers").textContent = "当前图层数： " + num;
		});
		


//4.显示地图比例尺，并能根据地图的缩放调整比例尺的数值。鼠标在地图上移动时，能实时显示坐标。
		
		view.watch(["stationary"], function () {
			showInfo(view.center);
		});
		//添加显示鼠标的坐标点
		view.on(["pointer-move"], function (evt) {
			showInfo(view.toMap({
				x: evt.x,
				y: evt.y
			}));
		});
		view2.on(["pointer-move"], function (evt) {
			showInfo(view.toMap({
				x: evt.x,
				y: evt.y
			}));
		});
		//添加比例尺和实时经纬度坐标
		function showInfo(pt) {
			document.getElementById("scaleDisplay").textContent = "当前比例尺：1:" + Math.round(view.scale);
			//console.log(Math.round(view.scale))
			document.getElementById("coordinateDisplay").textContent = "经度:" + pt.latitude.toFixed(7) + "，" + "  纬度：" + pt.longitude
				.toFixed(7);
		}
		
		//省份图层添加
		
//5.每加载一个图层，生成鹰眼图（缩略图）
		/*
		//基础底图
		var map = new Map({
			basemap: "streets" // Basemap layer service
		});
		//主视图
		var view = new MapView({
			map: map,
			center: [119, 35.027], // Longitude, latitude
			zoom: 3, // Zoom level
			container: "viewDiv" // Div element
		});	
		*/
		//创建缩略底图
		
		//创建缩略图容器
		var mapView = new MapView({
		  container: "overviewDiv",
		  map: map,
		  constraints: {
			rotationEnabled: false
		  }
		});
		//缩略图与主图副图联动
		view.on(["pointer-down", "pointer-move"], function (evt) {
			mapView.scale = view.scale * 2 *
                    Math.max(
                      view.width / mapView.width,
                      view.height / mapView.height
                    );
			mapView.center = view.center;
			view2.zoom = view.zoom;
			view2.center = view.center;
		});
		mapView.on(["pointer-down", "pointer-move"], function (evt) {
			view.scale = mapView.scale * 0.5 *
		            Math.max(
		              mapView.width / view.width,
		              mapView.height / view.height
		            );
			view.center = mapView.center;
			view2.zoom = view.zoom;
			view2.center = view.center;
			
		});
		view2.on(["pointer-down", "pointer-move"], function (evt) {
			mapView.scale = view.scale * 2 *
		            Math.max(
		              view2.width / mapView.width,
		              view2.height / mapView.height
		            );
			mapView.center = view2.center;
			view.zoom = view2.zoom;
			view.center = view2.center;
		});

		
				

		//除去额外控件
		mapView.ui.components = [];

		mapView.when(() => {
		  view.when(() => {
			setup();
		  });
		});
		
		
		//定义遮罩的样式和属性
		function setup() {
		  const extent3Dgraphic = new Graphic({
			geometry: null,
			symbol: {
			  type: "simple-fill",
			  color: [0, 0, 0, 0.5],
			  outline: null
			}
		  });
		  mapView.graphics.add(extent3Dgraphic);
		
		  watchUtils.init(view, "extent", (extent) => {
		
			extent3Dgraphic.geometry = extent;
		
		  });
		}
//飓风查询
        const timeSlider = new TimeSlider({
          container: "timeSlider",
          view: view,
          mode: "time-window",
            fullTimeExtent: {
              start: new Date(1890, 0, 1),
              end: new Date(2020, 0, 1)
            },
            timeExtent: {
              start: new Date(2019, 2, 1),
              end: new Date(2019, 2, 28) //end date
            }
        });
        view.whenLayerView(layer_hurricane).then((lv) => {
          const fullTimeExtent = layer_hurricane.timeInfo.fullTimeExtent;

          // set up time slider properties
          timeSlider.fullTimeExtent = fullTimeExtent;
          timeSlider.stops = {
            interval: layer_hurricane.timeInfo.interval
          };
        });

        // add the UI for a title
        view.ui.add("titleDiv", "top-right");


	});