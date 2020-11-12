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

                                    }
                                }
                            });

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
                        text: 'Rol',
                        style: {
                            color: 'rgba(126,86,134,.9)'
                        }
                    },
                    labels: {
                        format: 'R$ {value}',
                        align: 'right',
                        x: 0,
                        y: 0,
                        padding: 0,
                        style: {
                            color: 'rgba(126,86,134,.9)'
                        }
                    },
                    opposite: true
                },
                { // Primary yAxis
                    title: {
                        text: 'Preço',
                        style: {
                            color: 'rgba(165,170,217,1)'
                        }
                    },
                    labels: {
                        format: 'R$ {value}',
                        // align: 'right',
                        x: 0,
                        y: 0,
                        padding: 0,
                        style: {
                            color: 'rgba(165,170,217,1)'
                        }
                    },
                    // showEmpty: false,
                    visible: true,
                    opposite: true
                },
                { // Secondary yAxis
                    title: {
                        text: 'Lb',
                        style: {
                            color: 'rgba(46, 36, 183, 1)'
                        }
                    },
                    labels: {
                        format: 'R$ {value}',
                        // align: 'right',
                        x: 0,
                        y: 0,
                        padding: 0,
                        style: {
                            color: 'rgba(46, 36, 183, 1)'
                        }
                    },
                    opposite: true
                },
                { // Tertiary yAxis
                    title: {
                        text: 'Mb',
                        style: {
                            color: 'rgba(221, 117, 85, 1)'
                        }
                    },
                    labels: {
                        format: '% {value}',
                        // align: 'right',
                        x: 0,
                        y: 0,
                        padding: 0,
                        style: {
                            color: 'rgba(221, 117, 85, 1)'
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
