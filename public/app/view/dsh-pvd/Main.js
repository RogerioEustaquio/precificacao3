Ext.define('App.view.dsh-pvd.Main', {
    extend: 'Ext.container.Container',
    xtype: 'dshpvdmain',
    itemId: 'dshpvdmain',
    requires: [],
    
    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            title: 'Dashboard Performance Venda Dia',
            layout: 'fit',
            items: [
                {
                    xtype: 'panel',
                    title: 'TreeGrid'
                }
            ]
        });

        me.callParent(arguments);
    }
    
});
