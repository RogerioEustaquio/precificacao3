Ext.define('App.view.price.PriceAnalyticsPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'priceanalyticspanel',
    itemId: 'priceanalyticspanel',
    height: Ext.getBody().getHeight() * 0.9,
    width: Ext.getBody().getWidth() * 0.9,
    requires: [
        'App.view.price.TabBalanced',
        'App.view.price.TabExplore'
    ],
    
    title: 'Price Analysis',
    border: false,
    layout: 'border',

    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {

            items: [
                {
                    xtype:'tabpanel',
                    region: 'center',
                    items:[
                        {
                            xtype: 'tabbalanced'
                        },
                        {
                            xtype: 'tabexplore'
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
