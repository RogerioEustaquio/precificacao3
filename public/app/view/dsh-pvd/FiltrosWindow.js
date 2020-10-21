Ext.define('App.view.dsh-pvd.FiltrosWindow', {
    extend: 'Ext.window.Window',
    xtype: 'filtroswindow',
    itemId: 'filtroswindow',
    height: Ext.getBody().getHeight() * 0.8,
    width: Ext.getBody().getWidth() * 0.9,
    title: 'Filtros',
    requires:[
        'App.view.dsh-pvd.PluginDragDropTag'
    ],
    layout: 'fit',
    modal: true,
    scrollable: false,

    constructor: function() {
        var me = this;

        var fielData = Ext.create('Ext.form.field.Date',{
            name: 'data',
            itemId: 'data',
            fieldLabel: 'Mês de Referência',
            // margin: '1 1 1 1',
            padding: 1,
            width: 240,
            labelWidth: 120,
            format: 'm/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____'
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
            width: '96%',
            name: 'emp',
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
            width: '96%',
            name: 'marca',
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
                    url: BASEURL + '/api/dshpvd/listarcurva',
                    timeout: 120000,
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            width: '96%',
            name: 'idCurvaAbc',
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

        var btnConfirm = Ext.create('Ext.button.Button',{

            text: 'Confirmar',
            name: 'confirmar',
            // margin: '2 10 2 2'
            padding: 1
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
                                margin: '0 0 10 0',
                                border: false
                            },
                            items: [
                                {
                                    xtype: 'panel',
                                    layout: 'hbox',
                                    items:[
                                        fielData,
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            margin: '1 1 1 4',
                                            handler: function(form) {
                                                form.up('panel').down('datefield').setValue(null);
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
                                }
                            ]
                        },
                        {
                            xtype: 'toolbar',
                            region: 'south',
                            items: [
                                '->',
                                {
                                    xtype: 'form',
                                    border: false,
                                    items: [
                                        btnConfirm
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]

        });

        me.callParent(arguments);

    }

});
