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
    scrollable: true,

    constructor: function() {
        var me = this;

        var elTagEmpresa = Ext.create('Ext.form.field.Tag',{
            name: 'elEmp',
            itemId: 'elEmp',
            store: Ext.data.Store({
                fields: [
                    { name: 'emp', type: 'string' }
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
            width: '98%',
            name: 'emp',
            queryParam: 'emp',
            queryMode: 'local',
            displayField: 'emp',
            valueField: 'emp',
            emptyText: 'Empresa',
            fieldLabel: 'Empresas',
            labelWidth: 60,
            margin: '1 1 1 1',
            plugins:'dragdroptag',
            filterPickList: true,
            publishes: 'value'
        });
        elTagEmpresa.store.load();

        var elTagMarca = Ext.create('Ext.form.field.Tag',{
            name: 'elMarca',
            itemId: 'elMarca',
            store: Ext.data.Store({
                fields: [
                    { name: 'marca', type: 'string' }
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
            width: '98%',
            name: 'marca',
            queryParam: 'marca',
            queryMode: 'local',
            displayField: 'marca',
            valueField: 'marca',
            emptyText: 'Marca',
            fieldLabel: 'Marcas',
            labelWidth: 60,
            margin: '1 1 1 1',
            plugins:'dragdroptag',
            filterPickList: true,
            publishes: 'value'
        });
        elTagMarca.store.load();

        var btnConfirm = Ext.create('Ext.button.Button',{

            text: 'Confirmar',
            name: 'confirmar',
            margin: '2 10 2 2'
            // handler: function(form) {
            //     console.log(elementbx.getValue());
            // }
        });

        Ext.applyIf(me, {
            
            items:[
                {
                    xtype:'panel',
                    layout: 'border',
                    items:[
                        {
                            xtype: 'panel',
                            region: 'center',
                            defaults:{
                                padding: 10,
                                border: false
                            },
                            items: [
                                {
                                    xtype: 'form',
                                    layout: 'hbox',
                                    items:[
                                        elTagEmpresa,
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            margin: '1 1 1 4',
                                            handler: function(form) {
                                                form.up('form').down('tagfield').setValue(null);
                                            }
                                        }
                                    ]
                
                                },
                                {
                                    xtype: 'form',
                                    layout: 'hbox',
                                    items:[
                                        elTagMarca,
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            margin: '1 1 1 4',
                                            handler: function(form) {
                                                form.up('form').down('tagfield').setValue(null);
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
