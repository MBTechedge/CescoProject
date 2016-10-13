sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"iot/techedge/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("iot.techedge.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			var oModel = new sap.ui.model.json.JSONModel({});
			var oModelFixed = new sap.ui.model.json.JSONModel({});
			var configModel = new sap.ui.model.json.JSONModel(
				{
					subRoute:"",
					defaultPower: -45,
					refresh:7500,
					defaultInterval:8,
					timerHandle:-1
					
				});
			var oModelTiles = new sap.ui.model.json.JSONModel("model/tiles.json");
			var oModelRPi = new sap.ui.model.json.JSONModel("model/dati.json");
			var oModelIntervals = new sap.ui.model.json.JSONModel("model/timeIntervals.json");
			this.setModel(oModel);
			this.setModel(oModelFixed,"dataFixedJ");
			this.setModel(oModelTiles, "tilesJ");
			this.setModel(oModelRPi, "rpiJ");
			this.setModel(configModel,"cfgJ");
			this.setModel(oModelIntervals,"interJ");
			this.getRouter().initialize();
		}
	});

});