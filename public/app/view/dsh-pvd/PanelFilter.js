Ext.define('App.view.dsh-pvd.PanelFilter',{
    extend: 'Ext.panel.Panel',
    xtype: 'panelfilter',
    itemId: 'panelfilter',
    region: 'west',
    width: 220,
    collapsible: false,
    title: 'Filtros',
    hidden: false,
    layout: 'fit',
    requires:[
        'App.view.dsh-pvd.MarcaGrid',
        'App.view.dsh-pvd.GrupoGrid'
    ],

    constructor: function() {
        var me = this;

        Ext.applyIf(me, {

            items : [
                {
                    xtype: 'panel',
                    layout: 'border',
                    // height: 600,
                    defaults:{
                        layout: 'fit'
                    },
                    items:[
                        {
                            xtype: 'panel',
                            // columnWidth: 0.3,
                            width: 68,
                            region: 'west',
                            // title: 'Painel 1',
                            // height: 600,
                            // border: true,
                            items:[
                                {
                                    xtype: 'grid',
                                    hideHeaders: true,
                                    store: Ext.create('Ext.data.Store', {
                                        // fields:[ 'name'],
                                        data: [
                                            { name: 'Marca', xtype: 'marcagrid' },
                                            { name: 'Grupo', xtype: 'grupogrid' }
                                        ]
                                    }),
                                    columns: [
                                        { 
                                            text: 'Name',
                                            dataIndex: 'name',
                                            width: 60
                                        }
                                    ],
                                    listeners :{
                                        select: function(grid,selected){
                                            
                                            me.onFilterSelectd(selected.data.xtype);
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            itemId: 'opcoesfiltros',
                            // columnWidth: 0.7,
                            region: 'center',
                            vItems: []
                        }
                    ]
                }
                
            ]
        });

        me.callParent(arguments);

    },

    onFilterSelectd: function(xtype){

        var me = this.up('panel').down('#opcoesfiltros');
        var objAtivo = me.down(xtype);

        var array = me.vItems;

        array.forEach(function(record){
            (record === xtype ? objAtivo.setHidden(false) : me.down(record).setHidden(true))
        });

        array.push(xtype);

        if(!objAtivo){
            me.add({xtype: xtype});
            me.down(xtype).getStore().load();
        }else{
            objAtivo.setHidden(false);
        }

        // 

    }
    
});