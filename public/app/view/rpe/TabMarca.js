Ext.define('App.view.rpe.TabMarca', {
    extend: 'Ext.panel.Panel',
    xtype: 'tabmarca',
    itemId: 'tabmarca',
    closable: true,
    requires: [
        'App.view.rpe.GridMarcaOverview',
        'App.view.rpe.GridMarcaPerformance',
        'App.view.rpe.ChartsBrandPositioning',
        'App.view.rpe.FiltroMarca',
        'App.view.rpe.FiltroBrandPositioning'
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
        },
        {
            xtype: 'button',
            text: 'Brand Positioning',
            handler: function(){
            
                var bolha = Ext.create('App.view.rpe.ChartsBrandPositioning');

                var panelBolha =  this.up('panel').down('#containerbolha').down('#panelbolha');

                if(panelBolha.items.length == 0){
                    panelBolha.add(bolha);
                }
                // else{

                //     var charts = panelBolha.down('#chartsbrandpositioning');

                //     var seriesLength = (charts.chart.series) ? charts.chart.series.length : 0 ;

                //     for(var i = seriesLength - 1; i > -1; i--)
                //     {
                //         charts.chart.series[i].remove();
                //     }
                //     charts.setLoading(true);
                //     charts.chart.update(false,false);

                //     Ext.Ajax.request({
                //         url: BASEURL +'/api/marcabrandpositioning/marcabrandpositioning',
                //         method: 'POST',
                //         // params: params,
                //         async: true,
                //         timeout: 240000,
                //         success: function (response) {
                //             var result = Ext.decode(response.responseText);

                //             charts.setLoading(false);
                //             // charts.chart.hideLoading();
                //             if(result.success){

                //                 rsarray = result.data;
                //                 var cont = 0;
                                
                //                 // charts.chart.xAxis[0].setCategories(rsarray.categories);

                //                 var vSerie = Object();
                //                 var vData = Array();

                //                 rsarray.forEach(function(record){

                //                     vData.push({
                //                             x: parseFloat(record.x),
                //                             y:  parseFloat(record.y),
                //                             z: parseFloat(record.z),
                //                             desc: record.desc,
                //                             descricao: record.descricao
                //                     });

                //                     cont++;
                //                 });

                //                 vSerie = {data: vData};
                //                 charts.chart.addSeries(vSerie);

                //             }else{
                //                 rsarray = [];

                //                 new Noty({
                //                     theme: 'relax',
                //                     layout: 'bottomRight',
                //                     type: 'error',
                //                     closeWith: [],
                //                     text: 'Erro sistema: '+ result.message.substr(0,20)
                //                 }).show();
                //             }
                            
                //         },
                //         error: function() {
                //             rsarray = [];
                //             charts.setLoading(false);
                //             // charts.chart.hideLoading();

                //             new Noty({
                //                 theme: 'relax',
                //                 layout: 'bottomRight',
                //                 type: 'error',
                //                 closeWith: [],
                //                 text: 'Erro sistema: '+ result.message.substr(0,20)
                //             }).show();
                //         }
                //     });
                // }
                this.up('panel').setActiveItem(2);
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

                                        searchColumnIndexes = ['marca'];
                    
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
        },
        {
            xtype: 'container',
            layout:'border',
            itemId: 'containerbolha',
            items:[
                {
                    xtype:'filtrobrandpositioning',
                    region: 'west'
                },
                {
                    xtype: 'panel',
                    region: 'center',
                    layout: 'fit',
                    itemId: 'panelbolha',
                    tbar:[
                        {
                            xtype: 'button',
                            iconCls: 'fa fa-filter',
                            handler: function() {
                                var filtromarca =  this.up('panel').up('container').down('#filtrobrandpositioning');
                                var hidden = (filtromarca.hidden) ? false : true;
                                filtromarca.setHidden(hidden);
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'fa fa-search',
                            margin: '0 0 0 2',
                            tooltip: 'Consultar',
                            handler: function() {

                                var filtromarca =  this.up('panel').up('container').down('#filtrobrandpositioning');
                                var empresas = filtromarca.down('#elEmpresa').getValue();
                                // var data = filtromarca.down('#data').getRawValue();
                                var datainicio = filtromarca.down('#datainicio').getRawValue();
                                var datafim = filtromarca.down('#datafim').getRawValue();
                                var marcas = filtromarca.down('#elmarca').getValue();
                                
                                var params = {
                                    idEmpresas: Ext.encode(empresas),
                                    datainicio : datainicio,
                                    datafim: datafim,
                                    idMarcas: Ext.encode(marcas)
                                };

                                // var gridStore = this.up('panel').down('grid').getStore();
                                // gridStore.getProxy().setExtraParams(params);
                                // gridStore.load();

                                var panelBolha =  this.up('panel');
                                var charts = panelBolha.down('#chartsbrandpositioning');

                                var seriesLength = (charts.chart.series) ? charts.chart.series.length : 0 ;

                                for(var i = seriesLength - 1; i > -1; i--)
                                {
                                    charts.chart.series[i].remove();
                                }
                                charts.setLoading(true);
                                charts.chart.update(false,false);

                                Ext.Ajax.request({
                                    url: BASEURL +'/api/marcabrandpositioning/marcabrandpositioning',
                                    method: 'POST',
                                    params: params,
                                    async: true,
                                    timeout: 240000,
                                    success: function (response) {
                                        var result = Ext.decode(response.responseText);

                                        charts.setLoading(false);
                                        // charts.chart.hideLoading();
                                        if(result.success){

                                            rsarray = result.data;
                                            var cont = 0;
                                            
                                            // charts.chart.xAxis[0].setCategories(rsarray.categories);

                                            var vSerie = Object();
                                            var vData = Array();

                                            rsarray.forEach(function(record){

                                                vData.push({
                                                        x: parseFloat(record.x),
                                                        y: parseFloat(record.y),
                                                        z: parseFloat(record.z),
                                                        desc: record.desc,
                                                        descricao: record.descricao
                                                });

                                                cont++;
                                            });

                                            vSerie = {data: vData};
                                            charts.chart.addSeries(vSerie);

                                            textSubtitle = {
                                                subtitle:{
                                                    text: result.referencia.incio + ' até ' + result.referencia.fim
                                                }
                                            };
        
                                            charts.chart.update(textSubtitle);

                                        }else{
                                            rsarray = [];

                                            new Noty({
                                                theme: 'relax',
                                                layout: 'bottomRight',
                                                type: 'error',
                                                closeWith: [],
                                                text: 'Erro sistema: '+ result.message.substr(0,20)
                                            }).show();
                                        }
                                        
                                    },
                                    error: function() {
                                        rsarray = [];
                                        charts.setLoading(false);
                                        // charts.chart.hideLoading();

                                        new Noty({
                                            theme: 'relax',
                                            layout: 'bottomRight',
                                            type: 'error',
                                            closeWith: [],
                                            text: 'Erro sistema: '+ result.message.substr(0,20)
                                        }).show();
                                    }
                                });
                
                            }
                        }
                    ],
                    items:[
                        // {
                        //     xtype: 'chartsbrandpositioning'
                        // }
                    ]
                    
                }
            ]
        }
        // {
        //     xtype: 'container',
        //     layout:'border',
        //     itemId: 'containerbolha',
        //     items:[
        //         {
        //             xtype: 'panel',
        //             region: 'center',
        //             layout: 'fit',
        //             itemId: 'panelbolha',
        //             items:[
        //                 // {
        //                 //     xtype: 'chartsbrandpositioning',
        //                 //     title: 'Bolha'
        //                 // }
        //             ]
                    
        //         }
        //     ]
        // }
    ]
})
