Ext.define('App.view.price.ChartsBalanced', {
    extend: 'Ext.Container',
    xtype: 'chartsbalanced',
    itemId: 'chartsbalanced',
    width: '100%',
    height: '60%',
    // margin: '10 2 2 2',
    style: {
        background: '#ffffff'
    },
    requires: [ 
    ],
    showLegend: [],
    // controller: 'chart',
    layout: 'border',
    border: true,

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

                            me.setLoading(true);

                            var serie = Array();
                            
                            // me.buildChartContainer(el,serie);
                            // me.chart.reflow();
                            Ext.Ajax.request({
                                url: BASEURL +'/api/balanced/listaritensbalanced',
                                method: 'POST',
                                params: me.params,
                                async: true,
                                timeout: 240000,
                                success: function (response) {
                                    
                                    me.setLoading(false);
                                    var result = Ext.decode(response.responseText);
                                    if(result.success){

                                        rsarray = result.data;

                                        me.buildChartContainer(el,rsarray);
                                        me.chart.reflow();

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

                                    me.buildChartContainer(el,rsarray);

                                    me.setLoading(false);
                                },
                                error: function() {
                                    
                                    me.setLoading(false);
                                    rsarray = [];

                                    me.buildChartContainer(el,rsarray)

                                    new Noty({
                                        theme: 'relax',
                                        layout: 'bottomRight',
                                        type: 'error',
                                        closeWith: [],
                                        text: 'Erro sistema: '+ result.message.substr(0,20)
                                    }).show();

                                    me.setLoading(false);
                                }
                            });

                        }
                    }
                }
            ]
        });

        me.callParent(arguments);
    },

    buildChartContainer: function(el,series){
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        var data = series;

        me.chart = Highcharts.stockChart(el.id, {

                credits:{
                    enabled: false
                },
                rangeSelector: {
                    selected: 2
                },
        
                title: {
                    text: ' '
                },
                
                xAxis: {
                    type: 'datetime'
                },
                // xAxis: [
                //         {
                //             title : {
                //                 text: 'Preço'
                //             } 
                //         },
                //         {
                //             title : {
                //                 text: 'ROL'
                //             }
                //         },
                //         {
                //             title : {
                //                 text: 'Quantidade'
                //             }
                //         }
                // ],
                yAxis: [
                    {
                        height: '100%',
                        title: {
                            text: 'Preço',
                            style: {
                                color: Highcharts.getOptions().colors[0],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,0);
                            },
                            style: {
                                color: Highcharts.getOptions().colors[0],
                                fontSize: '10px'
                            }
                        }
                    },
                    {
                        height: '100%',
                        title: {
                            text: 'ROL',
                            style: {
                                color: Highcharts.getOptions().colors[1],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,0);
                            },
                            style: {
                                color: Highcharts.getOptions().colors[1],
                                fontSize: '10px'
                            }
                        }
                    },
                    {
                        top: '60%',
                        height: '40%',
                        title: {
                            text: 'Quantidade',
                            style: {
                                color: 'green',
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            align: 'left',
                            formatter: function () {
                                return utilFormat.Value2(this.value,0);
                            },
                            style: {
                                color: 'green',
                                fontSize: '10px'
                            }
                        }
                    }
                ],

                plotOptions: {
                },

                tooltip: {
                    pointFormatter: function(){

                        var dicima = this.ds == 'Preço'? 2 : 0;

                        var valor = utilFormat.Value2(this.y,dicima);
                        return '<span style="color: '+this.series.color+'">'+this.ds+'</span>: <b>'+valor+'</b><br/>';
                    },
                    valueDecimals: 2,
                    split: true
                },

                // tooltip: {
                //     useHTML: true,
                //     followPointer: true,
                //     formatter: function(){

                //         var dataBase = new Date(this.points[0].point.x);

                //         var pointFormat = '<table>';
                //         pointFormat += '<tr><th colspan="2" align="center">'+ this.points[0].point.data+ '</th></tr>';
                //         pointFormat += '<tr><th align="left"><span style="color:'+'</span>'+this.points[0].point.ds+': </th><td  align="left">'+utilFormat.Value2(this.points[0].point.y,2)+'</td></tr>';
                //         pointFormat += '<tr><th align="left"><span style="color:'+'</span>'+this.points[1].point.ds+': </th><td  align="left">'+utilFormat.Value2(this.points[1].point.y,0)+'</td></tr>';
                //         pointFormat += '<tr><th align="left"><span style="color:'+'</span>'+this.points[2].point.ds+': </th><td  align="left">'+utilFormat.Value2(this.points[2].point.y,0)+'</td></tr>';
                //         pointFormat += '</table>';

                //         return pointFormat;
                //     }
                // },
                rangeSelector: {
                    selected: 5
                },

                series: [
                    {
                        type: 'line',
                        name: 'preco',
                        data: data[0],
                        // tooltip: {
                        //     valueDecimals: 2
                        // }
                        
                    },
                    {
                        type: 'line',
                        name: 'rol',
                        data: data[1],
                        yAxis: 1,
                        // tooltip: {
                        //     valueDecimals: 2
                        // }
                        
                    },
                    {
                        type: 'column',
                        id: 'quantidade',
                        name: 'quantidade',
                        data: data[2],
                        color: 'green',
                        yAxis: 2,
                        // tooltip: {
                        //     valueDecimals: 2
                        // }
                    }
                ]
            });

    }
});
