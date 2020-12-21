Ext.define('App.view.dolar.Main', {
    extend: 'Ext.container.Container',
    xtype: 'dolarmain',
    itemId: 'dolarmain',
    name: 'dolarmain',
    requires: [
        'App.view.dolar.ContainerHighCharts'
    ],
    
    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            title: 'Dolar',
            layout: 'fit',
            items: [
                {
                    xtype: 'dolarchart'
                }
            ]
        });

        me.callParent(arguments);
    }
    
});
