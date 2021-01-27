Ext.define('App.view.dolar.ContainerHighCharts', {
    extend: 'Ext.Container',
    xtype: 'dolarchart',
    itemId: 'dolarchart',
    // width: '100%',
    // height: '86%',
    // margin: '1 1 1 1',
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
                                url: BASEURL +'/api/api-bcb/dolarcomercial',
                                method: 'POST',
                                // params: {
                                //     datainicio: '01-17-2020', //mm-dd-yyyy
                                //     datafim: '12-17-2020'
                                // },
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

    buildChartContainer: function(el,meses,series){
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

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
                type: 'line',
                zoomType: 'xy'
            },

            plotOptions: {
                series: {
                    events: {

                        hide: function(){
                            this.chart.yAxis[this.index].update({visible: false},false);
                            this.chart.redraw();
                        },
                        show: function(){
                            this.chart.yAxis[this.index].update({visible: true},false);
                            this.chart.redraw();
                        },
                    },
                    dataLabels: {
                        formatter: function () {

                            var options  = this.point.series.options;
                            var vFormat  = options.vFormat.toString();
                            var vDecimos = options.vDecimos.toString();

                            if(vFormat == 'N'){
                                return this.y;
                            }

                            return vFormat+' '+utilFormat.Value2(this.y,vDecimos);
                        }
                    }
                }
            },
            title: {
                text: ' ',
                style: {
                    fontSize: '14px'
                }
            },
            xAxis: {
                categories: meses,
                crosshair: true
            },
            yAxis:[
                    {
                        title: {
                            text: ' ',
                            style: {
                                color: Highcharts.getOptions().colors[0],
                                fontSize: '10px'
                            }
                        }
                    }
                ],
            tooltip: {
                // shared: true,
                // outside: true
            },
            series: series
        });

    }
});
