	var map;

	//globally declare image WMS
	var imageWMS = new ol.source.ImageWMS({
		url : 'http://demo.boundlessgeo.com/geoserver/wms',
		params : {
			LAYERS : 'ne:ne'
		},
		serverType : 'geoserver',
		crossOrigin : 'anonymous'
	});

	var view = new ol.View({
		//projection is about how we represent a global thing on a flat thing.
		projection : 'EPSG:900913',
		center : ol.proj.fromLonLat([-2.5,51.1]),
		zoom:4,
	});


	//initialise map (called at the end)
	function init(){
		map = new ol.Map({
			target : 'map',
			//the type of rendered we want to use.
			renderer : 'canvas',
			view : view
		});
		map.addLayer(imageLayer);
		
	}

	//image layer contains
	var imageLayer = new ol.layer.Image({
		source : imageWMS
	});


	init();
	
	// Supporting functions
	
	function spawnPopupWithData(coord){
		var $popup = $('<div>');
		
			$popup.load("./templates/popup.html",function(){
			var overlay = new ol.Overlay({
				element:$popup
			});
		
			map.addOverlay(overlay);
			
			//TODO set the position so it looks a bit nicer
			overlay.setPosition(coord);
			var url = generateInfoUrl(coord);
			generatePopupData($popup, url)
			
		});
	
	}
	
	//generate the url to send the request for data
	function generateInfoUrl(coordinate){
		return imageWMS.getGetFeatureInfoUrl(
			coordinate, 
			view.getResolution(), 
			'EPSG:3857',
			{'INFO_FORMAT' : 'application/json'}
		);
	}
	
	//request data to populate the modal with
	function generatePopupData(element, url){
		if(!url){
			element.innerHTML = "error";
		} else {
			$.get(url, function(data){
				populatePopup(element,data);
			}).fail(function(){
				
			});	
		}
	}
	
	//populate the modal with information given
	function populatePopup(element, data){
		var properties = data.features[0].properties;
		if (element[0].hasChildNodes()){
			element[0].childNodes[0].innerHTML = 
				"<div class='header'><h3>" + properties.admin + "</h3></div>" +
				"<div class='container'><br/>Continent: " + properties.continent + 
				"<br/>Type: " + properties.type + 
				"<br/>Income group: " + properties.income_grp + "</div>" + 
				element[0].childNodes[0].innerHTML;
		}
	}

	//close a popup
	function closePopup(popup){
		var overlays = map.getOverlays();
		
		for(var i = 0 ; i < overlays.a.length; i++){
			overlay = overlays.a[i];
			
			if (overlay.b.children[0].children[0] === popup.parentElement){
				overlay.setPosition(undefined);
			}
		}
	}

	//Define behaviours

	//Gets info on the country you've clicked on and puts it in a popup.
	map.on('singleclick', function(evt){
		spawnPopupWithData(evt.coordinate);		
	});


	//turn the cursor into a pointer if it's over an image.
	map.on('pointermove',function(evt){
		if(evt.dragging){
			return;
		}
		var pixel = map.getEventPixel(evt.originalEvent);
		//called with pixel, callback. Detects layers that have a colour value
		//at a pixel.
		var hit = map.forEachLayerAtPixel(pixel,function(layer){
			return true;
		});
		map.getTargetElement().style.cursor = hit? 'pointer' : '';
	});

	
