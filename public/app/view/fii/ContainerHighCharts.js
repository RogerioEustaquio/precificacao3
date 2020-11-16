Ext.define('App.view.fii.ContainerHighCharts', {
    extend: 'Ext.Container',
    xtype: 'fiichart',
    itemId: 'fiichart',
    width: '100%',
    height: 300,
    margin: '10 2 2 2',
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
                            
                            Ext.Ajax.request({
                                url: BASEURL +'/api/fii/listarfichaitemgrafico',
                                method: 'POST',
                                params: me.params,
                                async: false,
                                success: function (response) {
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

                            // console.log(rsarray.series);
                            me.buildChartContainer(el,rsarray.categories,rsarray.series)
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

            credits:{
                enabled: false
            },
            chart: {
                type: 'line',
                zoomType: 'xy'
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                alert('Category: ' + this.category + ', value: ' + this.y);
                            }
                        }
                    },
                    dataLabels: {
                        // format: '{series}'
                        formatter: function () {

                            var vFormat = this.point.series.options.vFormat.toString();

                            if(vFormat == 'NAO'){
                                return this.y;
                            }

                            return vFormat+' '+utilFormat.Value(this.y);
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
                        text: 'Desconto',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        // format: utilFormat.Value(parseFloat('{value}')),
                        formatter: function () {
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
                    opposite: true
                },
                { // Primary yAxis
                    title: {
                        text: 'Preço',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    labels: {
                        // format: utilFormat.Value(parseFloat('{value}')),
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
                    // showEmpty: false,
                    visible: true,
                    opposite: true
                },
                { // Secondary yAxis
                    title: {
                        text: 'Imposto',
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
                    opposite: true
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
                    opposite: true
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
                     opposite: true
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
                      opposite: true
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
                                return utilFormat.Value(parseFloat(this.value));
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: Highcharts.getOptions().colors[6]
                            }
                       },
                       opposite: true
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
                                return utilFormat.Value(parseFloat(this.value));
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: Highcharts.getOptions().colors[7]
                            }
                        },
                        opposite: true
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
                                return utilFormat.Value(parseFloat(this.value));
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: Highcharts.getOptions().colors[8]
                            }
                         },
                         opposite: true
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
                          opposite: true
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
                           opposite: true
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
                            opposite: true
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
