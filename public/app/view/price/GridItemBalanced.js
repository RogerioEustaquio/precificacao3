Ext.define('App.view.price.GridItemBalanced', {
    extend: 'Ext.panel.Panel',
    xtype: 'griditembalanced',
    name: 'griditembalanced',
    itemId: 'griditembalanced',
    store: 'Companies',
    columnLines: true,
    selType: 'checkboxmodel',
    margin: '1 1 1 1',
    requires: [
    ],
    
    constructor: function() {
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        var coresVariaveis = [
                              '#5A8AC6', //------------------
                              '#719ACE',
                              '#88AAD6',
                              '#9FBADE',
                              '#B6CBE6',
                              '#CDDBEE',
                              '#E4EBF6',
                              '#FCFCFF',
                              '#FCE8EA',
                              '#FBD3D5',
                              '#FBBDC0',
                              '#FAA8AB',
                              '#FA9396',
                              '#F97E81',
                              '#F8696B'
                            ];
        
        var mystore = Ext.create('Ext.data.Store', {
                                model: Ext.create('Ext.data.Model', {
                                                fields:[{name:'precoMedio', type:'number'},
                                                        {name:'rolUni', type: 'float'},
                                                        {name:'lucroUni', type: 'float'},
                                                        {name:'custoUni', type: 'float'},
                                                        {name:'numeroNf', type: 'float'},
                                                        {name:'rol', type: 'float'},
                                                        {name:'cmv', type: 'float'},
                                                        {name:'mb', type: 'number'},
                                                        {name:'mb', type: 'number'},
                                                        {name:'order', type: 'float'}
                                                        ]
                                }),
                                proxy: {
                                    type: 'ajax',
                                    method:'POST',
                                    url : BASEURL + '/api/balanced/listaritem',
                                    encode: true,
                                    timeout: 240000,
                                    format: 'json',
                                    reader: {
                                        type: 'json',
                                        rootProperty: 'data'
                                    }
                                },
                                autoLoad: false
                    });

        Ext.applyIf(me, {
    
            items:{
                xtype: 'grid',

                store: mystore,
                columns: [
                    {
                        text: 'Preço',
                        dataIndex: 'precoMedio',
                        minWidth: 75,
                        flex: 1,
                        renderer: function (v) {
                            return utilFormat.Value2(v,2);
                        }
                    },
                    {
                        text: 'Rol Uni',
                        dataIndex: 'rolUni',
                        minWidth: 90,
                        flex: 1,
                        hidden: true,
                        renderer: function (v) {
                            return utilFormat.Value2(v,2);
                        }
                    },
                    {
                        text: 'Custo Uni',
                        dataIndex: 'custoUni',
                        minWidth: 90,
                        flex: 1,
                        hidden: true,
                        renderer: function (v) {
                            return utilFormat.Value2(v,2);
                        }
                    },
                    {
                        text: 'Lucro Uni',
                        dataIndex: 'lucroUni',
                        minWidth: 90,
                        flex: 1,
                        hidden: true,
                        renderer: function (v) {
                            return utilFormat.Value2(v,2);
                        }
                    },
                    {
                        text: 'Notas',
                        dataIndex: 'notas',
                        width: 75
                    },
                    {
                        text: 'ROL',
                        dataIndex: 'rol',
                        width: 80,
                        renderer: function (v, metaData, record,index) {

                            var valor = utilFormat.Value2(v,0);
                            var gridData = this.getStore().getData();

                            var divisao = gridData.length/15; // 15 é a grade de cores
                            
                            var order = gridData.items[index].data.order;

                            if (order < divisao){
                                // metaData.tdCls = 'background-color:#88AAD6';
                                metaData.style = 'background-color:'+ coresVariaveis[0];

                                // cont = index == (divisao-1) ? cont++ : 0;
                            }else {

                                cont = utilFormat.Value2((order / divisao),0);

                                metaData.style = 'background-color:'+ coresVariaveis[parseFloat(cont)];

                            }

                            return valor;
                        }
                    },
                    {
                        text: 'CMV',
                        dataIndex: 'cmv',
                        width: 80,
                        renderer: function (v) {
                            return utilFormat.Value2(v,0);
                        },
                        hidden: true
                    },
                    {
                        text: 'LB',
                        dataIndex: 'lb',
                        width: 80,
                        renderer: function (v) {
                            return utilFormat.Value2(v,0);
                        },
                        hidden: true
                    },
                    {
                        text: 'MB',
                        dataIndex: 'mb',
                        width: 54,
                        renderer: function (v) {
                            return utilFormat.Value2(v,2);
                        }
                    },
                    {
                        text: 'Qtde',
                        dataIndex: 'qtde',
                        width: 60,
                        renderer: function (v) {
                            return utilFormat.Value2(v,0);
                        }
                    },
                ]
            }
        });

        me.callParent(arguments);

    }

});
