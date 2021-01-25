Ext.define('App.view.rpe.ChartsClientePosicionamento', {
    extend: 'Ext.Container',
    xtype: 'chartsclienteposicionamento',
    itemId: 'chartsclienteposicionamento',
    // id: 'chartsbrandpositioning',
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

                            me.setLoading({msg: 'Carregando...'});

                            var idEixos = {
                                x: 'rol',
                                y: 'mb',
                                z: 'nf'
                            }
                            
                            Ext.Ajax.request({
                                url: BASEURL +'/api/clienteposicionamento/clienteposicionamento',
                                method: 'POST',
                                params: me.params,
                                async: true,
                                timeout: 240000,
                                success: function (response) {
                                    
                                    me.setLoading(false);
                                    var result = Ext.decode(response.responseText);
                                    if(result.success){

                                        rsarray = result.data;

                                        var x='',y='',z='';
                                        var arrayPJ = Array();
                                        var arrayPF = Array();
                                        var iCont = 0;
                                        rsarray.forEach(function(rowSerie){

                                            x = rowSerie[idEixos.x];
                                            y = rowSerie[idEixos.y];

                                            if(rowSerie.tipoPessoa == 'J'){
                                                arrayPJ.push([parseFloat(x),parseFloat(y)]);
                                            }else{
                                                arrayPF.push([parseFloat(x),parseFloat(y)]);
                                            }
                                            
                                            // rsarray[iCont].x = parseFloat(x);

                                            iCont++;
                                        });

                                        arraySerie = [
                                            {
                                                name: 'Pessoa Jurídica',
                                                color: 'rgba(223, 83, 83, .5)',
                                                data : arrayPJ
                                            },
                                            {
                                                name: 'Pessoa Física',
                                                color: 'rgba(119, 152, 191, .5)',
                                                data : arrayPF
                                            }
                                        ];

                                    }else{
                                        arraySerie = [
                                            {
                                                name: 'Pessoa Jurídica',
                                                color: 'rgba(223, 83, 83, .5)',
                                                data : []
                                            },
                                            {
                                                name: 'Pessoa Física',
                                                color: 'rgba(119, 152, 191, .5)',
                                                data : []
                                            }
                                        ];

                                        new Noty({
                                            theme: 'relax',
                                            layout: 'bottomRight',
                                            type: 'error',
                                            closeWith: [],
                                            text: 'Erro sistema: '+ result.message.substr(0,20)
                                        }).show();
                                    }
                                    // console.log(arraySerie);

                                    me.buildChartContainer(el,arraySerie);

                                    textSubtitle = {
                                        subtitle:{
                                            text: result.referencia.incio + ' até ' + result.referencia.fim
                                        }
                                    };

                                    me.chart.update(textSubtitle);
                                },
                                error: function() {
                                    
                                    me.setLoading(false);
                                    arraySerie = [
                                        {
                                            name: 'Pessoa Jurídica',
                                            color: 'rgba(223, 83, 83, .5)',
                                            data : []
                                        },
                                        {
                                            name: 'Pessoa Física',
                                            color: 'rgba(119, 152, 191, .5)',
                                            data : []
                                        }
                                    ];

                                    me.buildChartContainer(el,arraySerie)

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

    buildChartContainer: function(el,series){
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        me.chart =  Highcharts.chart(el.id, {

            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
        
            legend: {
                enabled: false
            },
            credits:{
                enabled: false
            },
        
            title: {
                text: 'Posicionamento de Cliente',
                style: {
                    fontSize: '14px'
                }
            },
        
            subtitle: {
                text: ' '
            },
        
            xAxis: {
                title: {
                    text: 'ROL'
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true
            },
        
            yAxis: {
                title: {
                    text: 'MB'
                }
            },

            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 70,
                floating: true,
                backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
                borderWidth: 1
            },

            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.x}, {point.y}'
                    }
                }
            },
        
            series: series
        
        });

    }
});
