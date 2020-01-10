sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.extentia.dlrulecreate.controller.Main", {
		onInit: function () {
			if (!sap.ui.Device.support.touch) {
				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			} else {
				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}

		}
	});
});