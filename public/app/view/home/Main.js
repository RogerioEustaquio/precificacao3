Ext.define('App.view.home.Main', {
    extend: 'Ext.container.Container',
    xtype: 'homemain',
    itemId: 'homemain',
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
