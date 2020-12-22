Ext.define('App.view.fii.ContainerGrid', {
    extend: 'Ext.container.Container',
    xtype: 'containergrid',
    itemId: 'containergrid',
    // margin: '10 2 2 2',
    layout:'fit',
    // params: [],
    requires: [
        'Ext.grid.feature.GroupingSummary'
    ],

    constructor: function() {
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        var meses =
            [null,
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro'];

        /////Ajax ///////////////////////////
        var seqMes = [];
        Ext.Ajax.request({
            url: BASEURL +'/api/fii/listarfichaitemheader',
            method: 'POST',
            params: me.params,
            async: false,
            success: function (response) {
                var result = Ext.decode(response.responseText);
                if(result.success){

                    var rsarray = result.data;
                    rsarray.forEach(function(record){
                        seqMes.push(meses[parseFloat(record.id)]);
                    });

                    return seqMes;

                }
            }
        });
        // console.log(seqMes);
        /////////////////////////////////////

        Ext.define('App.view.fii.modelgrid', {
            extend: 'Ext.data.Model',
            fields:[{name:'indicador', type: 'string'},
                    {name:'valorM11', type: 'number'},
                    {name:'valorM10', type: 'number'},
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

            items: [
                {
                    xtype: Ext.create('Ext.grid.Panel',{

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
                        
                        features: [
                            // {
                            //     groupHeaderTpl: '{name}',
                            //     ftype: 'groupingsummary',
                            //     hideGroupedHeader: false,
                            //     enableGroupingMenu: false,
                            //     startCollapsed: false
                            // },
                            // {
                            //     ftype: 'summary',
                            //     dock: 'bottom'
                            // }
                        ],
                        listeners: {
                        },

                        columns: [
                            {
                                text: 'Indicador',
                                dataIndex: 'indicador',
                                width: 140
                            },
                            {
                                text: seqMes[0],
                                texto: 'M11',
                                dataIndex: 'valorM11',
                                width: 110,
                                summaryType: 'sum',
                                align: 'right',
                                renderer: function (v,record,index) {
                                    return utilFormat.Value2(v,index.data.vDecimos);
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
                                text: seqMes[1],
                                texto: 'M10',
                                dataIndex: 'valorM10',
                                width: 110,
                                summaryType: 'sum',
                                align: 'right',
                                renderer: function (v,record,index) {
                                    return utilFormat.Value2(v,index.data.vDecimos);
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
                                text: seqMes[2],
                                texto: 'M9',
                                dataIndex: 'valorM9',
                                width: 110,
                                summaryType: 'sum',
                                align: 'right',
                                renderer: function (v,record,index) {
                                    return utilFormat.Value2(v,index.data.vDecimos);
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
                                text: seqMes[3],
                                texto: 'M8',
                                dataIndex: 'valorM8',            
                                width: 110,
                                summaryType: 'sum',
                                align: 'right',
                                renderer: function (v,record,index) {
                                    return utilFormat.Value2(v,index.data.vDecimos);
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
                                text: seqMes[4],
                                texto: 'M7',
                                dataIndex: 'valorM7',            
                                width: 110,
                                summaryType: 'sum',
                                align: 'right',
                                renderer: function (v,record,index) {
                                    return utilFormat.Value2(v,index.data.vDecimos);
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
                                text: seqMes[5],
                                texto: 'M6',
                                dataIndex: 'valorM6',            
                                width: 110,
                                summaryType: 'sum',
                                align: 'right',
                                renderer: function (v,record,index) {
                                    return utilFormat.Value2(v,index.data.vDecimos);
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
                                text: seqMes[6],
                                texto: 'M5',
                                dataIndex: 'valorM5',            
                                width: 110,
                                summaryType: 'sum',
                                align: 'right',
                                renderer: function (v,record,index) {
                                    return utilFormat.Value2(v,index.data.vDecimos);
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
                                text: seqMes[7],
                                texto: 'M4',
                                dataIndex: 'valorM4',            
                                width: 110,
                                summaryType: 'sum',
                                align: 'right',
                                renderer: function (v,record,index) {
                                    return utilFormat.Value2(v,index.data.vDecimos);
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
                                text: seqMes[8],
                                texto: 'M3',
                                dataIndex: 'valorM3',            
                                width: 110,
                                summaryType: 'sum',
                                align: 'right',
                                renderer: function (v,record,index) {
                                    return utilFormat.Value2(v,index.data.vDecimos);
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
                            },
                            {
                                text: seqMes[9],
                                texto: 'M2',
                                dataIndex: 'valorM2',            
                                width: 110,
                                summaryType: 'sum',
                                align: 'right',
                                renderer: function (v,record,index) {
                                    return utilFormat.Value2(v,index.data.vDecimos);
                                },
                                summaryType: function(records) {
            
                                    var i = 0,
                                        length = records.length,
                                        totalOpe = 0;
            
                                    for (; i < length; ++i) {
                                        record = records[i];
                                        totalOpe += parseFloat(record.get('valorM2'));
                                    }
                                    return utilFormat.Value(totalOpe);
                                }
                            },
                            {
                                text: seqMes[10],
                                texto: 'M1',
                                dataIndex: 'valorM1',            
                                width: 110,
                                summaryType: 'sum',
                                align: 'right',
                                renderer: function (v,record,index) {
                                    return utilFormat.Value2(v,index.data.vDecimos);
                                },
                                summaryType: function(records) {
            
                                    var i = 0,
                                        length = records.length,
                                        totalOpe = 0;
            
                                    for (; i < length; ++i) {
                                        record = records[i];
                                        totalOpe += parseFloat(record.get('valorM1'));
                                    }
                                    return utilFormat.Value(totalOpe);
                                }
                            },
                            {
                                text: seqMes[11],
                                texto: 'M0',
                                dataIndex: 'valorM0',            
                                width: 110,
                                summaryType: 'sum',
                                align: 'right',
                                renderer: function (v,record,index) {
                                    return utilFormat.Value2(v,index.data.vDecimos);
                                },
                                summaryType: function(records) {
            
                                    var i = 0,
                                        length = records.length,
                                        totalOpe = 0;
            
                                    for (; i < length; ++i) {
                                        record = records[i];
                                        totalOpe += parseFloat(record.get('valorM0'));
                                    }
                                    return utilFormat.Value(totalOpe);
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
