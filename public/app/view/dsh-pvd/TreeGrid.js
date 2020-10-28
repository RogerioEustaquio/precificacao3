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
                                      { name: 'rol_1m', type: 'number'},
                                      { name: 'rol_1a', type: 'number'},
                                      { name: 'rolM12', type: 'number'},
                                      { name: 'rolM6', type: 'number'},
                                      { name: 'rol_x_1m', type: 'number'},
                                      { name: 'rol_x_1a', type: 'number'},
                                      { name: 'rol_x_m6', type: 'number'},
                                      { name: 'rol_x_m12', type: 'number'},
                                      { name: 'lb', type: 'number'},
                                      { name: 'lb_1m', type: 'number'},
                                      { name: 'lb_1a', type: 'number'},
                                      { name: 'lbM6', type: 'number'},
                                      { name: 'lbM12', type: 'number'},
                                      { name: 'lb_x_1m', type: 'number'},
                                      { name: 'lb_x_1a', type: 'number'},
                                      { name: 'lb_x_m6', type: 'number'},
                                      { name: 'lb_x_m12', type: 'number'},
                                      { name: 'qtde', type: 'number'},
                                      { name: 'pDesconto', type: 'number'},
                                      { name: 'pDesconto_1m', type: 'number'},
                                      { name: 'pDesconto_1a', type: 'number'},
                                      { name: 'pDescontoM6', type: 'number'},
                                      { name: 'pDescontoM12', type: 'number'},
                                      { name: 'pDesconto_x_1m', type: 'number'},
                                      { name: 'pDesconto_x_1a', type: 'number'},
                                      { name: 'pDesconto_x_m6', type: 'number'},
                                      { name: 'pDesconto_x_m12', type: 'number'},
                                      { name: 'mb', type: 'number'},
                                      { name: 'mb_1m', type: 'number'},
                                      { name: 'mb_1a', type: 'number'},
                                      { name: 'mbM6', type: 'number'},
                                      { name: 'mbM12', type: 'number'},
                                      { name: 'mb_x_1m', type: 'number'},
                                      { name: 'mb_x_1a', type: 'number'},
                                      { name: 'mb_x_m6', type: 'number'},
                                      { name: 'mb_x_m12', type: 'number'},
                                      { name: 'pvm', type: 'number'},
                                      { name: 'pvm_1m', type: 'number'},
                                      { name: 'pvm_1a', type: 'number'},
                                      { name: 'pvmM6', type: 'number'},
                                      { name: 'pvmM12', type: 'number'},
                                      { name: 'pvm_x_1m', type: 'number'},
                                      { name: 'pvm_x_1a', type: 'number'},
                                      { name: 'pvm_x_m6', type: 'number'},
                                      { name: 'pvm_x_m12', type: 'number'},
                                      { name: 'pcm', type: 'number'},
                                      { name: 'pcm_1m', type: 'number'},
                                      { name: 'pcm_1a', type: 'number'},
                                      { name: 'pcm_x_1m', type: 'number'},
                                      { name: 'pcm_x_1a', type: 'number'},
                                      { name: 'pcmM6', type: 'number'},
                                      { name: 'pcmM12', type: 'number'},
                                      { name: 'pcm_x_m6', type: 'number'},
                                      { name: 'pcm_x_m12', type: 'number'}
                                    ]
                        });

        var mystore = Ext.create('Ext.data.TreeStore', {
            model: myModel,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: BASEURL + '/api/dshpvd/listartreepvd',
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
                    minWidth: 120,
                    sortable: true                    
                },
                {
                    text: 'ROL',
                    columns: [
                        {
                            text: 'Atual',
                            dataIndex: 'rol',
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '1M',
                            dataIndex: 'rol_1m',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '1A',
                            dataIndex: 'rol_1a',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'M6',
                            dataIndex: 'rolM6',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'M12',
                            dataIndex: 'rolM12',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '% 1M',
                            dataIndex: 'rol_x_1m',
                            width: 80,
                            align: 'right',
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
                            width: 80,
                            align: 'right',
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
                            width: 80,
                            align: 'right',
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
                            width: 80,
                            align: 'right',
                            renderer: function (value, metaData, record) {

                                if (value > 0)
                                    metaData.tdCls = 'x-grid-cell-green-border';
                                if (value < 0)
                                    metaData.tdCls = 'x-grid-cell-red-border';
    
                                return utilFormat.Value(value);
                            }
                        }
                    ]
                },
                {
                    text: 'LB',
                    columns: [
                        {
                            text: 'Atual',
                            dataIndex: 'lb',
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '1M',
                            dataIndex: 'lb_1m',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '1A',
                            dataIndex: 'lb_1a',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'M6',
                            dataIndex: 'lbM6',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'M12',
                            dataIndex: 'lbM12',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '% 1M',
                            dataIndex: 'lb_x_1m',
                            width: 80,
                            align: 'right',
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
                            dataIndex: 'lb_x_1a',
                            width: 80,
                            align: 'right',
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
                            dataIndex: 'lb_x_m6',
                            width: 80,
                            align: 'right',
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
                            dataIndex: 'lb_x_m12',
                            width: 80,
                            align: 'right',
                            renderer: function (value, metaData, record) {

                                if (value > 0)
                                    metaData.tdCls = 'x-grid-cell-green-border';
                                if (value < 0)
                                    metaData.tdCls = 'x-grid-cell-red-border';
    
                                return utilFormat.Value(value);
                            }
                        }
                    ]
                },
                {
                    text: 'Desconto',
                    columns: [
                        {
                            text: 'Atual',
                            dataIndex: 'pDesconto',
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '1M',
                            dataIndex: 'pDesconto_1m',
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '1A',
                            dataIndex: 'pDesconto_1a',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'M6',
                            dataIndex: 'pDescontoM6',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'M12',
                            dataIndex: 'pDescontoM12',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '% 1M',
                            dataIndex: 'pDesconto_x_1m',
                            width: 80,
                            align: 'right',
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
                            dataIndex: 'pDesconto_x_1a',
                            width: 80,
                            align: 'right',
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
                            dataIndex: 'pDesconto_x_m6',
                            width: 80,
                            align: 'right',
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
                            dataIndex: 'pDesconto_x_m12',
                            width: 80,
                            align: 'right',
                            renderer: function (value, metaData, record) {

                                if (value > 0)
                                    metaData.tdCls = 'x-grid-cell-green-border';
                                if (value < 0)
                                    metaData.tdCls = 'x-grid-cell-red-border';
    
                                return utilFormat.Value(value);
                            }
                        }
                    ]
                },
                {
                    text: 'MB',
                    columns: [
                        {
                            text: 'Atual',
                            dataIndex: 'mb',
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '1M',
                            dataIndex: 'mb_1m',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '1A',
                            dataIndex: 'mb_1a',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'M6',
                            dataIndex: 'mbM6',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'M12',
                            dataIndex: 'mbM12',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '% 1M',
                            dataIndex: 'mb_x_1m',
                            width: 80,
                            align: 'right',
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
                            dataIndex: 'mb_x_1a',
                            width: 80,
                            align: 'right',
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
                            dataIndex: 'mb_x_m6',
                            width: 80,
                            align: 'right',
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
                            dataIndex: 'mb_x_m12',
                            width: 80,
                            align: 'right',
                            renderer: function (value, metaData, record) {

                                if (value > 0)
                                    metaData.tdCls = 'x-grid-cell-green-border';
                                if (value < 0)
                                    metaData.tdCls = 'x-grid-cell-red-border';
    
                                return utilFormat.Value(value);
                            }
                        }
                    ]
                },
                {
                    text: 'PVM',
                    columns: [
                        {
                            text: 'Atual',
                            dataIndex: 'pvm',
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '1M',
                            dataIndex: 'pvm_1m',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '1A',
                            dataIndex: 'pvm_1a',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'M6',
                            dataIndex: 'pvmM6',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'M12',
                            dataIndex: 'pvmM12',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '% 1M',
                            dataIndex: 'pvm_x_1m',
                            width: 80,
                            align: 'right',
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
                            dataIndex: 'pvm_x_1a',
                            width: 80,
                            align: 'right',
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
                            dataIndex: 'pvm_x_m6',
                            width: 80,
                            align: 'right',
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
                            dataIndex: 'pvm_x_m12',
                            width: 80,
                            align: 'right',
                            renderer: function (value, metaData, record) {

                                if (value > 0)
                                    metaData.tdCls = 'x-grid-cell-green-border';
                                if (value < 0)
                                    metaData.tdCls = 'x-grid-cell-red-border';
    
                                return utilFormat.Value(value);
                            }
                        }
                    ]
                },
                {
                    text: 'PCM',
                    columns: [
                        {
                            text: 'Atual',
                            dataIndex: 'pcm',
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '1M',
                            dataIndex: 'pcm_1m',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '1A',
                            dataIndex: 'pcm_1a',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'M6',
                            dataIndex: 'pcmM6',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'M12',
                            dataIndex: 'pcmM12',
                            hidden: false,
                            width: 100,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: '% 1M',
                            dataIndex: 'pcm_x_1m',
                            width: 80,
                            align: 'right',
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
                            dataIndex: 'pcm_x_1a',
                            width: 80,
                            align: 'right',
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
                            dataIndex: 'pcm_x_m6',
                            width: 80,
                            align: 'right',
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
                            dataIndex: 'pcm_x_m12',
                            width: 80,
                            align: 'right',
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