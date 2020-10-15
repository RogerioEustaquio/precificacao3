Ext.define('App.view.cpcf.WindowNf', {
    extend: 'Ext.window.Window',
    xtype: 'WindowNf',
    id: 'WindowNf',
    height: Ext.getBody().getHeight() * 0.8,
    width: Ext.getBody().getWidth() * 0.9,
    maximizable: true,
    title: 'Notas',
    requires:[
        'App.view.cpcf.NfItensGrid'
    ],
    layout: 'fit',
    items: {
        xtype: 'panel',
        id: 'WindowNfPanel',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items:[
            {
                xtype: 'form',
                height: 60,
                layout: {
                    type: 'hbox'
                },
                defaults: {
                    margin: '2 12 2 2',
                    labelAlign: 'top'
                },
                items:[
                    {
                        xtype: 'displayfield',
                        layout: 'ancho',
                        fieldLabel: '<b>Filial',
                        id: 'filial',
                        labelWidth: 30
                    },
                    {
                        xtype: 'displayfield',
                        layout: 'ancho',
                        fieldLabel: '<b>Fornecedor',
                        id: 'fornecedor',
                        labelWidth: 60
                    },
                    {
                        xtype: 'displayfield',
                        layout: 'ancho',
                        fieldLabel: '<b>Anterior',
                        id: 'totalAnterior',
                        labelWidth: 32,
                        value: 0
                    },
                    {
                        xtype: 'displayfield',
                        layout: 'ancho',
                        fieldLabel: '<b>Operação',
                        id: 'totalOperacao',
                        labelWidth: 32,
                        value: 0
                    },
                    {
                        xtype: 'displayfield',
                        layout: 'ancho',
                        fieldLabel: '<b>Operação x Anterior',
                        id: 'totalOpeXAnt',
                        labelWidth: 32,
                        value: 0
                    },
                    {
                        xtype: 'displayfield',
                        layout: 'ancho',
                        fieldLabel: '<b>% Operação x Anterior',
                        id: 'totalPOpeXAnt',
                        labelWidth: 32,
                        value: 0
                    }
                ]
            },
            {
                xtype: 'NfItensGrid',
                flex: 1
            }
        ]
    }
});
