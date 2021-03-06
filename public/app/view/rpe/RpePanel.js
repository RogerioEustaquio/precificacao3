Ext.define('App.view.rpe.RpePanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'rpepanel',
    itemId: 'rpepanel',
    height: Ext.getBody().getHeight() * 0.9,
    width: Ext.getBody().getWidth() * 0.9,
    requires: [
        'App.view.rpe.TabMarca',
        'App.view.rpe.TabFilial',
        'App.view.rpe.TabCliente',
        'App.view.rpe.TabProduto',
        'App.view.rpe.TabCexplore'
    ],
    
    title: 'Rastreador de Performance',
    border: false,
    layout: 'border',
    // tbar:[
    //     {
    //         xtype: 'button',
    //         text: 'RPE',
    //         menu: [
    //             // {
    //             //     text: 'Loja',
    //             //     handler: function(){
    //             //         this.up('button').up('panel').ontabs('tabloja');
    //             //     }
    //             // },
    //             {
    //                 text: 'Marca',
    //                 handler: function(){
    //                     this.up('button').up('panel').ontabs('tabmarca');
    //                 }
    //             },
    //             // {
    //             //     text: 'Produto',
    //             //     handler: function(){
    //             //         this.up('button').up('panel').ontabs('tabproduto');
    //             //     }
    //             // }
    //         ]
    //     }
    // ],

    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {

            items: [
                {
                    xtype:'tabpanel',
                    region: 'center',
                    items:[
                        {
                            xtype: 'tabmarca'
                        },
                        {
                            xtype: 'tabfilial'
                        },
                        {
                            xtype: 'tabcliente'
                        },
                        {
                            xtype: 'tabproduto'
                        },
                        {
                            xtype: 'tabcexplore'
                        }
                    ]
                   
                }

            ]

        });

        me.callParent(arguments);
    },

    ontabs: function(tab){

        var me = this;
        var tabSelec = me.down('#'+tab);

        if(tabSelec){
            me.down('tabpanel').setActiveItem(tabSelec);
        }else{

            if(tab == 'tabloja'){
                var tabAdd = Ext.create('App.view.rpe.TabLoja');
            }
            if(tab == 'tabmarca'){
                var tabAdd = Ext.create('App.view.rpe.TabMarca');
            }
            if(tab == 'tabproduto'){ 
                var tabAdd = Ext.create('App.view.rpe.TabProduto');
            }

            me.down('tabpanel').add(tabAdd);
            me.down('tabpanel').setActiveItem(tabAdd);
        }
    }
    
});
