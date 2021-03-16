Ext.define('App.view.price.TabBalanced', {
    extend: 'Ext.panel.Panel',
    xtype: 'tabbalanced',
    itemId: 'tabbalanced',
    closable: false,
    requires: [
        'App.view.price.GridProdutoBalanced',
        'App.view.price.ChartsBalanced',
        'App.view.price.GridItemBalanced'
    ],
    title: 'Price Balanced',
    layout: 'card',
    border: false,
    // scrollable: true,
    constructor: function() {
        var me = this;

        var elTagMarca = Ext.create('Ext.form.field.Tag',{
            name: 'prodmarca',
            itemId: 'prodmarca',
            multiSelect: true,
            // labelAlign: 'top',
            // width: 180,
            maxHeight : 26,
            store: Ext.data.Store({
                fields: [
                    { name: 'marca', type: 'string' },
                    { name: 'idMarca', type: 'string' }
                ],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/produtoposicionamento/listarmarca',
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
            labelWidth: 44,
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

        var elTagEmpresa = Ext.create('Ext.form.field.Tag',{
            name: 'prodfilial',
            itemId: 'prodfilial',
            // labelAlign: 'top',
            multiSelect: true,
            store: Ext.data.Store({
                fields: [
                    { name: 'emp', type: 'string' },
                    { name: 'idEmpresa', type: 'string' }
                ],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/rpe/listarEmpresas',
                    timeout: 120000,
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            // width: 30,
            queryParam: 'emp',
            queryMode: 'local',
            displayField: 'emp',
            valueField: 'idEmpresa',
            emptyText: 'Filial',
            fieldLabel: 'Filiais',
            labelWidth: 34,
            margin: '1 1 1 1',
            plugins:'dragdroptag',
            filterPickList: true,
            publishes: 'value',
            disabled:true
        });
        elTagEmpresa.store.load(
            function(){
                elTagEmpresa.setDisabled(false);
            }
        );

        var fielDataInicio = Ext.create('Ext.form.field.Date',{
            name: 'datainicio',
            itemId: 'datainicio',
            // labelAlign: 'top',
            fieldLabel: 'Período',
            margin: '1 1 1 1',
            padding: 1,
            width: 152,
            labelWidth: 48,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____',
            // value: sysdate
        });

        var fielDataFim = Ext.create('Ext.form.field.Date',{
            name: 'datafim',
            itemId: 'datafim',
            // labelAlign: 'top',
            fieldLabel: 'até',
            margin: '1 1 1 1',
            padding: 1,
            width: 130,
            labelWidth: 20,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____',
            // value: sysdate
        });

        var storedata = Ext.create('Ext.data.Store', {
            fields: ['desc', 'name'],
            data : [
                {"desc":"Diário", "name":"D"},
                {"desc":"Mensal", "name":"M"}
            ]
        });

        var elTagData = Ext.create('Ext.form.ComboBox', {
            name: 'periodo',
            itemId: 'periodo',
            store: storedata,
            queryParam: 'emdescp',
            queryMode: 'local',
            displayField: 'desc',
            valueField: 'name',
            emptyText: 'Período',
            width: 90
        });

        Ext.applyIf(me, {

            items:[
                {
                    xtype: 'container',
                    layout:'border',
                    itemId: 'containerprincipal',
                    items:[
                        {
                            xtype:'toolbar',
                            region: 'north',
                            border: true,
                            scrollable: true,
                            items:[
                                elTagMarca,
                                ' ',
                                elTagEmpresa,
                                ' ',
                                fielDataInicio,
                                fielDataFim,
                                {
                                    xtype: 'button',
                                    text: 'Consultar Produtos',
                                    handler: function (form){
                    
                                        var marcas = form.up('toolbar').down('tagfield[name=prodmarca]').getValue();
                                        var filiais  = form.up('toolbar').down('tagfield[name=prodfilial]').getValue();
                                        var datainicio  = form.up('toolbar').down('datefield[name=datainicio]').getRawValue();
                                        var datafim  = form.up('toolbar').down('datefield[name=datafim]').getRawValue();
                                        var periodo  = form.up('toolbar').down('combobox[name=periodo]').getValue();
                                        
                                        var container = form.up('toolbar').up('container');
                                        var storeproduto = container.down('#panelgridproduto').down('#gridprodutobalanced').getStore();
                    
                                        var params = {
                                            marca: Ext.encode(marcas),
                                            filial: Ext.encode(filiais),
                                            datainicio: datainicio,
                                            datafim: datafim,
                                            periodo: periodo
                                        };
                    
                                        storeproduto.getProxy().setExtraParams(params);
                    
                                        storeproduto.load();
                                        
                                    }
                                },
                                '-',
                                elTagData,
                                ' ',
                                {
                                    xtype: 'button',
                                    text: 'Calcular Preço Médio',
                                    handler: function (form){
                    
                                        var marcas = form.up('toolbar').down('tagfield[name=prodmarca]').getValue();
                                        var filiais  = form.up('toolbar').down('tagfield[name=prodfilial]').getValue();
                                        var datainicio  = form.up('toolbar').down('datefield[name=datainicio]').getRawValue();
                                        var datafim  = form.up('toolbar').down('datefield[name=datafim]').getRawValue();
                                        var periodo  = form.up('toolbar').down('combobox[name=periodo]').getValue();

                                        var container = form.up('toolbar').up('container');

                                        var gridproduto = container.down('#panelgridproduto').down('#gridprodutobalanced');
                                        var arrayproduto = gridproduto.getSelection();

                                        stringProduto ='';
                                        for (let index = 0; index < arrayproduto.length; index++) {
                                            var element = arrayproduto[index];

                                            if(stringProduto){
                                                
                                                stringProduto += "','"+element.data.codItem;
                                            }else{
                                                
                                                stringProduto = element.data.codItem;
                                            }
                                        }
                                        
                                       
                                        var storeitem = container.down('#panelcentral').down('#griditembalanced').down('grid').getStore();
                    
                                        var params = {
                                            marca: Ext.encode(marcas),
                                            filial: Ext.encode(filiais),
                                            datainicio: datainicio,
                                            datafim: datafim,
                                            periodo: periodo,
                                            produtos: stringProduto
                                        };
                    
                                        storeitem.getProxy().setExtraParams(params);
                                        storeitem.load();

                                        // update gráfico
                                        var charts = me.down('container').down('#panelcentral').down('#chartsbalanced');

                                        // console.log(charts);

                                        var seriesLength = (charts.chart.series) ? charts.chart.series.length : 0 ;

                                        for(var i = seriesLength - 1; i > -1; i--)
                                        {
                                            charts.chart.series[i].remove();
                                        }
                                        charts.setLoading(true);
                                        // charts.chart.update(false,false);

                                        

                                        Ext.Ajax.request({
                                            url: BASEURL + '/api/balanced/listaritensbalanced',
                                            method: 'POST',
                                            params: params,
                                            async: true,
                                            timeout: 240000,
                                            success: function (response) {
                                                var result = Ext.decode(response.responseText);
                                
                                                charts.setLoading(false);
                                                
                                                if(result.success){
                                
                                                    rsarray = result.data;

                                                    var series1 = {
                                                                type: 'line',
                                                                name: 'preco',
                                                                data: rsarray[0]
                                                    };

                                                    var series2 = {
                                                                type: 'column',
                                                                id: 'quantidade',
                                                                name: 'quantidade',
                                                                data: rsarray[1],
                                                                color: 'green',
                                                                yAxis: 1
                                                    };

                                                    charts.chart.addSeries(series1);
                                                    charts.chart.addSeries(series2);
                                
                                                }else{
                                                    rsarray = [];
                                                    charts.setLoading(false);
                                
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
                            ]
                        },
                        {
                            xtype:'panel',
                            itemId: 'panelgridproduto',
                            region: 'west',
                            layout: 'fit',
                            width: 300,
                            border: false,
                            items: [
                                {
                                    xtype: 'gridprodutobalanced'
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            itemId: 'panelcentral',
                            region: 'center',
                            layout: 'border',
                            bodyStyle: 'background:#ffffff;',
                            border: false,
                            items:[
                                {
                                    xtype: 'griditembalanced',
                                    region: 'west',
                                    layout:'fit',
                                    width: 276
                                },
                                {
                                    xtype: 'chartsbalanced',
                                    region: 'center'
                                }
                            ]
                            
                        }
                    ]
                }
            ]
        })

        me.callParent(arguments);

    }
})
