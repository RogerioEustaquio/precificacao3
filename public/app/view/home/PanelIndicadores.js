Ext.define('App.view.home.PanelIndicadores',{
    extend: 'Ext.container.Container',
    xtype: 'panelindicadores',
    itemId: 'panelindicadores',
    margin: '1 1 1 1',
    requires: [
        'App.view.home.ContainerHighCharts',
        'App.view.fii.ContainerHighCharts',
        'App.view.dolar.ContainerHighCharts'
    ],
    
    // title: 'Painel de Indicadores',
    layout: {
        type: 'table',
        columns: 3,
        tableAttrs: {
            style: {
                width: '100%'
            }
        }
    },

    defaults: {
        margin: '1 1 1 1',
        height: 220,
        layout: 'border',
        ui: 'light'
    },
    height: Ext.getBody().getHeight() * 0.9,
    scrollable: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {

            items: [
                {
                    // html: 'Cell B content',

                    title: 'Ficha de Indicadores',
                    items: [ { xtype: 'fiichart', region: 'center', flex: 1, margin: '0 0 0 0' }],
                    tools: [
                        // {
                        //     type: 'restore',
                        //     handler: function() {
                        //         // show help here
                        //     }
                        // }
                    ]
                },
                {
                    // html: 'Cell B content',

                    title: 'Cotação Dolar Comercial',
                    items: [ { xtype: 'dolarchart', region: 'center', flex: 1 }],
                    tools: [
                        // {
                        //     type: 'restore',
                        //     handler: function() {
                        //         // show help here
                        //     }
                        // }
                    ]
                },
                {
                    // html: 'Cell A content',
                    title: 'Chart Home',
                    tools: [
                        // {
                        //     type: 'restore',
                        //     handler: function() {
                        //         // show help here
                        //     }
                        // }
                    ],
                    items: [ { xtype: 'homechart', region: 'center', flex: 1 }],
                },
                {
                    // html: 'Cell A content',
                    title: 'Chart Home',
                    tools: [
                        // {
                        //     type: 'restore',
                        //     handler: function() {
                        //         // show help here
                        //     }
                        // }
                    ],
                    items: [ { xtype: 'homechart', region: 'center', flex: 1 }],
                },
                {
                    // html: 'Cell A content',
                    title: 'Chart Home',
                    tools: [
                        // {
                        //     type: 'restore',
                        //     handler: function() {
                        //         // show help here
                        //     }
                        // }
                    ],
                    items: [ { xtype: 'homechart', region: 'center', flex: 1 }],
                },
                {
                    // html: 'Cell A content',
                    title: 'Chart Home',
                    tools: [
                        // {
                        //     type: 'restore',
                        //     handler: function() {
                        //         // show help here
                        //     }
                        // }
                    ],
                    items: [ { xtype: 'homechart', region: 'center', flex: 1 }],
                },
                {
                    // html: 'Cell A content',
                    title: 'Chart Home',
                    tools: [
                        // {
                        //     type: 'restore',
                        //     handler: function() {
                        //         // show help here
                        //     }
                        // }
                    ],
                    items: [ { xtype: 'homechart', region: 'center', flex: 1 }],
                },
                {
                    // html: 'Cell A content',
                    title: 'Chart Home',
                    tools: [
                        // {
                        //     type: 'restore',
                        //     handler: function() {
                        //         // show help here
                        //     }
                        // }
                    ],
                    items: [ { xtype: 'homechart', region: 'center', flex: 1 }],
                },
                {
                    // html: 'Cell A content',
                    title: 'Chart Home',
                    tools: [
                        // {
                        //     type: 'restore',
                        //     handler: function() {
                        //         // show help here
                        //     }
                        // }
                    ],
                    items: [ { xtype: 'homechart', region: 'center', flex: 1 }],
                }
            ]

        });

        me.callParent(arguments);
    }
    
});
