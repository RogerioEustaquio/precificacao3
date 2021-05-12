Ext.define('App.view.rpe.TreeGridCexplore',{
    extend: 'Ext.tree.Panel',
    xtype: 'treegridcexplore',
    itemId: 'treegridcexplore',
    rootVisible: false,

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

        var myModel = Ext.create('Ext.data.TreeModel', {
                            fields: [ { name: 'grupo', type: 'string'},
                                      { name: 'precoMedio', type: 'number'},
                                      { name: 'precoMediob', type: 'number'},
                                      { name: 'precoMediox', type: 'number'},
                                      { name: 'mb', type: 'number'},
                                      { name: 'mbb', type: 'number'},
                                      { name: 'mbx', type: 'number'},
                                      { name: 'rob', type: 'number'},
                                      { name: 'robb', type: 'number'},
                                      { name: 'robx', type: 'number'},
                                      { name: 'qtde', type: 'number'},
                                      { name: 'qtdeb', type: 'number'},
                                      { name: 'qtdex', type: 'number'},
                                      { name: 'rol', type: 'number'},
                                      { name: 'rolb', type: 'number'},
                                      { name: 'rolx', type: 'number'},
                                      { name: 'cmv', type: 'number'},
                                      { name: 'cmvb', type: 'number'},
                                      { name: 'cmvx', type: 'number'},
                                      { name: 'lb', type: 'number'},
                                      { name: 'lbb', type: 'number'},
                                      { name: 'lbx', type: 'number'}
                                    ]
                        });

        var mystore = Ext.create('Ext.data.TreeStore', {
            model: myModel,
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: BASEURL + '/api/cexplore/listartreepvd',
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
                    minWidth: 228,
                    sortable: true
                },
                {
                    text: 'Preço Médio',
                    columns:[
                        {
                            text: 'Período A',
                            dataIndex: 'precoMedio',
                            // hidden: true,
                            width: 90,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'Período B',
                            dataIndex: 'precoMediob',
                            // hidden: true,
                            width: 90,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'A X B',
                            dataIndex: 'precoMediox',
                            width: 90,
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
                            text: 'Período A',
                            dataIndex: 'mb',
                            // hidden: true,
                            width: 90,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'Período B',
                            dataIndex: 'mbb',
                            // hidden: true,
                            width: 90,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        },
                        {
                            text: 'A X B',
                            dataIndex: 'mbx',
                            width: 90,
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
                    text: 'Quantidade',
                    columns:[
                        {
                            text: 'Período A',
                            dataIndex: 'qtde',
                            // hidden: true,
                            width: 90,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value2(v,0);
                            }
                        },
                        {
                            text: 'Período B',
                            dataIndex: 'qtdeb',
                            // hidden: true,
                            width: 90,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value2(v,0);
                            }
                        },
                        {
                            text: 'A X B',
                            dataIndex: 'qtdex',
                            width: 90,
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
                    text: 'ROL',
                    columns:[
                        {
                            text: 'Período A',
                            dataIndex: 'rol',
                            width: 90,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value2(v,0);
                            }
                        },
                        {
                            text: 'Período B',
                            dataIndex: 'rolb',
                            width: 90,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value2(v,0);
                            }
                        },
                        {
                            text: 'A X B',
                            dataIndex: 'rolx',
                            width: 90,
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
                    text: 'CMV',
                    columns:[
                        {
                            text: 'Período A',
                            dataIndex: 'cmv',
                            // hidden: true,
                            width: 90,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value2(v,0);
                            }
                        },
                        {
                            text: 'Período B',
                            dataIndex: 'cmvb',
                            // hidden: true,
                            width: 90,
                            align: 'right',
                            renderer: function (v) {
                                return utilFormat.Value2(v,0);
                            }
                        },
                        {
                            text: 'A X B',
                            dataIndex: 'cmvx',
                            width: 90,
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
                            text: 'Período A',
                            dataIndex: 'lb',
                            width: 90,
                            align: 'right',
                            renderer: function (value, metaData, record) {
                                return utilFormat.Value2(value,0);
                            }
                        },
                        {
                            text: 'Período B',
                            dataIndex: 'lbb',
                            width: 90,
                            align: 'right',
                            renderer: function (value, metaData, record) {
                                return utilFormat.Value2(value,0);
                            }
                        },
                        {
                            text: 'A X B',
                            dataIndex: 'lbx',
                            width: 90,
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