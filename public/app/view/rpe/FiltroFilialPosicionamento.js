Ext.define('App.view.rpe.FiltroFilialPosicionamento',{
    extend: 'Ext.panel.Panel',
    xtype: 'filtrofilialposicionamento',
    itemId: 'filtrofilialposicionamento',
    title: 'Filtro',
    region: 'west',
    width: 220,
    hidden: true,
    scrollable: true,
    layout: 'vbox',
    requires:[
    ],

    constructor: function() {
        var me = this;

        var fielDataInicio = Ext.create('Ext.form.field.Date',{
            name: 'filialdatainicio',
            itemId: 'filialdatainicio',
            labelAlign: 'top',
            fieldLabel: 'Data Inícial',
            margin: '1 1 1 1',
            padding: 1,
            width: 180,
            labelWidth: 60,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____',
            // value: sysdate
        });

        var fielDataFim = Ext.create('Ext.form.field.Date',{
            name: 'filialdatafim',
            itemId: 'filialdatafim',
            labelAlign: 'top',
            fieldLabel: 'Data Final',
            margin: '1 1 1 1',
            padding: 1,
            width: 180,
            labelWidth: 60,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____',
            // value: sysdate
        });

        var elTagMarca = Ext.create('Ext.form.field.Tag',{
            name: 'filialelmarca',
            itemId: 'filialelmarca',
            multiSelect: true,
            labelAlign: 'top',
            width: 180,
            store: Ext.data.Store({
                fields: [
                    { name: 'marca', type: 'string' },
                    { name: 'idMarca', type: 'string' }
                ],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/filialposicionamento/listarmarca',
                    timeout: 120000,
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            queryParam: 'marca',
            queryMode: 'local',
            displayField: 'marca',
            valueField: 'idMarca',
            emptyText: 'Marca',
            fieldLabel: 'Marcas',
            // labelWidth: 60,
            margin: '1 1 1 1',
            // padding: 1,
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


        Ext.applyIf(me, {

            items : [
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    items:[
                        fielDataInicio,
                        {
                            xtype: 'button',
                            iconCls: 'fa fa-file',
                            tooltip: 'Limpar',
                            margin: '26 1 1 1',
                            handler: function(form) {
                                form.up('panel').down('datefield').setValue(null);
                            }
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    items:[
                        fielDataFim,
                        {
                            xtype: 'button',
                            iconCls: 'fa fa-file',
                            tooltip: 'Limpar',
                            margin: '26 1 1 1',
                            handler: function(form) {
                                form.up('panel').down('datefield').setValue(null);
                            }
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    items:[
                        elTagMarca,
                        {
                            xtype: 'button',
                            iconCls: 'fa fa-file',
                            tooltip: 'Limpar',
                            margin: '26 1 1 1',
                            handler: function(form) {
                                form.up('panel').down('tagfield').setValue(null);
                            }
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    width: '100%',
                    border: false,
                    items:[
                        '->',
                        {
                            xtype: 'button',
                            iconCls: 'fa fa-file',
                            text: 'Limpar Filtros',
                            tooltip: 'Limpar Filtros',
                            handler: function(form) {
                                form.up('toolbar').up('panel').down('tagfield[name=filialelmarca]').setValue(null);
                                form.up('toolbar').up('panel').down('datefield[name=filialdatainicio]').setValue(null);
                                form.up('toolbar').up('panel').down('datefield[name=filialdatafim]').setValue(null);
                            }
                        }
                    ]
                }
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

    }

});
