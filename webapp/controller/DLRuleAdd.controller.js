sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, MessageBox, Fragment, MessageToast, Filter, FilterOperator) {
	"use strict";
	var oi18n;
	var oMultiInput = "";
	var Device = sap.ui.Device;

	return Controller.extend("com.extentia.dlrulecreate.controller.DLRuleAdd", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.extentia.dlrulecreate.view.DLRuleAdd
		 */
		onInit: function () {
			gDLRuleAddView = this.getView();
			// MessageBox.success("onInit");

			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(gDLRuleAddView));
			//i18n
			oi18n = this._oComponent.getModel("i18n").getResourceBundle();
			//Router Initialisation
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			// this.setRuleNamesDD();
			this.setDefaultSettings();
			this.setConditionsDD();
			this.setOperationsDD();
			this.setRelOperationsDD();
			this.setDLTypeDD();
			this.setHeadCountTypeDD();

		},
		setDefaultSettings: function () {
			var oViewSettingModel = new sap.ui.model.json.JSONModel();
			var viewSettingData = {
				valueHelpFieldName: "",
				messageStripText: "",
				FNameVisible: false
			};
			oViewSettingModel.setData(viewSettingData);
			this.getView().setModel(oViewSettingModel, "LocalViewSetting");
		},
		setDLTypeDD: function () {
			var oDLTypeData = [{
				key: "",
				desc: ""
			}, {
				key: "01",
				desc: "Primary"
			}, {
				key: "02",
				desc: "Secondary"
			}, {
				key: "03",
				desc: "Additional"
			}];
			var oDLTypeModel = new sap.ui.model.json.JSONModel();
			oDLTypeModel.setData(oDLTypeData);
			this.getView().setModel(oDLTypeModel, "DLTypeDD");
		},
		setHeadCountTypeDD: function () {
			var oHeadCountData = [{
				key: "",
				desc: ""
			}, {
				key: "01",
				desc: "COE"
			}, {
				key: "02",
				desc: "NonVAT"
			}, {
				key: "03",
				desc: "Presales"
			}, {
				key: "04",
				desc: "SolExp"
			}, {
				key: "05",
				desc: "VAT"
			}, {
				key: "05",
				desc: "XME"
			}];
			var oHeadCountModel = new sap.ui.model.json.JSONModel();
			oHeadCountModel.setData(oHeadCountData);
			this.getView().setModel(oHeadCountModel, "HeadCountTypeDD");
		},
		onDLTypeChange: function (oEvent) {
			var selectedKey = oEvent.getSource().getSelectedKey();
			// if (selectedKey !== "") {
			// 	this.getView().getModel("LocalViewSetting").setProperty("/FNameVisible", true);
			// 	this.getView().byId("FnameTitle").setText("Define Rule for DL");
			// 	// this.setRuleNamesDD(selectedKey);
			// } else {
			// 	this.getView().getModel("LocalViewSetting").setProperty("/FNameVisible", false);
			// 	this.getView().byId("FnameTitle").setText("");
			// 	this.getView().byId("HeadCountDLType").setSelectedKey("");
			// }
			// var oVid = this.getView().byId("panelVBox");
			// oVid.removeAllItems();
		},
		setRuleNamesDD: function (selectedKey) {
			var oDataRuleNames = "";
			if (selectedKey === "01") {
				oDataRuleNames = [{
					RuleKey: "01",
					RuleDesc: "Region"
				}, {
					RuleKey: "02",
					RuleDesc: "Primary Hub"
				}];
			} else if (selectedKey === "02") {
				oDataRuleNames = [{
					RuleKey: "01",
					RuleDesc: "Region"
				}, {
					RuleKey: "02",
					RuleDesc: "Secondary Hub"
				}];
			} else if (selectedKey === "03") {
				oDataRuleNames = [{
					RuleKey: "01",
					RuleDesc: "Region"
				}, {
					RuleKey: "02",
					RuleDesc: "Additional Hub"
				}];
			} else {
				oDataRuleNames = [];
			}
			var oRuleNameModel = new sap.ui.model.json.JSONModel();
			oRuleNameModel.setData(oDataRuleNames);
			this.getView().setModel(oRuleNameModel, "RuleNamesDD");
		},
		setRuleNamesDDOldLogic: function () {
			// if (!this._fraDialog) {
			// 	this._fraDialog = sap.ui.xmlfragment("fragmId", "com.extentia.dlrulecreate.fragments.RuleDialog", this);
			// 	this.getView().addDependent(this._fraDialog);
			// }
			// var FragmentData = sap.ui.core.Fragment.byId("fragmentId");
			var oCheckBoxItems = gDListView.getModel("checkBoxItems").getProperty("/");
			var oSelCheckBoxItems = [];
			for (var i = 0; i < oCheckBoxItems.length; i++) {
				if (oCheckBoxItems[i].selected) {
					oSelCheckBoxItems.push({
						RuleKey: oCheckBoxItems[i].key,
						RuleDesc: oCheckBoxItems[i].value
					});
				}
			}
			var oRuleNameModel = new sap.ui.model.json.JSONModel();
			oRuleNameModel.setData(oSelCheckBoxItems);
			this.getView().setModel(oRuleNameModel, "RuleNamesDD");

			// var oRuleNames = [{
			// 	RuleKey: "01",
			// 	RuleDesc: "Region"
			// }, {
			// 	RuleKey: "02",
			// 	RuleDesc: "SubRegion"
			// }, {
			// 	RuleKey: "03",
			// 	RuleDesc: "Company Code"
			// }, {
			// 	RuleKey: "04",
			// 	RuleDesc: "Solutions"
			// }, {
			// 	RuleKey: "05",
			// 	RuleDesc: "Primary Hub"
			// }, {
			// 	RuleKey: "06",
			// 	RuleDesc: "Secondary Hub"
			// }];

			// this.getView().setModel(this._oComponent.getModel("RuleNamesDD"), "RuleNamesDD");

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
		onCollapseAllPress: function (evt) {
			var oMainPanel = this.getView().byId("mainPanel");
			if (oMainPanel.getExpanded())
				oMainPanel.setExpanded(false);
			else
				oMainPanel.setExpanded(true);
			// oMainPanel.setExpanded(true);
		},
		onAddRuleNames: function (oEvent) {
			this.handleAddRuleNames(oEvent);
		},
		// addGrid: function () {
		// 	var grid = new sap.ui.layout.Grid({
		// 		defaultSpan: "XL12 L12 M12 S12",
		// 		// width: "80%",
		// 		hSpacing: "2"
		// 	});
		// 	var hbox = this.addHBoxCondContent();
		// 	grid.addContent(hbox);
		// 	return grid;
		// },
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
			}, {
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
		handleAddRuleNames: function (oEvent) {
			var oVid = this.getView().byId("panelVBox");
			var vBoxItems = oVid.getItems();
			var flag = true;
			var ruleName = this.getView().byId("inputRuleName").getSelectedItem().getText();
			for (var i = 0; i < vBoxItems.length; i++) {
				if (vBoxItems[i].getHeaderText() === ruleName) {
					flag = false;
				}
			}
			if (flag) {
				if (vBoxItems.length > 0) {
					var hBoxContent = this.addHBoxCondContent(true, ruleName);
					var hBoxRelContent = this.addHBoxRelContent(true, ruleName);
					var oPanelContent = this.addPanelContent(hBoxContent, hBoxRelContent);
					oVid.addItem(oPanelContent);

				} else {
					var hBoxContent1 = this.addHBoxCondContent(true, ruleName);
					// var hBoxRelContent = this.addHBoxRelContent(true);
					var oPanelContent1 = this.addPanelContent(hBoxContent1, false);
					oVid.addItem(oPanelContent1);
				}
				if (vBoxItems) {
					this.getView().getModel("LocalViewSetting").setProperty("/footerVisible", true);
				}

			} else {
				MessageBox.error("The Name " + ruleName + " already existed");
			}
		},
		addHBoxRelContent: function (newItem, ruleName) {
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
				// if (vBoxItems.length > 0) {
				// 	var oRelNames = [];
				// 	for (var i = 0; i < vBoxItems.length; i++) {
				// 		oRelNames.push({
				// 			key: vBoxItems[i].getHeaderText(),
				// 			desc: vBoxItems[i].getHeaderText()
				// 		});
				// 	}
				// 	// if (this.getView().getModel("RelNameDD")) {
				// 	// 	this.getView().setModel("RelNameDD", []);
				// 	// }
				// 	var oRelsModel = new sap.ui.model.json.JSONModel();
				// 	oRelsModel.setData(oRelNames);
				// 	ruleName + "DD";
				// 	var OModelName = ruleName + "DD";
				// 	this.getView().setModel(oRelsModel, OModelName);
				// }
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

			var oDeleButton = new sap.m.Button({
				text: "",
				icon: "sap-icon://decline",
				//enabled: false,
				press: function (oEvent) {
					this.deleteRelRowItems(oEvent);
				}.bind(this)
			});
			var oAddButton = new sap.m.Button({
				text: "",
				icon: "sap-icon://add",
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
		setMultiInputF4: function (oEvent) {
			var that = this;
			this.oMultiInput = oEvent.getSource().getId();
			var token1 = new sap.m.Token({
				key: "Region",
				text: "Region"
			});
			this.oTokens = [token1];

			this.oMultiInput.setTokens(this.oTokens);
			this.oTableItems = [{
				RegionCode: "Region1",
				RegionName: "IND"
			}, {
				RegionCode: "Region2",
				RegionName: "AUS"
			}];

			var oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
				// basicSearchText: this.oMultiInput.getValue(),
				title: "Region",
				supportMultiselect: false,
				supportRanges: false,
				supportRangesOnly: false,
				// key: this.oKeys[0],
				// descriptionKey: this.oKeys[1],
				// stretch: sap.ui.Device.system.phone,

				ok: function (oControlEvent) {
					that.oTokens = oControlEvent.getParameter("tokens");
					that.oMultiInput.setTokens(that.oTokens);
					oValueHelpDialog.close();
				},
				cancel: function (oControlEvent) {
					sap.m.MessageToast.show('Cancel pressed!');
					oValueHelpDialog.close();
				},
				afterClose: function () {
					oValueHelpDialog.destroy();
				},
			});

			this.setF4Columns(oValueHelpDialog);
			this.setF4FilterBar(oValueHelpDialog);

			// oValueHelpDialog.setTokens(this.oMultiInput.getTokens());

			oValueHelpDialog.open();
			oValueHelpDialog.update();
		},
		setF4Columns: function (oValueHelpDialog) {
			var oColModel = new sap.ui.model.json.JSONModel();
			oColModel.setData({
				cols: [{
					label: "Region Code",
					template: "RegionCode"
				}, {
					label: "Reion Value",
					template: "RegionValue"
				}]
			});
			oValueHelpDialog.getTable().setModel(oColModel, "columns");

			var oRowsModel = new sap.ui.model.json.JSONModel();
			oRowsModel.setData(this.oTableItems);
			oValueHelpDialog.getTable().setModel(oRowsModel);
			if (oValueHelpDialog.getTable().bindRows) {
				oValueHelpDialog.getTable().bindRows("/");
			}
			if (oValueHelpDialog.getTable().bindItems) {
				var oTable = oValueHelpDialog.getTable();

				oTable.bindAggregation("items", "/", function (sId, oContext) {
					var aCols = oTable.getModel("columns").getData().cols;

					return new sap.m.ColumnListItem({
						cells: aCols.map(function (column) {
							var colname = column.template;
							return new sap.m.Label({
								text: "{" + colname + "}",
							});
						}),
					});
				});
			}
		},
		setF4FilterBar: function (oValueHelpDialog) {
			var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
				advancedMode: true,
				filterBarExpanded: false,
				showGoOnFB: !sap.ui.Device.system.phone,
				filterGroupItems: [
					new sap.ui.comp.filterbar.FilterGroupItem({
						// groupTitle: "foo",
						groupName: "gn1",
						name: "n1",
						label: "Region Code",
						control: new sap.m.Input(),
					}),
					new sap.ui.comp.filterbar.FilterGroupItem({
						// groupTitle: "foo",
						groupName: "gn2",
						name: "n2",
						label: "Region Name",
						control: new sap.m.Input(),
					})
				],
				search: function () {
					// sap.m.MessageToast.show(
					// 	"Search pressed '" +
					// 	arguments[0].mParameters.selectionSet[0].getValue() +
					// 	"''"
					// );
				},
			});

			if (oFilterBar.setBasicSearch) {
				oFilterBar.setBasicSearch(
					new sap.m.SearchField({
						showSearchButton: sap.ui.Device.system.phone,
						placeholder: "Search",
						search: function (event) {
							oValueHelpDialog.getFilterBar().search();
						},
					})
				);
			}

			oValueHelpDialog.setFilterBar(oFilterBar);
		},

		setRegionF4: function (oEvent) {
			var that = this;
			var headerText = oEvent.getSource().getParent().getParent().getParent().getHeaderText();
			// this.valueHelpModels();
			this.TokenInput = oEvent.getSource();
			this.TokenKeys = [headerText, "Condition"];
			this.setValueHelp({
				title: headerText,
				oController: this,
				controlID: "inputRegion",
				idLabel: headerText,
				descriptionLabel: "Condition",
				tokenInput: this.TokenInput,
				aKeys: this.TokenKeys,
				bMultiSelect: true,
				// defaultLabel: "Ship To Party",
				// defaultText: oPPCCommon.getTextFromTokens(this.getView(), "FShipToParty"),
				defaultVisible: false,
				idVisible: true,
				groupTitle: headerText,
				fireOnLoad: false,
				// modelID: "SCGW",
				// entityType: "SchemeItemDetail",
				// propName: "Region",
				// partnerNo: this.getView().getModel("SOs").getProperty("/CustomerNo")
			}, function (oControlEvent) {
				var tokens = oControlEvent.getParameter("tokens");
				// var jData = tokens[0].getCustomData()[0].getValue();
				that.TokenInput.removeAllTokens();
				var aToken = [];
				for (var j = 0; j < tokens.length; j++) {
					if (tokens[j] && tokens[j].getCustomData() && tokens[j].getCustomData().length >= 0) {
						var sDesc = tokens[j].getCustomData()[0].getValue().key + " (" + tokens[j].getCustomData()[0].getValue().desc +
							")";
						aToken.push(new sap.m.Token({
							key: tokens[j].getCustomData()[0].getValue().key,
							text: sDesc
						}));
					}
				}
				that.TokenInput.setTokens(aToken);
				// that.TokenInput.addToken(new sap.m.Token({
				// 	key: jData.key,
				// 	text: jData.desc + " (" + jData.key + ")"
				// }));
				// that.TokenInput.setTooltip(jData.desc);
			});

			//for enhancement
			if (this.RegionF4_Exit) {
				this.RegionF4_Exit(oEvent);
			}
		},
		setValueHelp: function (mParameters, requestCompleted) {
			var oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
				// basicSearchText: mParameters.tokenInput.getValue(),
				title: mParameters.title,
				supportMultiselect: mParameters.bMultiSelect,
				supportRanges: false,
				supportRangesOnly: false,
				key: mParameters.aKeys[0],
				descriptionKey: mParameters.aKeys[1],
				stretch: sap.ui.Device.system.phone,
				ok: function (oControlEvent) {
					// mParameters.tokenInput.setTokens(oControlEvent.getParameter("tokens"));
					// mParameters.oController.getView().byId(mParameters.controlID).setValueState(sap.ui.core.ValueState.None);
					// mParameters.oController.getView().byId(mParameters.controlID).setValueStateText("");
					if (requestCompleted) {
						requestCompleted(oControlEvent);
					}

					oValueHelpDialog.close();
				},
				cancel: function () {
					oValueHelpDialog.close();
				},
				afterClose: function () {
					oValueHelpDialog.destroy();
				}
			});

			this.setValueHelpColumns(oValueHelpDialog, mParameters);
			this.setValueHelpFilterBar(oValueHelpDialog, mParameters);

			if (sap.ui.Device.support.touch === false) {
				oValueHelpDialog.addStyleClass("sapUiSizeCompact");
			}
			oValueHelpDialog.open();
			if (mParameters.oController.tokenInput) {
				oValueHelpDialog.setTokens(mParameters.oController.tokenInput.getTokens());
			}
			if (mParameters.fireOnLoad && sap.ui.getCore().byId(mParameters.controlID)) {
				sap.ui.getCore().byId(mParameters.controlID).fireSearch();
			}
		},
		setValueHelpColumns: function (oValueHelpDialog, mParameters) {
			if (oValueHelpDialog.getTable().bindItems) {
				var oColModel = new sap.ui.model.json.JSONModel();
				oColModel.setData({
					cols: [{
						label: mParameters.idLabel,
						template: "desc"
					}, {
						label: mParameters.descriptionLabel,
						template: "key"
					}]
				});
				oValueHelpDialog.getTable().setModel(oColModel, "columns");

			} else {

				oValueHelpDialog.getTable().addColumn(new sap.ui.table.Column({
					label: mParameters.idLabel,
					template: new sap.m.Text({
						text: "{desc}"
					}),
					sortProperty: "desc",
					filterProperty: "desc"
				}));

				oValueHelpDialog.getTable().addColumn(new sap.ui.table.Column({
					label: mParameters.descriptionLabel,
					template: new sap.m.Text({
						text: "{key}"
					}),
					sortProperty: "key",
					filterProperty: "key"
				}));

				oValueHelpDialog.getTable().setNoData("No Item Selected");
			}
		},
		setValueHelpFilterBar: function (oValueHelpDialog, mParameters) {
			var that = this;
			var busyDialog = new sap.m.BusyDialog();
			var oTokenInputValue = "";
			if (mParameters.oController.tokenInput) {
				oTokenInputValue = mParameters.oController.tokenInput.getValue();
			}
			var code = new sap.m.Input({

			});
			var desc = new sap.m.Input({

			});
			oValueHelpDialog
				.setFilterBar(new sap.ui.comp.filterbar.FilterBar({

					advancedMode: true,
					filterGroupItems: [
						new sap.ui.comp.filterbar.FilterGroupItem({
							// groupTitle: mParameters.groupTitle,
							groupName: "gn1",
							name: "n1",
							label: mParameters.idLabel,
							control: code,
							visible: mParameters.idVisible
						}),
						new sap.ui.comp.filterbar.FilterGroupItem({
							// groupTitle: "",
							groupName: "gn2",
							name: "n2",
							label: mParameters.descriptionLabel,
							control: desc,
							visible: mParameters.descriptionVisible
						})
						// new sap.ui.comp.filterbar.FilterGroupItem({
						// 	groupTitle: ".",
						// 	groupName: "gn2",
						// 	name: "n3",
						// 	label: mParameters.defaultLabel,
						// 	control: new sap.m.Text({
						// 		text: mParameters.defaultText
						// 	}),
						// 	visible: mParameters.defaultVisible
						// })
					],
					search: function () {
						var rData = that.setValueHelpModels(mParameters.title);

						var ValueHelpsModel = new sap.ui.model.json.JSONModel();
						if (oValueHelpDialog.getTable().bindRows) {
							oValueHelpDialog.getTable().clearSelection();
							ValueHelpsModel.setData(rData);
							oValueHelpDialog.getTable().setModel(ValueHelpsModel);
							oValueHelpDialog.getTable().bindRows("/");

							if (rData.length == 0) {
								oValueHelpDialog.getTable().setNoData("No Results Found");

							}
						} else {
							//Setting Rows for sap.m.Table....................................
							var oRowsModel = new sap.ui.model.json.JSONModel();
							oRowsModel.setData(rData);
							oValueHelpDialog.getTable().setModel(oRowsModel);
							if (oValueHelpDialog.getTable().bindItems) {
								var oTable = oValueHelpDialog.getTable();
								oTable.bindAggregation("items", "/", function () {
									var aCols = oTable.getModel("columns").getData().cols;
									return new sap.m.ColumnListItem({
										cells: aCols.map(function (column) {
											var colname = column.template;
											return new sap.m.Text({
												text: "{" + colname + "}",
												wrapping: true
											});
										})
									});
								});
							}

							if (rData.length === 0) {
								oValueHelpDialog.getTable().setNoDataText("No Results Found");
							}

						}
					}

				}));
		},
		setValueHelpModels: function (headerText) {
			var oData = "";
			if (headerText === "Region") {
				oData = [{
					key: "01",
					desc: "APJ"
				}, {
					key: "02",
					desc: "GCO"
				}, {
					key: "03",
					desc: "ISV"
				}, {
					key: "04",
					desc: "CX"
				}, {
					key: "05",
					desc: "MEE"
				}, {
					key: "06",
					desc: "EME North"
				}, {
					key: "07",
					desc: "EMEA South"
				}, {
					key: "08",
					desc: "LA"
				}];
			} else if (headerText === "SubRegion") {
				// else if (headerText === "SubRegion") {
				oData = [{
					key: "01",
					desc: "ANZ"
				}, {
					key: "02",
					desc: "APJ-Regional"
				}, {
					key: "03",
					desc: "India"
				}, {
					key: "04",
					desc: "GC-CN"
				}, {
					key: "05",
					desc: "Operations"
				}, {
					key: "06",
					desc: "Southeast Asia"
				}, {
					key: "07",
					desc: "GC-HK"
				}, {
					key: "08",
					desc: "EMEA BN&P"
				}];
			} else if (headerText === "Primary Hub") {
				oData = [{
					key: "01",
					desc: "Architecting"
				}, {
					key: "02",
					desc: "Manager"
				}, {
					key: "03",
					desc: "Finance & Risk"
				}, {
					key: "04",
					desc: "PCSM/D"
				}, {
					key: "05",
					desc: "DSC-Supply Chain"
				}, {
					key: "06",
					desc: "Human Resources"
				}, {
					key: "07",
					desc: "Banking"
				}, {
					key: "08",
					desc: "Utilities"
				}];

			} else if (headerText === "Primary Hub") {
				oData = [{
					key: "01",
					desc: "Architecting"
				}, {
					key: "02",
					desc: "Manager"
				}, {
					key: "03",
					desc: "Finance & Risk"
				}, {
					key: "04",
					desc: "PCSM/D"
				}, {
					key: "05",
					desc: "DSC-Supply Chain"
				}, {
					key: "06",
					desc: "Human Resources"
				}, {
					key: "07",
					desc: "Banking"
				}, {
					key: "08",
					desc: "Utilities"
				}];
			} else if (headerText === "Primary Hub DL") {
				oData = [{
					key: "01",
					desc: "PSH Architecting - APJ"
				}, {
					key: "02",
					desc: "PSH Manager - APJ"
				}, {
					key: "03",
					desc: "PSH Finance & Risk - GC"
				}, {
					key: "04",
					desc: "PSH PCSM/D - APJ"
				}, {
					key: "05",
					desc: "DSC-Supply Chain"
				}, {
					key: "06",
					desc: "PSH Human Resources - APJ"
				}, {
					key: "07",
					desc: "PSH Banking - MEE"
				}, {
					key: "08",
					desc: "PSH Utilities - EMEA North"
				}];

			}
			return oData;
			// if (this.getView().getModel(headerText)) {
			// 	this.getView().getModel(headerText).setProperty("/", []);
			// }
			// var oModel = new sap.ui.model.json.JSONModel();
			// oModel.setData(oData);
			// this.getView().setModel(oModel, headerText);
		},
		onRelOperationsDDChange: function (oEvent) {
			// this._oValueHelpDialog.getTable().getColumns()[1]
			var evt = oEvent.getSource();
		},
		RagionValHelpF4: function (mParameters, requestCompleted) {
			var that = this;
			if (mParameters.controlID === undefined || mParameters.controlID === null) {
				mParameters.controlID = "inputRegion";
			}
			if (mParameters.bMultiSelect === undefined || mParameters.bMultiSelect === null) {
				mParameters.bMultiSelect = true;
			}
			var oTokenRegionInput = "";
			if (mParameters.oController.TokenInput) {
				oTokenRegionInput = mParameters.oController.TokenInput.getValue();
			}

			var oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
				basicSearchText: oTokenRegionInput,
				title: "Region",
				supportMultiselect: mParameters.bMultiSelect,
				supportRanges: false,
				supportRangesOnly: false,
				key: mParameters.oController.aTokenKeys[0],
				descriptionKey: mParameters.oController.aTokenKeys[1],
				stretch: sap.ui.Device.system.phone,
				ok: function (oControlEvent) {
					if (requestCompleted) {
						requestCompleted(oControlEvent.getParameter("tokens"));
					}
					oValueHelpDialog.close();
				},
				cancel: function (oControlEvent) {
					oValueHelpDialog.close();
				},
				afterClose: function () {
					oValueHelpDialog.destroy();
				}
			});
			that.setF4Columns(oValueHelpDialog, mParameters);
			that.setCPStockF4FilterBar(oValueHelpDialog, mParameters);

			if (sap.ui.Device.support.touch === false) {
				oValueHelpDialog.addStyleClass("sapUiSizeCompact");
			}

			oValueHelpDialog.open();
			if (mParameters.oController.TokenInput) {
				oValueHelpDialog.setTokens(mParameters.oController.TokenInput.getTokens());
			}
			//for enhancement
			if (this.RagionValHelpF4_Exit) {
				this.RagionValHelpF4_Exit();
			}
		},
		setCPStockF4Columns: function (oValueHelpDialog, mParameters) {
			var oColModel = new sap.ui.model.json.JSONModel();
			oColModel.setData({
				cols: [{
					label: "RegionCode",
					template: "RegionCode"
				}, {
					label: "RegionName",
					template: "RegionName"
				}]
			});
			oValueHelpDialog.getTable().setModel(oColModel, "columns");
		},
		setCPStockF4FilterBar: function (oValueHelpDialog, mParameters) {
			var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
				advancedMode: true,
				filterBarExpanded: false,
				showGoOnFB: !sap.ui.Device.system.phone,
				filterGroupItems: [
					new sap.ui.comp.filterbar.FilterGroupItem({
						groupTitle: "foo",
						groupName: "gn1",
						name: "n1",
						label: "Region Code",
						control: new sap.m.Input(),
					}),
					new sap.ui.comp.filterbar.FilterGroupItem({
						groupTitle: "foo",
						groupName: "gn1",
						name: "n2",
						label: "Region Name",
						control: new sap.m.Input(),
					})
				],
				search: function (oEvent) {
					// sap.m.MessageToast.show(
					// 	"Search pressed '" +
					// 	arguments[0].mParameters.selectionSet[0].getValue() +
					// 	"''"
					// );
				},
			});

			if (oFilterBar.setBasicSearch) {
				oFilterBar.setBasicSearch(
					new sap.m.SearchField({
						showSearchButton: sap.ui.Device.system.phone,
						placeholder: "Search",
						search: function (event) {
							oValueHelpDialog.getFilterBar().search();
						},
					})
				);
			}
			oValueHelpDialog.setFilterBar(oFilterBar);
		},
		addHBoxCondContent: function (newItem, ruleName) {
			var that = this;
			var operSelectEnabled = true;
			var hBoxWidth = "";
			var mInputWidth = "";
			var operSelectVisible = true;

			if (ruleName === "Region") {
				operSelectEnabled = false;
				hBoxWidth = "18rem";
				mInputWidth = "10rem";
				operSelectVisible = false;
			} else {
				operSelectEnabled = true;
				hBoxWidth = "35rem";
				mInputWidth = "15rem";
				operSelectVisible = true;
			}
			var hbox = new sap.m.HBox({
				justifyContent: "SpaceBetween",
				width: hBoxWidth,
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

			var oMultiInput = new sap.m.MultiInput({
				width: mInputWidth,
				fieldWidth: mInputWidth,
				valueHelpRequest: function (oEvent) {
					// that.setRegionF4(oEvent);
					this.onValueHelpRequested(oEvent);
					// this.handleValueHelp(oEvent);
				}.bind(this)
			});

			var operSelect = new sap.m.Select({
				// class: "sapUiSmallMarginBegin"
				enabled: operSelectEnabled,
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

			var oDeleButton = new sap.m.Button({
				text: "",
				icon: "sap-icon://decline",
				//enabled: false,
				visible: operSelectVisible,
				press: function (oEvent) {
					// var src = oEvent.getSource();
					this.deleteRowItems(oEvent);
				}.bind(this)
			});
			var oAddButton = new sap.m.Button({
				text: "",
				// class: "sapUiTinyMarginBegin",
				icon: "sap-icon://add",
				enabled: false,
				visible: operSelectVisible,
				press: function (oEvent) {
					that.addRowItems(oEvent);
				}
			});
			if (newItem) {
				oDeleButton.setEnabled(false);
			}
			hbox.addItem(conSelect);
			hbox.addItem(oMultiInput);
			hbox.addItem(operSelect);
			hbox.addItem(oDeleButton);
			hbox.addItem(oAddButton);

			return hbox;
		},
		handleValueHelp: function (oEvent) {
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment("valHelpFragmId", "com.extentia.dlrulecreate.fragments.ValueHelpDialog", this);
			}
			oMultiInput = oEvent.getSource();

			jQuery.sap.syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), this._valueHelpDialog);

			this.setRegions();
			this.getView().addDependent(this._valueHelpDialog);
			this._valueHelpDialog.open();
		},
		onCancel: function () {
			this._valueHelpDialog.close();
		},
		onSubmit: function (evt) {
			var aSelectedItems = evt.getParameter("selectedItems");
			// oMultiInput = this.byId("multiInput");

			if (aSelectedItems && aSelectedItems.length > 0) {
				aSelectedItems.forEach(function (oItem) {
					oMultiInput.addToken(new sap.m.Token({
						key: oItem.getTitle(),
						text: oItem.getTitle() + " (" + oItem.getTitle() + ")"
					}));
				});
			}
			this._valueHelpDialog.close();
		},
		onSelectionChange1: function (oEvent) {
			var oList = oEvent.getSource();
			// var oLabel = this.getView().byId("valHelpFragmId--idFilterLabel");
			// var oInfoToolbar = this.getView().byId("valHelpFragmId--idInfoToolbar");

			// With the 'getSelectedContexts' function you can access the context paths
			// of all list items that have been selected, regardless of any current
			// filter on the aggregation binding.
			var aContexts = oList.getSelectedContexts(true);

			// update UI
			var sText = "";
			oEvent.getSource().getInfoToolbar().removeAllContent();
			var bSelected = (aContexts && aContexts.length > 0);
			sText = (bSelected) ? aContexts.length + " selected" : null;
			oEvent.getSource().getInfoToolbar().setVisible(bSelected);
			oEvent.getSource().getInfoToolbar().addContent(new sap.m.Label({
				text: sText
			}));
			// oLabel.setText(sText);
		},

		setRegions: function () {
			var oData = [{
				key: "01",
				desc: "APJ",
				selected: false
			}, {
				key: "02",
				desc: "GCO",
				selected: false
			}, {
				key: "03",
				desc: "ISV",
				selected: false
			}, {
				key: "04",
				desc: "CX",
				selected: false
			}];
			var oDialogModel = new sap.ui.model.json.JSONModel();
			oDialogModel.setData(oData);
			// this.getView().setModel(oDialogModel, "checkBoxItems");
			this._valueHelpDialog.setModel(oDialogModel, "Regions");
		},
		_handleValueHelpClose: function (evt) {
			var aSelectedItems = evt.getParameter("selectedItems");
			// oMultiInput = this.byId("multiInput");

			if (aSelectedItems && aSelectedItems.length > 0) {
				aSelectedItems.forEach(function (oItem) {
					oMultiInput.addToken(new sap.m.Token({
						key: oItem.getTitle(),
						text: oItem.getTitle() + " (" + oItem.getTitle() + ")"
					}));
				});
			}
		},
		validateItems: function (content) {
			var aItemsContent = content;
			var validated = true;
			for (var i = 0; i < aItemsContent.length; i++) {
				if (aItemsContent[i].getItems()) {
					if (aItemsContent[i].getItems()[1].getTokens().length > 0) {
						validated = true;
						break;
					} else {
						validated = false;
					}
				}
			}
			return validated;
		},
		onValueHelpRequested: function (oEvent) {
			oMultiInput = oEvent.getSource();
			var headerText = oEvent.getSource().getParent().getParent().getParent().getHeaderText();
			this.getView().getModel("LocalViewSetting").setProperty("/valueHelpFieldName", headerText);
			var bSupportMultiselect = true;
			if (headerText === "Region") {
				bSupportMultiselect = false;
			}
			var oVid = this.getView().byId("panelVBox");
			var vBoxItems = oVid.getItems();
			var aValidated = true;
			var oMessage = "";
			for (var i = 0; i < vBoxItems.length; i++) {
				if (headerText === "SubRegion") {
					if (vBoxItems[i].getHeaderText() === "Region") {
						if (vBoxItems[i].getContent()[i].getHeaderText() === "Value") {
							var aRegionContent = vBoxItems[i].getContent()[i].getContent();
							aValidated = this.validateItems(aRegionContent, headerText);
							oMessage = "Please select Region !!!";
						}
					}
				}
				if (headerText === "Primary Hub") {
					if (vBoxItems[i].getHeaderText() === "Region") {
						if (vBoxItems[i].getContent()[i].getHeaderText() === "Value") {
							var aRegionContent = vBoxItems[i].getContent()[i].getContent();
							aValidated = this.validateItems(aRegionContent, headerText);
							oMessage = "Please select Region !!!";
						}
					}
				} else if (headerText === "Primary Hub DL") {
					if (vBoxItems[i].getHeaderText() === "Region") {
						if (vBoxItems[i].getContent()[i].getHeaderText() === "Value") {
							var aRegionContent = vBoxItems[i].getContent()[i].getContent();
							aValidated = this.validateItems(aRegionContent);
							oMessage = "Please select Region !!!";
						}
					}
					if (aValidated) {
						if (vBoxItems[i].getHeaderText() === "Primary Hub") {
							if (vBoxItems[i].getContent()[i].getHeaderText() === "Value") {
								var aPrimaryHubContent = vBoxItems[i].getContent()[i].getContent();
								aValidated = this.validateItems(aPrimaryHubContent);
								oMessage = "Please select Primary Hub !!!";
							}
						}
					}
				}
			}

			if (aValidated) {
				var aTokens = oEvent.getSource().getTokens();
				if (aTokens) {
					oMultiInput.setTokens(aTokens);
				}

				// var operSelect = new sap.m.Select({
				// 	// selectedKey: "{RelOperationsDD>key}",
				// 	change: function (evt) {
				// 		//this.setSelectedOper(evt);
				// 	}.bind(this)
				// });
				// operSelect.setModel(this.getView().getModel("RelOperationsDD"));
				// var operItemTemplate = new sap.ui.core.Item({
				// 	key: "{RelOperationsDD>key}",
				// 	text: "{RelOperationsDD>desc}"
				// });
				// operSelect.bindItems("RelOperationsDD>/", operItemTemplate);

				var oCulmnData = {
					"cols": [{
						"label": headerText,
						"template": "key",
					}, {
						"label": headerText + " Name",
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

				this._oValueHelpDialog = sap.ui.xmlfragment("com.extentia.dlrulecreate.fragments.ValueHelpDialogFilterbar", this);
				jQuery.sap.syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), this._oValueHelpDialog);
				//this._oValueHelpDialog.getFilterBar().getFilterGroupItems()[1].getControl().setSelectedKey(oMultiInput.getDescription());
				this.getView().addDependent(this._oValueHelpDialog);

				this._oValueHelpDialog.setRangeKeyFields([{
					label: headerText,
					key: headerText,
					type: "string"
				}]);
				if (bSupportMultiselect) {
					this._oValueHelpDialog.setSupportMultiselect(true);
					this._oValueHelpDialog.getFilterBar().getFilterGroupItems()[1].getControl().setSelectedKey("");
					this._oValueHelpDialog.getFilterBar().getFilterGroupItems()[1].getControl().setEditable(true);
				} else {
					this._oValueHelpDialog.setSupportMultiselect(true);
					this._oValueHelpDialog.getFilterBar().getFilterGroupItems()[1].getControl().setSelectedKey("OR");
					this._oValueHelpDialog.getFilterBar().getFilterGroupItems()[1].getControl().setEditable(false);
				}
				// this._oValueHelpDialog.getFilterBar().setBasicSearch(this._oBasicSearchField);

				this._oValueHelpDialog.getTableAsync().then(function (oTable) {

					var rData = this.setValueHelpModels(headerText);
					var oRowsModel = new sap.ui.model.json.JSONModel();
					oRowsModel.setData(rData);

					oTable.setModel(oRowsModel);
					// oTable.setModel(this.oProductsModel);
					oTable.setModel(this.getView().getModel("CulmnDataModel"), "columns");

					if (oTable.bindRows) {
						oTable.bindAggregation("rows", "/");
					}
					// oTable.addColumn(new sap.ui.table.Column({
					// 	label: headerText,
					// 	template: new sap.m.Text({
					// 		text: "{key}"
					// 	}),
					// 	sortProperty: "key",
					// 	filterProperty: "key"
					// }));

					// oTable.addColumn(new sap.ui.table.Column({
					// 	label: "Condition",
					// 	template: operSelect,
					// 	templateShareable: true
					// }));

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
						// this._oValueHelpDialog.setTable(oTable);
					}
					// var message = "";
					// that.getView().getModel("LocalViewSetting").setProperty("/messageStripText", "");
					// oTable.attachRowSelectionChange(function (evt) {

					// 	var params = evt.getParameters();
					// 	var index = params.rowIndex;
					// 	var oKey = evt.getParameters().rowContext.getModel().getData()[index].key;
					// 	var oSelDesc = evt.getParameters().rowContext.getModel().getData()[index].desc;
					// 	// var str = oSelDesc + " OR";
					// 	if (message === "") {
					// 		message += oSelDesc;
					// 	} else {
					// 		message += " OR " + oSelDesc;
					// 	}

					// 	that.getView().getModel("LocalViewSetting").setProperty("/messageStripText", message);
					// });

					this._oValueHelpDialog.update();
				}.bind(this));

				this._oValueHelpDialog.setTokens(oMultiInput.getTokens());
				this._oValueHelpDialog.open();
			} else {
				MessageBox.error(oMessage);
			}

		},
		onValueHelpOkPress: function (oEvent) {
			//this._oMultiInput = oEvent.getSource();
			var aTokens = oEvent.getParameter("tokens");
			oMultiInput.removeAllTokens();
			var fSelKey = this._oValueHelpDialog.getFilterBar().getFilterGroupItems()[1].getControl().getSelectedKey();
			// var fSelKeyText = this._oValueHelpDialog.getFilterBar().getFilterGroupItems()[1].getControl().getSelectedItem().getText();
			if (aTokens.length > 0) {
				if ((aTokens.length > 1 && fSelKey !== "00") || aTokens.length === 1) {
					oMultiInput.setTokens(aTokens);
					oMultiInput.setDescription(fSelKey);
					var oMessage = "";
					for (var i = 0; i < aTokens.length; i++) {
						var tText = aTokens[i].getText().split("(")[0];
						if (aTokens[i] === aTokens[0]) {
							oMessage += tText;
						} else {
							if (fSelKey === "OR") {
								oMessage += " || " + tText;
							} else {
								oMessage += " && " + tText;
							}

						}
					}
					if (oMessage) {
						MessageToast.show(oMessage);
					}

					this._oValueHelpDialog.close();
				} else {
					MessageBox.error("Please select the Condition !!!");
				}
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
		onFilterBarSearch: function (oEvent) {
			var headerText = this._oValueHelpDialog.getTitle();
			var sSearchQuery = this._oBasicSearchField.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet");
			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
				if (oControl.getValue()) {
					aResult.push(new Filter({
						path: oControl.getName(),
						operator: FilterOperator.Contains,
						value1: oControl.getValue()
					}));
				}

				return aResult;
			}, []);
			aFilters.push(new Filter({
				filters: [
					new Filter({
						path: headerText,
						operator: FilterOperator.Contains,
						value1: sSearchQuery
					})
				],
				and: false
			}));
			this._filterTable(new Filter({
				filters: aFilters,
				and: true
			}));
		},
		_filterTable: function (oFilter) {
			var oValueHelpDialog = this._oValueHelpDialog;
			oValueHelpDialog.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}
				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter);
				}
				oValueHelpDialog.update();
			});
		},
		setSelectedOper: function (oEvent) {
			// var evt = oEvent.getSource().getParent().getParent();
			if (oEvent.getSource().getSelectedKey() !== "00") {
				oEvent.getSource().getParent().getItems()[4].setEnabled(true);
			} else {
				oEvent.getSource().getParent().getItems()[4].setEnabled(false);
			}
		},
		addPanelContent: function (hBoxContent, hBoxRelContent) {
			var that = this;
			if (hBoxRelContent) {
				var oRelPanel = that.setRelationPanel(hBoxRelContent);
			}
			var oCondPanel = that.setConditionPanel(hBoxContent);
			var oPanel = new sap.m.Panel({
				backgroundDesign: "Solid",
				expandable: true,
				expanded: true,
				headerText: this.getView().byId("inputRuleName").getSelectedItem().getText(),
				content: [oRelPanel, oCondPanel],
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Transparent,
					content: [
						new sap.m.Title({
							text: this.getView().byId("inputRuleName").getSelectedItem().getText()
						}),
						new sap.m.ToolbarSpacer(),
						new sap.m.Button({
							icon: "sap-icon://less",
							tooltip: "Delete",
							press: function (oEvent) {
								this.deletePanelItems(oEvent);
							}.bind(this)
						})
					]
				})
			});
			return oPanel;
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
						// new sap.m.Button({
						// 	icon: "sap-icon://less",
						// 	tooltip: "Remove Item",
						// 	press: function (oEvent) {
						// 		this.deleteRCPanelItems(oEvent);
						// 	}.bind(this)
						// })
					]
				})

			});
			return oRelPanel;
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
						// new sap.m.Button({
						// 	icon: "sap-icon://less",
						// 	tooltip: "Remove Item",
						// 	press: function (oEvent) {
						// 		this.deleteRCPanelItems(oEvent);
						// 	}.bind(this)
						// })
					]
				})

			});
			return oCondPanel;
		},
		addPanelContent1: function (hBoxContent) {
			var that = this;
			var oVid = this.getView().byId("panelVBox");
			var vBoxItems = oVid.getItems().length;
			this.getView().getModel("LocalViewSetting").setProperty("/panelItems", vBoxItems);
			//panel 
			var oPanel = new sap.m.Panel({
				backgroundDesign: "Solid",
				expandable: true,
				expanded: true,
				headerText: this.getView().byId("inputRuleName").getSelectedItem().getText(),
				content: hBoxContent,
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Transparent,
					content: [
						new sap.m.Title({
							text: this.getView().byId("inputRuleName").getSelectedItem().getText()
						}),
						// new sap.m.ToolbarSpacer(), new sap.m.ToolbarSpacer(),
						// new sap.m.Title({
						// 	text: "Relation with the Next Field: ",
						// 	visible: "{= ${LocalViewSetting>/panelItems} > 0}"
						// }),
						// new sap.m.SegmentedButton({
						// 	selectedKey: "OR",
						// 	visible: "{= ${LocalViewSetting>/panelItems} > 0}",
						// 	items: [new sap.m.SegmentedButtonItem({
						// 		text: "OR"
						// 	}), new sap.m.SegmentedButtonItem({
						// 		text: "AND"
						// 	})]
						// }),
						new sap.m.ToolbarSpacer(),
						new sap.m.Button({
							icon: "sap-icon://less",
							tooltip: "Remove Item",
							press: function (oEvent) {
								this.deletePanelItems(oEvent);
							}.bind(this)
						})
					]
				})
			});
			return oPanel;
		},
		addRowItems: function (oEvent) {
			var oGrid = oEvent.getSource().getParent().getParent();
			oEvent.getSource().getParent().getItems()[2].setEnabled(false);
			var hbox = this.addHBoxCondContent(false);
			oGrid.addContent(hbox);
			oEvent.getSource().setEnabled(false);
		},
		addRelRowItems: function (oEvent) {
			var oGrid = oEvent.getSource().getParent().getParent();
			var hbox = this.addHBoxRelContent(false);
			oGrid.addContent(hbox);
			oEvent.getSource().setEnabled(false);
		},
		deleteRowItems: function (oEvent) {
			var panelContent = oEvent.getSource().getParent().getParent().getContent();
			if (panelContent.length > 2) {
				panelContent[panelContent.length - 2].getItems()[4].setEnabled(true);
				panelContent[panelContent.length - 2].getItems()[2].setEnabled(true);
			} else {
				panelContent[0].getItems()[4].setEnabled(true);
				panelContent[0].getItems()[2].setEnabled(true);
			}

			// if (panelContent.length > 0) {
			// 	oEvent.getSource().getParent().getItems()[panelContent.length - 1].setEnabled(true);
			// }
			var hbox = oEvent.getSource().getParent();
			oEvent.getSource().getParent().getParent().removeContent(hbox);

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
		},
		deleteRCPanelItems: function (oEvent) {
			var panelContent = oEvent.getSource().getParent().getParent().getParent();
			panelContent.removeAllContent(panelContent.getParent().getContent());
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.extentia.dlrulecreate.view.DLRuleAdd
		 */
		// onBeforeRendering: function () {

		// },

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.extentia.dlrulecreate.view.DLRuleAdd
		 */
		onAfterRendering: function () {
			//this.setRuleNamesDD();
			//	MessageBox.success("onAfterRendering");
			// alert('success');
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.extentia.dlrulecreate.view.DLRuleAdd
		 */
		//	onExit: function() {
		//
		//	}

	});

});