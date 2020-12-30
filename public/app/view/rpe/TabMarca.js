Ext.define('App.view.rpe.TabMarca', {
    extend: 'Ext.panel.Panel',
    xtype: 'tabmarca',
    itemId: 'tabmarca',
    closable: true,
    requires: [
        'App.view.rpe.GridMarcaOverview',
        'App.view.rpe.GridMarcaPerformance',
        'App.view.rpe.FiltroMarca'
    ],
    title: 'Marca',
    layout: 'card',
    tbar: [
        {
            xtype: 'button',
            text: 'Overview',
            handler: function(){
                this.up('panel').setActiveItem(0);
            }
        },
        {
            xtype: 'button',
            text: 'Performance',
            handler: function(){
                this.up('panel').setActiveItem(1);
            }
        }
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
                        },
                        '->',
                        {
                            name: 'filterfield',
                            xtype: 'textfield',
                            inputType: 'textfield',
                            width: 260,
                            emptyText: 'Buscar por marca',
                            listeners: {
                                change: function(field){
                                    
                                    var store = this.up('panel').down('grid').getStore();

                                    setTimeout(function(){
                                        var value = Ext.util.Format.uppercase(field.getValue());
                                        var filters = store.getFilters();

                                        searchColumnIndexes = ['marca']
                    
                                        var filter = new Ext.util.Filter({
                                            filterFn: function (record) {
                                                        var found = false;
                    
                                                        searchColumnIndexes.forEach(function(columnIndex){
                                                        if (record.get(columnIndex) && record.get(columnIndex).indexOf(value) != -1) {
                                                        found = true;
                                                        }
                                                    });
                    
                                                    return found;
                                            }
                                        });
                    
                                        store.clearFilter();
                                        store.filter(filter);
                                    }, 300);
                                }
                            }
                        },
                        {
                            tooltip: 'Limpar filtro',
                            iconCls: 'fa fa-file',
                            handler: function(btn){

                                filterField = this.up('panel').down('textfield[name=filterfield]')
                    
                                filterField.reset()
                                grid.getStore().clearFilter()
                            }
                        }
                    ],
                    items:[
                        {
                            xtype: 'gridmarcaoverview'
                        }
                    ]
                    
                }
            ]
        },
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
                        },
                        '->',
                        {
                            name: 'filterfield',
                            xtype: 'textfield',
                            inputType: 'textfield',
                            width: 260,
                            emptyText: 'Buscar por marca',
                            listeners: {
                                change: function(field){
                                    
                                    var store = this.up('panel').down('grid').getStore();

                                    setTimeout(function(){
                                        var value = Ext.util.Format.uppercase(field.getValue());
                                        var filters = store.getFilters();

                                        searchColumnIndexes = ['marca']
                    
                                        var filter = new Ext.util.Filter({
                                            filterFn: function (record) {
                                                        var found = false;
                    
                                                        searchColumnIndexes.forEach(function(columnIndex){
                                                        if (record.get(columnIndex) && record.get(columnIndex).indexOf(value) != -1) {
                                                        found = true;
                                                        }
                                                    });
                    
                                                    return found;
                                            }
                                        });
                    
                                        store.clearFilter();
                                        store.filter(filter);
                                    }, 300);
                                }
                            }
                        },
                        {
                            tooltip: 'Limpar filtro',
                            iconCls: 'fa fa-file',
                            handler: function(btn){

                                filterField = this.up('panel').down('textfield[name=filterfield]')
                    
                                filterField.reset()
                                grid.getStore().clearFilter()
                            }
                        }
                    ],
                    items:[
                        {
                            xtype: 'gridmarcaperformance'
                        }
                    ]
                    
                }
            ]
        }
    ]
})
