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

        var meses =
            [null,
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro'];

        var vSeries = [],
            vCategories = [];
        Ext.Ajax.request({
            url: BASEURL +'/api/fii/listarfichaitem',
            method: 'POST',
            async: false,
            success: function (response) {
                var result = Ext.decode(response.responseText);
                if(result.success){

                    rsarray = result.data;

                    vCategories.push(meses[parseFloat(rsarray[0].mesM0)]);
                    vCategories.push(meses[parseFloat(rsarray[0].mesM1)]);
                    vCategories.push(meses[parseFloat(rsarray[0].mesM2)]);
                    vCategories.push(meses[parseFloat(rsarray[0].mesM3)]);
                    vCategories.push(meses[parseFloat(rsarray[0].mesM4)]);
                    vCategories.push(meses[parseFloat(rsarray[0].mesM5)]);
                    vCategories.push(meses[parseFloat(rsarray[0].mesM6)]);
                    vCategories.push(meses[parseFloat(rsarray[0].mesM7)]);
                    vCategories.push(meses[parseFloat(rsarray[0].mesM8)]);
                    vCategories.push(meses[parseFloat(rsarray[0].mesM9)]);
                    vCategories.push(meses[parseFloat(rsarray[0].mesM10)]);
                    vCategories.push(meses[parseFloat(rsarray[0].mesM11)]);

                    rsarray.forEach(function(record){

                        var serie = {
                            name: record.idEmpresa,
                            data: [
                                parseFloat(record.valorM0),
                                parseFloat(record.valorM1),
                                parseFloat(record.valorM2),
                                parseFloat(record.valorM3),
                                parseFloat(record.valorM4),
                                parseFloat(record.valorM5),
                                parseFloat(record.valorM6),
                                parseFloat(record.valorM7),
                                parseFloat(record.valorM8),
                                parseFloat(record.valorM9),
                                parseFloat(record.valorM10),
                                parseFloat(record.valorM11)                            ]
                        };

                        vSeries.push(serie);

                    });

                    // return rsarray;

                }
            }
        });

        console.log(rsarray);
    
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
                            me.buildChartContainer(el,vCategories,vSeries)
                        }
                    }
                }
            ]
        });

        me.callParent(arguments);
    },

    buildChartContainer: function(el,meses,series){
        var me = this;

        console.log(series);

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
                    text: 'Ficha'
                },
                xAxis: {
                    categories: meses //['Apples', 'Bananas', 'Oranges']
                },
                yAxis: {
                    title: {
                        text: 'Ficha'
                    }
                },
                series: //series
                [
                    {
                        name: 'Rol',
                        dashStyle: 'shortdot',
                        data: [1271.569,
                            1339.661,
                            1258.922,
                            1192.778,
                            1123.123,
                            1044.219,
                            883.384,
                            824.531,
                            952.093,
                            1059.469,
                            1001.275,
                            961.114,
                            ]
                    },
                    {
                        name: 'Lb',
                        data: [377.161,
                                399.948,
                                378.895,
                                361.835,
                                340.188,
                                321.671,
                                270.296,
                                251.719,
                                281.072,
                                315.821,
                                298.878,
                                286.233
                            ]
                    },
                    {
                        name: 'Mb',
                        // type: 'column',
                        data:  [29.66,
                            29.85,
                            30.10,
                            30.34,
                            30.29,
                            30.80,
                            30.60,
                            30.53,
                            29.52,
                            29.81,
                            29.85,
                            29.78 
                       ]
                    }
                ]
            });

        console.log(me.chart);

    }
});