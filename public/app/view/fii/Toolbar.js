Ext.define('App.view.fii.Toolbar',{
    extend: 'Ext.Toolbar',
    xtype: 'fiitoolbar',
    itemId: 'fiitoolbar',
    region: 'north',
    requires:[
    ],

    initComponent: function() {
        var me = this;

        var btnFiltro = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-filter',
            tooltip: 'Filtro',
            margin: '1 1 1 4',
            handler: me.onBtnFiltros
        });

        var elTagEmpresa = Ext.create('Ext.form.field.Tag',{
            name: 'elEmp',
            itemId: 'elEmp',
            multiSelect: true,
            store: Ext.data.Store({
                fields: [
                    { name: 'emp', type: 'string' },
                    { name: 'idEmpresa', type: 'string' }
                ],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/dshpvd/listarEmpresas',
                    timeout: 120000,
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            width: 200,
            queryParam: 'emp',
            queryMode: 'local',
            displayField: 'emp',
            valueField: 'idEmpresa',
            emptyText: 'Empresa',
            fieldLabel: 'Empresas',
            labelWidth: 60,
            // margin: '0 1 0 0',
            padding: 1,
            plugins:'dragdroptag',
            filterPickList: true,
            publishes: 'value',
            disabled:true
        });
        elTagEmpresa.store.load(
            function(){
                elTagEmpresa.setDisabled(false);
            }
        );

        var elTagProduto = Ext.create('Ext.form.field.Tag',{
            name: 'elProduto',
            itemId: 'elProduto',
            multiSelect: true,
            width: 400,
            labelWidth: 60,
            store: Ext.data.Store({
                fields: [{ name: 'coditem' }, { name: 'descricao' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/dshpvd/listarprodutos',
                    reader: { type: 'json', root: 'data' },
                    extraParams: { tipoSql: 0}
                }
            }),
            queryParam: 'codItem',
            queryMode: 'remote',
            displayField: 'codItem',
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',		                            
                '{codItem} {descricao} {marca}',
                '</tpl>'), 
            valueField: 'codItem',
            emptyText: 'Produto',
            fieldLabel: 'Produtos',
            emptyText: 'Informe o código do produto',
            // matchFieldWidth: false,
            padding: 1,
            plugins:'dragdroptag',
            filterPickList: true,
            publishes: 'value',

            listeners: {
                
            },
            
            // allowBlank: false,
            listConfig: {
                loadingText: 'Carregando...',
                emptyText: '<div class="notificacao-red">Nenhuma produto encontrado!</div>',
                getInnerTpl: function() {
                    return '{[ values.codItem]} {[ values.descricao]} {[ values.marca]}';
                }
            }
        });

        var elTagMarca = Ext.create('Ext.form.field.Tag',{
            name: 'elMarca',
            itemId: 'elMarca',
            multiSelect: true,
            store: Ext.data.Store({
                fields: [
                    { name: 'marca', type: 'string' },
                    { name: 'idMarca', type: 'string' }
                ],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/dshpvd/listarmarca',
                    timeout: 120000,
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            width: 380,
            queryParam: 'marca',
            queryMode: 'local',
            displayField: 'marca',
            valueField: 'idMarca',
            emptyText: 'Marca',
            // fieldLabel: 'Marcas',
            // labelWidth: 60,
            // margin: '0 1 0 0',
            padding: 1,
            plugins:'dragdroptag',
            filterPickList: true,
            publishes: 'value',
            disabled: true
        });
        elTagMarca.store.load(
            function(){
                elTagMarca.setDisabled(false);
            }
        );

        var btnConsultar = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-search',
            tooltip: 'Consultar',
            margin: '1 1 1 4',
            handler: me.onBtnConsultar
        });

        Ext.applyIf(me, {

            items : [
                // elTagEmpresa,
                // elTagProduto,
                // elTagMarca,
                btnFiltro,
                btnConsultar
            ]
        });

        me.callParent(arguments);

    },

    onBtnFiltros: function(btn){
        var me = this.up('toolbar');

        if(me.up('container').down('#panelwest').hidden){
            me.up('container').down('#panelwest').setHidden(false);
        }else{
            me.up('container').down('#panelwest').setHidden(true);
        }
        
    },

    onBtnConsultar: function(btn){
        var me = this.up('toolbar');

        var meses =
            [null,
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro'];

        var idEmpresas  = me.up('container').down('#panelwest').down('#elEmp').getValue();
        var idMarcas    = me.up('container').down('#panelwest').down('#elMarca').getValue();
        var codProdutos = me.up('container').down('#panelwest').down('#elProduto').getValue();

        var grid = me.up('container').down('#panelcenter').down('grid');

        var params = {
            idEmpresas: Ext.encode(idEmpresas),
            idMarcas: Ext.encode(idMarcas),
            codProdutos: Ext.encode(codProdutos)
        };

        grid.getStore().getProxy().setExtraParams(params);
        grid.getStore().load(
            function(record){
                var columns = grid.getView().getHeaderCt().getGridColumns();
                Ext.each(columns, function (col) {

                    switch (col.texto) {
                        case 'M0':
                          col.setText(meses[parseFloat(record[0].data.mesM0)]);
                          break;
                        case 'M1':
                            col.setText(meses[parseFloat(record[0].data.mesM1)]);
                            break;
                        case 'M2':
                          col.setText(meses[parseFloat(record[0].data.mesM2)]);
                          break;
                        case 'M3':
                            col.setText(meses[parseFloat(record[0].data.mesM3)]);
                            break;
                        case 'M4':
                            col.setText(meses[parseFloat(record[0].data.mesM4)]);
                            break;
                        case 'M5':
                            col.setText(meses[parseFloat(record[0].data.mesM5)]);
                            break;
                        case 'M6':
                            col.setText(meses[parseFloat(record[0].data.mesM6)]);
                            break;
                        case 'M7':
                            col.setText(meses[parseFloat(record[0].data.mesM7)]);
                            break;
                        case 'M8':
                            col.setText(meses[parseFloat(record[0].data.mesM8)]);
                            break;
                        case 'M9':
                            col.setText(meses[parseFloat(record[0].data.mesM9)]);
                            break;
                        case 'M10':
                            col.setText(meses[parseFloat(record[0].data.mesM10)]);
                            break;
                        case 'M11':
                            col.setText(meses[parseFloat(record[0].data.mesM11)]);
                            break;
                      }
                });
            }
        );

    }
    
});