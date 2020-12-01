Ext.define('App.view.rpe.GridLoja', {
    extend: 'Ext.panel.Panel',
    xtype: 'gridloja',
    itemId: 'gridloja',
    // margin: '10 2 2 2',
    layout:'fit',
    // params: [],
    requires: [
        'Ext.grid.feature.GroupingSummary'
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
            fields:[{name:'emp', type: 'string'},
                    {name:'valor1', type: 'number'},
                    {name:'valor2', type: 'number'}
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
                                url : BASEURL + '/api/rpe/listaritensloja',
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
                                text: 'emp',
                                dataIndex: 'emp',
                                width: 140
                            },
                            {
                                text: 'Valor',
                                texto: 'M11',
                                dataIndex: 'valor1',
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
                                text: 'Valor 2',
                                texto: 'M10',
                                dataIndex: 'valor2',
                                width: 110,
                                summaryType: 'sum',
                                align: 'right',
                                renderer: function (v, metaData, record) {

                                    var idStatus = record.get('valor2');
            
                                    if (idStatus < 0)
                                         metaData.style = 'color: #73b51e;';
                                        // metaData.tdCls = 'x-grid-cell-green-border';
            
                                    if (idStatus > 0)
                                        metaData.style = 'color: #cf4c35;';
                                        // metaData.tdCls = 'x-grid-cell-red-border';
                                    
                                    v = (idStatus < 0 || idStatus > 0 ? utilFormat.Value(v) : null);
                                    return v;
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
                            }
                        ]
                    })
                }
            ]
        });

        this.callParent(arguments);
    }
});
