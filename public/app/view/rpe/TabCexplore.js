Ext.define('App.view.rpe.TabCexplore', {
    extend: 'Ext.panel.Panel',
    xtype: 'tabcexplore',
    itemId: 'tabcexplore',
    closable: false,
    requires: [
        'App.view.rpe.ToolbarCexplore',
        'App.view.rpe.TreeGridCexplore'
    ],
    
    title: 'Compras Explore',
    layout: 'border',

    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            items: [
                {
                    xtype : 'toolbarcexplore'
                },
                {
                    xtype: 'panel',
                    region: 'center',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'treegridcexplore'
                        }
                    ]
                }
            ]

        });

        me.callParent(arguments);
    }
    
});
