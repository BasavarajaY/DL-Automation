sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	var contextPath = "";
	var oi18n, oUtilsI18n;
	return Controller.extend("com.extentia.dlrulecreate.controller.DlRuleDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.extentia.dlrulecreate.view.DlRuleDetail
		 */
		onInit: function () {
			this.onInitHookUp();
		},
		onInitHookUp: function () {
			gDLRuleDetailPage = this.getView();
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			this.DynamicSideContent = this.getView().byId("ObjectPageLayout");
			oi18n = this._oComponent.getModel("i18n").getResourceBundle();
			//Router Initialisation
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//Attach event for routing on view patter matched 
			this._oRouter.attachRouteMatched(this.onRouteMatched, this);
			// this.setDefaultSettings();
			if (this.onInitHookUp_Exit) {
				this.onInitHookUp_Exit();
			}
		},
		onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") !== "DLRuleDetail") {
				return;
			}
			var oHistory = sap.ui.core.routing.History.getInstance();
			if (oEvent.getParameter("name") === "DLRuleDetail") {
				this.setDefaultSettings();
				if (oHistory.getDirection() !== "Backwards") {
					contextPath = oEvent.getParameter("arguments").contextPath;
					var RuleID = this.getPropertyValueFromContextPath(contextPath, "RuleID");
					var RuleName = this.getPropertyValueFromContextPath(contextPath, "RuleName");
					var DLName = this.getPropertyValueFromContextPath(contextPath, "DLName");
					var Region = this.getPropertyValueFromContextPath(contextPath, "Region");
					this.getView().getModel("LocalViewSettingDtl").setProperty("/editButton", true);
					this.getView().getModel("LocalViewSettingDtl").setProperty("/RuleID", RuleID);
					this.getView().getModel("LocalViewSettingDtl").setProperty("/RuleName", RuleName);
					this.getView().getModel("LocalViewSettingDtl").setProperty("/DLName", DLName);
					this.getView().getModel("LocalViewSettingDtl").setProperty("/Region", Region);
					this.getRuleDetails(RuleID);
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
				editMode: true,
				detailMode: false,
				RuleID: "",
				DLName: "",
				Region: "",
				RuleName: ""
			};
			oViewSettingModel.setData(viewSettingData);
			this._oComponent.setModel(oViewSettingModel, "LocalViewSettingDtl");
		},
		getRuleDetails: function (RuleID) {
			var view = this.getView();
			var oDataModel = view.getModel("ZUDS_DLMAINTENANCE_SRV");
			oDataModel.attachRequestCompleted(function () {

			});
			oDataModel.setHeaders({
				//	"x-arteria-loginid": this.getCurrentUsers("InquiryItems", "read")
			});

			oDataModel.read("/DLRuleSet(RuleID='" + RuleID + "')", {
				success: function (oData) {
					this.setDLRuleData(oData);
					this.getView().setBusy(false);
				},
				error: function (error) {
					this.getView().setBusy(false);
				}
			});
		},
		setDLRuleData: function (oData) {

		},
		navigateBack: function () {
			if (this._oComponent.getModel("LocalViewSettingDtl").getProperty("/detailMode")) {
				this._oComponent.getModel("LocalViewSettingDtl").setProperty("/editMode", true);
				this._oComponent.getModel("LocalViewSettingDtl").setProperty("/detailMode", false);
				this.setPanelItemsEditable(false);
			} else {
				this._oComponent.getModel("LocalViewSettingDtl").setProperty("/editMode", true);
				this._oComponent.getModel("LocalViewSettingDtl").setProperty("/detailMode", false);
				this.setPanelItemsEditable(false);
				window.history.go(-1);
			}

		},
		onEdit: function () {
			this._oComponent.getModel("LocalViewSettingDtl").setProperty("/editMode", false);
			this._oComponent.getModel("LocalViewSettingDtl").setProperty("/detailMode", true);
			this.setPanelItemsEditable(true);
			// sap.ui.controller("com.extentia.dlrulecreate.controller.block.DLRuleItemsBlock").addRuleItems();
			// this.setItemsEditable(true);
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
						this._oComponent.getModel("LocalViewSettingDtl").setProperty("/editMode", true);
						this._oComponent.getModel("LocalViewSettingDtl").setProperty("/detailMode", false);
						this.setPanelItemsEditable(false);
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
		setPanelItemsEditable: function (editFlag) {
			var oVid = gDLRuleItemsBlockView.byId("panelVBox");
			var vBoxItems = oVid.getItems();
			if (vBoxItems) {
				for (var i = 0; i < vBoxItems.length; i++) {
					var mainPanelContent = vBoxItems[i].getContent();
					var valPanel = "";
					var valHBoxContent = "";
					if (i === 0) {
						valPanel = mainPanelContent[0].getHeaderText();
						valHBoxContent = mainPanelContent[0].getContent();
					} else {
						valPanel = mainPanelContent[0].getHeaderText();
						valHBoxContent = mainPanelContent[0].getContent();
					}
					if (valPanel === "Value") {
						valHBoxContent = valHBoxContent[0].getItems();
						for (var k = 0; k < valHBoxContent.length; k++) {
							// var valItems = valHBoxContent[k].getItems();
							var valItems = valHBoxContent[k].getItems()[0].getItems();
							valItems[0].setEditable(editFlag);
							valItems[1].setEditable(editFlag);
							valItems[2].setEditable(editFlag);
							if (valHBoxContent[k] === valHBoxContent[valHBoxContent.length - 1]) {
								valItems[3].setEnabled(editFlag);
								valItems[4].setEnabled(editFlag);
							}else{
								valItems[3].setEnabled(!editFlag);
								valItems[4].setEnabled(!editFlag);
							}
						}
					}
				}
			}
		},
		setItemsEditable: function (flag) {
			var oVid = gDLRuleItemsBlockView.byId("panelVBox");
			var vBoxItems = oVid.getItems();
			if (vBoxItems) {
				if (vBoxItems.length > 0) {
					for (var i = 0; i < vBoxItems.length; i++) {
						// vBoxItems[i].getContent()[i].getHeaderToolbar().getContent()[1].setEnabled(true);
						var mainPanelContent = vBoxItems[i].getContent();
						if (i === 0) {
							var valPanel = mainPanelContent[0].getHeaderText();
							if (valPanel === "Value") {
								var relHBoxContent = mainPanelContent[0].getContent();
								for (var k = 0; k < relHBoxContent.length; k++) {
									var valItems = relHBoxContent[k].getItems();
									valItems[0].setEditable(flag);
									valItems[1].setEditable(flag);
									valItems[2].setEnabled(flag);
									valItems[4].setEnabled(flag);
								}
							}
						} else {
							var relPanel = mainPanelContent[0].getHeaderText();
							if (relPanel === "Relation") {
								var hBoxRelItems = mainPanelContent[0].getContent();
								//var hBoxRelItems = mainPanelContent[0].getContent()[0].getItems();
								for (var j = 0; j < hBoxRelItems.length; j++) {
									var relItems = hBoxRelItems[j].getItems();
									relItems[0].setEditable(flag);
									relItems[1].setEditable(flag);
								}
							}
							var valPanel = mainPanelContent[1].getHeaderText();
							if (valPanel === "Value") {
								var relHBoxContent = mainPanelContent[1].getContent();
								for (var k = 0; k < relHBoxContent.length; k++) {
									var valItems = relHBoxContent[k].getItems();
									valItems[0].setEditable(flag);
									valItems[1].setEditable(flag);
									valItems[2].setEnabled(flag);
									valItems[4].setEnabled(flag);
								}
							}
						}
					}
				}
			}

		},
		onSave: function () {
			this.saveConfirm();
		},
		saveConfirm: function () {
			var dialog = new sap.m.Dialog({
				title: "Confirm",
				type: "Message",
				content: [
					new sap.m.Text({
						text: "Are you sure you want to save your Rule with new changes?"
					}),
					// new sap.m.Input("saveDialogInput", {
					// 	placeholder: "Please enter Rule Name",
					// 	liveChange: function (oEvent) {
					// 		var sText = oEvent.getParameter("value");
					// 		var parent = oEvent.getSource().getParent();
					// 		parent.getBeginButton().setEnabled(sText.length > 8);
					// 	},
					// })
				],
				beginButton: new sap.m.Button({
					text: "YES",
					press: function () {
						// var sText = sap.ui.getCore().byId("saveDialogTextarea").getValue();
						// sap.m.MessageToast.show("Rule Name is: " + sText);
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
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.extentia.dlrulecreate.view.DlRuleDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.extentia.dlrulecreate.view.DlRuleDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.extentia.dlrulecreate.view.DlRuleDetail
		 */
		//	onExit: function() {
		//
		//	}

	});

});