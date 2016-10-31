Ext.define('LoginDemo.locale.Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.locale-btn',

    init: function() {
		var lang = localStorage ? (localStorage.getItem('user-lang') || 'en_US') : 'en_US',
			button = this.getView();
		button.setIconCls(lang);
		if(lang == 'en_US') {
			button.setText('English');
		} else if (lang == 'zh_CN') {
			button.setText('中文');
		}
	},

	onMenuItemClick: function(item, event) {
        var button = this.getView();
		button.setIconCls(item.iconCls);
		button.setText(item.text);
		localStorage.setItem('user-lang', item.iconCls);
		window.location.reload();
	}
});
