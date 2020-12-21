Ext.define('App.view.dsh-pvd.DashboardPerformanceVendaDiaPanel', {
    extend: 'Ext.container.Container',
    xtype: 'dashboardperformancevendadiapanel',
    itemId: 'dashboardperformancevendadiapanel',
    requires: [
        'App.view.dsh-pvd.Toolbar',
        'App.view.dsh-pvd.TreeGrid'
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
