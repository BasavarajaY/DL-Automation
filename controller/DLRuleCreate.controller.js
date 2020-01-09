sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";var t;return e.extend("com.extentia.dlrulecreate.controller.DLRuleCreate",{onInit:function(){gDLRuleCreateView=this.getView();this._oComponent=sap.ui.component(sap.ui.core.Component.getOwnerIdFor(gDLRuleCreateView));t=this._oComponent.getModel("i18n").getResourceBundle();this._oRouter=sap.ui.core.UIComponent.getRouterFor(this);this._oRouter.attachRouteMatched(this.onRouteMatched,this);this.setDefaultSettings()},onRouteMatched:function(e){if(e.getParameter("name")!=="DLRuleCreate"){return}var t=JSON.parse(decodeURIComponent(e.getParameter("arguments").contextPath));this.setRuleNamesDD(t)},setRuleNamesDD:function(e){var t=new sap.ui.model.json.JSONModel;t.setData(e);gDLRuleAddView.setModel(t,"RuleNamesDD");this.onCancel()},setDefaultSettings:function(){var e=new sap.ui.model.json.JSONModel;var t={footerVisible:false,panelItems:0};e.setData(t);this.getView().setModel(e,"LocalViewSetting")},onCancel:function(){var e=gDLRuleAddView.byId("panelVBox");e.removeAllItems();this.getView().getModel("LocalViewSetting").setProperty("/footerVisible",false)},onBack:function(){this.confirmDialog()},confirmDialog:function(){var e=new sap.m.Dialog({title:"Confirm",type:"Message",state:"Warning",icon:"sap-icon://message-warning",content:new sap.m.Text({text:"Your changes will be lost. you want to cancel the changes?"}),beginButton:new sap.m.Button({text:"YES",press:function(){this._oRouter.navTo("DLListPage");e.close()}.bind(this)}),endButton:new sap.m.Button({text:"NO",press:function(){e.close()}}),afterClose:function(){e.destroy()}});e.open()},addFieldNames:function(e){if(!this._fraDialog){this._fraDialog=sap.ui.xmlfragment("fragmId","com.extentia.dlrulecreate.fragments.RuleDialog",this)}var t=!!e.getSource().data("multi");this._fraDialog.setMultiSelect(t);var a=!!e.getSource().data("remember");this._fraDialog.setRememberSelections(a);jQuery.sap.syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(),this.getView(),this._fraDialog);this.setCheckBoxItems();this.getView().addDependent(this._fraDialog);this._fraDialog.open()},handleSearch:function(e){var t=e.getParameter("value");var a=new sap.ui.model.Filter("value",sap.ui.model.FilterOperator.Contains,t);var o=e.getSource().getBinding("items");o.filter([a])},handleSelect:function(e){var t=e.getParameter("selectedContexts");if(t.length){var a=[];t.map(function(e){a.push({RuleKey:e.getObject().key,RuleDesc:e.getObject().value})});gDLRuleAddView.getModel("RuleNamesDD").setProperty("/",a)}e.getSource().getBinding("items").filter([])},setCheckBoxItems:function(){var e=gDLRuleAddView;if(e.getModel("RuleNamesDD")){var t=e.getModel("RuleNamesDD").getProperty("/")}var a=[{key:"01",value:"Region",selected:false},{key:"02",value:"SubRegion",selected:false},{key:"03",value:"Primary Hub",selected:false},{key:"04",value:"Primary Hub DL",selected:false},{key:"05",value:"Secondary Hub",selected:false},{key:"06",value:"Secondary Hub DL",selected:false},{key:"07",value:"Company Code",selected:false},{key:"08",value:"Solutions",selected:false}];for(var o=0;o<a.length;o++){for(var n=0;n<t.length;n++){if(a[o].value===t[n].RuleDesc){a[o].selected=true}}}var s=new sap.ui.model.json.JSONModel;s.setData(a);this._fraDialog.setModel(s,"checkBoxItems")},onSave:function(){this.saveConfirm()},saveConfirm:function(){var e=new sap.m.Dialog({title:"Confirm",type:"Message",content:[new sap.m.Text({text:"Are you sure you want to save your Rule?"}),new sap.m.TextArea("saveDialogTextarea",{liveChange:function(e){var t=e.getParameter("value");var a=e.getSource().getParent();a.getBeginButton().setEnabled(t.length>0)},width:"100%",placeholder:"Please give a name for Rule"})],beginButton:new sap.m.Button({text:"YES",enabled:false,press:function(){var t=sap.ui.getCore().byId("saveDialogTextarea").getValue();sap.m.MessageToast.show("Rule Name is: "+t);e.close()}.bind(this)}),endButton:new sap.m.Button({text:"NO",press:function(){e.close()}}),afterClose:function(){e.destroy()}});e.open()}})});