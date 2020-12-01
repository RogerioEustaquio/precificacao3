Ext.define('App.view.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'apptoolbar',

    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'button',
                    text: 'Fii',
                    // href: BASEURL +'/#fii',
                    handler: function(){
                        var objWindow = Ext.create('App.view.fii.Main');
                        objWindow.show();
                    }
                },
                // {
                //     xtype: 'button',
                //     text: 'RPE',
                //     // href: BASEURL +'/#fii',
                //     handler: function(){
                //         var objWindow = Ext.create('App.view.rpe.Main');
                //         objWindow.show();
                //     }
                // }
            ]
        });

        me.callParent(arguments);
    }

});
