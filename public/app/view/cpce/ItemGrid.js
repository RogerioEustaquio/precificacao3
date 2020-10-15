Ext.define('App.view.cpce.ItemGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'ItemGrid',
    columnLines: true,
    margin: '1 1 1 1',
    requires: [
        'Ext.toolbar.Paging',
        'Ext.grid.feature.GroupingSummary',
        'Ext.ux.util.Format'
    ],
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true,
        displayMsg: 'Exibindo solicitações {0} - {1} de {2}',
        emptyMsg: "Não há solicitações a serem exibidos"
    },
    constructor: function() {
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        Ext.applyIf(me, {
    
            store: Ext.create('Ext.data.Store', {
                        model: Ext.create('Ext.data.Model', {
                                    fields:[{name:'emp',mapping:'emp'},
                                            {name:'operacao',mapping:'operacao'},
                                            {name:'dataEmissao',mapping:'dataEmissao'},
                                            {name:'dataEntrada',mapping:'dataEntrada'},
                                            {name:'cnpj',mapping:'cnpj'},
                                            {name:'nome',mapping:'nome'},
                                            {name:'numeroNota',mapping:'numeroNota'},
                                            {name:'valorNota',mapping:'valorNota',type:'number'},
                                            {name:'marca',mapping:'marca'},
                                            {name:'codItem',mapping:'codItem'},
                                            {name:'descricao',mapping:'descricao'},
                                            {name:'idCurvaAbc',mapping:'idCurvaAbc'},
                                            {name:'dataCompraAnterior',mapping:'dataCompraAnterior'},
                                            {name:'custoAnterior',mapping:'custoAnterior', type: 'number'},
                                            {name:'custoOperacao',mapping:'custoOperacao', type: 'number'},
                                            {name:'custoResultante',mapping:'custoResultante', type: 'number'},
                                            {name:'qdteAnterior',mapping:'qtdeAnterior', type: 'number'},
                                            {name:'qdteOperacao',mapping:'qtdeOperacao', type: 'number'},
                                            {name:'qtdeResultante',mapping:'qtdeResultante', type: 'number'},
                                            {name:'custoUltAnoAnterior',mapping:'custoUltAnoAnterior', type: 'number'},
                                            {name:'custoMedAnoAnterior',mapping:'custoMedAnoAnterior', type: 'number'},
                                            {name:'custoMedEAnoAnterior',mapping:'custoMedEAnoAnterior', type: 'number'},
                                            {name:'custoMedE_12mAnterior',mapping:'custoMedE_12mAnterior', type: 'number'},
                                            {name:'custoMedE_6mAnterior',mapping:'custoMedE_6mAnterior', type: 'number'},
                                            {name:'custoMedE_3mAnterior',mapping:'custoMedE_3mAnterior', type: 'number'},
                                            {name:'opeXAnteriorValor',mapping:'opeXAnteriorValor', type: 'number'},

                                            {name:'vOpeAnterior',mapping:'vOpeAnterior', type: 'number'},
                                            {name:'vOpeUltAnoAnterior',mapping:'vOpeUltAnoAnterior', type: 'number'},
                                            {name:'vOpeMedAnoAnterior',mapping:'vOpeMedAnoAnterior', type: 'number'},
                                            {name:'vOpeMedEAnoAnterior',mapping:'vOpeMedEAnoAnterior', type: 'number'},
                                            {name:'vOpeMedE_12mAnterior',mapping:'vOpeMedE_12mAnterior', type: 'number'},
                                            {name:'vOpeMedE_6mAnterior',mapping:'vOpeMedE_6mAnterior', type: 'number'},
                                            {name:'vOpeMedE_3mAnterior',mapping:'vOpeMedE_3mAnterior', type: 'number'}
                                            ]
                        }),
                        pageSize: 50,
                        autoLoad: false,
                        proxy: {
                            type: 'ajax',
                            method:'POST',
                            url : BASEURL + '/api/CpCe/listaritem',
                            encode: true,
                            timeout: 240000,
                            format: 'json',
                            reader: {
                                type: 'json',
                                rootProperty: 'data',
                                totalProperty: 'total'
                            }
                        },
                        // groupField: 'numeroNota'
                        grouper: {
                                property: 'numeroNota'
                        }
            }),
            columns: [
                {
                    text: 'Emp',
                    dataIndex: 'emp',
                    width: 52,
                    summaryType: 'count'
                },
                {
                    text: 'Operação',
                    dataIndex: 'operacao',
                    width: 120
                    
                },
                {
                    text: 'Data <br> Emissão',
                    dataIndex: 'dataEmissao',
                    width: 100
                },
                {
                    text: 'Data <br> Entrada',
                    dataIndex: 'dataEntrada',
                    width: 110
                },
                {
                    text: 'Cnpj',
                    dataIndex: 'cnpj',
                    width: 130
                },
                {
                    text: 'Nome',
                    dataIndex: 'nome',
                    minWidth: 60,
                    flex: 1
                },
                {
                    text: 'Nota',
                    dataIndex: 'numeroNota',
                    width: 84
                },
                {
                    text: 'Valor Nota',
                    dataIndex: 'valorNota',
                    width: 100,
                    hidden: true,
                    renderer: function (v) {
                        v = (idStatus < 0 || idStatus > 0 ? utilFormat.Value(v) : null);
                        return v;
                    },
                    summaryType: 'min'
                },
                {
                    text: 'Marca',
                    dataIndex: 'marca',
                    width: 74
                },
                {
                    text: 'Código',
                    dataIndex: 'codItem',
                    width: 110
                },
                {
                    text: 'Descrição',
                    dataIndex: 'descricao',
                    minWidth: 86,
                    flex:1
                },
                {
                    text: 'Curva',
                    dataIndex: 'idCurvaAbc',
                    width: 60
                },
                {
                    text: 'Data Compra  <br> Anterior',
                    dataIndex: 'dataCompraAnterior',
                    width: 120
                },
                {
                    text: 'Custo',
                    columns:[
                        {
                            text: 'Anterior',
                            dataIndex: 'custoAnterior',
                            width: 84,
                            align: 'right',
                            renderer: function (v) {

                                v = (v ? utilFormat.Value(v) : null);
                                return v;
                            },
                            summaryType: function(records, values) {

                                var i = 0,
                                    length = records.length,
                                    total = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    if(record.get('custoAnterior'))
                                        total += parseFloat(record.get('custoAnterior'));
                                }
        
                                total = (total < 0 || total > 0 ? utilFormat.Value(total) : null);
                                return total;
                            }
                        },
                        {
                            text: 'Operação',
                            dataIndex: 'custoOperacao',
                            width: 94,
                            align: 'right',
                            renderer: function (v) {

                                v = (v ? utilFormat.Value(v) : null);
                                return v;
                            },
                            summaryType: function(records, values) {

                                var i = 0,
                                    length = records.length,
                                    total = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    if(record.get('custoOperacao'))
                                        total += parseFloat(record.get('custoOperacao'));
                                }
        
                                total = (total < 0 || total > 0 ? utilFormat.Value(total) : null);
                                return total;
                            }
                        },
                        {
                            text: 'Resultante',
                            dataIndex: 'custoResultante',
                            width: 100,
                            align: 'right',
                            renderer: function (v) {

                                v = (v ? utilFormat.Value(v) : null);
                                return v;
                            },
                            summaryType: function(records, values) {

                                var i = 0,
                                    length = records.length,
                                    total = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    if(record.get('custoResultante'))
                                        total += parseFloat(record.get('custoResultante'));
                                }
        
                                total = (total < 0 || total > 0 ? utilFormat.Value(total) : null);
                                return total;
                            }
                        },
                        {
                            text: 'Últ. Ano <br> Anterior',
                            dataIndex: 'custoUltAnoAnterior',
                            width: 84,
                            align: 'right',
                            renderer: function (v) {

                                v = (v ? utilFormat.Value(v) : null);
                                return v;
                            },
                            summaryType: function(records, values) {

                                var i = 0,
                                    length = records.length,
                                    total = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    if(record.get('custoUltAnoAnterior'))
                                        total += parseFloat(record.get('custoUltAnoAnterior'));
                                }
        
                                total = (total < 0 || total > 0 ? utilFormat.Value(total) : null);
                                return total;
                            }
                        },
                        {
                            text: 'Média Ano <br> Anterior',
                            dataIndex: 'custoMedAnoAnterior',
                            width: 120,
                            align: 'right',
                            renderer: function (v) {

                                v = (v ? utilFormat.Value(v) : null);
                                return v;
                            },
                            summaryType: function(records, values) {

                                var i = 0,
                                    length = records.length,
                                    total = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    if(record.get('custoMedAnoAnterior'))
                                        total += parseFloat(record.get('custoMedAnoAnterior'));
                                }
        
                                total = (total < 0 || total > 0 ? utilFormat.Value(total) : null);
                                return total;
                            }
                        },
                        {
                            text: 'Média .P <br> Ano Anterior',
                            dataIndex: 'custoMedEAnoAnterior',
                            width: 120,
                            align: 'right',
                            renderer: function (v) {

                                v = (v ? utilFormat.Value(v) : null);
                                return v;
                            },
                            summaryType: function(records, values) {

                                var i = 0,
                                    length = records.length,
                                    total = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    if(record.get('custoMedEAnoAnterior'))
                                        total += parseFloat(record.get('custoMedEAnoAnterior'));
                                }
        
                                total = (total < 0 || total > 0 ? utilFormat.Value(total) : null);
                                return total;
                            }
                        },
                        {
                            text: 'Média 12 Meses <br> Anterior',
                            dataIndex: 'custoMedE_12mAnterior',
                            width: 142,
                            align: 'right',
                            renderer: function (v) {

                                v = (v ? utilFormat.Value(v) : null);
                                return v;
                            },
                            summaryType: function(records, values) {

                                var i = 0,
                                    length = records.length,
                                    total = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    if(record.get('custoMedE_12mAnterior'))
                                        total += parseFloat(record.get('custoMedE_12mAnterior'));
                                }
        
                                total = (total < 0 || total > 0 ? utilFormat.Value(total) : null);
                                return total;
                            }
                        },
                        {
                            text: 'Média 6 Meses <br> Anterior',
                            dataIndex: 'custoMedE_6mAnterior',
                            width: 136,
                            align: 'right',
                            renderer: function (v) {

                                v = (v ? utilFormat.Value(v) : null);
                                return v;
                            },
                            summaryType: function(records, values) {

                                var i = 0,
                                    length = records.length,
                                    total = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    if(record.get('custoMedE_6mAnterior'))
                                        total += parseFloat(record.get('custoMedE_6mAnterior'));
                                }
        
                                total = (total < 0 || total > 0 ? utilFormat.Value(total) : null);
                                return total;
                            }
                        },
                        {
                            text: 'Média 3 Meses <br> Anterior',
                            dataIndex: 'custoMedE_3mAnterior',
                            width: 136,
                            align: 'right',
                            renderer: function (v) {

                                v = (v ? utilFormat.Value(v) : null);
                                return v;
                            },
                            summaryType: function(records, values) {

                                var i = 0,
                                    length = records.length,
                                    total = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    if(record.get('custoMedE_3mAnterior'))
                                        total += parseFloat(record.get('custoMedE_3mAnterior'));
                                }
        
                                total = (total < 0 || total > 0 ? utilFormat.Value(total) : null);
                                return total;
                            }
                        }
                    ]
                },
                {
                    text: 'Variação Operação x<br>',
                    columns:[
                        {
                            text: 'Anterior',
                            dataIndex: 'vOpeAnterior',
                            width: 84,
                            align: 'right',
                            renderer: function (v, metaData, record) {

                                var idStatus = record.get('vOpeAnterior');
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
                                    totalAnt = 0,
                                    totalOpe = 0,
                                    totalOpeAnt=0,
                                    totalPAnt = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    if(record.get('custoAnterior'))
                                        totalAnt += parseFloat(record.get('custoAnterior'));
                                    if(record.get('custoOperacao'))
                                        totalOpe += parseFloat(record.get('custoOperacao'));
                                    if(record.get('opeXAnteriorValor'))
                                        totalOpeAnt += parseFloat(record.get('opeXAnteriorValor'));
                                }

                                totalPAnt = ((totalOpeAnt)/totalAnt)*100;
        
                                totalPAnt = (totalPAnt < 0 || totalPAnt > 0 ? utilFormat.Value(totalPAnt) : null);
                                return totalPAnt;
                            }
                        },
                        {
                            text: 'Últ. Ano <br> Anterior',
                            dataIndex: 'vOpeUltAnoAnterior',
                            width: 94,
                            align: 'right',
                            renderer: function (v, metaData, record) {
                                var idStatus = record.get('vOpeUltAnoAnterior');
                                if (idStatus < 0)
                                    metaData.tdCls = 'x-grid-cell-green-border';

                                if (idStatus > 0)
                                    metaData.tdCls = 'x-grid-cell-red-border';

                                v = (idStatus <= -0.01 || idStatus >= 0.01 ? utilFormat.Value(v) : null);
                                return v;
                            },
                            summaryType: function(records, values) {

                                var i = 0,
                                    length = records.length,
                                    totalAnt = 0,
                                    totalOpe = 0,
                                    totalPAnt = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    
                                    if(record.get('custoUltAnoAnterior')){

                                        totalAnt += parseFloat(record.get('custoUltAnoAnterior'));
                                        totalOpe += parseFloat(record.get('custoOperacao'));
                                    }
                                }

                                if(totalAnt)
                                    totalPAnt = ((totalOpe-totalAnt)/totalAnt)*100;
        
                                totalPAnt = (totalPAnt < 0 || totalPAnt > 0 ? utilFormat.Value(totalPAnt) : null);
                                return totalPAnt;
                            }
                        },
                        {
                            text: 'Média Ano <br> Anterior',
                            dataIndex: 'vOpeMedAnoAnterior',
                            width: 120,
                            align: 'right',
                            renderer: function (v, metaData, record) {
                                var idStatus = record.get('vOpeMedAnoAnterior');
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
                                    totalMedAnt = 0,
                                    totalOpe = 0,
                                    totalPMedAnt = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    
                                    if(parseFloat(record.get('custoMedAnoAnterior'))){
                                        totalMedAnt += parseFloat(record.get('custoMedAnoAnterior'));
                                        totalOpe += parseFloat(record.get('custoOperacao'));
                                    }
                                }
                                if(totalMedAnt)
                                    totalPMedAnt = ((totalOpe-totalMedAnt)/totalMedAnt)*100;
        
                                totalPMedAnt = (totalPMedAnt < 0 || totalPMedAnt > 0 ? utilFormat.Value(totalPMedAnt) : null);
                                return totalPMedAnt;
                            }
                        },
                        {
                            text: 'Média .P <br> Ano Anterior',
                            dataIndex: 'vOpeMedEAnoAnterior',
                            width: 120,
                            align: 'right',
                            renderer: function (v, metaData, record) {
                                var idStatus = record.get('vOpeMedEAnoAnterior');
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
                                    totalMedEAnt = 0,
                                    totalOpe = 0,
                                    totalPMedEAnt = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    
                                    if(parseFloat(record.get('custoMedEAnoAnterior'))){
                                        totalMedEAnt += parseFloat(record.get('custoMedEAnoAnterior'));
                                        totalOpe += parseFloat(record.get('custoOperacao'));
                                    }
                                }
                                if(totalMedEAnt)
                                    totalPMedEAnt = ((totalOpe-totalMedEAnt)/totalMedEAnt)*100;
        
                                totalPMedEAnt = (totalPMedEAnt < 0 || totalPMedEAnt > 0 ? utilFormat.Value(totalPMedEAnt) : null);
                                return totalPMedEAnt;
                            }
                        },
                        {
                            text: 'Média 12 Meses <br> Anterior',
                            dataIndex: 'vOpeMedE_12mAnterior',
                            width: 142,
                            align: 'right',
                            renderer: function (v, metaData, record) {
                                var idStatus = record.get('vOpeMedE_12mAnterior');
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
                                    totalMedEAnt12 = 0,
                                    totalOpe = 0,
                                    totalPMedEAnt12 = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    
                                    if(parseFloat(record.get('custoMedE_12mAnterior'))){
                                        totalMedEAnt12 += parseFloat(record.get('custoMedE_12mAnterior'));
                                        totalOpe += parseFloat(record.get('custoOperacao'));
                                    }
                                }
                                if(totalMedEAnt12)
                                    totalPMedEAnt12 = ((totalOpe-totalMedEAnt12)/totalMedEAnt12)*100;
        
                                totalPMedEAnt12 = (totalPMedEAnt12 < 0 || totalPMedEAnt12 > 0 ? utilFormat.Value(totalPMedEAnt12) : null);
                                return totalPMedEAnt12;
                            }
                        },
                        {
                            text: 'Média 6 Meses <br> Anterior',
                            dataIndex: 'vOpeMedE_6mAnterior',
                            width: 136,
                            align: 'right',
                            renderer: function (v, metaData, record) {
                                var idStatus = record.get('vOpeMedE_6mAnterior');
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
                                    totalMedEAnt6 = 0,
                                    totalOpe = 0,
                                    totalPMedEAnt6 = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    
                                    if(parseFloat(record.get('custoMedE_6mAnterior'))){
                                        totalMedEAnt6 += parseFloat(record.get('custoMedE_6mAnterior'));
                                        totalOpe += parseFloat(record.get('custoOperacao'));
                                    }
                                }
                                if(totalMedEAnt6)
                                    totalPMedEAnt6 = ((totalOpe-totalMedEAnt6)/totalMedEAnt6)*100;
        
                                totalPMedEAnt6 = (totalPMedEAnt6 < 0 || totalPMedEAnt6 > 0 ? utilFormat.Value(totalPMedEAnt6) : null);
                                return totalPMedEAnt6;
                            }
                        },
                        {
                            text: 'Média 3 Meses <br> Anterior',
                            dataIndex: 'vOpeMedE_3mAnterior',
                            width: 136,
                            align: 'right',
                            renderer: function (v, metaData, record) {
                                var idStatus = record.get('vOpeMedE_3mAnterior');
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
                                    totalMedEAnt3 = 0,
                                    totalOpe = 0,
                                    totalPMedEAnt3 = 0,
                                    record;
        
                                for (; i < length; ++i) {
                                    record = records[i];
                                    
                                    if(parseFloat(record.get('custoMedE_3mAnterior'))){
                                        totalMedEAnt3 += parseFloat(record.get('custoMedE_3mAnterior'));
                                        totalOpe += parseFloat(record.get('custoOperacao'));
                                    }
                                }
                                if(totalMedEAnt3)
                                    totalPMedEAnt3 = ((totalOpe-totalMedEAnt3)/totalMedEAnt3)*100;
        
                                totalPMedEAnt3 = (totalPMedEAnt3 < 0 || totalPMedEAnt3 > 0 ? utilFormat.Value(totalPMedEAnt3) : null);
                                return totalPMedEAnt3;
                            }
                        }
                    ]
                },
                {
                    text: 'Qt. Anterior',
                    dataIndex: 'qtdeAnterior',
                    width: 100,
                    align: 'center'
                },
                {
                    text: 'Qt. Operação',
                    dataIndex: 'qtdeOperacao',
                    width: 110,
                    align: 'center'
                },
                {
                    text: 'Qt. Resultante',
                    dataIndex: 'qtdeResultante',
                    width: 110,
                    align: 'center'
                }
            ],
            features: [
                {
                    groupHeaderTpl: "{name} | Total: {[values.rows[0].data.valorNota]}",
                    ftype: 'groupingsummary'
                }
            ]
        });

        me.callParent(arguments);

    }
});
