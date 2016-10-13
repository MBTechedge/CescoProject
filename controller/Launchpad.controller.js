sap.ui.define([
	"iot/techedge/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("iot.techedge.controller.Launchpad", {

		onInit: function() {
			//Append this code :
			// var oEventBus = sap.ui.getCore().getEventBus();
			// oEventBus.subscribe("FullScreen", "changeApp", this.changeApp, this);
			// oEventBus.subscribe("Detail", "changeApp", this.changeApp, this);

		},

		// changeApp: function() {
		// 	var idControl = this.getView().byId("splitAppId");
		// 	var idNormalControl = this.getView().byId("launch");
		// 	idControl.setVisible(idNormalControl.getVisible());
		// 	idNormalControl.setVisible(!(idControl.getVisible()));
		// },

		onPressTile: function(oEvt) {
			var src = oEvt.getSource();
			var binding = src.getBindingContext("tilesJ");
			var obj = binding.getObject();
			var route = obj.route;
			this.getView().getModel("cfgJ").setProperty("/subRoute", obj.subPath);
			clearInterval(this.intervalVar);
			this.intervalVar = null;
			// var oEventBus = sap.ui.getCore().getEventBus();
			// oEventBus.publish("FullScreen", "changeApp");
			this.getRouter().navTo(route, false);

		},
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf iot.techedge.view.Launchpad
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf iot.techedge.view.Launchpad
		 */
		onBeforeRendering: function() {
			// if (this.getView().getId().indexOf("App")>-1){
			// 	return;
			// }
			// if (this.intervalVar === null || this.intervalVar === undefined) {
				this.loadLiveData(this, true, this.readConfig("defaultInterval"), 15, this.readConfig("defaultPower"), "", "", "", 1, 30);
			// }
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf iot.techedge.view.Launchpad
		 */
		onAfterRendering: function() {
			//this.loadLiveData(this,true, this.readConfig("defaultInterval"), 15, this.readConfig("defaultPower"),"", "", "", 1, 30);
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf iot.techedge.view.Launchpad
		 */
		onExit: function() {

		}

	});

});