sap.ui.define([
	"iot/techedge/BaseController",
	'sap/ui/model/Filter',
	'sap/ui/core/Fragment'
], function(BaseController, Filter, Fragment) {
	"use strict";

	return BaseController.extend("iot.techedge.controller.Master", {
		// 
		onSearch: function(oEvt) {

			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("name", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}
			// update list binding
			var list = this.getView().byId("listMasterId");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");

		},
		// Dialogo Filtri
		onFilter: function(oEvent) {
			var oButton = oEvent.getSource();

			this.handleOpenDialog();

			return;
		},

		_getDialog: function() {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("iot.techedge.fragment.filterDialog", this);
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;
		},

		handleOpenDialog: function() {
			this._getDialog().open();
		},

		onListItemPress: function(oEvt) {
				var src = oEvt.getSource();
				//var index = src.getBindingContext("rpiJ").getPath().substr(1);
				var devId = src.getBindingContext("rpiJ").getObject().deviceId;
				if (this.getView().getModel("cfgJ").getProperty("/subRoute") === "L") {
					this.getRouter().navTo("customerchartlive", {
						deviceId: devId
					});
				} else {
					this.getRouter().navTo("customerchartfix", {
						deviceId: devId
					});
				}
				//this.getRouter().getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
			}
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf iot.techedge.view.Master
			 */
			//	onInit: function() {
			//
			//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf iot.techedge.view.Master
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf iot.techedge.view.Master
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf iot.techedge.view.Master
		 */
		//	onExit: function() {
		//
		//	}

	});

});