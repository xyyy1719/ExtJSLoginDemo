function loadLocale() {
	var lang = localStorage ? (localStorage.getItem('user-lang') || 'en_US') : 'en_US',
		file = Ext.util.Format.format('resources/locale/{0}.js', lang);
	Ext.Loader.loadScript({
		url: file,
		onError: function() {
			alert('Error loading locale file.');
		}
	});
	var extJsFile = Ext.util.Format.format('ext/locale/locale-{0}.js', lang);
	Ext.Loader.loadScript({
		url: extJsFile
	});
}

loadLocale();

Ext.define('LoginDemo.Application', {
    extend: 'Ext.app.Application',
    name: 'LoginDemo',

    views: [
        'LoginDemo.login.Window'
    ],

    init: function() {
        var me = this;
        me.loadingScreen = Ext.getBody().mask(locale.loadingScreen, 'x-loadingscreen');
        me.loadingScreen.addCls('x-loadingscreen');
        Ext.dom.Helper.insertFirst(me.loadingScreen, {
    		cls: 'x-loadingscreen-icon'
    	});
    },

    launch: function() {
        var me = this;
        var task = new Ext.util.DelayedTask(function() {
            me.loadingScreen.fadeOut({
        		duration: 1000,
        		remove: true,
        		listeners: {
        			afteranimate: function(el, startTime, eOpts) {
                        Ext.create({
                            xtype: 'login-win'
                        });
        			}
        		}
        	});
        });
        task.delay(2000);
    }
});

Ext.application('LoginDemo.Application');
