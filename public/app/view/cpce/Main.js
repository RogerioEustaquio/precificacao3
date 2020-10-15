Ext.define('App.view.cpce.Main', {
    extend: 'Ext.container.Container',
    xtype: 'cpcemain',
    id: 'cpcemain',
    itemId: 'cpcemain',
    requires: [
    ],
    title: 'Comparativo Custo Operação',
    layout: 'border',

    constructor: function() {
        var me = this;
        
        Ext.applyIf(me, {
            style: {
                background:'#ffffff !important'
            },
            items: [
                { 
                    xtype: 'CpCeToolbar',
                    region: 'north',
                },
                {
                    xtype: 'container',
                    id: 'container1',
                    idItem: 'container1',
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
                            id: 'pprincipal',
                            idItem: 'pprincipal',
                            layout: 'hbox',
                            width: '100%',
                            defaults:{
                                border: false,
                                margin: '1 1 1 1',
                                height : '100%',
                            },
                            items:[
                                {
                                    xtype: 'filtroPanel',
                                    hidden: true
                                },
                                {
                                    xtype:'panel',
                                    id: 'itemgridpanel',
                                    idItem: 'itemgridpanel',
                                    layout: 'fit',
                                    flex: 1,
                                    items: [
                                        {
                                            xtype: 'ItemGrid'
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
