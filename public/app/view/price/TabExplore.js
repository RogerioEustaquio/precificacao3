Ext.define('App.view.price.TabExplore', {
    extend: 'Ext.panel.Panel',
    xtype: 'tabexplore',
    itemId: 'tabexplore',
    closable: false,
    requires: [
        'App.view.price.ToolbarExplore',
        'App.view.price.TreeGridExplore'
    ],
    
    title: 'Price Explore',
    layout: 'border',

    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            items: [
                {
                    xtype : 'toolbarexplore'
                },
                {
                    xtype: 'panel',
                    region: 'center',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'treegridexplore'
                        }
                    ]
                }
            ]

        });

        me.callParent(arguments);
    }
    
});
