
var map;


//initialise map
function init(){
	map = new ol.Map({
		target : 'map',
		//the type of rendered we want to use.
		renderer : 'canvas',
		view : new ol.View({
			//projection is about how we represent a global thing on a flat thing.
			projection : 'EPSG:900913',
			center : ol.proj.fromLonLat([-2.5,51.1]),
			zoom:4,
		})
	});
	map.addLayer(imageLayer);

	
}



//add standard mapping layer
var baseLayer = new ol.layer.Tile({
	title : 'Global imagery',
	source : new ol.source.OSM()
});

var imageLayer = new ol.layer.Image({
	source : new ol.source.ImageWMS({
		url : 'http://demo.boundlessgeo.com/geoserver/wms',
		params : {
			LAYERS : 'ne:ne'
		},
		serverType : 'geoserver',
		crossOrigin : 'anonymous'
	})
});


//add random green layer
var vectorLayer = new ol.layer.Tile({
	//use web map service to pull layer bject onto map
	source: new ol.source.TileWMS({
		//preload the layer, ie the layer will stay cached 
		//when the user zooms in and out etc
		preload: Infinity,
		//url of the map server
		url: 'http://felek.cns.umass.edu:8080/geoserver/wms',
		serverType : 'geoserver',
		params : {
			//defines the actual layer we are pulling. 
			//Streams is the workspace of the layer in this case. 'Developed' is layer name.
			//TILED : only load a relevant part of the layer, not the entire thing.
			'LAYERS': "Streams:Developed", 'TILED':true
		}
	})
});

var vectorLayer_2 = new ol.layer.Tile({
	source : new ol.source.TileWMS({
		preload: Infinity,
		url : 'http://felek.cns.umass.edu:8080/geoserver/wms',
		serverType: 'geoserver',
		params : {
			'LAYERS':"Streams:Deposition_of_Nitrogen", 'TILED':true
		}
	})
});

init();



