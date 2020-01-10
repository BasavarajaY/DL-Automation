sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	var oi18n;
	return Controller.extend("com.extentia.dlrulecreate.controller.DLRuleCreate", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.extentia.dlrulecreate.view.DLRuleCreate
		 */
		onInit: function () {
			gDLRuleCreateView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(gDLRuleCreateView));
			//i18n
			oi18n = this._oComponent.getModel("i18n").getResourceBundle();
			//Router Initialisation
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//Attach event for routing on view patter matched 
			this._oRouter.attachRouteMatched(this.onRouteMatched, this);
			this.setDefaultSettings();

		},
		onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") !== "DLRuleCreate") {
				return;
			}
			var contextPath = JSON.parse(decodeURIComponent(oEvent.getParameter("arguments").contextPath));
			this.setRuleNamesDD(contextPath);
		},
		setRuleNamesDD: function (data) {
			var oRuleNameModel = new sap.ui.model.json.JSONModel();
			oRuleNameModel.setData(data);
			gDLRuleAddView.setModel(oRuleNameModel, "RuleNamesDD");
			this.onCancel();
		},
		setDefaultSettings: function () {
			var oViewSettingModel = new sap.ui.model.json.JSONModel();
			var viewSettingData = {
				footerVisible: false,
				panelItems: 0
			};
			oViewSettingModel.setData(viewSettingData);
			this.getView().setModel(oViewSettingModel, "LocalViewSetting");
		},
		onCancel: function () {
			var oVid = gDLRuleAddView.byId("panelVBox");
			// var vBoxItems = oVid.getItems();
			oVid.removeAllItems();
			this.getView().getModel("LocalViewSetting").setProperty("/footerVisible", false);
			// gDLRuleAddView.byId("inputRuleName").setSelectedKey("01");
		},
		onBack: function () {
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
						this._oRouter.navTo("DLListPage");
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
		addFieldNames: function (oEvent) {
			if (!this._fraDialog) {
				this._fraDialog = sap.ui.xmlfragment("fragmId", "com.extentia.dlrulecreate.fragments.RuleDialog", this);
			}
			// Multi-select if required
			var bMultiSelect = !!oEvent.getSource().data("multi");
			this._fraDialog.setMultiSelect(bMultiSelect);

			// Remember selections if required
			var bRemember = !!oEvent.getSource().data("remember");
			this._fraDialog.setRememberSelections(bRemember);

			// clear the old search filter
			//this._fraDialog.getBinding("items").filter([]);

			jQuery.sap.syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), this._fraDialog);

			this.setCheckBoxItems();
			this.getView().addDependent(this._fraDialog);
			// this._fraDialog.setModel(this.getView().setModel("checkBoxItems"));
			this._fraDialog.open();
		},
		handleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("value", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		handleSelect: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts.length) {
				var OChkBoxItems = [];
				aContexts.map(function (oContext) {
					OChkBoxItems.push({
						RuleKey: oContext.getObject().key,
						RuleDesc: oContext.getObject().value
					});
				});
				gDLRuleAddView.getModel("RuleNamesDD").setProperty("/", OChkBoxItems);
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		setCheckBoxItems: function () {
			var oView = gDLRuleAddView;
			if (oView.getModel("RuleNamesDD")) {
				var oChkBoxItems = oView.getModel("RuleNamesDD").getProperty("/");
			}
			var oDialogItemsData = [{
				key: "01",
				value: "Region",
				selected: false
			}, {
				key: "02",
				value: "SubRegion",
				selected: false
			}, {
				key: "03",
				value: "Primary Hub",
				selected: false
			}, {
				key: "04",
				value: "Primary Hub DL",
				selected: false
			}, {
				key: "05",
				value: "Secondary Hub",
				selected: false
			}, {
				key: "06",
				value: "Secondary Hub DL",
				selected: false
			},{
				key: "07",
				value: "Company Code",
				selected: false
			}, {
				key: "08",
				value: "Solutions",
				selected: false
			}];
			for (var i = 0; i < oDialogItemsData.length; i++) {
				for (var k = 0; k < oChkBoxItems.length; k++) {
					if (oDialogItemsData[i].value === oChkBoxItems[k].RuleDesc) {
						oDialogItemsData[i].selected = true;
					}
				}
			}
			var oDialogModel = new sap.ui.model.json.JSONModel();
			oDialogModel.setData(oDialogItemsData);
			// this.getView().setModel(oDialogModel, "checkBoxItems");
			this._fraDialog.setModel(oDialogModel, "checkBoxItems");
		},
		// _openValueHelpDialog: function (sInputValue) {
		// 	// create a filter for the binding
		// 	this._valueHelpDialog.getBinding("items").filter([new Filter(
		// 		"Name",
		// 		FilterOperator.Contains,
		// 		sInputValue
		// 	)]);

		// 	// open value help dialog filtered by the input value
		// 	this._valueHelpDialog.open(sInputValue);
		// },
		onSave: function () {
			this.saveConfirm();
		},
		saveConfirm: function () {
			var dialog = new sap.m.Dialog({
				title: "Confirm",
				type: "Message",
				// state: "Success",
				// icon: "sap-icon://message-warning",
				content: [
					new sap.m.Text({
						text: "Are you sure you want to save your Rule?"
					}),
					new sap.m.TextArea("saveDialogTextarea", {
						liveChange: function (oEvent) {
							var sText = oEvent.getParameter("value");
							var parent = oEvent.getSource().getParent();
							parent.getBeginButton().setEnabled(sText.length > 0);
						},
						width: "100%",
						placeholder: "Please give a name for Rule"
					})
				],
				beginButton: new sap.m.Button({
					text: "YES",
					enabled: false,
					press: function () {
						var sText = sap.ui.getCore().byId("saveDialogTextarea").getValue();
						sap.m.MessageToast.show("Rule Name is: " + sText);
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
		 * @memberOf com.extentia.dlrulecreate.view.DLRuleCreate
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.extentia.dlrulecreate.view.DLRuleCreate
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.extentia.dlrulecreate.view.DLRuleCreate
		 */
		//	onExit: function() {
		//
		//	}

	});

});