Ext.define('App.view.cpce.FiltroPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'filtroPanel',
    id: 'filtroPanel',
    idItem: 'filtroPanel',
    width: 220,
    region: 'lest',
    layout: 'fit',
    constructor: function() {
        var me = this;

        var bxproduto = Ext.create('Ext.form.ComboBox',{
            width: 140,
            margin: '6 2 2 2',
            name: 'produto',
            id: 'bxproduto',
            store: Ext.data.Store({
                fields: [{ name: 'codItem' }, { name: 'descricao' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/CpCe/listarProdutos',
                    reader: { type: 'json', root: 'data' }
                }
            }),
            queryParam: 'codigo',
            queryMode: 'remote',
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '{codItem} {descricao}',
                '</tpl>'), 
            valueField: 'codItem',
            emptyText: 'Cod. Produto',
            matchFieldWidth: false,
            minChars: 5,
            listeners: {                    
            },
            allowBlank: false, 
            listConfig: {
                loadingText: 'Carregando...',
                emptyText: '<div class="notificacao-red">Nenhuma produto encontrado!</div>',
                getInnerTpl: function() {
                    return '{[ values.codItem]} {[ values.descricao]} {[ values.marca]}';
                }
            }
        });

        Ext.applyIf(me, {

            items:[
                {
                    xtype: 'panel',
                    id: 'pform',
                    idItem: 'pform',
                    title: 'Filtros',
                    scrollable: true,
                    items: [
                        {
                            xtype: 'form',
                            id: 'pform2',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    title: 'Produto',
                                    id: 'fprotudo',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle'
                                    },
                                    defaults: {
                                        margin: '6 2 2 2'
                                    },
                                    items: [
                                        bxproduto,
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            handler: function(form) {
                                                var objValor = form.up('fieldset').down('combobox');
                                                objValor.setSelection(null);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    title: 'Curva',
                                    id: 'fcurva',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle'
                                    },
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            name: 'curva',
                                            id: 'curva',
                                            emptyText: 'Curva',
                                            width: 100,
                                            margin: '6 2 2 2',
                                            store: Ext.create('Ext.data.Store', {
                                                        fields: ['curva', 'name'],
                                                        data : [
                                                            {"curva":"A", "name":"A"},
                                                            {"curva":"B", "name":"B"},
                                                            {"curva":"C", "name":"C"}
                                                        ]
                                            }),
                                            queryMode: 'local',
                                            displayField: 'name',
                                            valueField: 'curva'
                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            margin: '6 2 2 42',
                                            handler: function(form) {
                                                var objValor = form.up('fieldset').down('combobox');
                                                objValor.setSelection(null);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    title: 'Faixa de Clientes',
                                    id: 'ffaixa',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle'
                                    },
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            name: 'faixacli',
                                            id: 'faixacli',
                                            emptyText: 'Faixa Cliente',
                                            width: 120,
                                            margin: '6 2 2 2',
                                            store: Ext.create('Ext.data.Store', {
                                                        fields: ['faixacli', 'name'],
                                                        data : [
                                                            {"faixacli":"1000", "name":"1000"},
                                                            {"faixacli":"2000", "name":"2000"},
                                                            {"faixacli":"500", "name":"500"},
                                                            {"faixacli":"100", "name":"100"},
                                                            {"faixacli":"50", "name":"6-50"}
                                                        ]
                                            }),
                                            queryMode: 'local',
                                            displayField: 'name',
                                            valueField: 'faixacli'
                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            margin: '6 2 2 22',
                                            handler: function(form) {
                                                var objValor = form.up('fieldset').down('combobox');
                                                objValor.setSelection(null);
                                            }
                                        }
                                    ]
                                },
                                ,
                                {
                                    xtype: 'fieldset',
                                    title: 'Faixa de Custo',
                                    id: 'ffaixacusto',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle'
                                    },
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            name: 'faixacusto',
                                            id: 'faixacusto',
                                            emptyText: 'Faixa Custo',
                                            width: 120,
                                            margin: '6 2 2 2',
                                            store: Ext.create('Ext.data.Store', {
                                                        fields: [{ name: 'fxCusto' }],
                                                        proxy: {
                                                            type: 'ajax',
                                                            url: BASEURL + '/api/CpCe/listarfaixacusto',
                                                            timeout: 120000,
                                                            reader: {
                                                                type: 'json',
                                                                root: 'data'
                                                            }
                                                        },
                                                        autoLoad: true
                                            }),
                                            queryParam: 'fxCusto',
                                            queryMode: 'local',
                                            displayField: 'fxCusto',
                                            valueField: 'fxCusto'
                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            margin: '6 2 2 22',
                                            handler: function(form) {
                                                var objValor = form.up('fieldset').down('combobox');
                                                objValor.setSelection(null);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    title: '% Variação x ùltima entrada',
                                    id: 'fvariaUltentrada',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle'
                                    },
                                    defaults: {
                                        margin: '6 2 2 2'
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            name: 'variaUltentrada',
                                            id: 'variaUltentrada',
                                            width: 140
                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            handler: function(form) {
                                                var objValor = form.up('fieldset').down('numberfield');
                                                objValor.setValue(null);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    id: 'fvariaUltcusto',
                                    title: '% Variação x último custo do ano anterior',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle'
                                    },
                                    defaults: {
                                        margin: '6 2 2 2'
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            name: 'variaUltcusto',
                                            id: 'variaUltcusto',
                                            width: 140
                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            handler: function(form) {
                                                var objValor = form.up('fieldset').down('numberfield');
                                                objValor.setValue(null);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    id: 'fvariaCustomedio',
                                    title: '% Variação x Custo médio ano anterior',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle'
                                    },
                                    defaults: {
                                        margin: '6 2 2 2'
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            name: 'variaCustomedio',
                                            id: 'variaCustomedio',
                                            width: 140
                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            handler: function(form) {
                                                var objValor = form.up('fieldset').down('numberfield');
                                                objValor.setValue(null);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    id: 'fvariaEmergmedio',
                                    title: '% Variação x Custo médio .P ano anterior',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle'
                                    },
                                    defaults: {
                                        margin: '6 2 2 2'
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            name: 'variaEmergmedio',
                                            id: 'variaEmergmedio',
                                            width: 140
                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            handler: function(form) {
                                                var objValor = form.up('fieldset').down('numberfield');
                                                objValor.setValue(null);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    id: 'fvaria3mes',
                                    title: '% Variação x Custo médio 3 meses anterior',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle'
                                    },
                                    defaults: {
                                        margin: '6 2 2 2'
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            name: 'varia3mes',
                                            id: 'varia3mes',
                                            width: 140
                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            handler: function(form) {
                                                var objValor = form.up('fieldset').down('numberfield');
                                                objValor.setValue(null);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    id: 'fvaria6mes',
                                    title: '% Variação x Custo médio 6 meses anterior',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle'
                                    },
                                    defaults: {
                                        margin: '6 2 2 2'
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            name: 'varia6mes',
                                            id: 'varia6mes',
                                            width: 140
                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            handler: function(form) {
                                                var objValor = form.up('fieldset').down('numberfield');
                                                objValor.setValue(null);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    id: 'fvaria12mes',
                                    title: '% Variação x Custo médio 12 meses anterior',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle'
                                    },
                                    defaults: {
                                        margin: '6 2 2 2'
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            name: 'varia12mes',
                                            id: 'varia12mes',
                                            width: 140
                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-file',
                                            tooltip: 'Limpar',
                                            handler: function(form) {
                                                var objValor = form.up('fieldset').down('numberfield');
                                                objValor.setValue(null);
                                            }
                                        }
                                    ]
                                }
        
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    title: 'Marcas',
                    id: 'pmarcagrid',
                    idItem: 'pmarcagrid',
                    scrollable: true,
                    items: [
                        {
                            xtype: 'MarcaGrid',
                        }
                    ]
                }
            ]
            

        });

        me.callParent(arguments);
    }

});
