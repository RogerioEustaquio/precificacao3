Ext.define('App.view.rpe.TabMarca', {
    extend: 'Ext.panel.Panel',
    xtype: 'tabmarca',
    itemId: 'tabmarca',
    closable: true,
    requires: [
        // 'App.view.rpe.TabLoja',
    ],
    title: 'Marca',
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
            title: 'Panel Grid 1'
        },
        {
            xtype: 'panel',
            title: 'Panel Grid 2'
        }
    ]
})
