Ext.define('App.view.dsh-pvd.GrupoGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'grupogrid',
    itemId: 'grupogrid',
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
            url : BASEURL + '/api/dshpvd/listarmarca',
            encode: true,
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
            text: 'Grupo',
            dataIndex: 'marca',
            flex: 1
            
        },
        {
            text: 'Itens',
            dataIndex: 'skus',
            width: 60,
            hidden: true
        }
    ],
    
    listeners: {

        deselect: function() {
            
            this.funcloadgrids();

        },
        select: function() {

            this.funcloadgrids();

        }

    },
    funcloadgrids: function (){
    
        var arraySession = this.getSelection();

        stringMarca ='';
        for (let index = 0; index < arraySession.length; index++) {
            var element = arraySession[index];

            if(stringMarca){
                stringMarca += ','+element.data.idMarca;
            }else{
                stringMarca = element.data.idMarca;
            }
        }

        console.log(stringMarca);

    }

});
