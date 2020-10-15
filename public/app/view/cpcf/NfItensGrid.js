Ext.define('App.view.cpcf.NfItensGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'NfItensGrid',
    id: 'NfItensGrid',
    margin: '1 1 1 1',
    width: '100%',
    requires: [
        'Ext.grid.feature.GroupingSummary',
        'Ext.ux.util.Format'
    ],
    constructor: function() {
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        Ext.applyIf(me, {

            store: Ext.create('Ext.data.Store', {
                        model: Ext.create('Ext.data.Model', {
                                    fields:[{name:'emp',mapping:'emp'},
                                            {name:'numeroNota',mapping:'numeroNota'},
                                            {name:'dataEmissao',mapping:'dataEmissao'},
                                            {name:'dataEntrada',mapping:'dataEntrada'},
                                            {name:'cnpj',mapping:'cnpj'},
                                            {name:'nome',mapping:'nome'},
                                            {name:'codItem',mapping:'codItem'},
                                            {name:'descricao',mapping:'descricao'},
                                            {name:'marca',mapping:'marca'},
                                            {name:'anteriorValor',mapping:'anteriorValor', type: 'number'},
                                            {name:'opeValor',mapping:'opeValor', type: 'number'},
                                            {name:'opeQtde',mapping:'opeQtde', type: 'number'},
                                            {name:'opeXAnteriorValor',mapping:'opeXAnteriorValor', type: 'number'},
                                            {name:'opeXAnteriorIdx',mapping:'opeXAnteriorIdx', type: 'number'}
                                            ]
                        }),
                        autoLoad: false,
                        proxy: {
                            type: 'ajax',
                            method:'POST',
                            url : BASEURL + '/api/CpCf/listarnfitens',
                            timeout: 240000,
                            reader: {
                                type: 'json',
                                rootProperty: 'data'
                            }
                        },
                        groupField: 'numeroNota'
            }),
            columns: [
                {
                    text: 'Emp',
                    dataIndex: 'emp',
                    width: 52,
                    summaryType: 'count',
                    hidden: true
                },
                {
                    text: 'Nota',
                    dataIndex: 'numeroNota',
                    width: 100,
                    hidden: true
                },
                {
                    text: 'Emissão',
                    dataIndex: 'dataEmissao',
                    width: 80,
                    hidden: true
                },
                {
                    text: 'Entrada',
                    dataIndex: 'dataEntrada',
                    width: 80,
                    hidden: false
                },
                {
                    text: 'CNPJ',
                    dataIndex: 'cnpj',
                    width: 120,
                    hidden: true
                },
                {
                    text: 'Nome',
                    dataIndex: 'nome',
                    minWidth: 60,
                    flex: 1,
                    hidden: true
                },
                {
                    text: 'Item',
                    dataIndex: 'codItem',
                    width: 100
                },
                {
                    text: 'Descrição',
                    dataIndex: 'descricao',
                    minWidth: 60,
                    flex: 1
                },
                {
                    text: 'Marca',
                    dataIndex: 'marca',
                    width: 80
                },
                {
                    text: 'Anterior',
                    dataIndex: 'anteriorValor',
                    width: 100,
                    align: 'right',
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
                    text: 'Operação',
                    dataIndex: 'opeValor',
                    width: 100,
                    align: 'right',
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
                            if(record.get('opeValor'))
                                total += parseFloat(record.get('opeValor'));
                        }

                        total = (total < 0 || total > 0 ? utilFormat.Value(total) : null);
                        return total;
                    }
                },
                {
                    text: 'Quantidade',
                    dataIndex: 'opeQtde',
                    align: 'center',
                    width: 100
                },
                {
                    text: 'Operação x<br>Anterior',
                    dataIndex: 'opeXAnteriorValor',
                    width: 140,
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
                    width: 160,
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
                            totalOpeAnt =0,
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
                        
                        totalPOpeAnt = (totalPOpeAnt <= -0.01 || totalPOpeAnt >= 0.01 ? utilFormat.Value(totalPOpeAnt) : null);
                        return totalPOpeAnt;
                    }
                }
            ],
            features: [
                {
                    groupHeaderTpl: "{name} ",
                    ftype: 'groupingsummary'
                }
            ]
        });

        me.callParent(arguments);

    }

});
