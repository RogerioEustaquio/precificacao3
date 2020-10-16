Ext.define('App.view.dsh-pvd.Main', {
    extend: 'Ext.container.Container',
    xtype: 'dshpvdmain',
    itemId: 'dshpvdmain',
    requires: [
        'App.view.dsh-pvd.Toolbar',
        'App.view.dsh-pvd.TreeGrid'
    ],
    
    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            title: 'Dashboard Performance Venda Dia',
            layout: 'border',
            items: [
                {
                    xtype : 'toolbarpvd'
                },
                {
                    xtype: 'tabpanel',
                    width: 220,
                    region: 'west',
                    items:[
                        {
                            xtype: 'container',
                            title: 'filtro2',
                            html: 'texto'
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    region: 'center',
                    title: 'teste',
                    // items: [
                    //     {
                    //         xtype: 'treegrid'
                    //     }
                    // ]
                }
            ]

        });

        me.callParent(arguments);
    }
    
});
