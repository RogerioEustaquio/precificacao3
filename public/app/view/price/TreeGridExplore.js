Ext.define('App.view.price.TreeGridExplore',{
    extend: 'Ext.tree.Panel',
    xtype: 'treegridexplore',
    itemId: 'treegridexplore',
    rootVisible: false,

    constructor: function() {
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        var myModel = Ext.create('Ext.data.TreeModel', {
                            fields: [ { name: 'grupo', type: 'string'},
                                      { name: 'rol', type: 'number'},
                                      { name: 'precoMedio', type: 'number'},
                                      { name: 'mb', type: 'number'},
                                      { name: 'rob', type: 'number'},
                                      { name: 'qtde', type: 'number'},
                                      { name: 'cmv', type: 'number'},
                                      { name: 'lb', type: 'number'}
                                    ]
                        });

        var mystore = Ext.create('Ext.data.TreeStore', {
            model: myModel,
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: BASEURL + '/api/price/listartreepvd',
                encode: true,
                timeout: 240000,
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
                    minWidth: 228,
                    sortable: true
                },
                {
                    text: 'Preço Medio',
                    dataIndex: 'precoMedio',
                    // hidden: true,
                    width: 120,
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
                },
                {
                    text: 'MB',
                    dataIndex: 'mb',
                    // hidden: true,
                    width: 70,
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
                },
                {
                    text: 'Quantidade',
                    dataIndex: 'qtde',
                    // hidden: true,
                    width: 110,
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value2(v,0);
                    }
                },
                {
                    text: 'ROL',
                    dataIndex: 'rol',
                    width: 98,
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value2(v,0);
                    }
                },
                {
                    text: 'CMV',
                    dataIndex: 'cmv',
                    // hidden: true,
                    width: 98,
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value2(v,0);
                    }
                },
                {
                    text: 'LB',
                    dataIndex: 'lb',
                    width: 98,
                    align: 'right',
                    renderer: function (value, metaData, record) {

                        // if (value > 0)
                        //     metaData.tdCls = 'x-grid-cell-green-border';
                        // if (value < 0)
                        //     metaData.tdCls = 'x-grid-cell-red-border';

                        return utilFormat.Value2(value,0);
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