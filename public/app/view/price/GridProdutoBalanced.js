Ext.define('App.view.price.GridProdutoBalanced', {
    extend: 'Ext.grid.Panel',
    xtype: 'gridprodutobalanced',
    name: 'gridprodutobalanced',
    itemId: 'gridprodutobalanced',
    store: 'Companies',
    columnLines: true,
    selType: 'checkboxmodel',
    margin: '1 1 1 1',
    requires: [
    ],
    
    store: Ext.create('Ext.data.Store', {
                model: Ext.create('Ext.data.Model', {
                            fields:[{name:'codItem', type: 'string'},
                                    {name:'descricao', type: 'string'},
                                    ]
                }),
                proxy: {
                    type: 'ajax',
                    method:'POST',
                    url : BASEURL + '/api/balanced/listarprodutos2',
                    encode: true,
                    timeout: 240000,
                    format: 'json',
                    reader: {
                        type: 'json',
                        rootProperty: 'data'
                    }
                },
                autoLoad: false
    }),
    columns: [
        {
            text: 'Código',
            dataIndex: 'codItem',
            width: 110
        },
        {
            text: 'Descrição',
            dataIndex: 'descricao',
            flex: 1
        }
    ]

});
