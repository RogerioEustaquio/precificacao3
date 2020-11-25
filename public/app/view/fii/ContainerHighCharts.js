Ext.define('App.view.fii.ContainerHighCharts', {
    extend: 'Ext.Container',
    xtype: 'fiichart',
    itemId: 'fiichart',
    width: '100%',
    height: '60%',
    margin: '10 2 2 2',
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
        colors = ["#63b598","#ce7d78","#ea9e70","#a48a9e","#c6e1e8","#648177","#0d5ac1","#f205e6","#1c0365","#14a9ad","#4ca2f9"
                 ,"#a4e43f","#d298e2","#6119d0","#d2737d","#c0a43c","#f2510e","#651be6","#79806e","#61da5e","#cd2f00"];

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
            exporting: {
                menuItemDefinitions: {
                    indicadores: {
                        onclick: function () {
                            var meChart = this;
                            var lista = [];
                            var element = '';
                            meChart.series.forEach(function(record){

                                var recordSeries = record;
                                element = {
                                    xtype: 'checkboxfield',
                                    margin: '2 2 2 2',
                                    fieldLabel: record.name,
                                    name: record.name,
                                    checked: recordSeries.options.showInLegend,
                                    handler: function(record,index){
                                        
                                        me.showLegend[recordSeries.index] = index ;
                                        recordSeries.update({showInLegend: index, visible: index},false);
                                        meChart.yAxis[recordSeries.index].update({visible: index},false);
                                        meChart.redraw();
                                    }
                                };
                                
                                lista.push(element);
                            });

                            Ext.create('Ext.window.Window', {
                                title: 'Habilitar/Desabilitar Indicadores',
                                // renderTo: me,
                                scrollable: true,
                                height: 300,
                                width: 260,
                                // padding: '1 1 1 1',
                                // layout: 'fit',
                                items: lista
                            }).show();
                        },
                        text: 'Selecionar Indicadores'
                    },
                    ocultar: {
                        onclick: function () {
                            var meChart = this;

                            // var length = meChart.series.length;
                            // for (let index = 0; index < length; index++) {
                            //     // meChart.series[index].update({visible: false});
                            //     // meChart.yAxis[index].update({visible: false});
                            // }

                            $(meChart.series).each(function(){
                                //this.hide();
                                this.setVisible(false, false);
                            });
                            meChart.redraw();

                            // $(meChart.series).each(function(i){
                            //     var serie = meChart.series[i];
                            //     // console.log(serie);
                            //     if(serie.visible){
                            //         serie.hide();
                            //     }
                            // });

                        },
                        text: 'Ocultar Indicadores'
                    }

                },
                buttons: {
                    contextButton: {
                        menuItems: ['viewFullscreen','downloadPNG', 'downloadXLS', 'indicadores', 'ocultar']
                    }
                }
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
                        // legendItemClick: function () {

                        //     var index = this.index;

                        //     if(this.chart.yAxis[index].visible){
                        //         this.chart.yAxis[index].update({visible: false});
                        //     }else{
                        //         this.chart.yAxis[index].update({visible: true});
                        //     }

                        //     return this;
                        // }
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
                text: 'Ficha de Indicadores'
            },
            xAxis: {
                categories: meses,
                crosshair: true
            },
            yAxis: [
                {
                    title: {
                        text: 'Preço Unitário',
                        style: {
                            color: Highcharts.getOptions().colors[1],
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        formatter: function () {
                            return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                        },
                        x: 0,
                        y: 0,
                        padding: 0,
                        style: {
                            color: Highcharts.getOptions().colors[1],
                            fontSize: '10px',
                            border: '0px'
                        }
                    },
                    opposite: true,
                    visible: true
                },
                { // Primary yAxis
                    
                    title: {
                        text: 'Desconto Unitário',
                        vteste: 'aqui',
                        style: {
                            color: Highcharts.getOptions().colors[0],
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        formatter: function () {
                            return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                        },
                        align: 'right',
                        x: 0,
                        y: 0,
                        padding: 0,
                        style: {
                            color: Highcharts.getOptions().colors[0],
                            fontSize: '10px'
                        }
                    },
                    opposite: true,
                    visible: true
                },
                { // Secondary yAxis
                    title: {
                        text: 'Imposto Unitário',
                        style: {
                            color: Highcharts.getOptions().colors[2],
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        formatter: function () {
                            return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                        },
                        x: 0,
                        y: 0,
                        padding: 0,
                        style: {
                            color: Highcharts.getOptions().colors[2],
                            fontSize: '10px'
                        }
                    },
                    opposite: true,
                    visible: true
                },
                {
                    title: {
                        text: 'ROL Unitário',
                        style: {
                            color: Highcharts.getOptions().colors[3],
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        formatter: function () {
                            return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                        },
                        x: 0,
                        y: 0,
                        padding: 0,
                        style: {
                            color: Highcharts.getOptions().colors[3],
                            fontSize: '10px'
                        }
                    },
                    opposite: true,
                    visible: true
                 },
                 {
                     title: {
                         text: 'Custo Unitário',
                         style: {
                             color: Highcharts.getOptions().colors[4],
                             fontSize: '10px'
                         }
                     },
                     labels: {
                        formatter: function () {
                            return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                        },
                         x: 0,
                         y: 0,
                         padding: 0,
                         style: {
                             color: Highcharts.getOptions().colors[4],
                             fontSize: '10px'
                         }
                     },
                     opposite: true,
                     visible: true
                  },
                  {
                      title: {
                          text: 'Lucro Unitário',
                          style: {
                              color: Highcharts.getOptions().colors[5],
                              fontSize: '10px'
                          }
                      },
                      labels: {
                         formatter: function () {
                             return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                         },
                          x: 0,
                          y: 0,
                          padding: 0,
                          style: {
                              color: Highcharts.getOptions().colors[5],
                              fontSize: '10px'
                          }
                      },
                      opposite: true,
                      visible: true
                   },
                   {
                        title: {
                            text: '% Imposto',
                            style: {
                                color: Highcharts.getOptions().colors[6],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: Highcharts.getOptions().colors[6],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: true
                    },
                    {
                        title: {
                            text: '% Desconto',
                            style: {
                                color: Highcharts.getOptions().colors[7],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: Highcharts.getOptions().colors[7],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: true
                    },
                    {
                        title: {
                            text: 'ROB',
                            style: {
                                color: Highcharts.getOptions().colors[8],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                                formatter: function () {
                                    return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                                },
                                x: 0,
                                y: 0,
                                padding: 0,
                                style: {
                                    color: Highcharts.getOptions().colors[8],
                                    fontSize: '10px'
                                }
                        },
                        opposite: true,
                        visible: true
                    },
                    {
                        title: {
                            text: 'ROL',
                            style: {
                                color: Highcharts.getOptions().colors[9],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                                formatter: function () {
                                    return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                                },
                                x: 0,
                                y: 0,
                                padding: 0,
                                style: {
                                    color: Highcharts.getOptions().colors[9],
                                    fontSize: '10px'
                                }
                        },
                        opposite: true,
                        visible: true
                    },
                    {
                        title: {
                            text: 'CMV',
                            style: {
                                color: colors[0],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[0],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'LB',
                            style: {
                                color: colors[1],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                        formatter: function () {
                            return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                        },
                        x: 0,
                        y: 0,
                        padding: 0,
                        style: {
                            color: colors[1],
                            fontSize: '10px'
                        }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'MB',
                            style: {
                                color: colors[2],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                            return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[2],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'Quantidade',
                            style: {
                                color: colors[3],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                            return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[3],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'Nota',
                            style: {
                                color: colors[4],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                            return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[4],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'Cliente',
                            style: {
                                color: colors[5],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[5],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'TKM Cliente',
                            style: {
                                color: colors[6],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[6],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'TKM Nota',
                            style: {
                                color: colors[7],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[7],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'LB Cliente',
                            style: {
                                color: colors[8],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[8],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'LB Nota',
                            style: {
                                color: colors[9],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[9],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'ROB Dia',
                            style: {
                                color: colors[10],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[10],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'ROL Dia',
                            style: {
                                color: colors[11],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[11],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'CMV Dia',
                            style: {
                                color: colors[12],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[12],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'LB Dia',
                            style: {
                                color: colors[13],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[13],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'Qtde Dia',
                            style: {
                                color: colors[14],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[14],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'Nota Dia',
                            style: {
                                color: colors[15],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[15],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
                    },
                    {
                        title: {
                            text: 'Cliente Dia',
                            style: {
                                color: colors[16],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,this.chart.options.series[this.chart.index].vDecimos);
                            },
                            x: 0,
                            y: 0,
                            padding: 0,
                            style: {
                                color: colors[16],
                                fontSize: '10px'
                            }
                        },
                        opposite: true,
                        visible: false
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
