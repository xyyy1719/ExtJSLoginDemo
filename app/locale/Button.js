Ext.define('LoginDemo.locale.Button', {
	extend: 'Ext.button.Split',
	xtype: 'locale-btn',
	requires: [
		'LoginDemo.locale.Controller'
	],
	controller: 'locale-btn',
	menu: {
		xtype: 'menu',
		defaults: {
            xtype: 'menuitem',
            handler: 'onMenuItemClick'
		},
		items: [
			{
				iconCls: 'en_US',
				text: 'English'
			},
			{
				iconCls: 'zh_CN',
				text: '中文'
			}
		]
	}
});
