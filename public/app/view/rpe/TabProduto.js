Ext.define('App.view.rpe.TabProduto', {
    extend: 'Ext.panel.Panel',
    xtype: 'tabproduto',
    itemId: 'tabproduto',
    closable: true,
    requires: [
        // 'App.view.rpe.LojaGrid',
    ],
    title: 'Produto',
    layout: 'card',
    tbar: [
        {
            xtype: 'button',
            text: 'Orverview',
            handler: function(){
                this.up('panel').setActiveItem(0);
            }
        },
        {
            xtype: 'button',
            text: 'Performance',
            handler: function(){
                this.up('panel').setActiveItem(1);
            }
        }
    ],
    items:[
        {
            xtype: 'panel',
            title: 'Panel Grid Overview'
        },
        {
            xtype: 'panel',
            title: 'Panel Grid Performance'
        }
    ]
})
