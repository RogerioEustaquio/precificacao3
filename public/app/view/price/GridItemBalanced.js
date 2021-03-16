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

        var coresVariaveis = ['#5A8AC6',
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
                              '#F8696B'];

        var mymodel = Ext.create('Ext.data.Model', {
                                fields:[{name:'preco', type: 'number'},
                                        {name:'numeroNf', type: 'number'},
                                        {name:'rol', type: 'number'},
                                        {name:'mb', type: 'number'}
                                        ]
                    });
        
        var mystore = Ext.create('Ext.data.Store', {
                                model: mymodel,
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
                                autoLoad: true
                    });

        Ext.applyIf(me, {
    
            items:{
                xtype: 'grid',

                store: mystore,
                columns: [
                    {
                        text: 'Preço',
                        dataIndex: 'precoMedio',
                        width: 60  
                    },
                    {
                        text: 'Notas',
                        dataIndex: 'notas',
                        width: 80
                    },
                    {
                        text: 'ROL',
                        dataIndex: 'rol',
                        width: 60,
                        renderer: function (v, metaData, record,index) {

                            var valor = utilFormat.Value(v);
                            var totalLinha = this.getStore().getData().length;

                            var divisao = totalLinha/15; // 15 é a grade de cores

                            if (index < divisao){
                                // metaData.tdCls = 'background-color:#88AAD6';
                                metaData.style = 'background-color:'+ coresVariaveis[0];

                                // cont = index == (divisao-1) ? cont++ : 0;
                            }else {

                                cont = utilFormat.Value2((index / divisao),0);

                                metaData.style = 'background-color:'+ coresVariaveis[parseFloat(cont)];

                            }

                            return valor;
                        }
                    },
                    {
                        text: 'MB',
                        dataIndex: 'mb',
                        width: 60
                    }
                ]
            }
        });

        me.callParent(arguments);

    }

});
