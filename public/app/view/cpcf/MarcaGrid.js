Ext.define('App.view.cpcf.MarcaGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'MarcaGridf',
    id: 'MarcaGridf',
    store: 'Companies',
    columnLines: true,
    selType: 'checkboxmodel',
    margin: '1 1 1 1',
    store: Ext.create('Ext.data.Store', {
        model: Ext.create('Ext.data.Model', {
                fields:[{name:'idGrupoMarca',mapping:'idGrupoMarca'},
                        {name:'idMarca',mapping:'idMarca'},
                        {name:'marca',mapping:'marca'},
                        {name:'skus',mapping:'skus'}
                        ]
        }),
        proxy: {
            type: 'ajax',
            method:'POST',
            url : BASEURL + '/api/CpCf/listarmarca',
            timeout: 120000,
            encode: true,
            format: 'json',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        },
        autoLoad : true
    }),
    columns: [
        {
            text: 'Marca',
            dataIndex: 'marca',
            flex: 1
            
        }
    ],
    
    listeners: {

    }

});
