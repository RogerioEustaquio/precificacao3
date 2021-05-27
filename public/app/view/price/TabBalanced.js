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

        var today = new Date();
        // var mes = today.getMonth() < 10 ? '0'+ today.getMonth(): today.getMonth();
        var sysdate = /*today.getDate()*/'01' +'/'+ /*mes*/'01' +'/'+ today.getFullYear();

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
            value: sysdate
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

        var elTagProduto = Ext.create('Ext.form.field.Tag',{
            name: 'elProduto',
            itemId: 'elProduto',
            region: 'north',
            multiSelect: true,
            width: '96%',
            labelWidth: 60,
            store: Ext.data.Store({
                fields: [{ name: 'coditem' }, { name: 'descricao' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/price/listarprodutos',
                    reader: { type: 'json', root: 'data' },
                    extraParams: { tipoSql: 0}
                }
            }),
            queryParam: 'codItem',
            queryMode: 'remote',
            displayField: 'codItem',
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',		                            
                '{codItem} {descricao} {marca}',
                '</tpl>'), 
            valueField: 'codItem',
            emptyText: 'Produto',
            fieldLabel: 'Produtos',
            emptyText: 'Informe o código do produto',
            // matchFieldWidth: false,
            padding: 1,
            plugins:'dragdroptag',
            filterPickList: true,
            publishes: 'value',

            listeners: {
                
            },
            
            // allowBlank: false,
            listConfig: {
                loadingText: 'Carregando...',
                emptyText: '<div class="notificacao-red">Nenhuma produto encontrado!</div>',
                getInnerTpl: function() {
                    return '{[ values.codItem]} {[ values.descricao]} {[ values.marca]}';
                }
            }
        });

        var btnProduto = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-filter',
            tooltip: 'Produto',
            name: 'vproduto',
            // margin: '1 1 1 4',
            handler: function(){

                var w = Ext.getCmp('winprodutob');

                if(!w){

                    var vproduto = this;

                    var w = Ext.create('Ext.window.Window',{
                        title: 'Produto',
                        itemId: 'winprodutob',
                        height: 140,
                        width: 400,
                        bodyStyle: { background: '#ffffff' },
                        closeAction : 'method-hide',
                        layout:'border',
                        items: [
                            elTagProduto,
                            {
                                xtype: 'toolbar',
                                region:'south',
                                items :[
                                    '->',
                                    {
                                        xtype: 'button',
                                        text: 'Confirmar',
                                        listeners: {
                                            click: function(){
                                                // Adicionar valor na toolbar (this)
                                                vproduto.value = this.up('toolbar').up('window').down('tagfield[name=elProduto]').getValue();
                                                w.close();

                                                var marcas  = vproduto.up('toolbar').down('tagfield[name=prodmarca]').getValue();
                                                var filiais = vproduto.up('toolbar').down('tagfield[name=prodfilial]').getValue();
                                                var curvas  = vproduto.up('toolbar').down('button[name=vcurva]').value;
                                                var produtos= vproduto.up('toolbar').down('button[name=vproduto]').value;
                                                var datainicio  = vproduto.up('toolbar').down('datefield[name=datainicio]').getRawValue();
                                                var datafim = vproduto.up('toolbar').down('datefield[name=datafim]').getRawValue();
                                                var periodo = vproduto.up('toolbar').down('combobox[name=periodo]').getValue();
                                                
                                                var container = vproduto.up('toolbar').up('container');
                                                var storeproduto = container.down('#panelgridproduto').down('#gridprodutobalanced').getStore();
                            
                                                var params = {
                                                    marca: Ext.encode(marcas),
                                                    filial: Ext.encode(filiais),
                                                    curvas: Ext.encode(curvas),
                                                    produtos: Ext.encode(produtos),
                                                    datainicio: datainicio,
                                                    datafim: datafim,
                                                    periodo: periodo
                                                };
                            
                                                storeproduto.getProxy().setExtraParams(params);
                            
                                                storeproduto.load();
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }

                w.show();

            }
        });

        var elTagCurva = Ext.create('Ext.form.field.Tag',{
            name: 'elCurvab',
            itemId: 'elCurvab',
            region: 'north',
            multiSelect: true,
            store: Ext.data.Store({
                fields: [
                    { name: 'idCurvaAbc', type: 'string' }
                ],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/price/listarcurva',
                    timeout: 120000,
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            width: '96%',
            queryParam: 'idCurvaAbc',
            queryMode: 'local',
            displayField: 'idCurvaAbc',
            valueField: 'idCurvaAbc',
            emptyText: 'Curva',
            fieldLabel: 'Curvas',
            labelWidth: 60,
            // margin: '0 1 0 0',
            padding: 1,
            plugins:'dragdroptag',
            filterPickList: true,
            publishes: 'value',
            disabled: true
        });
        elTagCurva.store.load(
            function(){
                elTagCurva.setDisabled(false);
            }
        );

        var btnCurva = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-cubes',
            tooltip: 'Curva',
            name: 'vcurva',
            // margin: '1 1 1 4',
            handler: function(){

                var w = Ext.getCmp('wincurvab');

                if(!w){

                    var vcurva = this;

                    var w = Ext.create('Ext.window.Window',{
                        title: 'Curva',
                        name: 'wincurvab',
                        itemId: 'wincurvab',
                        height: 140,
                        width: 400,
                        bodyStyle: { background: '#ffffff' },
                        closeAction : 'method-hide',
                        layout:'border',
                        items: [
                            elTagCurva,
                            {
                                xtype: 'toolbar',
                                region: 'south',
                                items :[
                                    '->',
                                    {
                                        xtype: 'button',
                                        text: 'Confirmar',
                                        listeners: {
                                            click: function(){
                                                // Adicionar valor na toolbar (this)
                                                vcurva.value = this.up('toolbar').up('window').down('tagfield[name=elCurvab]').getValue();
                                                w.close();

                                                var marcas  = vcurva.up('toolbar').down('tagfield[name=prodmarca]').getValue();
                                                var filiais = vcurva.up('toolbar').down('tagfield[name=prodfilial]').getValue();
                                                var curvas  = vcurva.up('toolbar').down('button[name=vcurva]').value;
                                                var produtos= vcurva.up('toolbar').down('button[name=vproduto]').value;
                                                var datainicio  = vcurva.up('toolbar').down('datefield[name=datainicio]').getRawValue();
                                                var datafim = vcurva.up('toolbar').down('datefield[name=datafim]').getRawValue();
                                                var periodo = vcurva.up('toolbar').down('combobox[name=periodo]').getValue();
                                                
                                                var container = vcurva.up('toolbar').up('container');
                                                var storeproduto = container.down('#panelgridproduto').down('#gridprodutobalanced').getStore();
                            
                                                var params = {
                                                    marca: Ext.encode(marcas),
                                                    filial: Ext.encode(filiais),
                                                    curvas: Ext.encode(curvas),
                                                    produtos: Ext.encode(produtos),
                                                    datainicio: datainicio,
                                                    datafim: datafim,
                                                    periodo: periodo
                                                };
                            
                                                storeproduto.getProxy().setExtraParams(params);
                            
                                                storeproduto.load();
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }

                w.show();

            }
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
                                btnCurva,
                                btnProduto,
                                ' ',
                                fielDataInicio,
                                fielDataFim,
                                {
                                    xtype: 'button',
                                    iconCls: 'fa fa-search',
                                    tooltip: 'Consultar Produtos',
                                    // text: 'Consultar Produtos',
                                    handler: function (form){
                    
                                        var marcas  = form.up('toolbar').down('tagfield[name=prodmarca]').getValue();
                                        var filiais = form.up('toolbar').down('tagfield[name=prodfilial]').getValue();
                                        var curvas  = form.up('toolbar').down('button[name=vcurva]').value;
                                        var produtos= form.up('toolbar').down('button[name=vproduto]').value;
                                        var datainicio  = form.up('toolbar').down('datefield[name=datainicio]').getRawValue();
                                        var datafim = form.up('toolbar').down('datefield[name=datafim]').getRawValue();
                                        var periodo = form.up('toolbar').down('combobox[name=periodo]').getValue();
                                        
                                        var container = form.up('toolbar').up('container');
                                        var storeproduto = container.down('#panelgridproduto').down('#gridprodutobalanced').getStore();
                    
                                        var params = {
                                            marca: Ext.encode(marcas),
                                            filial: Ext.encode(filiais),
                                            curvas: Ext.encode(curvas),
                                            produtos: Ext.encode(produtos),
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
                                    iconCls: 'fa fa-calculator',
                                    // text: 'Calcular Preço Médio',
                                    tooltip: 'Calcular Preço Médio',
                                    handler: function (form){
                    
                                        var marcas = form.up('toolbar').down('tagfield[name=prodmarca]').getValue();
                                        var filiais  = form.up('toolbar').down('tagfield[name=prodfilial]').getValue();
                                        var curvas  = form.up('toolbar').down('button[name=vcurva]').value;
                                        var produtos= form.up('toolbar').down('button[name=vproduto]').value;
                                        var datainicio  = form.up('toolbar').down('datefield[name=datainicio]').getRawValue();
                                        var datafim  = form.up('toolbar').down('datefield[name=datafim]').getRawValue();
                                        var periodo  = form.up('toolbar').down('combobox[name=periodo]').getValue();

                                        var desMarca  = form.up('toolbar').down('tagfield[name=prodmarca]').getRawValue();
                                        desMarca = desMarca.replace(',',', ');
                                        var descFilial= form.up('toolbar').down('tagfield[name=prodfilial]').getRawValue();
                                        descFilial = descFilial.replace(',',', ');

                                        var container = form.up('toolbar').up('container');

                                        var gridproduto = container.down('#panelgridproduto').down('#gridprodutobalanced');
                                        var arrayproduto = gridproduto.getSelection();

                                        stringProduto ='';
                                        descProduto = '';
                                        for (let index = 0; index < arrayproduto.length; index++) {
                                            var element = arrayproduto[index];

                                            if(stringProduto){
                                                
                                                stringProduto += "','"+element.data.codItem;
                                                descProduto += " "+element.data.codItem;
                                            }else{
                                                
                                                stringProduto = element.data.codItem;
                                                descProduto = element.data.codItem;
                                            }
                                        }

                                        if(produtos){

                                            if(produtos.length){

                                                stringProduto = '';
                                                for (let index = 0; index < produtos.length; index++) {
                                                    var element = produtos[index];

                                                    stringProduto = !stringProduto ? element :  "','"+element ;
                                                }
                                            }
                                        }
                                       
                                        var storeitem = container.down('#panelcentral').down('#griditembalanced').down('grid').getStore();
                    
                                        var params = {
                                            marca: Ext.encode(marcas),
                                            filial: Ext.encode(filiais),
                                            curvas: Ext.encode(curvas),
                                            // produtos: Ext.encode(produtos),
                                            datainicio: datainicio,
                                            datafim: datafim,
                                            periodo: periodo,
                                            produtos: stringProduto
                                        };
                    
                                        storeitem.getProxy().setExtraParams(params);
                                        storeitem.load();

                                        // update gráfico
                                        var charts = me.down('container').down('#panelcentral').down('#chartsbalanced');

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
                                                        name: 'Preço Médio',
                                                        data: rsarray[0],
                                                        yAxis: 0,
                                                        index: 0,
                                                        // color: seriesCores[0],
                                                        visible: charts.showLegend[0]
                                                    };
                                                    charts.chart.addSeries(series1);

                                                    var series2 = {
                                                        type: 'line',
                                                        name: 'ROL Unitário',
                                                        data: rsarray[1],
                                                        yAxis: 1,
                                                        index: 1,
                                                        // color: seriesCores[0],
                                                        visible: charts.showLegend[1]
                                                    };
                                                    charts.chart.addSeries(series2);

                                                    var series3 = {
                                                        type: 'line',
                                                        name: 'Custo Unitário',
                                                        data: rsarray[2],
                                                        yAxis: 2,
                                                        index: 2,
                                                        // color: seriesCores[0],
                                                        visible: charts.showLegend[2]
                                                    };
                                                    charts.chart.addSeries(series3);

                                                    var series4 = {
                                                        type: 'line',
                                                        name: 'Lucro Unitário',
                                                        data: rsarray[3],
                                                        yAxis: 3,
                                                        index: 3,
                                                        // color: seriesCores[0],
                                                        visible: charts.showLegend[3]
                                                    };
                                                    charts.chart.addSeries(series4);

                                                    var series5 = {
                                                        type: 'line',
                                                        name: 'ROL',
                                                        data: rsarray[4],
                                                        // color: seriesCores[1],
                                                        yAxis: 4,
                                                        index: 4,
                                                        visible: charts.showLegend[4]
                                                    };
                                                    charts.chart.addSeries(series5);

                                                    var series6 = {
                                                        type: 'line',
                                                        name: 'CMV',
                                                        data: rsarray[5],
                                                        // color: seriesCores[1],
                                                        yAxis: 5,
                                                        index: 5,
                                                        visible: charts.showLegend[5]
                                                    };
                                                    charts.chart.addSeries(series6);

                                                    var series7 = {
                                                        type: 'line',
                                                        name: 'LB',
                                                        data: rsarray[6],
                                                        // color: seriesCores[2],
                                                        yAxis: 6,
                                                        index: 6,
                                                        visible: charts.showLegend[6]
                                                    };
                                                    charts.chart.addSeries(series7);

                                                    var series8 = {
                                                        type: 'line',
                                                        name: 'MB',
                                                        data: rsarray[7],
                                                        // color: seriesCores[2],
                                                        yAxis: 7,
                                                        index: 7,
                                                        visible: charts.showLegend[7]
                                                    };
                                                    charts.chart.addSeries(series8);

                                                    var series9 = {
                                                        type: 'column',
                                                        id: 'Quantidade',
                                                        name: 'Quantidade',
                                                        data: rsarray[8],
                                                        color: '#2EBD85',
                                                        yAxis: 8,
                                                        index: 8,
                                                        visible: charts.showLegend[8]
                                                    };
                                                    charts.chart.addSeries(series9);

                                                    var series10 = {
                                                        type: 'line',
                                                        name: 'Nota',
                                                        data: rsarray[9],
                                                        // color: seriesCores[4],
                                                        yAxis: 9,
                                                        index: 9,
                                                        visible: charts.showLegend[9]
                                                    };
                                                    charts.chart.addSeries(series10);

                                                    var subtitle = '';
                                                    if(descProduto){

                                                        subtitle= {
                                                            text: descProduto
                                                        };
                                                    }

                                                    charts.chart.update({
                                                        rangeSelector: {
                                                            selected: 2,
                                                        },
                                                        // title : {
                                                        //     text: desMarca + ' | ' + descFilial + ' ' + descProduto
                                                        // },
                                                        // subtitle
                                                    });

                                                    iColor= 0;
                                                    iCont =0 ;
                                                    charts.chart.series.forEach(function(record){

                                                        if(record.visible){

                                                            var color = Highcharts.getOptions().colors[iColor];
    
                                                            if(record.name == 'Quantidade' || record.name == 'Navigator 1'){
                                                                color = '#2EBD85';
                                                            }else{
                                                                
                                                                iColor++;
                                                            }
                                                            record.update({color:color},false);
                                                            
                                                        }
                                                        
                                                        iCont++;
                                                    });

                                                    charts.chart.redraw();
                                
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
                            title: 'Lista de Produtos',
                            collapsible: true,
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
                                    width: 348
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
