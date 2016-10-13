sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";

	return Controller.extend("iot.techedge.BaseController", {

		getRouter: function() {

			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onNavBack: function(oEvent) {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("launchpad", {}, true /*no history*/ );
			}
		},

		readConfig: function(property) {
			try {
				return this.getView().getModel("cfgJ").getProperty("/" + property);
			} catch (e) {
				return "";
			}
		},
		writeConfig: function(property, valore) {
			try {
				return this.getView().getModel("cfgJ").setProperty("/" + property, valore);
			} catch (e) {
				return "";
			}
		},

		onNavBackHome: function(oEvent) {

			this.getRouter().navTo("launchpad", {}, true /*no history*/ );
			this.loadLiveData(this, true, this.readConfig("defaultInterval"), 15, this.readConfig("defaultPower"), "", "", "", 1, 30);

		},

		loadLiveData: function(context, continuos, timeinterval, timescale, power, device, startDate, endDate, numDays, colNum) {
			var that = context;
			// WEBIDE var baseUrl = "https://iotp1941952276trial.hanatrial.ondemand.com/IoTMilanProject/Consume";
			var baseUrl = "/IoTMilanProject/Consume";
			that.finalUrl = "";
			that.blockExecution = false;
			if (!!that.intervalVar) {
				clearInterval(that.intervalVar);
				// that.blockExecution = true;
			}
			var handleTimer = this.readConfig("timerHandle");
			clearInterval(handleTimer);
			if (timeinterval !== undefined) {
				this.finalUrl += "&timeinterval=" + timeinterval;
			}
			if (timescale !== undefined) {
				this.finalUrl += "&timescale=" + timescale;
			}
			if (power !== undefined) {
				this.finalUrl += "&power=" + power;
			}
			if (device !== undefined && device.length >0) {
				this.finalUrl += "&device=" + device;
			}
			if (startDate !== undefined && endDate !== undefined) {

				this.finalUrl += "&startDate=" + startDate;//.substring(0, 8);
				this.finalUrl += "&endDate=" + endDate;//.substring(0, 8);
			}
			if (numDays !== undefined) {
				this.finalUrl += "&numDays=" + numDays;
			}
			if (colNum !== undefined) {
				this.finalUrl += "&colNum=" + colNum;
			}

			this.finalUrl = baseUrl + "?" + that.finalUrl.substring(1, that.finalUrl.length);

			that.getView().getModel().attachRequestCompleted(function() {
				that.finishLoadingData(that);
			});
			//this.setIntervalSynchronous(function(){ that.reloadData(that);}, 5000);

			if (!continuos) {
				console.log((new Date()).toTimeString() + " Intervallo settato afterrendering NOT LIVE!\n" + that.finalUrl);
				context.getView().getModel("dataFixedJ").loadData(that.finalUrl, {}, true, "GET");

			} else if (!that.blockExecution) {
				// context.getView().getModel().loadData(that.finalUrl, {}, true, "GET");
				// that.intervalVar = setInterval(function() {
				that.reloadData(that);
				this.writeConfig("timerHandle", setInterval(function() {
					console.log((new Date()).toTimeString() + " Intervallo settato afterrendering LIVE!");
					that.reloadData(that);
				}, 7500));

			}

		},

		reloadData: function(that) {
			// clearInterval(that.intervalVar);
			//console.log((new Date()).toTimeString() + " Intervallo cancellato reloadData " + that.finalUrl);

			that.getView().getModel().loadData(that.finalUrl, {}, true, "GET");

			//that.intervallo = setInterval(that.reloadData, 2500);
		},
		finishLoadingData: function(that) {
			// clearInterval(that.intervalVar);

			// Aggiorno il model del tile
			that.getView().getModel("tilesJ").setProperty("/tiles/0/number", that.getView().getModel().getProperty("/Total"));
			that.getView().getModel("tilesJ").setProperty("/tiles/1/number", that.getView().getModel().getProperty("/global/29/ACCESSI"));

			// if(that.blockExecution){
			// 	return;	
			// }
			// that.intervalVar = setInterval(function() {
			// //	console.log((new Date()).toTimeString() + " Intervallo settato finishLoadingData");
			// 	that.reloadData(that, that.finalUrl);
			// }, 7500);
		}

	});

});