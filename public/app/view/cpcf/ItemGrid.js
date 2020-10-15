Ext.define('App.view.cpcf.ItemGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'ItemGridf',
    id: 'ItemGridf',
    margin: '1 1 1 1',
    requires: [
        'Ext.toolbar.Paging',
        'Ext.grid.feature.GroupingSummary',
        'Ext.ux.util.Format'
    ],
    constructor: function() {
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');
        // var operacaoTotal= 0;
        // var opeXAnteriorValorTotal= 0;

        Ext.applyIf(me, {

            store: Ext.create('Ext.data.Store', {
                        model: Ext.create('Ext.data.Model', {
                                    fields:[{name:'emp',mapping:'emp'},
                                            {name:'idMarca',mapping:'idMarca'},
                                            {name:'cnpj',mapping:'cnpj'},
                                            {name:'dataInicio',mapping:'dataInicio'},
                                            {name:'dataFim',mapping:'dataFim'},
                                            {name:'dataInicioe',mapping:'dataInicioe'},
                                            {name:'dataFime',mapping:'dataFime'},
                                            {name:'nome',mapping:'nome'},
                                            {name:'anteriorValor',mapping:'anteriorValor', type: 'number'},
                                            {name:'opeValor',mapping:'opeValor', type: 'number'},
                                            {name:'opeXAnteriorValor',mapping:'opeXAnteriorValor', type: 'number'},
                                            {name:'opeXAnteriorIdx',mapping:'opeXAnteriorIdx', type: 'number'}
                                            ]
                        }),
                        autoLoad: false,
                        proxy: {
                            type: 'ajax',
                            method:'POST',
                            url : BASEURL + '/api/CpCf/listaritem',
                            timeout: 240000,
                            reader: {
                                type: 'json',
                                rootProperty: 'data'
                            }
                        },
                        groupField: 'nome'
            }),
            columns: [
                {
                    text: 'Emp',
                    dataIndex: 'emp',
                    width: 52,
                    summaryType: 'count'
                },
                {
                    text: 'Nome',
                    dataIndex: 'nome',
                    minWidth: 60,
                    flex: 1
                },
                {
                    text: 'Anterior',
                    dataIndex: 'anteriorValor',
                    width: 100,
                    align: 'right',
                    hidden: true,
                    renderer: function (v) {

                        v = (v < 0 || v > 0 ? utilFormat.Value(v) : null);
                        return v;
                    },
                    summaryType: function(records, values) {

                        var i = 0,
                            length = records.length,
                            total = 0,
                            record;

                        for (; i < length; ++i) {
                            record = records[i];
                            if(record.get('anteriorValor'))
                                total += parseFloat(record.get('anteriorValor'));
                        }

                        total = (total < 0 || total > 0 ? utilFormat.Value(total) : null);
                        return total;

                    }
                },
                {
                    text: 'Opereção',
                    dataIndex: 'opeValor',
                    width: 100,
                    align: 'right',
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    },
                    summaryType: function(records, values) {

                        var i = 0,
                            length = records.length,
                            total = 0,
                            record;

                        for (; i < length; ++i) {
                            record = records[i];
                            if(record.get('opeValor'))
                                total += parseFloat(record.get('opeValor'));
                        }

                        total = (total < 0 || total > 0 ? utilFormat.Value(total) : null);
                        return total;
                    }
                },
                {
                    text: 'Variação Operação x<br>Anterior',
                    dataIndex: 'opeXAnteriorValor',
                    width: 180,
                    align: 'right',
                    renderer: function (v, metaData, record) {

                        var idStatus = record.get('opeXAnteriorValor');

                        if (idStatus < 0)
                            metaData.tdCls = 'x-grid-cell-green-border';

                        if (idStatus > 0)
                            metaData.tdCls = 'x-grid-cell-red-border';
                        
                        v = (idStatus < 0 || idStatus > 0 ? utilFormat.Value(v) : null);
                        return v;
                    },
                    summaryType: function(records, values) {

                        var i = 0,
                            length = records.length,
                            total = 0,
                            record;

                        for (; i < length; ++i) {
                            record = records[i];
                            if(record.get('opeXAnteriorValor'))
                                total += parseFloat(record.get('opeXAnteriorValor'));
                        }

                        total = (total < 0 || total > 0 ? utilFormat.Value(total) : null);
                        return total;
                    }
                },
                {
                    text: '% Operação x<br>Anterior',
                    dataIndex: 'opeXAnteriorIdx',
                    width: 120,
                    align: 'right',
                    renderer: function (v, metaData, record) {

                        var idStatus = record.get('opeXAnteriorIdx');

                        if (idStatus < 0)
                            metaData.tdCls = 'x-grid-cell-green-border';

                        if (idStatus > 0)
                            metaData.tdCls = 'x-grid-cell-red-border';
                        
                        v = (idStatus < 0 || idStatus > 0 ? utilFormat.Value(v) : null);
                        return v;
                    },
                    summaryType: function(records, values) {

                        var i = 0,
                            length = records.length,
                            totalOpe = 0,
                            totalAnt = 0,
                            totalOpeAnt = 0,
                            totalPOpeAnt=0,
                            record;

                        for (; i < length; ++i) {
                            record = records[i];
                            if(record.get('opeValor'))
                                totalOpe += parseFloat(record.get('opeValor'));
                            if(record.get('anteriorValor'))
                                totalAnt += parseFloat(record.get('anteriorValor'));
                            if(record.get('opeXAnteriorValor'))
                            totalOpeAnt += parseFloat(record.get('opeXAnteriorValor'));
                        }

                        if(totalAnt)
                            totalPOpeAnt = (totalOpeAnt/totalAnt)*100;

                        totalPOpeAnt = (totalPOpeAnt < 0 || totalPOpeAnt > 0 ? utilFormat.Value(totalPOpeAnt) : null);
                        return totalPOpeAnt;
                    }
                }
            ],
            features: [
                {
                    groupHeaderTpl: "{name}",
                    ftype: 'groupingsummary'
                }
            ]
        });

        me.callParent(arguments);

    }
});
