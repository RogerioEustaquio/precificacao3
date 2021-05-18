Ext.define('App.view.rpe.FiltrosWindowCexplore', {
    extend: 'Ext.window.Window',
    xtype: 'filtroswindowcexplore',
    itemId: 'filtroswindowcexplore',
    height: Ext.getBody().getHeight() * 0.8,
    width: Ext.getBody().getWidth() * 0.9,
    title: 'Filtros',
    requires:[
        
    ],
    layout: 'fit',
    modal: true,
    scrollable: false,

    constructor: function() {
        var me = this;

        var today = new Date();
        var sysdate = today.getMonth() +'/'+ today.getFullYear();

        var fielDataInicioA = Ext.create('Ext.form.field.Date',{
            name: 'datainicioa',
            itemId: 'datainicioa',
            fieldLabel: ' Período A',
            // margin: '1 1 1 1',
            padding: 1,
            width: 174,
            labelWidth: 64,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____',
            value: sysdate
        });

        var fielDataFinalA = Ext.create('Ext.form.field.Date',{
            name: 'datafinala',
            itemId: 'datafinala',
            fieldLabel: 'até',
            // margin: '1 1 1 1',
            padding: 1,
            width: 130,
            labelWidth: 20,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____',
            value: sysdate,
            listeners: {
                blur : function(){
                    
                    var datainicioa = this.up('window').down('#datainicioa').getRawValue();
                    var datafinala = this.getRawValue();

                    var arrayDtInicio = datainicioa.split('/');
                    var arrayDtFim = datafinala.split('/');

                    if(datafinala){

                        if(arrayDtInicio[2] == arrayDtFim[2]){

                            if(arrayDtInicio[1] > arrayDtFim[1]){

                                alert('Período final deve ser maior que o inicial!');
                                this.setValue(null);

                            }else if(arrayDtInicio[1] == arrayDtFim[1] && arrayDtInicio[0] > arrayDtFim[0]){
                                alert('Período final deve ser maior que o inicial!');
                                this.setValue(null);
                            }
                        }
                    }
                }
            
            }

        });

        var fielDataInicioB = Ext.create('Ext.form.field.Date',{
            name: 'datainiciob',
            itemId: 'datainiciob',
            fieldLabel: ' Período B',
            // margin: '1 1 1 1',
            padding: 1,
            width: 174,
            labelWidth: 64,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____',
            value: sysdate
        });

        var fielDataFinalB = Ext.create('Ext.form.field.Date',{
            name: 'datafinalb',
            itemId: 'datafinalb',
            fieldLabel: 'até',
            // margin: '1 1 1 1',
            padding: 1,
            width: 130,
            labelWidth: 20,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____',
            value: sysdate,
            listeners: {
                blur : function(){
                    
                    var datainiciob = this.up('window').down('#datainiciob').getRawValue();
                    var datafinalb = this.getRawValue();

                    var arrayDtInicio = datainiciob.split('/');
                    var arrayDtFim = datafinalb.split('/');

                    if(datafinalb){

                        if(arrayDtInicio[2] == arrayDtFim[2]){

                            if(arrayDtInicio[1] > arrayDtFim[1]){

                                alert('Período final deve ser maior que o inícial!');
                                this.setValue(null);

                            }else if(arrayDtInicio[1] == arrayDtFim[1] && arrayDtInicio[0] > arrayDtFim[0]){
                                alert('Período final deve ser maior que o inícial!');
                                this.setValue(null);
                            }
                        }
                    }
                }
            
            }
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
                    url: BASEURL + '/api/cexplore/listarEmpresas',
                    timeout: 120000,
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            width: '96%',
            queryParam: 'emp',
            queryMode: 'local',
            displayField: 'emp',
            valueField: 'idEmpresa',
            emptyText: 'Empresa',
            fieldLabel: 'Empresas',
            labelWidth: 60,
            // margin: '0 1 0 0',
            padding: 1,
            // plugins:'dragdroptag',
            filterPickList: true,
            publishes: 'value',
            disabled:true
        });
        elTagEmpresa.store.load(
            function(){
                elTagEmpresa.setDisabled(false);
            }
        );

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
                    url: BASEURL + '/api/cexplore/listarmarca',
                    timeout: 120000,
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            width: '96%',
            queryParam: 'marca',
            queryMode: 'local',
            displayField: 'marca',
            valueField: 'idMarca',
            emptyText: 'Marca',
            fieldLabel: 'Marcas',
            labelWidth: 60,
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

        var elTagGrupoMarca = Ext.create('Ext.form.field.Tag',{
            name: 'elgrupomarca',
            itemId: 'elgrupomarca',
            multiSelect: true,
            store: Ext.data.Store({
                autoLoad: true,
                fields: [
                    { name: 'id', type: 'string' },
                    { name: 'idMarcas', type: 'string' }
                ],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/cexplore/listargrupomarca',
                    timeout: 120000,
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            width: '96%',
            queryParam: 'idMarcas',
            queryMode: 'local',
            displayField: 'id',
            valueField: 'idMarcas',
            emptyText: 'Grupo',
            fieldLabel: 'Grupo Marca',
            // margin: '1 1 1 1',
            // plugins:'dragdroptag',
            filterPickList: true,
            publishes: 'value',
            disabled:false
        });

        var elTagCurva = Ext.create('Ext.form.field.Tag',{
            name: 'elCurva',
            itemId: 'elCurva',
            multiSelect: true,
            store: Ext.data.Store({
                fields: [
                    { name: 'idCurvaAbc', type: 'string' }
                ],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/price/listarcurva',
                    timeout: 120000,
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            width: '96%',
            queryParam: 'idCurvaAbc',
            queryMode: 'local',
            displayField: 'idCurvaAbc',
            valueField: 'idCurvaAbc',
            emptyText: 'Curva',
            fieldLabel: 'Curvas',
            labelWidth: 60,
            // margin: '0 1 0 0',
            padding: 1,
            plugins:'dragdroptag',
            filterPickList: true,
            publishes: 'value',
            disabled: true
        });
        elTagCurva.store.load(
            function(){
                elTagCurva.setDisabled(false);
            }
        );

        var elTagProduto = Ext.create('Ext.form.field.Tag',{
            name: 'elProduto',
            itemId: 'elProduto',
            multiSelect: true,
            width: '96%',
            labelWidth: 60,
            store: Ext.data.Store({
                fields: [{ name: 'coditem' }, { name: 'descricao' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/cexplore/listarprodutos',
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

        var btnConfirm = Ext.create('Ext.button.Button',{

            text: 'Confirmar',
            name: 'confirmar',
            // margin: '2 10 2 2'
            padding: 1
        });

        var btnLimpar = Ext.create('Ext.button.Button',{

            text: 'Limpar',
            name: 'limpar',
            // margin: '2 10 2 2'
            padding: 1,
            handler: me.onBtnLimpar
        });

        Ext.applyIf(me, {
            
            items:[
                {
                    xtype:'panel',
                    layout: 'border',
                    padding: 2,
                    border: false,
                    scrollable: false,
                    items:[
                        {
                            xtype: 'panel',
                            region: 'center',
                            scrollable: true,
                            defaults:{
                                margin: '2 2 10 2',
                                border: false
                            },
                            items: [
                                {
                                    xtype: 'panel',
                                    layout: 'hbox',
                                    items:[
                                        fielDataInicioA,
                                        fielDataFinalA,
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            margin: '1 1 1 4',
                                            handler: function(form) {
                                                form.up('panel').down('#datainicioa').setValue(null);
                                                form.up('panel').down('#datafinala').setValue(null);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    layout: 'hbox',
                                    items:[
                                        fielDataInicioB,
                                        fielDataFinalB,
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            margin: '1 1 1 4',
                                            handler: function(form) {
                                                form.up('panel').down('#datainiciob').setValue(null);
                                                form.up('panel').down('#datafinalb').setValue(null);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    layout: 'hbox',
                                    items:[
                                        elTagEmpresa,
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            margin: '1 1 1 4',
                                            handler: function(form) {
                                                form.up('panel').down('tagfield').setValue(null);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    layout: 'hbox',
                                    items:[
                                        elTagMarca,
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            margin: '1 1 1 4',
                                            handler: function(form) {
                                                form.up('panel').down('tagfield').setValue(null);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    layout: 'hbox',
                                    items:[
                                        elTagGrupoMarca,
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            margin: '1 1 1 4',
                                            handler: function(form) {
                                                form.up('panel').down('tagfield').setValue(null);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    layout: 'hbox',
                                    items:[
                                        elTagCurva,
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            margin: '1 1 1 4',
                                            handler: function(form) {
                                                form.up('panel').down('tagfield').setValue(null);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    layout: 'hbox',
                                    items:[
                                        elTagProduto,
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            margin: '1 1 1 4',
                                            handler: function(form) {
                                                form.up('panel').down('tagfield').setValue(null);
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'toolbar',
                            region: 'south',
                            items: [
                                '->',
                                btnConfirm,
                                btnLimpar
                            ]
                        }
                    ]
                }
            ]

        });

        me.callParent(arguments);

    },

    onBtnLimpar: function(){

        var me = this.up('toolbar').up('panel');
        
        me.down('panel').down('#datainicioa').setRawValue(null);
        me.down('panel').down('#datafinala').setRawValue(null);
        me.down('panel').down('#datainiciob').setRawValue(null);
        me.down('panel').down('#datafinalb').setRawValue(null);
        me.down('panel').down('tagfield[name=elEmp]').setValue(null);
        me.down('panel').down('tagfield[name=elMarca]').setValue(null);
        me.down('panel').down('tagfield[name=elgrupomarca]').setValue(null);
        me.down('panel').down('tagfield[name=elCurva]').setValue(null);
        me.down('panel').down('tagfield[name=elProduto]').setValue(null);

    }

});
