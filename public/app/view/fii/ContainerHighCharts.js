Ext.define('App.view.fii.ContainerHighCharts', {
    extend: 'Ext.Container',
    xtype: 'fiichart',
    itemId: 'fiichart',
    width: '100%',
    height: 200,
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
                            me.buildChartContainer(el)
                        }
                    }
                }
            ]
        });

        me.callParent(arguments);
    },

    buildChartContainer: function(el){
        var me = this;

        me.chart =  Highcharts.chart(el.id, {

                credits:{
                    enabled: false
                },

                chart: {
                    type: 'line'
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
                        }
                    }
                },
                title: {
                    text: 'Fruit Consumption'
                },
                xAxis: {
                    categories: ['Apples', 'Bananas', 'Oranges']
                },
                yAxis: {
                    title: {
                        text: 'Fruit eaten'
                    }
                },
                series: [{
                    name: 'Jane',
                    data: [1, 8, 4]
                }, {
                    name: 'John',
                    data: [5, 7, 3]
                }]
            });

    }
});