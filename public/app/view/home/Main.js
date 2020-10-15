Ext.define('App.view.home.Main', {
    extend: 'Ext.container.Container',
    xtype: 'homemain',
    itemId: 'homemain',
    requires: [],
    
    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            title: 'Home',
            layout: 'fit',
            items: [
                {
                    xtype: 'panel',
                    title: 'Title Panel'
                }
            ]
        });

        me.callParent(arguments);
    }
    
});
