Ext.define('LoginDemo.login.Window', {
    extend: 'Ext.window.Window',
    requires: [
		'LoginDemo.login.Controller',
        'LoginDemo.locale.Button'
	],
    xtype: 'login-win',
    controller: 'login-win',
    autoShow: true,
    height: 200,
    width: 360,
    layout: {
        type: 'fit'
    },
    iconCls: 'fa fa-key fa-lg',
    title: locale.login,
    closeAction: 'hide',
    closable: false,
    draggable: false,
    resizable: false,
    items: [
        {
            xtype: 'form',
            reference: 'form',
            bodyPadding: 15,
            defaults: {
                xtype: 'textfield',
                anchor: '100%',
                labelWidth: 70,
                allowBlank: false,
                msgTarget: 'side'
            },
            items: [
                {
                    name: 'userName',
                    fieldLabel: locale.userName,
                    minLength: 3,
                    maxLength: 25,
                    vtype: 'alphanum',
                    listeners: {
						specialKey: 'onUserNameEnterPress'
					}
                },
                {
                    inputType: 'password',
                    name: 'password',
                    fieldLabel: locale.password,
                    vtype: 'customPass',
                    enableKeyEvents: true,
					listeners: {
						specialKey: 'onPasswordEnterOrCapsLockPress',
						keypress: 'onPasswordKeyPress'
					}
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {
                            xtype: 'locale-btn'
                        },
                        '->',
						{
                            xtype: 'button',
                            iconCls: 'fa fa-sign-in fa-lg',
                            text: locale.submit,
                            formBind: true,
                            handler: 'onSubmitButtonClick'
                        }
                    ]
                }
            ]
        }
    ]
});

Ext.apply(Ext.form.field.VTypes, {
    customPass: function(val, field) {
        return /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/.test(val);
    },
    customPassText: locale.customPassText
});
