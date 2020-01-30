sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/export/Spreadsheet",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, MessageBox, Export, ExportTypeCSV, Spreadsheet, Fragment, Filter, FilterOperator) {
	"use strict";
	var oi18n;
	var Device = sap.ui.Device;

	return Controller.extend("com.extentia.dlrulecreate.controller.DLList", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.extentia.dlrulecreate.view.DLList
		 */
		onInit: function () {
			gDListView = this.getView();
			this.onInitHookUp();
		},
		onInitHookUp: function () {
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			//i18n
			oi18n = this._oComponent.getModel("i18n").getResourceBundle();
			//Router Initialisation
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//Attach event for routing on view patter matched 
			this._oRouter.attachRouteMatched(this.onRouteMatched, this);

			if (this.onInitHookUp_Exit) {
				this.onInitHookUp_Exit();
			}
		},
		onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") !== "DLListPage") {
				return;
			}
			this.setDefaultSettings();
		},
		handleValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			var ruleNameData = [{
				key: "01",
				desc: "RuleName1",
				selected: false
			}, {
				key: "02",
				desc: "RuleName2",
				selected: false
			}, {
				key: "03",
				desc: "RuleName3",
				selected: false
			}, {
				key: "04",
				desc: "RuleName4",
				selected: false
			}];
			var oListsModel = new sap.ui.model.json.JSONModel();
			oListsModel.setData(ruleNameData);
			this.getView().setModel(oListsModel, "RuleNameList");
			// create value help dialog
			if (!this._RuleNamevalueHelpDialog) {
				Fragment.load({
					id: "valueHelpDialog",
					name: "com.extentia.dlrulecreate.fragments.VHDialog",
					controller: this
				}).then(function (oValueHelpDialog) {
					this._RuleNamevalueHelpDialog = oValueHelpDialog;
					this.getView().addDependent(this._RuleNamevalueHelpDialog);
					this._openValueHelpDialog(sInputValue);
				}.bind(this));
			} else {
				this._openValueHelpDialog(sInputValue);
			}
			jQuery.sap.syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), this._RuleNamevalueHelpDialog);
		},
		_openValueHelpDialog: function (sInputValue) {
			// create a filter for the binding
			// this._valueHelpDialog.getBinding("items").filter([new Filter(
			// 	"Name",
			// 	FilterOperator.Contains,
			// 	sInputValue
			// )]);

			// open value help dialog filtered by the input value
			this._RuleNamevalueHelpDialog.open(sInputValue);
		},
		handleValueHelpClose: function (evt) {
			var aSelectedItems = evt.getParameter("selectedItems"),
				oMultiInput = this.getView().byId("multiInput");

			if (aSelectedItems && aSelectedItems.length > 0) {
				aSelectedItems.forEach(function (oItem) {
					oMultiInput.addToken(new sap.m.Token({
						text: oItem.getTitle()
					}));
				});
			}
		},
		_handleValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"Name",
				FilterOperator.Contains,
				sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		setDefaultSettings: function () {
			/**
			 * All view related local settings should be mapped in a Model and is called LocalViewSetting
			 */
			var oViewSettingModel = new sap.ui.model.json.JSONModel();
			this.viewSettingData = {
				ListItemsCount: 0
			};
			oViewSettingModel.setData(this.viewSettingData);
			this._oComponent.setModel(oViewSettingModel, "LocalViewSetting");

			if (this.setDefaultSettings_Exit) {
				this.setDefaultSettings_Exit();
			}
		},

		onSearch: function () {
			this.setListItems();
			// var oItems = this.getView().getModel("ListItems").getProperty("/");
			var oTokens = this.getView().byId("inputRegionF4");
			var oTokenValue = oTokens.getTokens()[0].getText().split("(")[0];
			var aFilter = [];
			aFilter.push(new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.Contains, oTokenValue));
			var oList = this.getView().byId("UIRuleTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
			// oItems.filter(aFilter);
		},
		setListItems: function () {
			var oListData = [{
				RuleID: "01",
				DLName: "DLName1",
				DLDescription: "",
				RuleName: "RuleName1",
				Region: "APJ",
				SubRegion: [{
					label: "SubRegion",
					value: "ANZ"
				}, {
					label: "SubRegion",
					value: "RNZ"
				}],
				CompanyCode: "0014",
				Solutions: "Solutions1",
				PrimaryHub: "Architecting",
				PrimaryHubDL: "PSH-Architecting- APJ",
				SecondaryHub: "Public Sector Solutions",
				SecondaryHubDL: "PSH-Public Sector Solutions- APJ"
			}, {
				RuleID: "02",
				RuleName: "RuleName2",
				DLName: "DLName2",
				DLDescription: "",
				Region: "GCO",
				//SubRegion: "APJ-Regional",
				SubRegion: [{
					label: "SubRegion",
					value: "APJ-Regional"
				}, {
					label: "SubRegion",
					value: "RNZ"
				}],
				CompanyCode: "0015",
				Solutions: "Solutions2",
				PrimaryHub: "Manager",
				PrimaryHubDL: "PSH-Manager- APJ",
				SecondaryHub: "DSC Supply",
				SecondaryHubDL: "PSH-DSC Supply"
			}, {
				RuleID: "03",
				RuleName: "RuleName3",
				DLName: "DLName3",
				DLDescription: "",
				Region: "GC",
				//SubRegion: "GC CN",
				SubRegion: [{
					label: "SubRegion",
					value: "GC-CN"
				}, {
					label: "SubRegion",
					value: "RNZ"
				}, {
					label: "SubRegion",
					value: "ISV-APJ"
				}],
				CompanyCode: "0016",
				Solutions: "Solutions3",
				PrimaryHub: "Finance",
				PrimaryHubDL: "PSH-Finance- APJ",
				SecondaryHub: "Public Sector Finance",
				SecondaryHubDL: "PSH-Public Sector Finance- APJ"
			}, {
				RuleID: "04",
				RuleName: "RuleName4",
				DLName: "DLName4",
				DLDescription: "",
				Region: "ISV",
				//SubRegion: "ISV-APJ",
				SubRegion: [{
					label: "SubRegion",
					value: "ISV-APJ"
				}, {
					label: "SubRegion",
					value: "RNZ"
				}],
				CompanyCode: "0017",
				Solutions: "Solutions4",
				PrimaryHub: "Architecting",
				PrimaryHubDL: "PSH-Architecting- APJ",
				SecondaryHub: "Public Sector Solutions",
				SecondaryHubDL: "PSH-Public Sector Solutions- APJ"
			}, {
				RuleID: "05",
				RuleName: "RuleName5",
				DLName: "DLName5",
				DLDescription: "",
				Region: "APJ",
				//SubRegion: "ANZ",
				SubRegion: [{
					label: "SubRegion",
					value: "ANZ-APJ"
				}, {
					label: "SubRegion",
					value: "ANZ-RNZ"
				}],
				CompanyCode: "0014",
				Solutions: "Solutions5",
				PrimaryHub: "Architecting",
				PrimaryHubDL: "PSH-Architecting- APJ",
				SecondaryHub: "PSH-Public Sector Solutions- APJ",
				SecondaryHubDL: "Public Sector Solutions"
			}, {
				RuleID: "06",
				RuleName: "RuleName6",
				DLName: "DLName6",
				DLDescription: "",
				Region: "EME North",
				//SubRegion: "ANZ",
				SubRegion: [{
					label: "SubRegion",
					value: "GC-HK"
				}, {
					label: "SubRegion",
					value: "EMEA BN&P"
				}],
				CompanyCode: "0016",
				Solutions: "Solutions6",
				PrimaryHub: "Banking",
				PrimaryHubDL: "PSH-Banking",
				SecondaryHub: "PSH-Public Sector Solutions- APJ",
				SecondaryHubDL: "Public Sector Solutions"
			}, {
				RuleID: "07",
				RuleName: "RuleName7",
				DLName: "DLName7",
				DLDescription: "",
				Region: "EME South",
				//SubRegion: "ANZ",
				SubRegion: [{
					label: "SubRegion",
					value: "GK-KK"
				}, {
					label: "SubRegion",
					value: "EMEA BN&PS"
				}],
				CompanyCode: "0017",
				Solutions: "Solutions7",
				PrimaryHub: "Human Resources",
				PrimaryHubDL: "PSH-Human Resources",
				SecondaryHub: "PSH-Public - EME South",
				SecondaryHubDL: "Public Sector Solutions"
			}, {
				RuleID: "08",
				RuleName: "RuleName8",
				DLName: "DLName8",
				DLDescription: "",
				Region: "ISV",
				//SubRegion: "ANZ",
				SubRegion: [{
					label: "SubRegion",
					value: "GC"
				}, {
					label: "SubRegion",
					value: "CN"
				}],
				CompanyCode: "0018",
				Solutions: "Solutions8",
				PrimaryHub: "HR",
				PrimaryHubDL: "PSH-HR",
				SecondaryHub: "PSH-GC",
				SecondaryHubDL: "PSS-PSH-GC"
			}];
			var oListsModel = new sap.ui.model.json.JSONModel();
			oListsModel.setData(oListData);
			this.getView().setModel(oListsModel, "ListItems");
			this.getView().getModel("LocalViewSetting").setProperty("/ListItemsCount", oListData.length);
		},
		setDialog: function () {
			// var dialog = new sap.m.Dialog({
			// 	title: "Select Name",
			// 	type: "Standard",
			// 	state: "None",
			// 	icon: "sap-icon://create",
			// 	content: new sap.m.Text({
			// 		text: "Content goes here,,,,,,"
			// 	}),
			// 	beginButton: new sap.m.Button({
			// 		text: "OK",
			// 		press: function() {
			// 			dialog.close();
			// 		}
			// 	}),
			// 	endButton: new sap.m.Button({
			// 		text: "NO",
			// 		press: function() {
			// 			dialog.close();
			// 		}
			// 	}),
			// 	afterClose: function() {
			// 		dialog.destroy();
			// 	}
			// });
			// dialog.open();
		},
		handleRuleCreate: function (oEvent) {
			this.setDialogCheckBox(oEvent);
			// this._oRouter.navTo("DLRuleCreate", false);
		},
		setDialogCheckBox: function (oEvent) {
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
				var selchkBoxItems = [];
				aContexts.map(function (oContext) {
					selchkBoxItems.push({
						RuleKey: oContext.getObject().key,
						RuleDesc: oContext.getObject().value
					});
				});
				this._oRouter.navTo("DLRuleCreate", {
					contextPath: encodeURIComponent(JSON.stringify(selchkBoxItems))
				}, false);
				// this._fraDialog.close();
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		setCheckBoxItems: function () {
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
			var oDialogModel = new sap.ui.model.json.JSONModel();
			oDialogModel.setData(oDialogItemsData);
			// this.getView().setModel(oDialogModel, "checkBoxItems");
			this._fraDialog.setModel(oDialogModel, "checkBoxItems");
		},
		onCancel: function () {
			this._fraDialog.close();
		},
		onSubmit: function (oEvent) {
			var oDataItems = this._fraDialog.getModel("checkBoxItems").getProperty("/");
			var count = 0;
			var selchkBoxItems = [];
			for (var i = 0; i < oDataItems.length; i++) {
				if (oDataItems[i].selected) {
					selchkBoxItems.push({
						RuleKey: oDataItems[i].key,
						RuleDesc: oDataItems[i].value
					});
					count++;
				}
			}
			if (count === 0) {
				MessageBox.error("selct atleast one checkbox to create Rule");
			} else {
				this._oRouter.navTo("DLRuleCreate", {
					contextPath: encodeURIComponent(JSON.stringify(selchkBoxItems))
				}, false);
				this._fraDialog.close();
			}
		},
		RegionF4: function (oEvent) {
			var that = this;
			var headerText = "Region";
			this.TokenInput = oEvent.getSource();
			this.TokenKeys = ["Region", "RegionDesc"];
			this.setValueHelp({
				title: headerText,
				oController: this,
				controlID: "inputRegionF4",
				idLabel: headerText,
				descriptionLabel: headerText + " Description",
				tokenInput: this.TokenInput,
				aKeys: this.TokenKeys,
				bMultiSelect: false,
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
				var jData = tokens[0].getCustomData()[0].getValue();
				that.TokenInput.removeAllTokens();
				that.TokenInput.addToken(new sap.m.Token({
					key: jData.key,
					text: jData.desc + " (" + jData.key + ")"
				}));
				that.TokenInput.setTooltip(jData.desc);
			});

			//for enhancement
			if (this.RegionF4_Exit) {
				this.RegionF4_Exit(oEvent);
			}

		},
		SubRegionF4: function (oEvent) {
			var that = this;
			var headerText = "SubRegion";
			this.TokenInput = oEvent.getSource();
			this.TokenKeys = ["SubRegion", "SubRegionDesc"];
			this.setValueHelp({
				title: headerText,
				oController: this,
				controlID: "inputSubRegionF4",
				idLabel: headerText,
				descriptionLabel: headerText + " Description",
				tokenInput: this.TokenInput,
				aKeys: this.TokenKeys,
				bMultiSelect: false,
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
				var jData = tokens[0].getCustomData()[0].getValue();
				that.TokenInput.removeAllTokens();
				that.TokenInput.addToken(new sap.m.Token({
					key: jData.key,
					text: jData.desc + " (" + jData.key + ")"
				}));
				that.TokenInput.setTooltip(jData.desc);
			});
			//for enhancement
			if (this.RegionF4_Exit) {
				this.RegionF4_Exit(oEvent);
			}
		},
		CompanyCodeF4: function (oEvent) {
			var that = this;
			var headerText = "Company";
			this.TokenInput = oEvent.getSource();
			this.TokenKeys = ["CompanyCode", "CompanyDesc"];
			this.setValueHelp({
				title: headerText,
				oController: this,
				controlID: "inputCompanyCodeF4",
				idLabel: headerText,
				descriptionLabel: headerText + " Description",
				tokenInput: this.TokenInput,
				aKeys: this.TokenKeys,
				bMultiSelect: false,
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
				var jData = tokens[0].getCustomData()[0].getValue();
				that.TokenInput.removeAllTokens();
				that.TokenInput.addToken(new sap.m.Token({
					key: jData.key,
					text: jData.desc + " (" + jData.key + ")"
				}));
				that.TokenInput.setTooltip(jData.desc);
			});
			//for enhancement
			if (this.CompanyCodeF4_Exit) {
				this.CompanyCodeF4_Exit(oEvent);
			}
		},
		BusinessUnitF4: function (oEvent) {
			var that = this;
			var headerText = "Company";
			this.TokenInput = oEvent.getSource();
			this.TokenKeys = ["BusinessUnit", "BusinessUnit"];
			this.setValueHelp({
				title: headerText,
				oController: this,
				controlID: "inputBusinessUnitF4",
				idLabel: headerText,
				descriptionLabel: headerText + " Description",
				tokenInput: this.TokenInput,
				aKeys: this.TokenKeys,
				bMultiSelect: false,
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
				var jData = tokens[0].getCustomData()[0].getValue();
				that.TokenInput.removeAllTokens();
				that.TokenInput.addToken(new sap.m.Token({
					key: jData.key,
					text: jData.desc + " (" + jData.key + ")"
				}));
				that.TokenInput.setTooltip(jData.desc);
			});
			//for enhancement
			if (this.BusinessUnitF4_Exit) {
				this.BusinessUnitF4_Exit(oEvent);
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
					mParameters.tokenInput.setTokens(oControlEvent.getParameter("tokens"));
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
						template: "key"
					}, {
						label: mParameters.descriptionLabel,
						template: "desc"
					}]
				});
				oValueHelpDialog.getTable().setModel(oColModel, "columns");

			} else {

				oValueHelpDialog.getTable().addColumn(new sap.ui.table.Column({
					label: mParameters.idLabel,
					template: new sap.m.Text({
						text: "{key}"
					}),
					sortProperty: "key",
					filterProperty: "key"
				}));

				oValueHelpDialog.getTable().addColumn(new sap.ui.table.Column({
					label: mParameters.descriptionLabel,
					template: new sap.m.Text({
						text: "{desc}"
					}),
					sortProperty: "desc",
					filterProperty: "desc"
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
				}];
			} else if (headerText === "SubRegion") {
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
				}];
			} else if (headerText === "Company") {
				oData = [{
					key: "0014",
					desc: "SAP Australia Pty Ltd"
				}, {
					key: "0071",
					desc: "SAP India Pvt. Ltd."
				}, {
					key: "0015",
					desc: "SAP ASIA Pte Ltd"
				}, {
					key: "0038",
					desc: "SAP (China) Co., Ltd."
				}, {
					key: "0093",
					desc: "SAP(CHINA) HOLDING CO.LTD"
				}, {
					key: "0074",
					desc: "SAP Hong Kong -Causeway Bay"
				}];
			}
			return oData;
		},
		/*------------------------------------------Table Filter, Sorter & Export to EXCEL-------------------------------------*/
		handleViewSettingsDialogButtonPressed: function (oEvent) {
			if (!this.FilterDialog) {
				this.FilterDialog = sap.ui.xmlfragment("com.extentia.dlrulecreate.fragments.FilterDialog", this);
			}
			var oModel = this.getView().getModel("ListItems");
			this.FilterDialog.setModel(oModel, "ListItems");
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.FilterDialog);
			this.FilterDialog.open();
		},
		exportToExcel: sap.m.Table.prototype.exportData || function (oEvent) {
			var oSpreadsheet = new Spreadsheet({
				dataSource: this.getView().getModel("ListItems").getProperty("/"),
				fileName: "DlListItems.xlsx",
				workbook: {
					columns: [{
						label: "Region",
						property: "Region",
						width: 20
					}, {
						label: "SubRegion",
						property: "SubRegion"
					}, {
						label: "Company Code",
						property: "CompanyCode",
						width: 20
					}, {
						label: "Solutions",
						property: "Solutions",
						width: 20
					}, {
						label: "Primary Hub",
						property: "PrimaryHub",
						width: 20
					}, {
						label: "Secondary Hub",
						property: "SecondaryHub",
						width: 20
					}, ]
				}
			});
			// oSpreadsheet.onprogress = function (iValue) {
			// 	jQuery.sap.log.debug("Export: " + iValue + "% completed");
			// };
			oSpreadsheet.build().then(function () {
				jQuery.sap.log.debug("Export is finished");
			}).catch(function (sMessage) {
				jQuery.sap.log.error("Export error: " + sMessage);
			});
		},
		onRuleIdPress: function (oEvent) {
			var path = "";
			var oModelContext = oEvent.getSource().getBindingContext("ListItems");
			path = "DLRuleSet(RuleID='" + oModelContext.getProperty("RuleID") + "',RuleName='" + oModelContext.getProperty("RuleName") +
				"',DLName='" + oModelContext.getProperty("DLName") +
				"',Region='" + oModelContext.getProperty("Region") + "')";

			this._oRouter.navTo("DLRuleDetail", {
				contextPath: path
			}, false);
		},
		onDisplayDL: function (oEvent) {
			var path = "";
			var oModelContext = oEvent.getSource().getBindingContext("ListItems");
			path = "DLDetailSet(RuleName='" + oModelContext.getProperty("RuleName") + "',DLName='" + oModelContext.getProperty("DLName") +
				"',Region='" + oModelContext.getProperty("Region") + "')";

			this._oRouter.navTo("DLDetail", {
				contextPath: path
			}, false);
		},
		handleSRQuickViewPress: function (oEvent) {
			var oModel = this.getView().getModel("ListItems");
			var oSubRegion = oEvent.getSource().getBindingContext("ListItems").getProperty("SubRegion");
			var ruleName = oEvent.getSource().getBindingContext("ListItems").getProperty("RuleName");
			this.createQuickViewModel(oEvent, ruleName, oSubRegion);

		},
		createQuickViewModel: function (oEvent, ruleName, oSubRegion) {
			var jsonData = {
				"pages": [{
					"pageId": "QVPageId",
					"header": ruleName,
					"title": "SubRegion",
					"icon": "sap-icon://background",
					"groups": [{
						"elements": oSubRegion
					}]
				}]
			};

			var oQVModel = new sap.ui.model.json.JSONModel();
			oQVModel.setData(jsonData);
			this.getView().setModel(oQVModel, "QuickViewData");
			this.openQuickView(oEvent, this.getView().getModel("QuickViewData"));
			//this._fraDialog.setModel(oDialogModel, "checkBoxItems");

			// SubRegion: [{
			// 	pageId: "genericPageId",
			// 	header: "Process",
			// 	title: "Inventarisation",
			// 	icon: "sap-icon://camera",
			// 	groups: [{
			// 		elements: [{
			// 			label: "SubRegion",
			// 			value: "ANZ"
			// 		}, {
			// 			label: "SubRegion",
			// 			value: "RNZ"
			// 		}]
			// 	}]
			// }],
		},
		openQuickView: function (oEvent, oModel) {
			var oButton = oEvent.getSource();

			if (!this._oQuickView) {
				Fragment.load({
					name: "com.extentia.dlrulecreate.fragments.QuickView",
					controller: this
				}).then(function (oQuickView) {
					this._oQuickView = oQuickView;
					this._configQuickView(oModel);
					this._oQuickView.openBy(oButton);
				}.bind(this));
			} else {
				this._configQuickView(oModel);
				this._oQuickView.openBy(oButton);
			}
		},
		_configQuickView: function (oModel) {
			this.getView().addDependent(this._oQuickView);
			this._oQuickView.close();
			this._oQuickView.setModel(oModel);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.extentia.dlrulecreate.view.DLList
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.extentia.dlrulecreate.view.DLList
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.extentia.dlrulecreate.view.DLList
		 */
		//	onExit: function() {
		//
		//	}

	});

});