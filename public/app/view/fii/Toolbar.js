Ext.define('App.view.fii.Toolbar',{
    extend: 'Ext.Toolbar',
    xtype: 'fiitoolbar',
    itemId: 'fiitoolbar',
    region: 'north',
    requires:[
        'App.view.fii.ContainerHighCharts'
    ],

    initComponent: function() {
        var me = this;

        var btnFiltro = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-filter',
            tooltip: 'Filtro',
            margin: '1 1 1 4',
            handler: me.onBtnFiltros
        });

        var btnConsultar = Ext.create('Ext.button.Button',{

            iconCls: 'fa fa-search',
            tooltip: 'Consultar',
            margin: '1 1 1 4',
            handler: me.onBtnConsultar
        });

        Ext.applyIf(me, {

            items : [
                btnFiltro,
                btnConsultar
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
        
        var charts = me.up('container').down('#panelcenter').down('#fiichart');
        // charts.chart.showLoading();
        charts.setLoading({msg: 'Carregando...'});

        var idEmpresas  = me.up('container').down('#panelwest').down('#elEmp').getValue();
        var codProdutos = me.up('container').down('#panelwest').down('#elProduto').getValue();
        var idMarcas    = me.up('container').down('#panelwest').down('#elMarca').getValue();
        var tpPessoas   = me.up('container').down('#panelwest').down('#elPessoa').getValue();
        var data        = me.up('container').down('#panelwest').down('#data').getRawValue();
        var idCurvas    = me.up('container').down('#panelwest').down('#elCurva').getValue();
        
        var grid = me.up('container').down('#panelcenter').down('grid');
        var params = {
            idEmpresas: Ext.encode(idEmpresas),
            idMarcas: Ext.encode(idMarcas),
            codProdutos: Ext.encode(codProdutos),
            tpPessoas: Ext.encode(tpPessoas),
            data: data,
            idCurvas: Ext.encode(idCurvas),
        };
        var seriesOrig = Array();
        var seriesLength = (charts.chart.series) ? charts.chart.series.length : 0 ;

        for (let index = 0; index < seriesLength; index++) {

            if(charts.chart.series[index].visible){
                seriesOrig.push({visible: true});
            }else{
                seriesOrig.push({visible: false});
            }
            
        }
  
        for(var i = seriesLength - 1; i > -1; i--)
        {
            charts.chart.series[i].remove();
        }

        charts.chart.update(false,false);

        Ext.Ajax.request({
            url: BASEURL +'/api/fii/listarfichaitemgrafico',
            method: 'POST',
            params: params,
            async: true,
            success: function (response) {
                var result = Ext.decode(response.responseText);

                charts.setLoading(false);
                // charts.chart.hideLoading();
                if(result.success){

                    rsarray = result.data;
                    var cont = 0;
                    
                    charts.chart.xAxis[0].setCategories(rsarray.categories);

                    rsarray.series.forEach(function(record){

                        record.visible      = seriesOrig[cont].visible;
                        record.showInLegend = charts.showLegend[cont];
                        charts.chart.addSeries(record);
                        cont++;
                    });

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

        var meses = [null,
                    'Janeiro',
                    'Fevereiro',
                    'Março',
                    'Abril',
                    'Maio',
                    'Junho',
                    'Julho',
                    'Agosto',
                    'Setembro',
                    'Outubro',
                    'Novembro',
                    'Dezembro'];

        var arrayHeader = grid.getColumns();
        var seqMes= [];
        Ext.Ajax.request({
            url: BASEURL +'/api/fii/listarfichaitemheader',
            method: 'POST',
            params: params,
            async: false,
            success: function (response) {
                var result = Ext.decode(response.responseText);
                if(result.success){

                    var rsarray = result.data;
                    rsarray.forEach(function(record){
                        seqMes.push(meses[parseFloat(record.id)]);
                    });

                    arrayHeader[1].setText(seqMes[0]);
                    arrayHeader[2].setText(seqMes[1]);
                    arrayHeader[3].setText(seqMes[2]);
                    arrayHeader[4].setText(seqMes[3]);
                    arrayHeader[5].setText(seqMes[4]);
                    arrayHeader[6].setText(seqMes[5]);
                    arrayHeader[7].setText(seqMes[6]);
                    arrayHeader[8].setText(seqMes[7]);
                    arrayHeader[9].setText(seqMes[8]);
                    arrayHeader[10].setText(seqMes[9]);
                    arrayHeader[11].setText(seqMes[10]);
                    arrayHeader[12].setText(seqMes[11]);

                }
            }
        });

        grid.getStore().getProxy().setExtraParams(params);
        grid.getStore().load(
            // function(record){
            //     var columns = grid.getView().getHeaderCt().getGridColumns();
            //     Ext.each(columns, function (col) {
            //               col.setText();
            //           }
            //     });
            // }
        );

        

    }

});
