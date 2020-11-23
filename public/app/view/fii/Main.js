Ext.define('App.view.fii.Main', {
    extend: 'Ext.window.Window',
    xtype: 'fiimain',
    itemId: 'fiimain',
    height: Ext.getBody().getHeight() * 0.9,
    width: Ext.getBody().getWidth() * 0.9,
    margin: '10 1 1 1',
    maximizable: true,
    requires: [
        'App.view.fii.Toolbar',
        'App.view.fii.ContainerHighCharts',
        'App.view.fii.ContainerGrid',
        'App.view.fii.PanelFiltro'
    ],
    
    title: 'Ficha de Indicadores',
    layout: 'fit',

    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {

            items: [
                {
                    xtype: 'container',
                    layout: 'border',
                    width: '100%',
                    items:[
                        {
                            xtype: 'fiitoolbar'
                        },
                        {
                            xtype: 'panelwest'
                        },
                        {
                            xtype: 'panel',
                            itemId: 'panelcenter',
                            region: 'center',
                            layout: 'border',
                            items:[
                                {
                                    xtype: 'fiichart',
                                    region: 'north'
                                },
                                { 
                                    xtype: 'containergrid',
                                    region: 'center'
                                }
                            ]

                        }
                    ]
                }

            ]

        });

        me.callParent(arguments);
    }
    
});
