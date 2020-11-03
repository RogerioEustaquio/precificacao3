Ext.define('App.view.dsh-pvd.NodeWindow', {
    extend: 'Ext.window.Window',
    xtype: 'nodewindow',
    itemId: 'nodewindow',
    height: 300,
    width: 800,
    title: 'Níveis de Agrupamentos',
    requires:[
        'App.view.dsh-pvd.PluginDragDropTag',
        'Ext.grid.plugin.CellEditing'
    ],
    layout: 'fit',
    constructor: function() {
        var me = this;

        var elementbx = Ext.create('Ext.form.field.Tag',{
            name: 'bxElement',
            itemId: 'bxElement',
            store: Ext.data.Store({
                fields: [{ name: 'idKey', type: 'string' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/dshpvd/listarElementos',
                    timeout: 120000,
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            width: '100%',
            queryParam: 'idKey',
            queryMode: 'local',
            displayField: 'idKey',
            valueField: 'idKey',
            emptyText: 'Ordem',
            fieldLabel: 'Agrupamentos',
            margin: '1 1 1 1',
            plugins:'dragdroptag',
            filterPickList: true,
            publishes: 'value',
            listeners: {
                // select: function(record){
                //     console.log(record.getValue());
                //     var grid = this.up('form').down('grid');

                //     // if(record.getValue()){
                //     // }

                //     console.log(grid);
                    
                // }
            }
        });
        elementbx.store.load();

        var myStore = Ext.create('Ext.data.Store', {
            model: Ext.create('Ext.data.Model', {
                    fields:[{name:'campo', type: 'string'},
                            {name:'ordem', type: 'string'},
                            ]
            }),
            proxy: {
                type: 'ajax',
                method:'POST',
                url : BASEURL + '/api/dshpvd/listarordemagrupamento',
                timeout: 240000,
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad : true
        });

        var btnConfirm = Ext.create('Ext.button.Button',{

            text: 'Confirmar',
            // handler: function(form) {
            //     console.log(elementbx.getValue());
            // }
        });


        Ext.applyIf(me, {
            
            items:[
                {
                    xtype:'panel',
                    layout: 'border',
                    items:[
                        {
                            xtype: 'form',
                            region: 'center',
                            items: [
                                elementbx,
                                {
                                    xtype: 'grid',
                                    margin: '10 0 0 0',
                                    store: myStore,
                                    columns: [
                                        {
                                            text: 'Campo',
                                            dataIndex: 'campo',
                                            width: 130,
                                            align: 'right'
                                        },
                                        {
                                            text: 'Ordem',
                                            dataIndex: 'ordem',
                                            // width: 140,
                                            flex:1,
                                            align: 'left',
                                            editor: {
                                                xtype: 'combo',
                                                typeAhead: true,
                                                triggerAction: 'all',
                                                selectOnFocus: false,
                                                store: [
                                                    ['DESC', 'Decrescente'],
                                                    ['ASC', 'Crescente']
                                                ]
                                            }
                                        }
                                    ],
                                    selModel: 'cellmodel',
                                    plugins: {
                                        ptype: 'cellediting',
                                        clicksToEdit: 1
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'toolbar',
                            region: 'south',
                            items: [
                                '->',
                                {
                                    xtype: 'form',
                                    items: [
                                        btnConfirm
                                    ]
                                }
                            ]
                        }
                    ]
                }   
            ]
        });

        me.callParent(arguments);

    }

});
