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
    width: '100%',
    height: Ext.getBody().getHeight() * 0.9,
    scrollable: true,

    initComponent: function() {
        var me = this;

        Ext.define('App.view.home.formoption',{
            extend: 'Ext.toolbar.Toolbar',
            width: '100%',
            cls: 'x-column-header',
            // cls: 'x-panel-header-default',
            items:[
                {
                    xtype: 'displayfield',
                    value: 'Option'
                },
                '->',
                {
                    xtype: 'button',
                    // text: ' ',
                    iconCls: 'fa fa-tools',
                    menu: [
                        {
                            text: 'Nova Aba',
                            handler: function(){
                                var homeMain = this.up('button').up('toolbar').up('panel').up('container').up('panel');

                                var newTab = Ext.create('Ext.panel.Panel',{
                                    closable:true
                                });

                                var objTable = Ext.create('App.view.home.ContainerHighCharts');

                                objTable.chart.reflow();

                                newTab.add(objTable);

                                homeMain.add(newTab);
                                // homeMain.setActiveItem(newTab);

                                console.log(newTab);
                            }
                        },
                        {
                            text: 'Window',
                            handler: function(){
                            }
                        }
                    ]
                }
            ]
        });
        
        Ext.define('App.view.home.formdolar',{
            extend: 'Ext.panel.Panel',
            width: '100%',
            bodyPadding: 10,
            frame: true,
            collapsed: true,
            collapsible: false,
            ui: 'light',
            hidden: false,
            header: {
                enableFocusableContainer: false,
                title: {
                    text: 'Cotação Dolar Comercial',
                    focusable: true,
                    tabIndex: 0
                }
            },
            tools: [
                {
                    type: 'restore',
                    handler: function() {
                        // show help here
                    }
                },
                {
                    type: 'maximize',
                    handler: function () {
                        // do refresh

                    }
                },
                {
                    type: 'close',
                    handler: function (panel) {
                        // do search
                        panel.down('#refresh').show();
                    }
                }
            ]
            
        });

        Ext.applyIf(me, {

            items: [
                {
                    // html: 'Cell A content',
                    height: 220,
                    margin: '1 1 1 1',
                    xtype: 'panel',
                    layout: 'vbox',
                    items: [
                        Ext.create('App.view.home.formoption'),
                        {
                            xtype: 'fiichart',
                            height: '90%'
                        }
                    ]
                },
                {
                    // html: 'Cell B content',
                    height: 220,
                    width: '100%',
                    margin: '1 1 1 1',
                    xtype: 'panel',
                    bodyPadding: 10,
                    frame: true,
                    ui: 'light',
                    title: 'Cotação Dolar Comercial',
                    tools: [
                        {
                            type: 'restore',
                            handler: function() {
                                // show help here
                            }
                        },
                        {
                            type: 'maximize',
                            handler: function () {
                                // do refresh

                            }
                        },
                        {
                            type: 'close',
                            handler: function (panel) {
                                // do search
                                panel.down('#refresh').show();
                            }
                        }
                    ]
                },
                {
                    // html: 'Cell C content',
                    height: 220,
                    margin: '1 1 1 1',
                    xtype: 'panel',
                    layout: 'vbox',
                    items: [
                        Ext.create('App.view.home.formoption'),
                        {
                            xtype: 'homechart'
                        }
                    ]
                },
                {
                    // html: 'Cell D content',
                    height: 220,
                    margin: '1 1 1 1',
                    xtype: 'panel',
                    layout: 'vbox',
                    items: [
                        Ext.create('App.view.home.formoption'),
                        {
                            xtype: 'homechart'
                        }
                    ]
                },
                {
                    // html: 'Cell A2 content',
                    height: 220,
                    margin: '1 1 1 1',
                    xtype: 'panel',
                    layout: 'vbox',
                    items: [
                        Ext.create('App.view.home.formoption'),
                        {
                            xtype: 'homechart'
                        }
                    ]
                },
                {
                    // html: 'Cell B2 content',
                    height: 220,
                    margin: '1 1 1 1',
                    xtype: 'panel',
                    layout: 'vbox',
                    items: [
                        Ext.create('App.view.home.formoption'),
                        {
                            xtype: 'homechart'
                        }
                    ]
                },
                {
                    // html: 'Cell A2 content',
                    height: 220,
                    margin: '1 1 1 1',
                    xtype: 'panel',
                    layout: 'vbox',
                    items: [
                        Ext.create('App.view.home.formoption'),
                        {
                            xtype: 'homechart'
                        }
                    ]
                },
                {
                    // html: 'Cell B2 content',
                    height: 220,
                    margin: '1 1 1 1',
                    xtype: 'panel',
                    layout: 'vbox',
                    items: [
                        Ext.create('App.view.home.formoption'),
                        {
                            xtype: 'homechart'
                        }
                    ]
                },
                {
                    // html: 'Cell A2 content',
                    height: 220,
                    margin: '1 1 1 1',
                    xtype: 'panel',
                    layout: 'vbox',
                    items: [
                        Ext.create('App.view.home.formoption'),
                        {
                            xtype: 'homechart'
                        }
                    ]
                },
                {
                    // html: 'Cell B2 content',
                    height: 220,
                    margin: '1 1 1 1',
                    xtype: 'panel',
                    layout: 'vbox',
                    items: [
                        Ext.create('App.view.home.formoption'),
                        {
                            xtype: 'homechart'
                        }
                    ]
                }
            ]

        });

        me.callParent(arguments);
    }
    
});
