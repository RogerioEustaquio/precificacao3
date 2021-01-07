Ext.define('App.view.rpe.GridMarcaOverview', {
    extend: 'Ext.panel.Panel',
    xtype: 'gridmarcaoverview',
    itemId: 'gridmarcaoverview',
    // margin: '10 2 2 2',
    layout:'fit',
    // params: [],
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
                    {name:'rolM0', type: 'number'},
                    {name:'rolDiaM0', type: 'number'},
                    {name:'rolDiaM01', type: 'number'},
                    {name:'rolDiaM0X_1m', type: 'number'},
                    {name:'lbM0', type: 'number'},
                    {name:'lbDiaM0', type: 'number'},
                    {name:'lbDiaM0X_1m', type: 'number'},
                    {name:'mbM0', type: 'number'},
                    {name:'mbM0X_1m', type: 'number'},
                    {name:'qtdeM0', type: 'number'},
                    {name:'qtdeDiaM0', type: 'number'},
                    {name:'qtdeDiaM0X_1m', type: 'number'},
                    {name:'ccM0', type: 'number'},
                    {name:'ccDiaM0', type: 'number'},
                    {name:'ccDiaM0X_1m', type: 'number'},
                    {name:'nfM0', type: 'number'},
                    {name:'nfDiaM0', type: 'number'},
                    {name:'nfDiaM0X_1m', type: 'number'},
                    {name:'skuM0', type: 'number'},
                    {name:'estoqueQtde', type: 'number'},
                    {name:'estoqueValor', type: 'number'},
                    {name:'estoqueSkuDisp', type: 'number'}
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
                                url : BASEURL + '/api/marcaoverview/marcaoverview',
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
                                    }
                                ]
                            },
                            {
                                text: 'VENDA',
                                columns: [
                                    {
                                        text: 'ROL',
                                        columns:[
                                            {
                                                text: 'Atual',
                                                dataIndex: 'rolM0',
                                                width: 90,
                                                align: 'right',
                                                renderer: function (v) {
                                                    return utilFormat.ValueZero(v);
                                                },
                                            }
                                        ]
                                    },
                                    {
                                        text: 'ROL DIA',
                                        columns:[
                                            {
                                                text: 'Atual',
                                                dataIndex: 'rolDiaM0',
                                                width: 78,
                                                align: 'right',
                                                hidden: false,
                                                renderer: function (v) {
                                                    return utilFormat.ValueZero(v);
                                                },
                                            },
                                            {
                                                text: 'Atual X 1M',
                                                dataIndex: 'rolDiaM0X_1m',
                                                width: 88,
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
                                        text: 'LB',
                                        columns:[
                                            {
                                                text: 'Atual',
                                                dataIndex: 'lbM0',
                                                width: 90,
                                                align: 'right',
                                                renderer: function (v) {
                                                    return utilFormat.ValueZero(v);
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        text: 'LB Dia',
                                        columns:[
                                            {
                                                text: 'Atual',
                                                dataIndex: 'lbDiaM0',
                                                width: 78,
                                                align: 'right',
                                                hidden: false,
                                                renderer: function (v) {
                                                    return utilFormat.ValueZero(v);
                                                },
                                            },
                                            {
                                                text: 'Atual X 1M',
                                                dataIndex: 'lbDiaM0X_1m',
                                                width: 88,
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
                                        text: 'MB',
                                        columns: [
                                            {
                                                text: 'Atual',
                                                dataIndex: 'mbM0',
                                                width: 90,
                                                align: 'right',
                                                renderer: function (v) {
                                                    return utilFormat.ValueZero(v);
                                                },
                                            },
                                            {
                                                text: 'Atual X 1M',
                                                dataIndex: 'mbM0X_1m',
                                                width: 88,
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
                                        text: 'QTD',
                                        columns:[
                                            {
                                                text: 'Atual',
                                                dataIndex: 'qtdeM0',
                                                width: 80,
                                                align: 'right',
                                                renderer: function (v) {
                                                    return utilFormat.ValueZero(v);
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        text: 'QTD Dia',
                                        columns:[
                                            {
                                                text: 'Atual',
                                                dataIndex: 'qtdeDiaM0',
                                                width: 78,
                                                align: 'right',
                                                renderer: function (v) {
                                                    return utilFormat.ValueZero(v);
                                                }
                                            },
                                            {
                                                text: 'Atual X 1M',
                                                dataIndex: 'qtdeDiaM0X_1m',
                                                width: 88,
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
                                        text: 'CC',
                                        columns:[
                                            {
                                                text: 'Atual',
                                                dataIndex: 'ccM0',
                                                width: 80,
                                                align: 'right',
                                                renderer: function (v) {
                                                    return utilFormat.ValueZero(v);
                                                },
                                            }
                                        ]
                                    },
                                    {
                                        text: 'CC Dia',
                                        columns:[
                                            {
                                                text: 'Atual',
                                                dataIndex: 'ccDiaM0',
                                                width: 78,
                                                align: 'right',
                                                renderer: function (v) {
                                                    return utilFormat.ValueZero(v);
                                                },
                                            },
                                            {
                                                text: 'Atual X 1M',
                                                dataIndex: 'ccDiaM0X_1m',
                                                width: 88,
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
                                        text: 'NF',
                                        columns: [
                                            {
                                                text: 'Atual',
                                                dataIndex: 'nfM0',
                                                width: 80,
                                                align: 'right',
                                                renderer: function (v) {
                                                    return utilFormat.ValueZero(v);
                                                },
                                            }
                                        ]
                                    },
                                    {
                                        text: 'NF Dia',
                                        columns: [
                                            {
                                                text: 'Atual',
                                                dataIndex: 'nfDiaM0',
                                                width: 78,
                                                align: 'right',
                                                renderer: function (v) {
                                                    return utilFormat.ValueZero(v);
                                                },
                                            },
                                            {
                                                text: 'Atual X 1M',
                                                dataIndex: 'nfDiaM0X_1m',
                                                width: 88,
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
                                        text: 'SKU Atual',
                                        dataIndex: 'skuM0',
                                        width: 94,
                                        align: 'right',
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        },
                                    }
                                ]
                            },
                            {
                                text: 'Estoque',
                                columns:[
                                    {
                                        text: 'QTD',
                                        dataIndex: 'estoqueQtde',
                                        width: 80,
                                        align: 'right',
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        }
                                    },
                                    {
                                        text: 'Valor',
                                        dataIndex: 'estoqueValor',
                                        width: 90,
                                        align: 'right',
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        }
                                    },
                                    {
                                        text: 'SKU Disp',
                                        dataIndex: 'estoqueSkuDisp',
                                        width: 94,
                                        align: 'right',
                                        renderer: function (v) {
                                            return utilFormat.ValueZero(v);
                                        }
                                    }
                                ]
                            }
                        ]
                    })
                }
            ]
        });

        this.callParent(arguments);
    }
});
