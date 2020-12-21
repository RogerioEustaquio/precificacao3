Ext.define('App.view.api-bcb.ContainerHighCharts', {
    extend: 'Ext.Container',
    xtype: 'apichart',
    itemId: 'apichart',
    width: '100%',
    height: '90%',
    margin: '10 2 2 2',
    style: {
        background: '#ffffff'
    },
    requires: [ 
    ],
    
    layout: 'fit',

    chart: null,

    constructor: function(config) {
        var me = this;
        // var utilFormat = Ext.create('Ext.ux.util.Format');
        me.showLegend = [];

        Ext.applyIf(me, {
            items: [
                {
                    region: 'center',
                    xtype: 'container',
								  
                    flex: 1,
                    listeners: {
                        afterLayout: function(el){
                            if(me.chart){
                                // me.chart.setSize(el.getWidth(), el.getHeight())
								me.chart.reflow();
                            }
                        },
                        afterrender: function(el){

                            me.setLoading({msg: 'Carregando...'});
                            
                            Ext.Ajax.request({
                                url: BASEURL +'/api/api-bcb/apidc',
                                method: 'POST',
                                params: me.params,
                                async: true,
                                timeout: 240000,
                                success: function (response) {
                                    
                                    me.setLoading(false);
                                    var result = Ext.decode(response.responseText);
                                    if(result.success){

                                        rsarray = result.data;
                                        rsarray.series.forEach(function(record){
                                            me.showLegend.push(record.showInLegend);
                                        })

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

                                    me.buildChartContainer(el,rsarray.categories,rsarray.series)
                                },
                                error: function() {
                                    
                                    me.setLoading(false);
                                    rsarray = [];

                                    me.buildChartContainer(el,rsarray.categories,rsarray.series)

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
                }
            ]
        });

        me.callParent(arguments);
    },

    buildChartContainer: function(el,categories,series){
        var me = this;

        console.log(categories);
        console.log(series);

        me.chart =  Highcharts.chart(el.id, {
            loading: {
                labelStyle: {
                    color: 'gray'
                }
            },
            credits:{
                enabled: false
            },

            chart: {
                type: 'line'
            },
            title: {
                text: 'Dolar Comercial',
                style: {
                    fontSize: '14px'
                }
            },
            xAxis: {
                categories: categories,
                crosshair: true
            },
            yAxis: {
                title: {
                    text: '$ Dolar Comercial'
                }
            },
            tooltip: {
                // shared: true,
                // outside: true
            },
            series: series
        });

    }
});
