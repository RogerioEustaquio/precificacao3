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


        Ext.Ajax.request({
            url: BASEURL +'/api/api-bcb/apidc',
            method: 'POST',
            params:'',
            async: true,
            timeout: 240000,
            success: function (response) {
                
                me.setLoading(false);
                var result = Ext.decode(response.responseText);
                if(result.success){

                    rsarray = result.data;
                    
                    console.log(rsarray);

                }else{
                    rsarray = [];
                    console.log(result);

                    new Noty({
                        theme: 'relax',
                        layout: 'bottomRight',
                        type: 'error',
                        closeWith: [],
                        text: 'Erro sistema: '+ result
                    }).show();
                }

            },
            error: function() {
                
                console.log(result);
                rsarray = [];

                new Noty({
                    theme: 'relax',
                    layout: 'bottomRight',
                    type: 'error',
                    closeWith: [],
                    text: 'Erro sistema: '+ result
                }).show();
            }
        });


        Ext.applyIf(me, {
            items: [
                {
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

                            me.buildChartContainer(el);
                            me.chart.reflow();
                        }
                    }
                }
            ]
        });

        me.callParent(arguments);
    },

    buildChartContainer: function(el){
        
        var me = this;

        me.chart = Highcharts.chart(el.id, {

            credits:{
                enabled: false
            },

            title: {
                text: 'Solar Employment Growth by Sector, 2010-2016',
                style: {
                    fontSize: '12px'
                }
            },
        
            // subtitle: {
            //     text: 'Source: thesolarfoundation.com',
            // },
        
            yAxis: {
                title: {
                    text: 'Number',
                    style: {
                        fontSize: '10px'
                    }
                }
            },
        
            xAxis: {
                accessibility: {
                    rangeDescription: 'Range: 2010 to 2017'
                }
            },
        
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
        
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 2010
                }
            },
        
            series: [{
                name: 'Installation',
                data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
            }, {
                name: 'Manufacturing',
                data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
            }, {
                name: 'Sales & Distribution',
                data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
            }, {
                name: 'Project Development',
                data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227],
                showInLegend: false
            }, {
                name: 'Other',
                data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111],
                showInLegend: false
            }],
        
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
    }

});
