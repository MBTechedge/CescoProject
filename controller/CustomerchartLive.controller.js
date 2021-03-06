sap.ui.define([
	"iot/techedge/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("iot.techedge.controller.CustomerchartLive", {
		// setIntervalSynchronous: function (func, delay) {
		//     var intervalFunction, timeoutId, clear;
		//     // Call to clear the interval.
		//     clear = function () {
		//         clearTimeout(timeoutId);
		//     };
		//     intervalFunction = function () {
		//         func();
		//         timeoutId = setTimeout(intervalFunction, delay);
		//     };
		//     // Delay start.
		//     timeoutId = setTimeout(intervalFunction, delay);
		//     // You should capture the returned function for clearing.
		//     return clear;
		// },

		onInit: function() {

			var oVizFrame = this.getView().byId("idVizFrame");
			oVizFrame.setVizProperties({
				id: "idVizFrame",
				plotArea: {

					dataLabel: {

						visible: true
					}
				},
				valueAxis: {

					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				},
				title: {
					visible: true,
					text: 'Live Counter Accesses'
				}
			});

			this.getRouter().getRoute("customerchartlive").attachPatternMatched(this._onObjectMatched, this);

		},

		_onObjectMatched: function(oEvent) {

			this.currentDevice = oEvent.getParameter("arguments").deviceId;
			if (this.currentDevice === "ALL") {
				this.currentDevice = "";
			}
			this.getView().getModel().setData({});
			this.getView().byId("pagina").setTitle(oEvent.getParameter("arguments").name);
			// this.getView().byId("listaId").setBusy(false);
		},

		applyPress: function() {
				var seconds = this.getView().byId("selectId").getSelectedKey();
				if (!!this.intervalVar) {
					clearInterval(this.intervalVar);
				// 	this.blockExecution = true;
				}

				this.loadLiveData(this, true, this.readConfig("defaultInterval"), seconds, this.readConfig("defaultPower"), this.currentDevice,
					"", "", 1, 30);
				//loadLiveData: function(context, continuos, timeinterval, timescale, power, device, startDate, endDate, numDays, colNum) 
			}
			// onAfterRendering: function() {
			// 	var that = this;
			// 	//this.setIntervalSynchronous(function(){ that.reloadData(that);}, 5000);
			// 	setInterval(function() {
			// 		that.reloadData(that);
			// 	}, 5000);
			// },

		// reloadData: function(that) {
		// 	//clearInterval(that.intervallo);
		// 	//	that.getView().getModel().loadData("https://iotp1941952276trial.hanatrial.ondemand.com/IoTMilanProject/Consume", {}, false, "GET");
		// 	this.loadLiveData(this, false, this.readConfig("defaultInterval"), 15, this.readConfig("defaultPower"), "", "", "", "", 30);
		// 	//that.intervallo = setInterval(that.reloadData, 2500);
		// }
	});

});
/*
sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/data/FlattenedDataset',
    ], function(jQuery, Controller, JSONModel, FlattenedDataset) {
    "use strict";
    
    return Controller.extend("iot.techedge.controller.LandingPage", {
        
        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume",
        
        settingsModel : {
            dataset : {
                name: "Dataset",
                defaultSelected : 1,
                values : [{
                    name : "Small",
                    value : "/betterSmall.json"
                },{
                    name : "Medium",
                    value : "/betterMedium.json"
                },{
                    name : "Large",
                    value : "/betterLarge.json"
                }]
            },
            series : {
                name : "Series",
                defaultSelected : 0,
                values : [{
                    name : "1 Series",
                    value : ["Revenue"]
                }, {
                    name : '2 Series',
                    value : ["Revenue", "Cost"]
                }]
            },
            dataLabel : {
                name : "Value Label",
                defaultState : true
            },
            axisTitle : {
                name : "Axis Title",
                defaultState : false
            },
            dimensions: {
                Small: [{
                    name: 'Seasons',
                    value: "{Seasons}",
                }],
                Medium: [{
                    name: 'Week',
                    value: "{Week}",
                }],
                Large: [{
                    name: 'Week',
                    value: "{Week}",
                }]
            },
            measures: [{
               name: 'Revenue',
               value: '{Revenue}'
            },{
               name: 'Cost',
               value: '{Cost}'
            }]
        },
        
        oVizFrame : null,
 
        onInit : function (evt) {
            this.initCustomFormat();
            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
            this.getView().setModel(oModel);
            
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        formatString:CustomerFormat.FIORI_LABEL_SHORTFORMAT_2,
                        visible: true
                    }
                },
                valueAxis: {
                    label: {
                        formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_10
                    },
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                title: {
                    visible: false,
                    text: 'Revenue by City and Store Name'
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/betterMedium.json");
            oVizFrame.setModel(dataModel);
            
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
            
            InitPageUtil.initPageSettings(this.getView());
        },
        onAfterRendering : function(){
            var datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);
            
            var seriesRadioGroup = this.getView().byId('seriesRadioGroup');
            seriesRadioGroup.setSelectedIndex(this.settingsModel.series.defaultSelected);
        },
        onDatasetSelected : function(oEvent){
            var datasetRadio = oEvent.getSource();
            if(this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                var dataset = {
                    data: {
                        path: "/milk"
                    }
                };
                var dim = this.settingsModel.dimensions[bindValue.name];
                dataset.dimensions = dim;
                dataset.measures = this.settingsModel.measures;
                var oDataset = new FlattenedDataset(dataset);
                this.oVizFrame.setDataset(oDataset);
                var dataModel = new JSONModel(this.dataPath + bindValue.value);
                this.oVizFrame.setModel(dataModel);

                var feedCategoryAxis = this.getView().byId('categoryAxisFeed');
                this.oVizFrame.removeFeed(feedCategoryAxis);
                var feed = [];
                for (var i = 0; i < dim.length; i++) {
                    feed.push(dim[i].name);
                }
                feedCategoryAxis.setValues(feed);
                this.oVizFrame.addFeed(feedCategoryAxis);
            }
        },
        onSeriesSelected : function(oEvent){
            var seriesRadio = oEvent.getSource();
            if(this.oVizFrame && seriesRadio.getSelected()){
                var bindValue = seriesRadio.getBindingContext().getObject();
                
                var feedValueAxis = this.getView().byId('valueAxisFeed');
                this.oVizFrame.removeFeed(feedValueAxis);
                feedValueAxis.setValues(bindValue.value);
                this.oVizFrame.addFeed(feedValueAxis);
            }
        },
        onDataLabelChanged : function(oEvent){
            if(this.oVizFrame){
                this.oVizFrame.setVizProperties({
                    plotArea: {
                        dataLabel: {
                            visible: oEvent.getParameter('state')
                        }
                    }
                });
            }
        },
        onAxisTitleChanged : function(oEvent){
            if(this.oVizFrame){
                var state = oEvent.getParameter('state');
                this.oVizFrame.setVizProperties({
                    valueAxis: {
                        title: {
                            visible: state
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: state
                        }
                    }
                });
            }
        },
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
    }); 
 
    
 
});

*/