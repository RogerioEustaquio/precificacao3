Ext.define('App.view.rpe.TabMarca', {
    extend: 'Ext.panel.Panel',
    xtype: 'tabmarca',
    itemId: 'tabmarca',
    closable: true,
    requires: [
        'App.view.rpe.GridMarca',
        'App.view.rpe.FiltroMarca'
    ],
    title: 'Marca',
    layout: 'card',
    tbar: [
        {
            xtype: 'button',
            text: 'Orverview',
            handler: function(){
                this.up('panel').setActiveItem(0);
            }
        },
        // {
        //     xtype: 'button',
        //     text: 'Performance',
        //     handler: function(){
        //         this.up('panel').setActiveItem(1);
        //     }
        // }
    ],
    items:[
        {
            xtype: 'container',
            layout:'border',
            items:[
                {
                    xtype:'filtromarca',
                    region: 'west'
                },
                {
                    xtype: 'panel',
                    region: 'center',
                    layout: 'fit',
                    tbar:[
                        {
                            xtype: 'button',
                            iconCls: 'fa fa-filter',
                            handler: function() {
                                var filtromarca =  this.up('panel').up('container').down('#filtromarca');
                                var hidden = (filtromarca.hidden) ? false : true;
                                this.up('panel').up('container').down('#filtromarca').setHidden(hidden);
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'fa fa-search',
                            margin: '0 0 0 2',
                            tooltip: 'Consultar',
                            handler: function() {

                                var filtromarca =  this.up('panel').up('container').down('#filtromarca');
                                var empresas = filtromarca.down('#elEmpresa').getValue();
                                var data = filtromarca.down('#data').getRawValue();
                                var marcas = filtromarca.down('#elgrupomarca').getValue();
                                
                                var params = {
                                    idEmpresas: Ext.encode(empresas),
                                    data : data,
                                    idMarcas: Ext.encode(marcas)
                                };
                
                                var gridStore = this.up('panel').down('grid').getStore();
                
                                gridStore.getProxy().setExtraParams(params);
                                gridStore.load();
                
                            }
                        }
                    ],
                    items:[
                        {
                            xtype: 'gridmarca'
                        }
                    ]
                    
                }
            ]
        },
        {
            xtype: 'panel',
            title: 'Panel Grid 2'
        }
    ]
})
