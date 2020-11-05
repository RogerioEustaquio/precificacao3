Ext.define('App.view.fii.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'fiigrid',
    itemId: 'fiigrid',
    margin: '10 2 2 2',
    layout:'fit',
    requires: [
        'Ext.grid.feature.GroupingSummary'
    ],
    constructor: function() {
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        Ext.define('App.view.fii.modelgrid', {
            extend: 'Ext.data.Model',
            fields:[{name:'tipo'},
                    {name:'idEmpresa' },
                    {name:'idItem' },
                    {name:'idCategoria'},
                    {name:'valorM14', type: 'number' },
                    {name:'valorM13', type: 'number' },
                    {name:'valorM12', type: 'number' },
                    {name:'valorM11', type: 'number' },
                    {name:'valorM10', type: 'number' },
                    {name:'valorM9', type: 'number' },
                    {name:'valorM8', type: 'number' },
                    {name:'valorM7', type: 'number' },
                    {name:'valorM6', type: 'number' },
                    {name:'valorM5', type: 'number' },
                    {name:'valorM4', type: 'number' },
                    {name:'valorM3', type: 'number' },
                    {name:'valorM2', type: 'number' },
                    {name:'valorM1', type: 'number' },
                    {name:'valorM0', type: 'number' }
                    ]
        });

        Ext.applyIf(this, {

            store: Ext.create('Ext.data.Store', {
                model: 'App.view.fii.modelgrid',
                proxy: {
                    type: 'ajax',
                    method:'POST',
                    url : BASEURL + '/api/fii/listarfichaitem',
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
            columns: [
                {
                    text: 'Emp',
                    width: 52,
                    dataIndex: 'idEmpresa',
                    summaryType: 'count'
                },
                {
                    text: 'Item ',
                    dataIndex: 'idItem',
                    width: 140
                },
                {
                    text: 'Categoria',
                    dataIndex: 'idCategoria',
                    width: 110
                },
                {
                    text: 'Dezembro',
                    dataIndex: 'valorM14',            
                    width: 110,
                    summaryType: 'sum',
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
                },
                {
                    text: 'Novembro',
                    dataIndex: 'valorM13',
                    width: 110,
                    summaryType: 'sum',
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    },
                    summaryType: function(records) {

                        var i = 0,
                            length = records.length,
                            totalOpe = 0;

                        for (; i < length; ++i) {
                            record = records[i];
                            totalOpe += parseFloat(record.get('valorM13'));
                        }
                        return utilFormat.Value(totalOpe);
                    }
                },
                {
                    text: 'Outubro',
                    dataIndex: 'valorM12',
                    width: 110,
                    summaryType: 'sum',
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    },
                    summaryType: function(records) {

                        var i = 0,
                            length = records.length,
                            totalOpe = 0;

                        for (; i < length; ++i) {
                            record = records[i];
                            totalOpe += parseFloat(record.get('valorM12'));
                        }
                        return utilFormat.Value(totalOpe);
                    }
                },
                {
                    text: 'Setembro',
                    dataIndex: 'valorM11',            
                    width: 110,
                    summaryType: 'sum',
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    },
                    summaryType: function(records) {

                        var i = 0,
                            length = records.length,
                            totalOpe = 0;

                        for (; i < length; ++i) {
                            record = records[i];
                            totalOpe += parseFloat(record.get('valorM11'));
                        }
                        return utilFormat.Value(totalOpe);
                    }
                },
                {
                    text: 'Agosto',
                    dataIndex: 'valorM10',            
                    width: 110,
                    summaryType: 'sum',
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    },
                    summaryType: function(records) {

                        var i = 0,
                            length = records.length,
                            totalOpe = 0;

                        for (; i < length; ++i) {
                            record = records[i];
                            totalOpe += parseFloat(record.get('valorM10'));
                        }
                        return utilFormat.Value(totalOpe);
                    }
                },
                {
                    text: 'Julho',
                    dataIndex: 'valorM9',            
                    width: 110,
                    summaryType: 'sum',
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    },
                    summaryType: function(records) {

                        var i = 0,
                            length = records.length,
                            totalOpe = 0;

                        for (; i < length; ++i) {
                            record = records[i];
                            totalOpe += parseFloat(record.get('valorM9'));
                        }
                        return utilFormat.Value(totalOpe);
                    }
                },
                {
                    text: 'Junho',
                    dataIndex: 'valorM8',            
                    width: 110,
                    summaryType: 'sum',
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    },
                    summaryType: function(records) {

                        var i = 0,
                            length = records.length,
                            totalOpe = 0;

                        for (; i < length; ++i) {
                            record = records[i];
                            totalOpe += parseFloat(record.get('valorM8'));
                        }
                        return utilFormat.Value(totalOpe);
                    }
                },
                {
                    text: 'Maio',
                    dataIndex: 'valorM7',            
                    width: 110,
                    summaryType: 'sum',
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    },
                    summaryType: function(records) {

                        var i = 0,
                            length = records.length,
                            totalOpe = 0;

                        for (; i < length; ++i) {
                            record = records[i];
                            totalOpe += parseFloat(record.get('valorM7'));
                        }
                        return utilFormat.Value(totalOpe);
                    }
                },
                {
                    text: 'Abril',
                    dataIndex: 'valorM6',            
                    width: 110,
                    summaryType: 'sum',
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    },
                    summaryType: function(records) {

                        var i = 0,
                            length = records.length,
                            totalOpe = 0;

                        for (; i < length; ++i) {
                            record = records[i];
                            totalOpe += parseFloat(record.get('valorM6'));
                        }
                        return utilFormat.Value(totalOpe);
                    }
                },
                {
                    text: 'Março',
                    dataIndex: 'valorM5',            
                    width: 110,
                    summaryType: 'sum',
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    },
                    summaryType: function(records) {

                        var i = 0,
                            length = records.length,
                            totalOpe = 0;

                        for (; i < length; ++i) {
                            record = records[i];
                            totalOpe += parseFloat(record.get('valorM5'));
                        }
                        return utilFormat.Value(totalOpe);
                    }
                },
                {
                    text: 'Fevereiro',
                    dataIndex: 'valorM4',            
                    width: 110,
                    summaryType: 'sum',
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    },
                    summaryType: function(records) {

                        var i = 0,
                            length = records.length,
                            totalOpe = 0;

                        for (; i < length; ++i) {
                            record = records[i];
                            totalOpe += parseFloat(record.get('valorM4'));
                        }
                        return utilFormat.Value(totalOpe);
                    }
                },
                {
                    text: 'Janeiro',
                    dataIndex: 'valorM3',            
                    width: 110,
                    summaryType: 'sum',
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    },
                    summaryType: function(records) {

                        var i = 0,
                            length = records.length,
                            totalOpe = 0;

                        for (; i < length; ++i) {
                            record = records[i];
                            totalOpe += parseFloat(record.get('valorM3'));
                        }
                        return utilFormat.Value(totalOpe);
                    }
                }
            ],
            features: [
                // {
                //     groupHeaderTpl: '{name}',
                //     ftype: 'groupingsummary',
                //     hideGroupedHeader: false,
                //     enableGroupingMenu: false,
                //     startCollapsed: false
                // },
                {
                    ftype: 'summary',
                    dock: 'bottom'
                }
            ],
            listeners: {

            }
        });

        this.callParent(arguments);
    }
});