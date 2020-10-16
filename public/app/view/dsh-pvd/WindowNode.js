Ext.define('App.view.dsh-pvd.WindowNode', {
    extend: 'Ext.window.Window',
    xtype: 'windownode',
    itemId: 'windownode',
    height: 200,
    width: 800,
    title: 'Filtros',
    requires:[
        'App.view.dsh-pvd.PluginDragDropTag'
    ],
    layout: 'fit',
    constructor: function() {
        var me = this;

        var elTagfield = Ext.create('Ext.form.field.Tag',{
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
            width: '100%',
            name: 'emp',
            queryParam: 'emp',
            queryMode: 'local',
            displayField: 'emp',
            valueField: 'emp',
            emptyText: 'Ordem',
            fieldLabel: 'Empresas',
            labelWidth: 60,
            margin: '1 1 1 1',
            plugins:'dragdroptag',
            filterPickList: true,
            publishes: 'value'
        });

        var btnConfirm = Ext.create('Ext.button.Button',{

            text: 'Confirmar',
            name: 'confirmar'
            // handler: function(form) {
            //     console.log(elementbx.getValue());
            // }
        });

        elTagfield.store.load();

        Ext.applyIf(me, {
            
            items:[
                {
                    xtype:'panel',
                    layout: 'border',
                    items:[
                        {
                            xtype: 'form',
                            region: 'center',
                            items: [
                                elTagfield
                            ]
                        },
                        {
                            xtype: 'toolbar',
                            region: 'south',
                            items: [
                                '->',
                                {
                                    xtype: 'form',
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
