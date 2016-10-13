var map;
var jsonContent;
var jsonMarkersContent;
var lastOpenedInfoWindow;
var infoWindowArray = [];
var markersRendered = 0;
var that;

sap.ui.define([
	"iot/techedge/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("iot.techedge.controller.Gmaps", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf iot.techedge.view.EmptyDetail
		 */
			onInit: function() {
				
				that = this;
				this.getRouter().getRoute("gmaps").attachPatternMatched(this._onObjectMatched, this);
				document.addEventListener('DOMContentLoaded', function() {
					onAfterRendering();
					}, false);

			},

			_onObjectMatched: function(oEvent) {
				
				var liveValues = {};
				
				jsonMarkersContent = this.getView().getModel("rpiJ").getJSON();
				
				this.getView().getModel("rpiJ").attachRequestCompleted(function() {
					jsonMarkersContent = that.getView().getModel("rpiJ").getJSON();
					if (markersRendered === 0){
						renderMarkers();
						markersRendered = 1;
					}
				});

				this.getView().getModel().attachRequestCompleted(function() {
					that.jsonContent = that.getView().getModel().getJSON();
					liveValues = JSON.parse(that.jsonContent);
					for (var k=0; k<infoWindowArray.length; k++){
						if (infoWindowArray[k].getContent().includes("Milano"))
				    		infoWindowArray[k].setContent('<div id="content"><p> Milano <BR> Total: ' + liveValues.Total + '</p></div>'); 
					}
				});	

			},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf iot.techedge.view.EmptyDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf iot.techedge.view.EmptyDetail
		 */
			onAfterRendering: function() {

				map = new google.maps.Map(document.getElementById('map'), {
					center: new google.maps.LatLng(45.6093108,9.5125623),
					zoom: 8
				});
				
				if ( jsonMarkersContent !== "{}" ){
					renderMarkers();
					markersRendered = 1;
				}
			},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf iot.techedge.view.EmptyDetail
		 */
		//	onExit: function() {
		//
		//	}

	});
	
	function bindInfoWindow(marker, map, infowindow) {
	    marker.addListener('click', function() {
	    	closeLastOpenedInfoWindo();
	        infowindow.open(map, this);
	        lastOpenedInfoWindow = infowindow;
	    });
	    google.maps.event.addListener(map, "click", function(event) {
	        infowindow.close();
	    });
	} 

	function closeLastOpenedInfoWindo() {
		if (lastOpenedInfoWindow) {
		    lastOpenedInfoWindow.close();
		}
	}
	
	function renderMarkers() {
		
		var contentString;
		var marker;
		var myLatlng;
		var arrayLatlng;
		var infowindow;
		var iterator = JSON.parse(jsonMarkersContent);		
		
		for (var i = 0, l = iterator.stores.length; i < l; i++) {
			
			contentString = iterator.stores[i]["city"];
		    arrayLatlng = iterator.stores[i]["location"].split(',')
		    myLatlng = new google.maps.LatLng(arrayLatlng[0], arrayLatlng[1]);
		    
		    if (iterator.stores[i]["location"] !== null){
			    marker = new google.maps.Marker({
				    position: myLatlng,
			        map: map,
			        title: iterator.stores[i]["name"]
		        });
			    infowindow = new google.maps.InfoWindow({
					content: '<div id="content"><p>' + contentString + '</p></div>',
					maxWidth: 200
				});
			    infoWindowArray.push(infowindow);
			    
			 // add an event listener for this marker
			    bindInfoWindow(marker, map, infowindow); 

            }
		}
	}
	
});