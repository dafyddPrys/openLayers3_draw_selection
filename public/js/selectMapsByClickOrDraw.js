var map;

var baseLayer = new ol.layer.Tile({
	source : new ol.source.OSM()
});

var view = new ol.View({
	//projection is about how we represent a global thing on a flat thing.
	projection : 'EPSG:900913',
	center : ol.proj.fromLonLat([-2.5,51.1]),
	zoom:4,
});


var pointsLayer = new ol.layer.Vector({
	title: 'random points',
	source : new ol.source.Vector({
		url : './assets/Points.json',
		format : new ol.format.GeoJSON()
	})
});

//initialise map (called at the end)
function init(){
	map = new ol.Map({
		target : 'map',
		//the type of rendered we want to use.
		renderer : 'canvas',
		view : view
	});
	map.addLayer(baseLayer);
	map.addLayer(pointsLayer);
}

init();

//////////// ADD DRAWING

//Define the collection of features and the overlay to show them.
var features = new ol.Collection();
var featureOverlay = new ol.layer.Vector({
	source : new ol.source.Vector({ features : features}),
	style : new ol.style.Style({
		fill : new ol.style.Fill({
			color: 'rgba(255,255,255,0.2)',
		}),
		stroke : new ol.style.Stroke({
			color : '#ffcc33',
			width : 2
		}),
		image : new ol.style.Circle({
			radius : 5,
			fill : new ol.style.Fill({
				color : '#ffcc33'
			})
		})
	})
});

featureOverlay.setMap(map);

//add drawing interaction - polygons only

//declare these globally so we can attach listeners to them later.
var draw;
var modify;
function addInteraction(){
	draw = new ol.interaction.Draw({
		features : features,
		type : 'Polygon'
	});
	map.addInteraction(draw);
	
	//add modification of polygons
	var modify = new ol.interaction.Modify({
		features : features
	});
	map.addInteraction(modify);
	
	//add event listener (wouldn't work outside this function)
	modify.on('modifyend',function(event){
		selectedFeatures.clear(); 
		//var extent = event.feature.getGeometry().getExtent();
		var extent = event.features.getArray()[0].getGeometry();
		pointsLayer.getSource().forEachFeatureIntersectingExtent(extent,function(feature){
			selectedFeatures.push(feature);
		});
		console.log(selectedFeatures.getArray().length);
	});
	
	modify.on('modifystart',function(event){
		console.log(selectedFeatures.getArray().length);
	});
}

addInteraction();


//////////// SUPPORTING FUNCTIONS

//turn the cursor into a pointer if it's over an image.
map.on('pointermove',function(evt){
	if(evt.dragging){
		return;
	}
	var pixel = map.getEventPixel(evt.originalEvent);
	//called with pixel, callback. Detects layers that have a colour value
	//at a pixel.
	var hit = map.forEachFeatureAtPixel(pixel,function(feature){
		return true;
	});
	map.getTargetElement().style.cursor = hit? 'pointer' : '';
});

//default is single click interaction.
var select = new ol.interaction.Select();

//////////// Selecting features in a polygons
var selectedFeatures = select.getFeatures();

// Add the interaction - style of selected function changes by default
map.addInteraction(select);
select.on('select', function (event){
	if(event.target){
		//Do stuff with target(s)
	    var selectedFeatures = event.target.getFeatures().getArray();
	}
})

function onPolygonEnd(event){
	//features that intersect the polygon will get added to the collection
	//of selected features.
	selectedFeatures.clear(); 
	var extent = event.feature.getGeometry().getExtent();
	pointsLayer.getSource().forEachFeatureInExtent(extent,function(feature){
		selectedFeatures.push(feature);
	});
	console.log(selectedFeatures.getArray().length);
}

draw.on('drawend',function(event){
	onPolygonEnd(event);
});

//reset selection when drawing a new polygon

draw.on('drawstart', function(event){
	selectedFeatures.clear();
});


map.on('click',function(){
	selectedFeatures.clear();
})






