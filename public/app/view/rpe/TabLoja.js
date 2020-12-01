Ext.define('App.view.rpe.TabLoja', {
    extend: 'Ext.panel.Panel',
    xtype: 'tabloja',
    itemId: 'tabloja',
    closable: true,
    requires: [
        'App.view.rpe.GridLoja',
    ],
    title: 'Loja',
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
            xtype: 'gridloja'
        },
        {
            xtype: 'panel',
            title: 'Panel Grid 2'
        }
    ]
})
