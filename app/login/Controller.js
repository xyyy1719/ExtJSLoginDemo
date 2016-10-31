Ext.define('LoginDemo.login.Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.login-win',

	login: function() {
		if (this.lookup('form').isValid()) {
			Ext.Msg.alert('Login Demo', '<span class="fa fa-smile-o"></span> Thank you for reading my post!');
		}
	},

	onSubmitButtonClick: function(button, event) {
        this.login();
	},

	onUserNameEnterPress: function(field, event, eOpts) {
		if (event.getKey() === event.ENTER) {
			this.login();
		}
	},

	onPasswordEnterOrCapsLockPress: function(field, event, eOpts) {
		var me = this;
		if (event.getKey() === event.ENTER) {
			me.login();
		} else if (event.getKey() === event.CAPS_LOCK) {
			me.createCapsLockTip();
			if (!me.capslocktooltip.isVisible()) {
				me.capslocktooltip.showBy(field, 'bl', [70, 5]);
			} else {
				me.capslocktooltip.hide();
			}
		}
	},

	onPasswordKeyPress: function(field, event, eOpts) {
		var charCode = event.getCharCode(),
			me = this;
		if ((event.shiftKey && charCode >= 97 && charCode <= 122) ||
			(!event.shiftKey && charCode >= 65 && charCode <= 90)) {
			me.createCapsLockTip();
			if (!me.capslocktooltip.isVisible()) {
				me.capslocktooltip.showBy(field, 'bl', [70, 5]);
			}
		} else {
			if (me.capslocktooltip !== undefined && me.capslocktooltip.isVisible()) {
				me.capslocktooltip.hide();
			}
		}
	},

	createCapsLockTip: function() {
		var me = this;
		if (me.capslocktooltip === undefined) {
			me.capslocktooltip = Ext.create('Ext.tip.Tip', {
				alwaysOnTop: true,
				width: 130,
				html: '<div class="fa fa-exclamation-triangle"> ' + locale.capslocktooltip + '</div>'
			});
		}
	}
});
