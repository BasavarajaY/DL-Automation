sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment"
], function (Controller, Fragment) {
	"use strict";

	return Controller.extend("com.extentia.dlrulecreate.controller.block.DLUserDetailBlock", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.extentia.dlrulecreate.view.DLUserDetailBlock
		 */
		onInit: function () {

		},
		onAddUser: function (oEvent) {
			var oButton = oEvent.getSource();
			if (!this._DLUserListDialog) {
				Fragment.load({
					name: "com.extentia.dlrulecreate.fragments.DLUserList",
					controller: this
				}).then(function (oDialog) {
					this._DLUserListDialog = oDialog;
					this.configDLUserListDialog(oButton);
					this._DLUserListDialog.open();
				}.bind(this));
			} else {
				this.configDLUserListDialog(oButton);
				this._DLUserListDialog.open();
			}
		},
		configDLUserListDialog: function (oButton) {
			// Set draggable property
			var bDraggable = oButton.data("draggable");
			this._DLUserListDialog.setDraggable(bDraggable == "true");

			// Set resizable property
			var bResizable = oButton.data("resizable");
			this._DLUserListDialog.setResizable(bResizable == "true");

			// Multi-select if required
			var bMultiSelect = !!oButton.data("multi");
			this._DLUserListDialog.setMultiSelect(bMultiSelect);

			// Remember selections if required
			var bRemember = !!oButton.data("remember");
			this._DLUserListDialog.setRememberSelections(bRemember);

			// Set custom text for the confirmation button
			var sCustomConfirmButtonText = oButton.data("confirmButtonText");
			this._DLUserListDialog.setConfirmButtonText(sCustomConfirmButtonText);

			this.getView().addDependent(this._DLUserListDialog);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._DLUserListDialog);
			jQuery.sap.syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), this._DLUserListDialog);
		},
		handleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("FirstName", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		handleClose: function (oEvent) {
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([]);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.extentia.dlrulecreate.view.DLUserDetailBlock
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.extentia.dlrulecreate.view.DLUserDetailBlock
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.extentia.dlrulecreate.view.DLUserDetailBlock
		 */
		//	onExit: function() {
		//
		//	}

	});

});