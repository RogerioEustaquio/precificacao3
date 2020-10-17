Ext.define('App.view.dsh-pvd.Main', {
    extend: 'Ext.container.Container',
    xtype: 'dshpvdmain',
    itemId: 'dshpvdmain',
    requires: [
        'App.view.dsh-pvd.Toolbar',
        'App.view.dsh-pvd.TreeGrid',
        'App.view.dsh-pvd.PanelFilter'
    ],
    
    title: 'Dashboard Performance Venda Dia',
    layout: 'border',

    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            items: [
                {
                    xtype : 'toolbarpvd'
                },
                {
                    xtype: 'panelfilter'
                },
                {
                    xtype: 'panel',
                    region: 'center',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'treegrid'
                        }
                    ]
                }
            ]

        });

        me.callParent(arguments);
    }
    
});
