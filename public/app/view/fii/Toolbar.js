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

        var idEmpresas  = me.up('container').down('#panelwest').down('#elEmp').getValue();
        var codProdutos = me.up('container').down('#panelwest').down('#elProduto').getValue();
        var idMarcas    = me.up('container').down('#panelwest').down('#elMarca').getValue();
        var tpPessoas = me.up('container').down('#panelwest').down('#elPessoa').getValue();
        
        var grid = me.up('container').down('#panelcenter').down('grid');
        var params = {
            idEmpresas: Ext.encode(idEmpresas),
            idMarcas: Ext.encode(idMarcas),
            codProdutos: Ext.encode(codProdutos),
            tpPessoas: Ext.encode(tpPessoas),
        };
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

        var charts = me.up('container').down('#panelcenter').down('#fiichart');

        var seriesOrig = Array();
        var seriesLength = charts.chart.series.length;

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

        Ext.Ajax.request({
            url: BASEURL +'/api/fii/listarfichaitemgrafico',
            method: 'POST',
            params: params,
            async: false,
            success: function (response) {
                var result = Ext.decode(response.responseText);
                if(result.success){

                    rsarray = result.data;
                    var cont = 0;
                    rsarray.series.forEach(function(record){
                        
                        record.visible = seriesOrig[cont].visible;
                        charts.chart.addSeries(record);
                        cont++;
                    });

                    // charts.chart.update(
                    //     {
                    //         title: {
                    //             text: 'teste'
                    //         },

                    //         series: rsarray.series
                    //     }
                    // );

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

});
