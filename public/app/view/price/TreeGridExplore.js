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
                                      { name: 'rol_1m', type: 'number'},
                                      { name: 'rol_1a', type: 'number'},
                                      { name: 'rolM12', type: 'number'},
                                      { name: 'rolM6', type: 'number'},
                                      { name: 'rol_x_1m', type: 'number'},
                                      { name: 'rol_x_1a', type: 'number'},
                                      { name: 'rol_x_m6', type: 'number'},
                                      { name: 'rol_x_m12', type: 'number'}
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
                    text: 'ROL',
                    columns: [
                        {
                            text: 'Atual',
                            dataIndex: 'rol',
                            width: 98,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '1M',
                            dataIndex: 'rol_1m',
                            hidden: true,
                            width: 98,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '1A',
                            dataIndex: 'rol_1a',
                            hidden: true,
                            width: 98,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'M12',
                            dataIndex: 'rolM12',
                            hidden: true,
                            width: 98,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'M6',
                            dataIndex: 'rolM6',
                            hidden: true,
                            width: 98,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '% 1M',
                            dataIndex: 'rol_x_1m',
                            width: 72,
                            align: 'center',
                            renderer: function (value, metaData, record) {

                                if (value > 0)
                                    metaData.tdCls = 'x-grid-cell-green-border';
                                if (value < 0)
                                    metaData.tdCls = 'x-grid-cell-red-border';
    
                                return utilFormat.Value(value);
                            }
                        },
                        {
                            text: '% 1A',
                            dataIndex: 'rol_x_1a',
                            width: 72,
                            align: 'center',
                            renderer: function (value, metaData, record) {

                                if (value > 0)
                                    metaData.tdCls = 'x-grid-cell-green-border';
                                if (value < 0)
                                    metaData.tdCls = 'x-grid-cell-red-border';
    
                                return utilFormat.Value(value);
                            }
                        },
                        {
                            text: '% M12',
                            dataIndex: 'rol_x_m12',
                            width: 72,
                            align: 'center',
                            renderer: function (value, metaData, record) {

                                if (value > 0)
                                    metaData.tdCls = 'x-grid-cell-green-border';
                                if (value < 0)
                                    metaData.tdCls = 'x-grid-cell-red-border';
    
                                return utilFormat.Value(value);
                            }
                        },
                        {
                            text: '% M6',
                            dataIndex: 'rol_x_m6',
                            width: 72,
                            align: 'center',
                            renderer: function (value, metaData, record) {

                                if (value > 0)
                                    metaData.tdCls = 'x-grid-cell-green-border';
                                if (value < 0)
                                    metaData.tdCls = 'x-grid-cell-red-border';
    
                                return utilFormat.Value(value);
                            }
                        }
                    ]
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