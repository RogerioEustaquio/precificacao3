Ext.define('App.view.dolar.CotacaoDolarComercialPanel', {
    extend: 'Ext.container.Container',
    xtype: 'cotacaodolarpomercialpanel',
    itemId: 'cotacaodolarpomercialpanel',
    name: 'cotacaodolarpomercialpanel',
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
