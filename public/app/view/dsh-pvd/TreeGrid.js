Ext.define('App.view.dsh-pvd.TreeGrid',{
    extend: 'Ext.tree.Panel',
    xtype: 'treegrid',
    itemId: 'treegrid',
    rootVisible: false,

    constructor: function() {
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        var myModel = Ext.create('Ext.data.TreeModel', {
                            fields: [ { name: 'grupo', type: 'string'},
                                      { name: 'rol', type: 'number'},
                                      { name: 'lb', type: 'number'},
                                      { name: 'pDesconto', type: 'number'},
                                      { name: 'mb', type: 'number'},
                                      { name: 'precoRobVendaMedio', type: 'number'},
                                      { name: 'precoRolVendaMedio', type: 'number'},
                                      { name: 'custoVendaMedio', type: 'number'}
                                    ]
                        });

        var mystore = Ext.create('Ext.data.TreeStore', {
            model: myModel,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: BASEURL + '/api/dshpvd/listartreepvd',
                encode: true,
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    messageProperty: 'message',
                    root: 'data'
                }
            },
            root: {
                expanded: true,
                text: "",
                // children: [],
                "data": []
            }
        });

        Ext.applyIf(me, {

            store: mystore,
            columns: [
                {
                    xtype: 'treecolumn', // this is so we know which column will show the tree
                    text: '',
                    dataIndex: 'grupo',
                    flex: 1,
                    sortable: true,
                    
                },
                {
                    text: 'ROL',
                    dataIndex: 'rol',
                    width: 100,
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
                },
                {
                    text: 'LB',
                    dataIndex: 'lb',
                    width: 100,
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
                },
                {
                    text: 'Desconto',
                    dataIndex: 'pDesconto',
                    width: 100,
                    align: 'center',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
                },
                {
                    text: 'MB',
                    dataIndex: 'mb',
                    width: 100,
                    align: 'center',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
                },
                {
                    text: 'ROB Médio',
                    dataIndex: 'precoRobVendaMedio',
                    width: 120,
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
                },
                {
                    text: 'ROL Médio',
                    dataIndex: 'precoRolVendaMedio',
                    width: 120,
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
                },
                {
                    text: 'Custo Médio',
                    dataIndex: 'custoVendaMedio',
                    width: 120,
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
                }
            ],
            listeners: {
                // click: {
                //     element: 'el', //bind to the underlying el property on the panel
                //     fn: function(e){ console.log( this.getLoader()); }
                // },
                // dblclick: {
                //     element: 'body', //bind to the underlying body property on the panel
                //     fn: function(){ console.log('dblclick body'); }
                // }
            }

        });

        me.callParent(arguments);

    }
    
});