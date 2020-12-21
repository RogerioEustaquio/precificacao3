Ext.define('App.view.home.HomePanel', {
    extend: 'Ext.container.Container',
    xtype: 'homepanel',
    itemId: 'homepanel',
    requires: [
        'App.view.home.PanelIndicadores'
    ],
    
    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            title: 'Home',
            layout: 'fit',
            items: [
                {
                    xtype: 'panelindicadores'
                }
            ]
        });

        me.callParent(arguments);
    }
    
});
