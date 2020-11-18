Ext.define('App.view.fii.ContainerHighCharts', {
    extend: 'Ext.Container',
    xtype: 'fiichart',
    itemId: 'fiichart',
    width: '100%',
    height: 300,
    margin: '10 2 2 2',
    style: {
        background: '#ffffff'
    },
    requires: [ 
    ],
    
    // controller: 'chart',
    layout: 'border',
    border: true,

    chart: null,

    constructor: function(config) {
        var me = this;
        // var utilFormat = Ext.create('Ext.ux.util.Format');

        Ext.applyIf(me, {
            items: [
                {
                    region: 'center',
                    xtype: 'container',
                    flex: 1,
                    listeners: {
                        afterLayout: function(el){
                            if(me.chart){
                                me.chart.setSize(el.getWidth(), el.getHeight())
                            }
                        },
                        afterrender: function(el){

                            me.setLoading({msg: 'Carregando...'});
                            
                            Ext.Ajax.request({
                                url: BASEURL +'/api/fii/listarfichaitemgrafico',
                                method: 'POST',
                                params: me.params,
                                async: true,
                                success: function (response) {
                                    
                                    me.setLoading(false);
                                    var result = Ext.decode(response.responseText);
                                    if(result.success){

                                        rsarray = result.data;

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

                            // console.log(rsarray.series);
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
        colors = ["#63b598","#ce7d78","#ea9e70","#a48a9e","#c6e1e8","#648177","#0d5ac1","#f205e6","#1c0365","#14a9ad","#4ca2f9"];

        me.chart =  Highcharts.chart(el.id, {
            loading: {
                labelStyle: {
                    color: 'gray'
                },
                // style: {
                //     backgroundColor: 'gray'
                // }
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
                        legendItemClick: function () {

                            var index = this.index;

                            if(this.chart.yAxis[index].visible){
                                this.chart.yAxis[index].update({visible: false});
                            }else{
                                this.chart.yAxis[index].update({visible: true});
                            }

                            return this;
                        }
                    },
                    dataLabels: {
                        // format: '{series}'
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
                text: 'Ficha'
            },
            xAxis: {
                categories: meses,
                crosshair: true
            },
            yAxis: [

                { // Primary yAxis
                    
                    title: {
                        text: 'Desconto Unitário',
                        vteste: 'aqui',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        // format: utilFormat.Value(parseFloat('{value}')),
                        formatter: function () {
                            
                            // console.log(this.axis.options.title.text);
                            // console.log(this.axis.visible);
                            // console.log(this.axis.options.title.style.visibility);
                            return utilFormat.Value(parseFloat(this.value));
                        },
                        align: 'right',
                        x: 0,
                        y: 0,
                        padding: 0,
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true,
                    visible: true
                },
                { // 2 yAxis
                    title: {
                        text: 'Preço Unitário',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    labels: {
                        formatter: function () {
                            return utilFormat.Value(parseFloat(this.value));
                        },
                        x: 0,
                        y: 0,
                        padding: 0,
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    opposite: true,
                    visible: true
                },
                { // Secondary yAxis
                    title: {
                        text: 'Imposto Unitário',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    labels: {
                        formatter: function () {
                            return utilFormat.Value(parseFloat(this.value));
                        },
                        x: 0,
                        y: 0,
                        padding: 0,
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    opposite: true,
                    visible: true
                },
                { 
                    title: {
                        text: 'ROL Unitário',
                        style: {
                            color: Highcharts.getOptions().colors[3]
                        }
                    },
                    labels: {
                        formatter: function () {
                            return utilFormat.Value(parseFloat(this.value));
                        },
                        x: 0,
                        y: 0,
                        padding: 0,
                        style: {
                            color: Highcharts.getOptions().colors[3]
                        }
                    },
                    opposite: true,
                    visible: true
                 },
                 {
                     title: {
                         text: 'Custo Unitário',
                         style: {
                             color: Highcharts.getOptions().colors[4]
                         }
                     },
                     labels: {
                         formatter: function () {
                             return utilFormat.Value(parseFloat(this.value));
                         },
                         x: 0,
                         y: 0,
                         padding: 0,
                         style: {
                             color: Highcharts.getOptions().colors[4]
                         }
                     },
                     opposite: true,
                     visible: true
                  },
                  {
                      title: {
                          text: '% Desconto',
                          style: {
                              color: Highcharts.getOptions().colors[5]
                          }
                      },
                      labels: {
                        formatter: function () {
                            return utilFormat.Value(parseFloat(this.value));
                        },
                          x: 0,
                          y: 0,
                          padding: 0,
                          style: {
                              color: Highcharts.getOptions().colors[5]
                          }
                      },
                      opposite: true,
                      visible: true
                   },
                   {
                       title: {
                           text: 'ROL',
                           style: {
                               color: Highcharts.getOptions().colors[6]
                           }
                       },
                       labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,0);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: Highcharts.getOptions().colors[6]
                            }
                       },
                       opposite: true,
                       visible: true
                    },
                    {
                        title: {
                            text: 'CMV',
                            style: {
                                color: Highcharts.getOptions().colors[7]
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,0);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: Highcharts.getOptions().colors[7]
                            }
                        },
                        opposite: true,
                        visible: true
                     },
                     {
                         title: {
                             text: 'LB',
                             style: {
                                 color: Highcharts.getOptions().colors[8]
                             }
                         },
                         labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,0);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: Highcharts.getOptions().colors[8]
                            }
                         },
                         opposite: true,
                         visible: true
                      },
                      {
                          title: {
                              text: 'Quantidade',
                              style: {
                                  color: Highcharts.getOptions().colors[9]
                              }
                          },
                          labels: {
                             x: 0,
                             y: 0,
                             padding: 0,
                             style: {
                                 color: Highcharts.getOptions().colors[9]
                             }
                          },
                          opposite: true,
                          visible: true
                       },
                       {
                           title: {
                               text: 'Nota Fiscal',
                               style: {
                                   color: colors[0]
                               }
                           },
                           labels: {
                              x: 0,
                              y: 0,
                              padding: 0,
                              style: {
                                  color: colors[0]
                              }
                           },
                           opposite: true,
                           visible: true
                        },
                        {
                            title: {
                                text: 'Cliente',
                                style: {
                                    color: colors[1]
                                }
                            },
                            labels: {
                               x: 0,
                               y: 0,
                               padding: 0,
                               style: {
                                   color: colors[1]
                               }
                            },
                            opposite: true,
                            visible: true
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
