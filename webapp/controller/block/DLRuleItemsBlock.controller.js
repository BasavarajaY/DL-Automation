sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	var oMultiInput = "";

	return Controller.extend("com.extentia.dlrulecreate.controller.block.DLRuleItemsBlock", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.extentia.dlrulecreate.view.DLRuleItemsBlock
		 */
		onInit: function () {
			//this.setDefaultSettings();
			this._oView = this.getView();
			if (this.getView().sViewName === "com.extentia.dlrulecreate.view.block.DLRuleItemsBlock") {
				gDLRuleItemsBlockView = this.getView();
			}
			// gDLRuleItemsBlockView = this._oView;
			//this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(gDLRuleDetailPage));

			//Router Initialisation
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//Attach event for routing on view patter matched 
			this._oRouter.attachRouteMatched(this.onRouteMatched, this);

			this.setConditionsDD();
			this.setOperationsDD();
			this.setRelOperationsDD();

			// this.addRuleItems();
			if (!sap.ui.Device.support.touch) {
				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			} else {
				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}
		},
		onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") !== "DLRuleDetail") {
				return;
			}
			this.setLocalModel();
			this.addRuleItemsOldLogic();
		},

		setLocalModel: function () {
			var oViewSettingModel = new sap.ui.model.json.JSONModel();
			var viewSettingData = {
				valueHelpFieldName: ""
			};
			oViewSettingModel.setData(viewSettingData);
			this.getView().setModel(oViewSettingModel, "LocalViewModel");
		},
		addRuleItems: function () {
			var oData = [{
				FieldName: "Region",
				FieldValue: "APJ",
				ExternalCondition: "",
				InternalCondition: "OR",
				Flag: "I",
				LineItem: 1
			}, {
				FieldName: "SubRegion",
				FieldValue: "ANZ||APJ-Regional",
				ExternalCondition: "AND",
				InternalCondition: "OR",
				Flag: "I",
				LineItem: 1
			}, {
				FieldName: "SubRegion",
				FieldValue: "India&&GC-CN",
				ExternalCondition: "OR",
				InternalCondition: "AND",
				Flag: "I",
				LineItem: 2
			}, {
				FieldName: "SubRegion",
				FieldValue: "Operations",
				ExternalCondition: "",
				InternalCondition: "",
				Flag: "I",
				LineItem: 3
			}, {
				FieldName: "Primary Hub",
				FieldValue: "Architecting||Manager",
				ExternalCondition: "",
				InternalCondition: "OR",
				Flag: "I",
				LineItem: 1
			}];

			var mOutputData = [];

			oData.forEach(function (item) {
				var existing = mOutputData.filter(function (v, i) {
					return v.FieldName === item.FieldName;
				});

				if (existing.length) {
					var existingIndex = mOutputData.indexOf(existing[0]);
					if (!mOutputData[existingIndex].intItem)
						mOutputData[existingIndex].intItem = [];

					mOutputData[existingIndex].intItem = mOutputData[existingIndex].intItem.concat(item);
				} else {
					mOutputData.push(item);
				}
			});
			var oVid = this.getView().byId("panelVBox");
			var hBoxRelContent = "";
			var hBoxValContent = "";
			var oPanelContent = "";
			oVid.removeAllItems();
			for (var i = 0; i < mOutputData.length; i++) {
				if (i === 0) {
					hBoxValContent = this.addHBoxValSumanContent(mOutputData[i], true);
					oPanelContent = this.addPanelContent(false, hBoxValContent, mOutputData[i].FieldName);
				} else {
					//hBoxRelContent = this.addHBoxRelContent(true, oData[i].FieldName);
					hBoxValContent = this.addHBoxValSumanContent(mOutputData[i], true);
					oPanelContent = this.addPanelContent(hBoxRelContent, hBoxValContent, mOutputData[i].FieldName);
				}
				oVid.addItem(oPanelContent);
			}
		},
		addHBoxValSumanContent: function (mData, newItem) {
			var hExtBoxData = "";
			var hIntBoxData = "";
			var vBoxWidth = "";
			if (mData.FieldName === "Region") {
				vBoxWidth = "15rem";
			} else {
				vBoxWidth = "35rem";
			}
			var mainVBox = new sap.m.VBox({
				justifyContent: "SpaceBetween",
				alignContent: "Center",
				widht: vBoxWidth
			});
			hExtBoxData = this.addHBoxData(mData, newItem);
			if (hExtBoxData)
				mainVBox.addItem(hExtBoxData);
			if (mData.intItem) {
				for (var i = 0; i < mData.intItem.length; i++) {
					hIntBoxData = this.addHBoxData(mData.intItem[i], newItem);
					if (hIntBoxData)
						mainVBox.addItem(hIntBoxData);
				}
			}
			return mainVBox;
		},
		addHBoxData: function (mData, newItem) {
			var boxWidth = "";
			var mInputWidth = "";
			var editControls = false;
			var multiVisible = true;

			if (mData.FieldName === "Region") {
				multiVisible = false;
				boxWidth = "18rem";
				mInputWidth = "10rem";
			} else {
				multiVisible = true;
				boxWidth = "35rem";
				mInputWidth = "15rem";
			}

			if (newItem) {
				editControls = false;
			} else {
				editControls = true;
			}

			var conditionSelect = "";
			var valMultiInput = "";
			var operationSelect = "";

			var tokensData = mData.FieldValue.split(",");

			var hBox = new sap.m.HBox({
				justifyContent: "SpaceBetween",
				alignContent: "Center",
				width: boxWidth
			});
			var vBox = new sap.m.VBox({
				justifyContent: "SpaceBetween",
				alignContent: "Center",
				widht: boxWidth
			});
			conditionSelect = new sap.m.Select({
				editable: editControls
			});
			conditionSelect.setModel(this.getView().getModel("ConditionsDD"));
			var itemTemplate = new sap.ui.core.Item({
				key: "{ConditionsDD>key}",
				text: "{ConditionsDD>desc}"
			});
			conditionSelect.bindItems("ConditionsDD>/", itemTemplate);

			conditionSelect.setSelectedKey(mData.Flag);

			valMultiInput = new sap.m.MultiInput({
				width: mInputWidth,
				fieldWidth: mInputWidth,
				editable: editControls,
				valueHelpRequest: function (oEvent) {
					this.onValueHelpRequested(oEvent, mData.FieldName);
				}.bind(this)
			});

			var oToken = [];
			for (var i = 0; i < tokensData.length; i++) {
				var sTokenData = "";
				if (tokensData[i]) {
					if (tokensData[i].includes("||")) {
						sTokenData = tokensData[i].split("||");
						for (var k = 0; k < sTokenData.length; k++) {
							oToken.push(new sap.m.Token({
								text: sTokenData[k],
								key: sTokenData[k]
							}));
						}
					} else if (tokensData[i].includes("&&")) {
						sTokenData = tokensData[i].split("&&");
						for (var m = 0; m < sTokenData.length; m++) {
							oToken.push(new sap.m.Token({
								text: sTokenData[m],
								key: sTokenData[m]
							}));
						}
					} else {
						oToken.push(new sap.m.Token({
							text: tokensData[i],
							key: tokensData[i]
						}));
					}
				}
			}
			valMultiInput.setTokens(oToken);
			valMultiInput.setDescription(mData.InternalCondition);

			operationSelect = new sap.m.Select({
				editable: editControls,
				visible: multiVisible,
				change: function (oEvent) {
					this.setSelectedOper(oEvent);
				}.bind(this)
			});
			operationSelect.setModel(this.getView().getModel("OperationsDD"));
			var operItemTemplate = new sap.ui.core.Item({
				key: "{OperationsDD>key}",
				text: "{OperationsDD>desc}"
			});
			operationSelect.bindItems("OperationsDD>/", operItemTemplate);
			operationSelect.setSelectedKey(mData.ExternalCondition);

			var oDeleButton = new sap.m.Button({
				text: "",
				icon: "sap-icon://decline",
				enabled: editControls,
				visible: multiVisible,
				press: function (oEvent) {
					this.deleteRowItems(oEvent);
				}.bind(this)
			});
			var oAddButton = new sap.m.Button({
				text: "",
				icon: "sap-icon://add",
				enabled: editControls,
				visible: multiVisible,
				press: function (oEvent) {
					this.addRowItems(oEvent);
				}.bind(this)
			});

			hBox.addItem(conditionSelect);
			hBox.addItem(valMultiInput);
			hBox.addItem(operationSelect);
			hBox.addItem(oDeleButton);
			hBox.addItem(oAddButton);
			vBox.addItem(hBox);

			return vBox;
		},
		addRuleItemsOldLogic: function () {
			var oData = [{
				FieldName: "Region",
				FieldValue: "APJ",
				Group: "G1",
				Sign: "I"
			}, {
				FieldName: "SubRegion",
				FieldValue: "TOKYO&&BEIJING,CALIFORNIA||CANADA,CANADA||LONDON||WASHINGTON",
				Group: "G1&&G2,G2&&G3",
				Sign: "I,I,E"
			}, {
				FieldName: "PrimaryHub",
				FieldValue: "Architecting||ManagerS",
				Group: "G1",
				Sign: "I"
			}];
			// var oConditionsModel = new sap.ui.model.json.JSONModel();
			// oConditionsModel.setData(oCondData);
			// this.getView().setModel(oConditionsModel, "ConditionsDD");
			var oVid = this.getView().byId("panelVBox");
			var hBoxRelContent = "";
			var hBoxValContent = "";
			var oPanelContent = "";
			oVid.removeAllItems();
			for (var i = 0; i < oData.length; i++) {
				if (i === 0) {
					hBoxValContent = this.addHBoxValContent(oData[i], true);
					oPanelContent = this.addPanelContent(false, hBoxValContent, oData[i].FieldName);
				} else {
					//hBoxRelContent = this.addHBoxRelContent(true, oData[i].FieldName);
					hBoxValContent = this.addHBoxValContent(oData[i], true);
					oPanelContent = this.addPanelContent(hBoxRelContent, hBoxValContent, oData[i].FieldName);
				}
				oVid.addItem(oPanelContent);

			}
		},
		addHBoxValContent: function (oData, newItem) {
			var ItemsData = oData;
			var operSelectEnabled = true;
			var boxWidth = "";
			var mInputWidth = "";
			var operSelectVisible = true;
			var buttonsVisible = true;

			if (ItemsData.FieldName === "Region") {
				buttonsVisible = false;
				boxWidth = "25rem";
				mInputWidth = "10rem";
				operSelectVisible = false;
			} else {
				buttonsVisible = true;
				boxWidth = "35rem";
				mInputWidth = "15rem";
				operSelectVisible = true;
			}
			var bEnabled = false;
			if (newItem) {
				bEnabled = false;
			} else {
				bEnabled = true;
			}

			var oSign = oData.Sign.split(",");
			var tokensData = oData.FieldValue.split(",");
			var groupData = oData.Group.split(",");
			var conditionSelect = "";
			var valMultiInput = "";
			var operationSelect = "";

			var mainVBox = new sap.m.VBox({
				justifyContent: "SpaceBetween",
				alignContent: "Center",
				widht: boxWidth
			});

			for (var i = 0; i < oSign.length; i++) {
				var hBox = new sap.m.HBox({
					justifyContent: "SpaceBetween",
					alignContent: "Center",
					width: boxWidth
				});
				var vBox = new sap.m.VBox({
					justifyContent: "SpaceBetween",
					alignContent: "Center",
					widht: boxWidth
				});
				conditionSelect = new sap.m.Select({});
				conditionSelect.setModel(this.getView().getModel("ConditionsDD"));
				var itemTemplate = new sap.ui.core.Item({
					key: "{ConditionsDD>key}",
					text: "{ConditionsDD>desc}"
				});
				conditionSelect.bindItems("ConditionsDD>/", itemTemplate);

				conditionSelect.setSelectedKey(oSign[i]);

				valMultiInput = new sap.m.MultiInput({
					width: mInputWidth,
					fieldWidth: mInputWidth,
					valueHelpRequest: function (oEvent) {
						this.onValueHelpRequested(oEvent);
					}.bind(this)
				});

				var oToken = [];
				// var tokensData = oData.FieldValue.split(",");
				// for (var j = 0; j < tokensData.length; j++) {
				var sTokenData = "";
				if (tokensData[i]) {
					if (tokensData[i].includes("||")) {
						sTokenData = tokensData[i].split("||");
						for (var k = 0; k < sTokenData.length; k++) {
							oToken.push(new sap.m.Token({
								text: sTokenData[k],
								key: sTokenData[k]
							}));
						}
					} else if (tokensData[i].includes("&&")) {
						sTokenData = tokensData[i].split("&&");
						for (var m = 0; m < sTokenData.length; m++) {
							oToken.push(new sap.m.Token({
								text: sTokenData[m],
								key: sTokenData[m]
							}));
						}
					} else {
						oToken.push(new sap.m.Token({
							text: tokensData[i],
							key: tokensData[i]
						}));
					}
				}
				valMultiInput.setTokens(oToken);

				operationSelect = new sap.m.Select({
					enabled: true,
					visible: true,
					change: function (oEvent) {
						this.setSelectedOper(oEvent);
					}.bind(this)
				});
				operationSelect.setModel(this.getView().getModel("OperationsDD"));
				var operItemTemplate = new sap.ui.core.Item({
					key: "{OperationsDD>key}",
					text: "{OperationsDD>desc}"
				});
				operationSelect.bindItems("OperationsDD>/", operItemTemplate);
				if (groupData[i]) {
					if (groupData[i].includes("||")) {
						operationSelect.setSelectedKey("OR");
					} else if (groupData[i].includes("&&")) {
						operationSelect.setSelectedKey("AND");
					} else {
						operationSelect.setSelectedKey("");
					}
				}

				var oDeleButton = new sap.m.Button({
					text: "",
					icon: "sap-icon://decline",
					enabled: true,
					visible: buttonsVisible,
					press: function (oEvent) {
						this.deleteRowItems(oEvent);
					}.bind(this)
				});
				var oAddButton = new sap.m.Button({
					text: "",
					icon: "sap-icon://add",
					enabled: true,
					visible: buttonsVisible,
					press: function (oEvent) {
						this.addRowItems(oEvent);
					}.bind(this)
				});

				hBox.addItem(conditionSelect);
				hBox.addItem(valMultiInput);
				hBox.addItem(operationSelect);
				hBox.addItem(oDeleButton);
				hBox.addItem(oAddButton);
				vBox.addItem(hBox);
				mainVBox.addItem(vBox);
			}
			return mainVBox;

		},
		setConditionsDD: function () {
			var oCondData = [{
				key: "I",
				desc: "include"
			}, {
				key: "E",
				desc: "exclude"
			}];
			var oConditionsModel = new sap.ui.model.json.JSONModel();
			oConditionsModel.setData(oCondData);
			this.getView().setModel(oConditionsModel, "ConditionsDD");
		},
		setOperationsDD: function () {
			var oOpeData = [{
				key: "",
				desc: ""
			}, {
				key: "OR",
				desc: "OR"
			}, {
				key: "AND",
				desc: "AND"
			}];
			var oOpersModel = new sap.ui.model.json.JSONModel();
			oOpersModel.setData(oOpeData);
			this.getView().setModel(oOpersModel, "OperationsDD");
		},
		setRelOperationsDD: function () {
			var oOpeData = [{
				key: "OR",
				desc: "OR"
			}, {
				key: "AND",
				desc: "AND"
			}];
			var oOpersModel = new sap.ui.model.json.JSONModel();
			oOpersModel.setData(oOpeData);
			this.getView().setModel(oOpersModel, "RelOperationsDD");
		},
		addHBoxContent: function (newItem, fieldName) {
			var that = this;
			var operSelectEnabled = true;
			var hBoxWidth = "";
			var mInputWidth = "";
			var operSelectVisible = true;
			operSelectEnabled = true;
			hBoxWidth = "35rem";
			mInputWidth = "15rem";
			operSelectVisible = true;
			var bEnabled = false;
			if (newItem) {
				bEnabled = false;
			} else {
				bEnabled = true;
			}

			var hbox = new sap.m.HBox({
				justifyContent: "SpaceBetween",
				width: hBoxWidth,
				alignContent: "Center"

			});
			var conSelect = new sap.m.Select({
				editable: bEnabled
			});
			conSelect.setModel(this.getView().getModel("ConditionsDD"));
			var itemTemplate = new sap.ui.core.Item({
				key: "{ConditionsDD>key}",
				text: "{ConditionsDD>desc}"
			});
			conSelect.bindItems("ConditionsDD>/", itemTemplate);
			conSelect.setSelectedKey("01");
			// conSelect.setEditable(bEnabled);

			var multiInput = new sap.m.MultiInput({
				width: mInputWidth,
				fieldWidth: mInputWidth,
				editable: bEnabled,
				valueHelpRequest: function (oEvent) {
					this.onValueHelpRequested(oEvent, fieldName);
				}.bind(this)
			});

			multiInput.setTokens([
				new sap.m.Token({
					text: "APJ (01)",
					key: "01"
				}),
				new sap.m.Token({
					text: "GCO (02)",
					key: "02"
				})
			]);
			var operSelect = new sap.m.Select({
				// class: "sapUiSmallMarginBegin"
				enabled: bEnabled,
				visible: operSelectVisible,
				change: function (oEvent) {
					this.setSelectedOper(oEvent);
				}.bind(this)
			});
			operSelect.setModel(this.getView().getModel("OperationsDD"));
			var operItemTemplate = new sap.ui.core.Item({
				key: "{OperationsDD>key}",
				text: "{OperationsDD>desc}"
			});
			operSelect.bindItems("OperationsDD>/", operItemTemplate);
			operSelect.setSelectedKey("01");
			// operSelect.setEnabled(false);
			// operSelect.setEditable(false);

			var oDeleButton = new sap.m.Button({
				text: "",
				icon: "sap-icon://decline",
				enabled: bEnabled,
				visible: true,
				press: function (oEvent) {
					// var src = oEvent.getSource();
					this.deleteRowItems(oEvent);
				}.bind(this)
			});
			var oAddButton = new sap.m.Button({
				text: "",
				// class: "sapUiTinyMarginBegin",
				icon: "sap-icon://add",
				enabled: bEnabled,
				visible: true,
				press: function (oEvent) {
					that.addRowItems(oEvent);
				}
			});

			hbox.addItem(conSelect);
			hbox.addItem(multiInput);
			hbox.addItem(operSelect);
			hbox.addItem(oDeleButton);
			hbox.addItem(oAddButton);

			return hbox;
		},
		addHBoxRelContent: function (newItem) {
			var that = this;
			var oRelHBox = new sap.m.HBox({
				justifyContent: "SpaceBetween",
				width: "24rem",
				alignContent: "Center"

			});
			var conSelect = new sap.m.Select({

			});
			conSelect.setModel(this.getView().getModel("ConditionsDD"));
			var itemTemplate = new sap.ui.core.Item({
				key: "{ConditionsDD>key}",
				text: "{ConditionsDD>desc}"
			});
			conSelect.bindItems("ConditionsDD>/", itemTemplate);
			conSelect.setEnabled(false);

			var oVid = this.getView().byId("panelVBox");
			var vBoxItems = oVid.getItems();
			if (vBoxItems) {
				if (vBoxItems.length > 0) {
					var oRelNames = [];
					for (var i = 0; i < vBoxItems.length; i++) {
						oRelNames.push({
							key: vBoxItems[i].getHeaderText(),
							desc: vBoxItems[i].getHeaderText()
						});
					}
					if (this.getView().getModel("RelNameDD")) {
						this.getView().setModel("RelNameDD", []);
					}
					var oRelsModel = new sap.ui.model.json.JSONModel();
					oRelsModel.setData(oRelNames);
					this.getView().setModel(oRelsModel, "RelNameDD");
				}
			}
			var ruleSelect = new sap.m.Select({
				width: "8rem"
			});
			ruleSelect.setModel(this.getView().getModel("RelNameDD"));

			var ruleItemTemplate = new sap.ui.core.Item({
				key: "{RelNameDD>key}",
				text: "{RelNameDD>desc}"
			});
			ruleSelect.bindItems("RelNameDD>/", ruleItemTemplate);
			ruleSelect.setEditable(false);
			var operSelect = new sap.m.Select({
				// class: "sapUiSmallMarginBegin"
				width: "8rem"
			});
			operSelect.setModel(this.getView().getModel("RelOperationsDD"));
			var operItemTemplate = new sap.ui.core.Item({
				key: "{RelOperationsDD>key}",
				text: "{RelOperationsDD>desc}"
			});
			operSelect.bindItems("RelOperationsDD>/", operItemTemplate);
			operSelect.setEditable(false);
			var oDeleButton = new sap.m.Button({
				text: "",
				icon: "sap-icon://decline",
				enabled: false,
				press: function (oEvent) {
					this.deleteRelRowItems(oEvent);
				}.bind(this)
			});
			var oAddButton = new sap.m.Button({
				text: "",
				icon: "sap-icon://add",
				enabled: false,
				press: function (oEvent) {
					that.addRelRowItems(oEvent);
				}
			});
			if (newItem) {
				oDeleButton.setEnabled(false);
			}
			// oRelHBox.addItem(conSelect);
			oRelHBox.addItem(ruleSelect);
			oRelHBox.addItem(operSelect);
			oRelHBox.addItem(oDeleButton);
			oRelHBox.addItem(oAddButton);

			return oRelHBox;
		},
		addPanelContent: function (hBoxRelContent, hBoxContent, fieldName) {
			var that = this;
			if (hBoxRelContent) {
				var oRelPanel = that.setRelationPanel(hBoxRelContent);
			}
			var oCondPanel = that.setConditionPanel(hBoxContent);
			var oPanel = new sap.m.Panel({
				backgroundDesign: "Solid",
				expandable: true,
				expanded: false,
				headerText: fieldName,
				content: [oRelPanel, oCondPanel],
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Transparent,
					content: [
						new sap.m.Title({
							text: fieldName
						}),
						new sap.m.ToolbarSpacer(),
						new sap.m.Button({
							icon: "sap-icon://less",
							tooltip: "Delete",
							enabled: false,
							press: function (oEvent) {
								this.deletePanelItems(oEvent);
							}.bind(this)
						})
					]
				})
			});
			return oPanel;
		},
		setConditionPanel: function (hBoxContent) {
			var oCondPanel = new sap.m.Panel({
				backgroundDesign: "Solid",
				expandable: true,
				expanded: true,
				headerText: "Value",
				content: hBoxContent,
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Transparent,
					content: [
						new sap.m.Title({
							text: "Value"
						}),
						new sap.m.ToolbarSpacer()
					]
				})
			});
			return oCondPanel;
		},
		setRelationPanel: function (hBoxRelContent) {
			var oRelPanel = new sap.m.Panel({
				backgroundDesign: "Solid",
				expandable: true,
				expanded: true,
				headerText: "Relation",
				content: hBoxRelContent,
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Transparent,
					content: [
						new sap.m.Title({
							text: "Relation"
						}),
						new sap.m.ToolbarSpacer()
					]
				})

			});
			return oRelPanel;
		},
		onValueHelpRequested: function (oEvent, fieldName) {
			oMultiInput = oEvent.getSource();
			var headerText = fieldName;
			this.getView().getModel("LocalViewModel").setProperty("/valueHelpFieldName", headerText);
			var aTokens = oEvent.getSource().getTokens();
			if (aTokens) {
				oMultiInput.setTokens(aTokens);
			}
			var bSupportMultiselect = true;
			if (headerText === "Region") {
				bSupportMultiselect = false;
			}
			var oCulmnData = {
				"cols": [{
					"label": headerText,
					"template": "key",
				}, {
					"label": headerText + " Description",
					"template": "desc"
				}]
			};
			var oOpersModel = new sap.ui.model.json.JSONModel();
			oOpersModel.setData(oCulmnData);
			this.getView().setModel(oOpersModel, "CulmnDataModel");
			var aCols = oCulmnData;
			this._oBasicSearchField = new sap.m.SearchField({
				showSearchButton: false
			});

			this._oValueHelpDialog = sap.ui.xmlfragment("com.extentia.dlrulecreate.fragments.VHDEditPage", this);
			jQuery.sap.syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), this._oValueHelpDialog);

			this.getView().addDependent(this._oValueHelpDialog);
			this._oValueHelpDialog.getFilterBar().getFilterGroupItems()[1].getControl().setSelectedKey(oMultiInput.getDescription());
			if (bSupportMultiselect) {
				this._oValueHelpDialog.setSupportMultiselect(true);
				this._oValueHelpDialog.getFilterBar().getFilterGroupItems()[1].getControl().setEditable(true);
			} else {
				this._oValueHelpDialog.setSupportMultiselect(false);
				this._oValueHelpDialog.getFilterBar().getFilterGroupItems()[1].getControl().setEditable(false);
			}
			this._oValueHelpDialog.setRangeKeyFields([{
				label: headerText,
				key: headerText,
				type: "string"
			}]);

			this._oValueHelpDialog.getTableAsync().then(function (oTable) {
				var rData = this.setValueHelpModels(headerText);
				var oRowsModel = new sap.ui.model.json.JSONModel();
				oRowsModel.setData(rData);
				oTable.setModel(oRowsModel);
				oTable.setModel(this.getView().getModel("CulmnDataModel"), "columns");

				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "/");
				}
				if (oTable.bindItems) {
					oTable.bindAggregation("items", "/", function () {
						return new sap.m.ColumnListItem({
							cells: aCols.map(function (column) {
								return new sap.m.Label({
									text: "{" + column.template + "}"
								});
							})
						});
					});
				}
				this._oValueHelpDialog.update();
			}.bind(this));
			this._oValueHelpDialog.setTokens(oMultiInput.getTokens());
			this._oValueHelpDialog.open();
		},

		setValueHelpModels: function (headerText) {
			var oData = "";
			if (headerText === "Region") {
				oData = [{
					key: "APJ",
					desc: "APJ"
				}, {
					key: "GCO",
					desc: "GCO"
				}, {
					key: "ISV",
					desc: "ISV"
				}, {
					key: "CX",
					desc: "CX"
				}, {
					key: "MEE",
					desc: "MEE"
				}, {
					key: "EME North",
					desc: "EME North"
				}, {
					key: "EMEA South",
					desc: "EMEA South"
				}, {
					key: "LA",
					desc: "LA"
				}];
			} else if (headerText === "SubRegion") {
				// else if (headerText === "SubRegion") {
				oData = [{
					key: "ANZ",
					desc: "ANZ"
				}, {
					key: "APJ-Regional",
					desc: "APJ-Regional"
				}, {
					key: "India",
					desc: "India"
				}, {
					key: "GC-CN",
					desc: "GC-CN"
				}, {
					key: "Operations",
					desc: "Operations"
				}, {
					key: "Southeast Asia",
					desc: "Southeast Asia"
				}, {
					key: "GC-HK",
					desc: "GC-HK"
				}, {
					key: "EMEA BN&P",
					desc: "EMEA BN&P"
				}];
			} else if (headerText === "Primary Hub") {
				oData = [{
					key: "Architecting",
					desc: "Architecting"
				}, {
					key: "Manager",
					desc: "Manager"
				}, {
					key: "Finance & Risk",
					desc: "Finance & Risk"
				}, {
					key: "PCSM/D",
					desc: "PCSM/D"
				}, {
					key: "DSC-Supply Chain",
					desc: "DSC-Supply Chain"
				}, {
					key: "Human Resources",
					desc: "Human Resources"
				}, {
					key: "Banking",
					desc: "Banking"
				}, {
					key: "Utilities",
					desc: "Utilities"
				}];

			} else if (headerText === "Primary Hub") {
				oData = [{
					key: "Architecting",
					desc: "Architecting"
				}, {
					key: "Manager",
					desc: "Manager"
				}, {
					key: "Finance & Risk",
					desc: "Finance & Risk"
				}, {
					key: "PCSM/D",
					desc: "PCSM/D"
				}, {
					key: "DSC-Supply Chain",
					desc: "DSC-Supply Chain"
				}, {
					key: "Human Resources",
					desc: "Human Resources"
				}, {
					key: "Banking",
					desc: "Banking"
				}, {
					key: "Utilities",
					desc: "Utilities"
				}];
			} else if (headerText === "Primary Hub DL") {
				oData = [{
					key: "PSH Architecting - APJ",
					desc: "PSH Architecting - APJ"
				}, {
					key: "PSH Manager - APJ",
					desc: "PSH Manager - APJ"
				}, {
					key: "PSH Finance & Risk - GC",
					desc: "PSH Finance & Risk - GC"
				}, {
					key: "PSH PCSM/D - APJ",
					desc: "PSH PCSM/D - APJ"
				}, {
					key: "DSC-Supply Chain",
					desc: "DSC-Supply Chain"
				}, {
					key: "PSH Human Resources - APJ",
					desc: "PSH Human Resources - APJ"
				}, {
					key: "PSH Banking - MEE",
					desc: "PSH Banking - MEE"
				}, {
					key: "PSH Utilities - EMEA North",
					desc: "PSH Utilities - EMEA North"
				}];
			}
			return oData;
		},
		onValueHelpOkPress: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			oMultiInput.removeAllTokens();
			// var fSelKey = this._oValueHelpDialog.getFilterBar().getFilterGroupItems()[1].getControl().getSelectedKey();
			// var fSelKeyText = this._oValueHelpDialog.getFilterBar().getFilterGroupItems()[1].getControl().getSelectedItem().getText();
			if (aTokens.length > 0) {
				oMultiInput.setTokens(aTokens);
				this._oValueHelpDialog.close();
			} else {
				this._oValueHelpDialog.close();
			}
		},

		onValueHelpCancelPress: function () {
			this._oValueHelpDialog.close();
		},

		onValueHelpAfterClose: function () {
			this._oValueHelpDialog.destroy();
		},

		setSelectedOper: function (oEvent) {
			// var evt = oEvent.getSource().getParent().getParent();
			if (oEvent.getSource().getSelectedKey() !== "00") {
				oEvent.getSource().getParent().getItems()[4].setEnabled(true);
			} else {
				oEvent.getSource().getParent().getItems()[4].setEnabled(false);
			}
		},
		deleteRowItems: function (oEvent) {
			var mainVBox = oEvent.getSource().getParent().getParent().getParent();
			var iVBoxItem = oEvent.getSource().getParent().getParent();
			mainVBox.removeItem(iVBoxItem);
			var mainVBoxItems = mainVBox.getItems();
			for (var i = 0; i < mainVBoxItems.length; i++) {
				if (i === mainVBoxItems.length - 1) {
					// mainVBoxItems[i].getItems()[0].getItems()[3].setEnabled(true);
					mainVBoxItems[i].getItems()[0].getItems()[4].setEnabled(true);
				} else {
					// mainVBoxItems[i].getItems()[0].getItems()[3].setEnabled(false);
					mainVBoxItems[i].getItems()[0].getItems()[4].setEnabled(false);
				}
			}

			// var panelContent = oEvent.getSource().getParent().getParent().getContent();
			// if (panelContent.length > 2) {
			// 	panelContent[panelContent.length - 2].getItems()[4].setEnabled(true);
			// 	panelContent[panelContent.length - 2].getItems()[2].setEnabled(true);
			// } else {
			// 	panelContent[0].getItems()[4].setEnabled(true);
			// 	panelContent[0].getItems()[2].setEnabled(true);
			// }
			// var hbox = oEvent.getSource().getParent();
			// oEvent.getSource().getParent().getParent().removeContent(hbox);

		},
		addRowItems: function (oEvent) {
			oEvent.getSource().getParent().getItems()[2].setEnabled(false);
			var mainVBox = oEvent.getSource().getParent().getParent().getParent();
			var hExtBoxData = this.addHBoxData({
				FieldName: "",
				FieldValue: "",
				ExternalCondition: "",
				InternalCondition: "",
				Flag: "",
				LineItem: 0
			}, false);
			if (hExtBoxData)
				mainVBox.addItem(hExtBoxData);

			// var oGrid = oEvent.getSource().getParent().getParent();
			// oEvent.getSource().getParent().getItems()[2].setEnabled(false);
			// var vBoxWidth = "";
			// vBoxWidth = "35rem";

			// var mainVBox = new sap.m.VBox({
			// 	justifyContent: "SpaceBetween",
			// 	alignContent: "Center",
			// 	widht: vBoxWidth
			// });
			// hExtBoxData = this.addHBoxData(mData, false);
			// if (hExtBoxData)
			// 	mainVBox.addItem(hExtBoxData);
			// oGrid.addContent(mainVBox);
			// oEvent.getSource().setEnabled(false);
		},
		addRelRowItems: function (oEvent) {
			var oGrid = oEvent.getSource().getParent().getParent();
			var hbox = this.addHBoxRelContent(false);
			oGrid.addContent(hbox);
			oEvent.getSource().setEnabled(false);
		},
		deleteRelRowItems: function (oEvent) {
			var panelContent = oEvent.getSource().getParent().getParent().getContent();
			if (panelContent.length > 2) {
				panelContent[panelContent.length - 2].getItems()[3].setEnabled(true);
			} else {
				panelContent[0].getItems()[3].setEnabled(true);
			}
			var hbox = oEvent.getSource().getParent();
			oEvent.getSource().getParent().getParent().removeContent(hbox);

		},
		deletePanelItems: function (oEvent) {
			var panelContent = oEvent.getSource().getParent().getParent();
			panelContent.getParent().removeItem(panelContent);
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.extentia.dlrulecreate.view.DLRuleItemsBlock
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.extentia.dlrulecreate.view.DLRuleItemsBlock
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.extentia.dlrulecreate.view.DLRuleItemsBlock
		 */
		//	onExit: function() {
		//
		//	}

	});

});