Ext.define('App.view.cpcf.Main', {
    extend: 'Ext.container.Container',
    xtype: 'cpcfmain',
    id: 'cpcfmain',
    itemId: 'cpcfmain',
    requires: [
    ],
    title: 'Comparativo Custo Fábrica',
    layout: 'border',

    constructor: function() {
        var me = this;
        
        Ext.applyIf(me, {
            style: {
                background:'#ffffff !important'
            },
            items: [
                {
                    xtype: 'CpCfToolbar',
                    region: 'north',
                },
                {
                    xtype: 'container',
                    id: 'container1f',
                    idItem: 'container1f',
                    region: 'center',
                    layout: {
                        type: 'hbox'
                    },
                    defaults:{
                        border: false,
                        margin: '1 1 1 1',
                        height : '100%',
                    },
                    items:[
                        {
                            xtype: 'panel',
                            id: 'pprincipalf',
                            idItem: 'pprincipalf',
                            layout: 'hbox',
                            width: '100%',
                            defaults:{
                                border: false,
                                margin: '1 1 1 1',
                                height : '100%',
                            },
                            items:[
                                {
                                    xtype: 'filtroPanelf',
                                    hidden: true
                                },
                                {
                                    xtype:'panel',
                                    id: 'itemgridpanelf',
                                    idItem: 'itemgridpanelf',
                                    layout: 'fit',
                                    flex: 1,
                                    items: [
                                        {
                                            xtype: 'ItemGridf'
                                        }
                                    ]
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
