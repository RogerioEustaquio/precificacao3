Ext.define('App.view.rpe.GridMarca', {
    extend: 'Ext.panel.Panel',
    xtype: 'gridmarca',
    itemId: 'gridmarca',
    // margin: '10 2 2 2',
    layout:'fit',
    // params: [],
    requires: [
    ],

    tbar:[
        {
            xtype: 'datefield',
            name: 'data',
            itemId: 'data',
            // labelAlign: 'top',
            fieldLabel: 'Referência',
            // margin: '1 1 1 1',
            // padding: 1,
            width: 180,
            labelWidth: 62,
            format: 'm/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____'
        },
        {
            xtype: 'button',
            iconCls: 'fa fa-search',
            margin: '0 0 0 2',
            tooltip: 'Consultar',
            handler: function(form) {
                var data = this.up('toolbar').down('#data').getRawValue();

                var params = {
                    data : data
                };

                var gridStore = this.up('panel').down('grid').getStore();

                gridStore.getProxy().setExtraParams(params);
                gridStore.load();

            }
        }
    ],

    constructor: function() {
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        Ext.define('App.view.rpe.modelgrid', {
            extend: 'Ext.data.Model',
            fields:[{name:'marca', type: 'string'},
                    {name:'diasUteisM0', type: 'number'},
                    {name:'diasUteisM1', type: 'number'},
                    {name:'diasUteis_3m', type: 'number'},
                    {name:'diasUteis_6m', type: 'number'},
                    {name:'diasUteis_12m', type: 'number'},
                    {name:'rolDiaM0', type: 'number'},
                    {name:'rolDiaM01', type: 'number'},
                    {name:'rolDia_3m', type: 'number'},
                    {name:'rolDia_6m', type: 'number'},
                    {name:'rolDia_12m', type: 'number'},
                    {name:'rolDiaM0X_1m', type: 'number'},
                    {name:'rolDiaM0X_3m', type: 'number'},
                    {name:'rolDiaM0X_6m', type: 'number'},
                    {name:'rolDiaM0X_12m', type: 'number'},
                    {name: 'estoqueValor', type: 'number'}
                    ]
        });

        Ext.applyIf(this, {

            items: [
                {
                    xtype: Ext.create('Ext.grid.Panel',{

                        store: Ext.create('Ext.data.Store', {
                            model: 'App.view.rpe.modelgrid',
                            proxy: {
                                type: 'ajax',
                                method:'POST',
                                url : BASEURL + '/api/rpe/listaritensmarcas',
                                encode: true,
                                timeout: 240000,
                                format: 'json',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'data'
                                }
                            },
                            autoLoad: true,
                            grouper: {
                                property: 'grupo'
                            }
                        }),
                        
                        listeners: {
                        },

                        columns: [
                            {
                                text: 'Marca',
                                dataIndex: 'marca',
                                minWidth: 180,
                                flex: 1
                            },
                            {
                                text: 'Dias Uteis',
                                hidden: true,
                                columns: [
                                    {
                                        text: 'Atual',
                                        dataIndex: 'diasUteisM0',
                                        width: 80,
                                        align: 'right',
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        },
                                    },
                                    {
                                        text: '1M',
                                        dataIndex: 'diasUteisM1',
                                        width: 80,
                                        align: 'right',
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        }
                                    },
                                    {
                                        text: '3M',
                                        dataIndex: 'diasUteis_3m',
                                        width: 80,
                                        align: 'right',
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        },
                                    },
                                    {
                                        text: '6M',
                                        dataIndex: 'diasUteis_6m',
                                        width: 80,
                                        align: 'right',
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        }
                                    },
                                    {
                                        text: '12M',
                                        dataIndex: 'diasUteis_12m',
                                        width: 80,
                                        align: 'right',
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        },
                                    }
                                ]
                            },
                            {
                                text: 'ROL Dia',
                                columns: [
                                    {
                                        text: 'Atual',
                                        dataIndex: 'rolDiaM0',
                                        width: 90,
                                        align: 'right',
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        },
                                    },
                                    {
                                        text: '1M',
                                        dataIndex: 'rolDiaM1',
                                        width: 90,
                                        align: 'right',
                                        hidden: true,
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        },
                                    },
                                    {
                                        text: '3M',
                                        dataIndex: 'rolDia_3m',
                                        width: 90,
                                        align: 'right',
                                        hidden: true,
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        },
                                    },
                                    {
                                        text: '6M',
                                        dataIndex: 'rolDia_6m',
                                        width: 90,
                                        align: 'right',
                                        hidden: true,
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        },
                                    },
                                    {
                                        text: '12M',
                                        dataIndex: 'rolDia_12m',
                                        width: 90,
                                        align: 'right',
                                        hidden: true,
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        },
                                    },
                                    {
                                        text: 'Atual X 1M',
                                        dataIndex: 'rolDiaM0X_1m',
                                        width: 100,
                                        align: 'right',
                                        renderer: function (v, metaData, record) {

                                            if (v > 0)
                                                metaData.style = 'color: #73b51e;';
                                                // metaData.tdCls = 'x-grid-cell-green-border';
            
                                            if (v < 0)
                                                metaData.style = 'color: #cf4c35;';

                                            return utilFormat.Value(v);
                                        }
                                    },
                                    {
                                        text: 'Atual X 3M',
                                        dataIndex: 'rolDiaM0X_3m',
                                        width: 100,
                                        align: 'right',
                                        renderer: function (v, metaData, record) {

                                            if (v > 0)
                                                metaData.style = 'color: #73b51e;';
                                                // metaData.tdCls = 'x-grid-cell-green-border';
            
                                            if (v < 0)
                                                metaData.style = 'color: #cf4c35;';

                                            return utilFormat.Value(v);
                                        }
                                    },
                                    {
                                        text: 'Atual X 6M',
                                        dataIndex: 'rolDiaM0X_6m',
                                        width: 100,
                                        align: 'right',
                                        renderer: function (v, metaData, record) {

                                            if (v > 0)
                                                metaData.style = 'color: #73b51e;';
                                                // metaData.tdCls = 'x-grid-cell-green-border';
            
                                            if (v < 0)
                                                metaData.style = 'color: #cf4c35;';

                                            return utilFormat.Value(v);
                                        }
                                    },
                                    {
                                        text: 'Atual X 12M',
                                        dataIndex: 'rolDiaM0X_12m',
                                        width: 110,
                                        align: 'right',
                                        renderer: function (v, metaData, record) {

                                            if (v > 0)
                                                metaData.style = 'color: #73b51e;';
                                                // metaData.tdCls = 'x-grid-cell-green-border';
            
                                            if (v < 0)
                                                metaData.style = 'color: #cf4c35;';

                                            return utilFormat.Value(v);
                                        }
                                    }
                                ]
                            },
                            {
                                text: 'Estoque Valor',
                                dataIndex: 'estoqueValor',
                                width: 120,
                                align: 'right',
                                renderer: function (v) {
                                    return utilFormat.ValueZero(v);
                                }
                            }
                        ]
                    })
                }
            ]
        });

        this.callParent(arguments);
    }
});
