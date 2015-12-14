
//Attribution
var myAttributionControl = new ol.control.Attribution({
  className:'ol-attribution', //default parameter
  target:null, //default parameter. Places attribution in a div
});
map.addControl(myAttributionControl);

//This is a default control. If you felt like destroying someone else's credit, you could use the css reference to stop displaying the attribution.

//Full Screen
var myFullScreenControl = new ol.control.FullScreen();
map.addControl(myFullScreenControl);

//Rotate
var myRotateControl = new ol.control.Rotate()
map.addControl(myRotateControl);

//ScaleLine
var myScaleLine = new ol.control.ScaleLine()
map.addControl(myScaleLine);
//I often use the scale line. The default implementation looks nice.

//Zoom
var myZoom = new ol.control.Zoom();
map.addControl(myZoom);
//Zoom is a default control, but there are some parameters you could change if you wanted:
//Check them out here: http://ol3js.org/en/master/apidoc/ol.control.Zoom.html


//ZoomSlider
var myZoomSlider = new ol.control.ZoomSlider();
map.addControl(myZoomSlider);
//The zoom slider is a nice addition to your map. It is wise to have it accompany your zoom buttons.

//ZoomToExtent
var myExtentButton = new ol.control.ZoomToExtent({
    extent:undefined
});
map.addControl(myExtentButton);
//This is a complicated button. We will implement this in a special way. The key for this
//is to create an extent and pass it to the button. If undefined, the extent is the entire map.

