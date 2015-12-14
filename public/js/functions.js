
function spawnPopup(coord){
	var $popup = $('<div>');
	$popup.load("./templates/popup.html",function(){
		var overlay = new ol.Overlay({
			element:$popup
		});
	
		map.addOverlay(overlay);
		overlay.setPosition(coord);
	});
	
}
