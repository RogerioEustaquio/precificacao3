Ext.define('App.view.dolar.CotacaoDolarComercialPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'cotacaodolarpomercialpanel',
    itemId: 'cotacaodolarpomercialpanel',
    name: 'cotacaodolarpomercialpanel',
    requires: [
        'App.view.dolar.ContainerHighCharts'
    ],
    title: 'Cotação Dolar Comercial',
    layout: 'fit',
    
    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'dolarchart'
                }
            ]
        });

        me.callParent(arguments);
    }
    
});
