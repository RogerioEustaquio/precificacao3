Ext.define('App.view.rpe.GridMarcaPerformance', {
    extend: 'Ext.panel.Panel',
    xtype: 'gridmarcaperformance',
    itemId: 'gridmarcaperformance',
    // margin: '10 2 2 2',
    layout:'fit',
    // params: [],
    border: false,
    requires: [
    ],

    constructor: function() {
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        var stylesvg = 'vertical-align: middle;';
        stylesvg += 'width: 12px;';
        stylesvg += 'margin-right: 4px;';
        stylesvg += 'height: 12px;';
        stylesvg += 'border-radius: 50%;';
        stylesvg += 'display: -webkit-inline-flex;';
        stylesvg += 'display: inline-flex;';
        stylesvg += '-webkit-align-items: center;';
        stylesvg += 'align-items: center;';
        stylesvg += '-webkit-justify-content: center;';
        stylesvg += 'justify-content: center;';
        
        var pathMaior = '<div class="ValueChange_triangle__3YfpU" style="background: #dbfddd;'+stylesvg+'"><svg width="6" height="4" viewBox="0 0 6 4" xmlns="http://www.w3.org/2000/svg"><path fill="#26C953" d="M2.66175 0.159705C2.83527 -0.0532454 3.16516 -0.0532329 3.33868 0.15973L5.90421 3.30859C6.13124 3.58724 5.92918 4 5.56574 4H0.434261C0.0708052 4 -0.131254 3.58721 0.0958059 3.30857L2.66175 0.159705Z"></path></svg></div>';
        var pathMenor = '<div class="ValueChange_triangle__3YfpU" style="background: #ffe6e6;'+stylesvg+'"><svg width="6" height="4" viewBox="0 0 6 4" xmlns="http://www.w3.org/2000/svg"><path fill="#FF5B5B" d="M3.33825 3.8403C3.16473 4.05325 2.83484 4.05323 2.66132 3.84027L0.0957854 0.691405C-0.131243 0.412756 0.0708202 -5.18345e-07 0.434261 -4.86572e-07L5.56574 -3.79643e-08C5.9292 -6.18999e-09 6.13125 0.412786 5.90419 0.69143L3.33825 3.8403Z"></path></svg></div>';

        // pathMaior = '<svg width="10" height="10" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"> <path d="M 30 30 L 20 10 L 10 30 z" fill="#26C953" stroke-width="3" /></svg>';
        // pathMenor = '<svg width="10" height="10" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"> <path d="M 10 10 L 30 10 L 20 30 z" fill="#FF5B5B" stroke-width="3" /></svg>';

        Ext.define('App.view.rpe.modelgrid', {
            extend: 'Ext.data.Model',
            fields:[{name:'marca', type: 'string'},
                    {name:'diasUteisM0', type: 'number'},
                    {name:'diasUteisM1', type: 'number'},
                    {name:'diasUteis_3m', type: 'number'},
                    {name:'diasUteis_6m', type: 'number'},
                    {name:'diasUteis_12m', type: 'number'},
                    {name:'diasUteis_24m', type: 'number'},
                    {name:'diasUteisAcAtual', type: 'number'},
                    {name:'diasUteisAcAnoAnt', type: 'number'},
                    {name:'rolDiaM0', type: 'number'},
                    {name:'rolDiaM01', type: 'number'},
                    {name:'rolDia_3m', type: 'number'},
                    {name:'rolDia_6m', type: 'number'},
                    {name:'rolDia_12m', type: 'number'},
                    {name:'rolDia_24m', type: 'number'},
                    {name:'rolDiaAcAtual', type: 'number'},
                    {name:'rolDiaAcAnoAnt', type: 'number'},
                    {name:'rolDiaM0X_1m', type: 'number'},
                    {name:'rolDiaM0X_3m', type: 'number'},
                    {name:'rolDiaM0X_6m', type: 'number'},
                    {name:'rolDiaM0X_12m', type: 'number'},
                    {name:'rolDiaM0X_24m', type: 'number'},
                    {name:'rolDiaM0XAcAnoAnt', type: 'number'},
                    {name:'rolDiaAcAtualXAcAnoAnt', type: 'number'},
                    {name: 'mbM0', type: 'number'},
                    {name: 'mbM1', type: 'number'},
                    {name: 'mbAcAtual', type: 'number'},
                    {name: 'mbAcAnoAnt', type: 'number'},
                    {name: 'mbM0X_1m', type: 'number'},
                    {name: 'mbAcAtualXAcAnoAnt', type: 'number'},
                    {name: 'mbM0XAcAnoAnt', type: 'number'},
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
                                url : BASEURL + '/api/marcaperformance/marcaperformance',
                                encode: true,
                                timeout: 240000,
                                format: 'json',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'data'
                                }
                            },
                            autoLoad: false,
                            grouper: {
                                property: 'grupo'
                            }
                        }),
                        
                        listeners: {
                        },
                        border: false,

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
                                    },
                                    {
                                        text: '24M',
                                        dataIndex: 'diasUteis_24m',
                                        width: 80,
                                        align: 'right',
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        },
                                    },
                                    {
                                        text: 'Ac. Atual',
                                        dataIndex: 'diasUteisAcAtual',
                                        width: 100,
                                        align: 'right',
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        },
                                    },
                                    {
                                        text: 'Ac. Ano Atual',
                                        dataIndex: 'diasUteisAcAnoAnt',
                                        width: 120,
                                        align: 'right',
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        },
                                    }
                                ]
                            },
                            {
                                text: 'ROL DIA',
                                columns: [
                                    {
                                        text: 'Atual',
                                        dataIndex: 'rolDiaM0',
                                        width: 84,
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
                                        text: '24M',
                                        dataIndex: 'rolDia_24m',
                                        width: 90,
                                        align: 'right',
                                        hidden: true,
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        },
                                    },
                                    {
                                        text: 'Ac. Atual',
                                        dataIndex: 'rolDiaAcAtual',
                                        width: 90,
                                        align: 'right',
                                        hidden: true,
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        },
                                    },
                                    {
                                        text: 'Ac. Ano Ant.',
                                        dataIndex: 'rolDiaAcAnoAnt',
                                        width: 110,
                                        align: 'right',
                                        hidden: true,
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        },
                                    },
                                    {
                                        text: 'Atual X 1M',
                                        dataIndex: 'rolDiaM0X_1m',
                                        width: 110,
                                        align: 'left',
                                        renderer: function (v, metaData, record) {

                                            var valor = utilFormat.Value(v);
                                            if (v > 0){
                                                valor = pathMaior +' '+ valor +'%';
                                                metaData.style = 'color: #26C953;';
                                            }
                                            if (v < 0){
                                                valor = pathMenor +' '+valor +'%';
                                                metaData.style = 'color: #FF5B5B;';
                                            }

                                            return valor;
                                        }
                                    },
                                    {
                                        text: 'Atual X 3M',
                                        dataIndex: 'rolDiaM0X_3m',
                                        width: 110,
                                        align: 'left',
                                        renderer: function (v, metaData, record) {

                                            var valor = utilFormat.Value(v);
                                            if (v > 0){
                                                valor = pathMaior +' '+ valor +'%';
                                                metaData.style = 'color: #26C953;';
                                            }
                                            if (v < 0){
                                                valor = pathMenor +' '+valor +'%';
                                                metaData.style = 'color: #FF5B5B;';
                                            }

                                            return valor;
                                        }
                                    },
                                    {
                                        text: 'Atual X 6M',
                                        dataIndex: 'rolDiaM0X_6m',
                                        width: 110,
                                        align: 'left',
                                        renderer: function (v, metaData, record) {

                                            var valor = utilFormat.Value(v);
                                            if (v > 0){
                                                valor = pathMaior +' '+ valor +'%';
                                                metaData.style = 'color: #26C953;';
                                            }
                                            if (v < 0){
                                                valor = pathMenor +' '+valor +'%';
                                                metaData.style = 'color: #FF5B5B;';
                                            }

                                            return valor;
                                        }
                                    },
                                    {
                                        text: 'Atual X 12M',
                                        dataIndex: 'rolDiaM0X_12m',
                                        width: 110,
                                        align: 'left',
                                        renderer: function (v, metaData, record) {

                                            var valor = utilFormat.Value(v);
                                            if (v > 0){
                                                valor = pathMaior +' '+ valor +'%';
                                                metaData.style = 'color: #26C953;';
                                            }
                                            if (v < 0){
                                                valor = pathMenor +' '+valor +'%';
                                                metaData.style = 'color: #FF5B5B;';
                                            }

                                            return valor;
                                        }
                                    },
                                    {
                                        text: 'Atual X 24M',
                                        dataIndex: 'rolDiaM0X_24m',
                                        width: 110,
                                        align: 'left',
                                        renderer: function (v, metaData, record) {

                                            var valor = utilFormat.Value(v);
                                            if (v > 0){
                                                valor = pathMaior +' '+ valor +'%';
                                                metaData.style = 'color: #26C953;';
                                            }
                                            if (v < 0){
                                                valor = pathMenor +' '+valor +'%';
                                                metaData.style = 'color: #FF5B5B;';
                                            }

                                            return valor;
                                        }
                                    },
                                    {
                                        text: 'Atual X Ac. Ano Ant.',
                                        dataIndex: 'rolDiaM0XAcAnoAnt',
                                        width: 140,
                                        align: 'left',
                                        renderer: function (v, metaData, record) {

                                            var valor = utilFormat.Value(v);
                                            if (v > 0){
                                                valor = pathMaior +' '+ valor +'%';
                                                metaData.style = 'color: #26C953;';
                                            }
                                            if (v < 0){
                                                valor = pathMenor +' '+valor +'%';
                                                metaData.style = 'color: #FF5B5B;';
                                            }

                                            return valor;
                                        }
                                    },
                                    {
                                        text: 'Ac. Atual X Ac. Ano Ant.',
                                        dataIndex: 'rolDiaAcAtualXAcAnoAnt',
                                        width: 160,
                                        align: 'left',
                                        renderer: function (v, metaData, record) {

                                            var valor = utilFormat.Value(v);
                                            if (v > 0){
                                                valor = pathMaior +' '+ valor +'%';
                                                metaData.style = 'color: #26C953;';
                                            }
                                            if (v < 0){
                                                valor = pathMenor +' '+valor +'%';
                                                metaData.style = 'color: #FF5B5B;';
                                            }

                                            return valor;
                                        }
                                    }
                                ]
                            },
                            {
                                text: 'MARGEM BRUTA',
                                columns:[
                                    {
                                        text: 'Atual',
                                        dataIndex: 'mbM0',
                                        width: 68,
                                        align: 'right',
                                        renderer: function (v) {
                                            return utilFormat.Value(v);
                                        }
                                    },
                                    {
                                        text: '1M',
                                        dataIndex: 'mbM1',
                                        width: 90,
                                        align: 'right',
                                        hidden: true,
                                        renderer: function (v) {
                                            return utilFormat.Value(v);
                                        }
                                    },
                                    {
                                        text: 'Ac. Atual',
                                        dataIndex: 'mbAcAtual',
                                        width: 90,
                                        align: 'right',
                                        hidden: true,
                                        renderer: function (v) {
                                            return utilFormat.Value(v);
                                        }
                                    },
                                    {
                                        text: 'Ac. Ano Ant.',
                                        dataIndex: 'mbAcAnoAnt',
                                        width: 110,
                                        align: 'right',
                                        hidden: true,
                                        renderer: function (v) {
                                            return utilFormat.Value(v);
                                        }
                                    },
                                    {
                                        text: 'Atual X 1M',
                                        dataIndex: 'mbM0X_1m',
                                        width: 100,
                                        align: 'left',
                                        renderer: function (v, metaData, record) {

                                            var valor = utilFormat.Value(v);
                                            if (v > 0){
                                                valor = pathMaior +' '+ valor +'%';
                                                metaData.style = 'color: #26C953;';
                                            }
                                            if (v < 0){
                                                valor = pathMenor +' '+ valor +'%';
                                                metaData.style = 'color: #FF5B5B;';
                                            }

                                            return valor;
                                        }
                                    },
                                    {
                                        text: 'Atual X Ac. Ano Ant.',
                                        dataIndex: 'mbM0XAcAnoAnt',
                                        width: 140,
                                        align: 'left',
                                        renderer: function (v, metaData, record) {

                                            var valor = utilFormat.Value(v);
                                            if (v > 0){
                                                valor = pathMaior +' '+ valor +'%';
                                                metaData.style = 'color: #26C953;';
                                            }
                                            if (v < 0){
                                                valor = pathMenor +' '+ valor +'%';
                                                metaData.style = 'color: #FF5B5B;';
                                            }

                                            return valor;
                                        }
                                    },
                                    {
                                        text: 'Ac. Atual X Ac. Ano Ant.',
                                        dataIndex: 'mbAcAtualXAcAnoAnt',
                                        width: 160,
                                        align: 'left',
                                        renderer: function (v, metaData, record) {

                                            var valor = utilFormat.Value(v);
                                            if (v > 0){
                                                valor = pathMaior +' '+ valor +'%';
                                                metaData.style = 'color: #26C953;';
                                            }
                                            if (v < 0){
                                                valor = pathMenor +' '+ valor +'%';
                                                metaData.style = 'color: #FF5B5B;';
                                            }

                                            return valor;
                                        }
                                    }
                                ]
                            },
                            {
                                text: 'Estoque Valor',
                                dataIndex: 'estoqueValor',
                                width: 130,
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
