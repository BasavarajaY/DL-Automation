sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	var contextPath = "";
	var oi18n, oUtilsI18n;
	return Controller.extend("com.extentia.dlrulecreate.controller.DLDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.extentia.dlrulecreate.view.DLDetail
		 */
		onInit: function () {
			this.onInitHookUp();
		},
		onInitHookUp: function () {
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			this.DynamicSideContent = this.getView().byId("ObjectPageLayout");
			oi18n = this._oComponent.getModel("i18n").getResourceBundle();
			//Router Initialisation
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//Attach event for routing on view patter matched 
			this._oRouter.attachRouteMatched(this.onRouteMatched, this);
			// this.setDefaultSettings();
			var oObjectPageLayout = this.byId("DLDetailObjectPageLayout");
			oObjectPageLayout.setShowFooter(true);
			if (this.onInitHookUp_Exit) {
				this.onInitHookUp_Exit();
			}
		},
		onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") !== "DLDetail") {
				return;
			}
			var oHistory = sap.ui.core.routing.History.getInstance();
			if (oEvent.getParameter("name") === "DLDetail") {
				this.setDefaultSettings();
				if (oHistory.getDirection() !== "Backwards") {
					contextPath = oEvent.getParameter("arguments").contextPath;
					var DLName = this.getPropertyValueFromContextPath(contextPath, "DLName");
					var RuleName = this.getPropertyValueFromContextPath(contextPath, "RuleName");
					var Region = this.getPropertyValueFromContextPath(contextPath, "Region");
					this.getView().getModel("LocalViewSettingDLDtl").setProperty("/DLName", DLName);
					this.getView().getModel("LocalViewSettingDLDtl").setProperty("/RuleName", RuleName);
					this.getView().getModel("LocalViewSettingDLDtl").setProperty("/Region", Region);
					this.getDLDetails();
				}
			}
		},
		getPropertyValueFromContextPath: function (path, property) {
			var propertyValue = "";
			propertyValue = path.split(property + "=")[1];
			if (propertyValue) {
				propertyValue = propertyValue.split(",")[0].replace("'", "").replace("'", "").replace(")", "");
			}
			return propertyValue;
		},
		setDefaultSettings: function () {
			var oViewSettingModel = new sap.ui.model.json.JSONModel();
			var viewSettingData = {
				valueHelpFieldName: "",
				editMode: false,
				detailMode: true,
				DLName: "",
				RuleName: "",
				Region: ""
			};
			oViewSettingModel.setData(viewSettingData);
			this._oComponent.setModel(oViewSettingModel, "LocalViewSettingDLDtl");
		},
		getDLDetails: function () {
			var oDLData = [{
				UserId: "000001",
				FirstName: "Scott",
				LastName: "Henry",
				Role: "Manger",
				Country: "USA"
			}, {
				UserId: "000002",
				FirstName: "Steve",
				LastName: "Carell",
				Role: "Product Manger",
				Country: "USA"
			}, {
				UserId: "000003",
				FirstName: "Mark",
				LastName: "Cuban",
				Role: "Delivery Manger",
				Country: "USA"
			}, {
				UserId: "000004",
				FirstName: "Ricky",
				LastName: "Tollman",
				Role: "Team Lead",
				Country: "USA"
			}, {
				UserId: "000004",
				FirstName: "Will",
				LastName: "Blair",
				Role: "Head",
				Country: "USA"
			}];
			var oDLDetailsModel = new sap.ui.model.json.JSONModel();
			oDLDetailsModel.setData(oDLData);
			this.getView().setModel(oDLDetailsModel, "DLUserDetails");
		},
		navigateBack: function () {
			if (this._oComponent.getModel("LocalViewSettingDLDtl").getProperty("/editMode")) {
				this._oComponent.getModel("LocalViewSettingDLDtl").setProperty("/editMode", false);
				this._oComponent.getModel("LocalViewSettingDLDtl").setProperty("/detailMode", true);
			} else {
				this._oComponent.getModel("LocalViewSettingDLDtl").setProperty("/editMode", false);
				this._oComponent.getModel("LocalViewSettingDLDtl").setProperty("/detailMode", true);
				window.history.go(-1);
			}

		},
		onEdit: function () {
			this._oComponent.getModel("LocalViewSettingDLDtl").setProperty("/editMode", true);
			this._oComponent.getModel("LocalViewSettingDLDtl").setProperty("/detailMode", false);
		},
		onCancel: function () {
			this.confirmDialog();
		},
		confirmDialog: function () {
			var dialog = new sap.m.Dialog({
				title: "Confirm",
				type: "Message",
				state: "Warning",
				icon: "sap-icon://message-warning",
				content: new sap.m.Text({
					text: "Your changes will be lost. you want to cancel the changes?"
				}),
				beginButton: new sap.m.Button({
					text: "YES",
					press: function () {
						// this._oRouter.navTo("DLListPage");
						this._oComponent.getModel("LocalViewSettingDLDtl").setProperty("/editMode", false);
						this._oComponent.getModel("LocalViewSettingDLDtl").setProperty("/detailMode", true);
						dialog.close();
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: "NO",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},
		toggleFooter: function () {
			var oObjectPageLayout = this.byId("DLDetailObjectPageLayout");
			oObjectPageLayout.setShowFooter(!oObjectPageLayout.getShowFooter());
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.extentia.dlrulecreate.view.DLDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.extentia.dlrulecreate.view.DLDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.extentia.dlrulecreate.view.DLDetail
		 */
		//	onExit: function() {
		//
		//	}

	});

});