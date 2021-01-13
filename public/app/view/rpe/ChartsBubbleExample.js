Ext.define('App.view.rpe.ChartsBubbleExample', {
    extend: 'Ext.Container',
    xtype: 'chartsbubbleexample',
    itemId: 'chartsbubbleexample',
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

                            // me.setLoading({msg: 'Carregando...'});

                            var serie = Array();
                            
                            me.buildChartContainer(el,serie);
                            me.chart.reflow();

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

        me.chart =  Highcharts.chart(el.id, {

            chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                zoomType: 'xy'
            },
        
            legend: {
                enabled: false
            },
            credits:{
                enabled: false
            },
            exporting: false,
        
            title: {
                text: ' ',
                style: {
                    fontSize: '14px'
                }
            },
        
            subtitle: {
                text: ' '
            },
        
            xAxis: {
                gridLineWidth: 1,
                title: {
                    text: 'ROL'
                },
                labels: {
                   formatter: function () {
                    return utilFormat.Value2(this.value,0);
                   }
                }
            },
        
            yAxis: {
                startOnTick: false,
                endOnTick: false,
                title: {
                    text: 'MB'
                },
                labels: {
                    formatter: function () {
                     return utilFormat.Value2(this.value,0);
                    }
                 }
                // maxPadding: 0.2,
                
                // labels: {
                //     // formatter: function () {
                //     //     return utilFormat.Value2(this.value,0);
                //     // },
                //     x: 0,
                //     y: 0,
                //     padding: 0,
                //     style: {
                //         // color: Highcharts.getOptions().colors[1],
                //         fontSize: '10px',
                //         border: '0px'
                //     }
                // }
            },
        
            tooltip: {
                useHTML: true,
                formatter: function () {

                    var pointFormat = '<table>';
                    pointFormat += '<tr><th colspan="2"><h3>'+this.point.name+'</h3></th></tr>';
                    pointFormat += '</table>';
                    pointFormat += '<table>';
                    pointFormat += '<tr><th align="left">ROL:</th><td  align="left">'+utilFormat.Value2(this.point.x,0)+'</td></tr>';
                    pointFormat += '<tr><th align="left">MB:</th><td  align="left">'+utilFormat.Value2(this.point.y,2)+'</td></tr>';
                    pointFormat += '<tr><th align="left">CC:</th><td  align="left">'+utilFormat.Value2(this.point.z,0)+'</td></tr>';
                    pointFormat += '</table>';

                    return pointFormat;
                },
                followPointer: true
            },
        
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }
            },
        
            series: [{
                // data: series
                data: [
                    { x: 1000000, y: 30, z: 1000, name: 'A', country: 'A' },
                    { x: 800000, y: 25, z: 800, name: 'B', country: 'B' },
                    { x: 1200000, y: 32, z: 900, name: 'C', country: 'C' }
                ]
            }]
        
        });

    }
});
