Ext.define('App.view.cpcf.FiltroPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'filtroPanelf',
    id: 'filtroPanelf',
    idItem: 'filtroPanelf',
    width: 220,
    region: 'lest',
    layout: 'fit',
    constructor: function() {
        var me = this;

        Ext.applyIf(me, {

            items:[
                {
                    xtype: 'panel',
                    title: 'Marcas',
                    id: 'pmarcagridf',
                    idItem: 'pmarcagridf',
                    scrollable: true,
                    items: [
                        {
                            xtype: 'MarcaGridf',
                        }
                    ]
                }
            ]
            
        });

        me.callParent(arguments);
    }

});
