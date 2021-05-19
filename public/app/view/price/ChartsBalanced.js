Ext.define('App.view.price.ChartsBalanced', {
    extend: 'Ext.Container',
    xtype: 'chartsbalanced',
    itemId: 'chartsbalanced',
    name: 'chartsbalanced',
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

                            var categories = Array();
                            // var serie = Array();
                            // me.buildChartContainer(el,serie);
                            // me.chart.reflow();

                            rsarray = [];
                            me.showLegend.push(true);
                            me.showLegend.push(false);
                            me.showLegend.push(true);
                            me.showLegend.push(true);
                            me.showLegend.push(false);
                            me.buildChartContainer(el,rsarray,categories);
                            me.setLoading(false);

                            // Ext.Ajax.request({
                            //     url: BASEURL +'/api/balanced/listaritensbalanced',
                            //     method: 'POST',
                            //     params: me.params,
                            //     async: true,
                            //     timeout: 240000,
                            //     success: function (response) {
                                    
                            //         me.setLoading(false);
                            //         var result = Ext.decode(response.responseText);
                            //         if(result.success){

                            //             rsarray = result.data;
                            //             // categories = result.categories;

                            //             rsarray.forEach(function(record){

                            //                 // console.log(record);
                            //                 if(me.showLegend){
                            //                     me.showLegend.push(record[0].show);
                            //                 }
                            //             })

                            //             me.buildChartContainer(el,rsarray,categories);
                            //             me.chart.reflow();

                            //         }else{
                                        
                            //             rsarray = [];

                            //             new Noty({
                            //                 theme: 'relax',
                            //                 layout: 'bottomRight',
                            //                 type: 'error',
                            //                 closeWith: [],
                            //                 text: 'Erro sistema: '+ result.message.substr(0,20)
                            //             }).show();
                            //         }

                            //         me.buildChartContainer(el,rsarray,categories);

                            //         me.setLoading(false);
                            //     },
                            //     error: function() {
                                    
                            //         me.setLoading(false);
                            //         rsarray = [];

                            //         me.buildChartContainer(el,rsarray,categories)

                            //         new Noty({
                            //             theme: 'relax',
                            //             layout: 'bottomRight',
                            //             type: 'error',
                            //             closeWith: [],
                            //             text: 'Erro sistema: '+ result.message.substr(0,20)
                            //         }).show();

                            //         me.setLoading(false);
                            //     }
                            // });

                        }
                    }
                }
            ]
        });

        me.callParent(arguments);
    },

    buildChartContainer: function(el,series,categories){
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        var data = series;

        var getCategory = function(value) {
            // return 'FY-' + (new Date(value)).getFullYear()
            return new Date(value);
        };

        me.chart = Highstock.stockChart(el.id, {
                // chart: {
                //     events: {
                //         // beforePrint: function () {
                //         //     this.oldhasUserSize = this.hasUserSize;
                //         //     this.resetParams = [this.chartWidth, this.chartHeight, false];
                //         //     this.setSize(600, 400, false);
                //         // },
                //         afterPrint: function () {
                //             this.setSize.apply(this, this.resetParams);
                //             this.hasUserSize = this.oldhasUserSize;
                //         }
                //     }
                // },
                credits:{
                    enabled: false
                },
                rangeSelector: {
                    enabled: false
                    // buttons: [
                    //     {
                    //         type:'day',
                    //         count: 1,
                    //         text: 'D'
                    //     },
                    //     {
                    //         type:'day',
                    //         count: 30,
                    //         text: 'D30'
                    //     },
                    //     {
                    //         type:'all',
                    //         text: 'Todos'
                    //     }
                    // ],
                    // selected: 2,
                    // inputEnabled: true,
                    // allButtonsEnabled: true,
                },
                
                exporting: {
                    menuItemDefinitions: {
                        fullscreen: {
                            onclick: function() {
                            //   Highcharts.FullScreen.prototype.open(this.renderTo);
                                // this.fullscreen.prototype.open();
                                this.fullscreen.toggle();
                            },
                            text: 'Full screen'
                        },
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
                                        labelWidth: 120,
                                        fieldLabel: record.name,
                                        name: record.name,
                                        checked: recordSeries.visible,
                                        handler: function(record,index){
                                            
                                            let cont = 0;
                                            if(index){

                                                var listaCheck = record.up('window').items;

                                                for (let i = 0; i < listaCheck.length; i++) {
                                                    const element = listaCheck.items[i];

                                                    cont = (element.checked) ? cont+1 : cont;
                                                    
                                                }
                                            }

                                            if(cont > 8){

                                                Ext.Msg.alert('Alerta','Permitido selecionar 8 indicadores.');
                                                record.setValue(false);
                                                me.showLegend[recordSeries.index] = false ;
                                                recordSeries.update({ visible: false},false);
                                                meChart.yAxis[recordSeries.index].update({visible: false},false);
                                                cont--;

                                            }else{

                                                me.showLegend[recordSeries.index] = index ;
                                                recordSeries.update({ visible: index},false);
                                                meChart.yAxis[recordSeries.index].update({visible: index},false);

                                                var iColor = 0;
                                                var iCont = 0;
                                                meChart.series.forEach(function(rowSerie){

                                                    if(rowSerie.visible){
                                                        var color = Highcharts.getOptions().colors[iColor];

                                                        if(rowSerie.name == 'Quantidade' || rowSerie.name == 'Navigator 1'){
                                                            color = '#2EBD85';
                                                            // iColor--;
                                                        }else{
                                                            
                                                            iColor++;
                                                        }

                                                        meChart.yAxis[iCont].update(
                                                            {
                                                                title:{
                                                                    style: {
                                                                        color: color
                                                                    }
                                                                },
                                                                labels:{
                                                                    style: {
                                                                        color: color
                                                                    }
                                                                }
                                                            }
                                                        ,false);
                                                        
                                                        rowSerie.update({color:color},false);
                                                            
                                                    }

                                                    iCont++;
                                                });
                                            }
                                            
                                            record.up('window').down('displayfield[name=contCheck]').setValue(cont);

                                            meChart.redraw();

                                            setTimeout(function(){
                                                meChart.redraw();
                                            },500);

                                        }
                                    };

                                    if(recordSeries.name == 'Navigator 1'){
                                        element = null;
                                    }

                                    if(element)
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
                                    tbar: [
                                        {
                                            xtype: 'displayfield',
                                            name: 'contCheck',
                                            itemId: 'contCheck',
                                            renderer: function(){
                                                let cont =0;
                                                me.showLegend.forEach(function(record){
                                                    if(record){
                                                        cont++
                                                    }
                                                })
                                                return cont;
                                            }
                                        },
                                        '->',
                                        {
                                            xtype: 'panel',
                                            items: {
                                                xtype: 'button',
                                                iconCls: 'fa fa-file',
                                                tooltip: 'Limpar seleção',
                                                handler: function(){
            
                                                    var listaCheck = this.up('panel').up('window').items;

                                                    for (let i = 0; i < listaCheck.length; i++) {
                                                        const element = listaCheck.items[i];

                                                        element.setValue(false);
                                                        me.showLegend[i] = false ;
                                                        meChart.series[i].setVisible(false, false);
                                                        meChart.yAxis[i].update({visible: false},false);
                                                        
                                                    }

                                                    meChart.redraw();

                                                    this.up('panel').up('window').down('displayfield[name=contCheck]').setValue(0);
                                                }
                                            }
                                            
                                        }
                                    ],
                                    items: lista
                                }).show();
                            },
                            text: 'Selecionar Indicadores'
                        },
                        ocultar: {
                            onclick: function () {
                                var meChart = this;

                                $(meChart.series).each(function(){
                                    //this.hide();
                                    this.setVisible(false, false);
                                });
                                meChart.redraw();

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
        
                title: {
                    text: ' '
                },
                
                xAxis: {
                    type: 'datetime'
                },
                yAxis: [
                    {  
                        visible: me.showLegend[0],
                        offset: 30,
                        margin: 2,
                        height: '100%',
                        title: {
                            text: 'Preço Médio',
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
                        visible: me.showLegend[1],
                        height: '100%',
                        title: {
                            text: 'ROL',
                            style: {
                                color: Highcharts.getOptions().colors[2],  // cor 1 na MB
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,0);
                            },
                            style: {
                                color: Highcharts.getOptions().colors[2],  // cor 1 na MB
                                fontSize: '10px'
                            }
                        }
                    },
                    {
                        visible: me.showLegend[2],
                        height: '100%',
                        title: {
                            text: 'MB',
                            style: {
                                color: Highcharts.getOptions().colors[1],  // cor 2 no ROL
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,2);
                            },
                            style: {
                                color: Highcharts.getOptions().colors[1], // cor 2 no ROL
                                fontSize: '10px'
                            }
                        }
                    },
                    {
                        visible: me.showLegend[3],
                        top: '60%',
                        height: '40%',
                        title: {
                            text: 'Quantidade',
                            style: {
                                color: '#2EBD85',
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            align: 'left',
                            formatter: function () {
                                return utilFormat.Value2(this.value,0);
                            },
                            style: {
                                color: '#2EBD85', //09ffa0 , 2EBD85 4caf50
                                fontSize: '10px'
                            }
                        }
                    },
                    {
                        visible: me.showLegend[4],
                        height: '100%',
                        title: {
                            text: 'Nota',
                            style: {
                                color: Highcharts.getOptions().colors[3],
                                fontSize: '10px'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return utilFormat.Value2(this.value,0);
                            },
                            style: {
                                color: Highcharts.getOptions().colors[3],
                                fontSize: '10px'
                            }
                        }
                    }
                ],

                // plotOptions: {
                // },

                tooltip: {

                    formatter: function () {

                        return ['<a>' + this.points[0].point.data + '</a>'].concat(
                            this.points ?
                                this.points.map(function (point) {

                                    var dicima = point.series.name == 'Preço Médio' || point.series.name == 'MB' ? 2 : 0;
                                    var valor = utilFormat.Value2(point.y,dicima);

                                    return '<span style="color: '+point.color+'">'+point.series.name+'</span>: <b>'+valor+'</b><br/>';
                                }) : []
                        );
                    },
                    
                    
                    // pointFormatter: function(){

                    //     var dicima = this.name == 'Preço' || this.name == 'MB' ? 2 : 0;

                    //     var valor = utilFormat.Value2(this.y,dicima);
                    //     console.log(this);
                    //     return '<span style="color: '+this.series.color+'">'+this.name+'</span>: <b>'+valor+'</b><br/>';
                    // },
                    // valueDecimals: 2,
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

                series: [
                    {
                        type: 'line',
                        name: 'Preço Médio',
                        data: data[0],
                        yAxis: 0,
                        visible: me.showLegend[0]
                        // tooltip: {
                        //     valueDecimals: 2
                        // }
                        
                    },
                    {
                        type: 'line',
                        name: 'ROL',
                        data: data[1],
                        yAxis: 1,
                        visible: me.showLegend[1]
                        // tooltip: {
                        //     valueDecimals: 2
                        // }
                        
                    },
                    {
                        type: 'line',
                        name: 'MB',
                        data: data[2],
                        yAxis: 2,
                        visible: me.showLegend[2]
                        // tooltip: {
                        //     valueDecimals: 2
                        // }
                        
                    },
                    {
                        type: 'column',
                        id: 'Quantidade',
                        name: 'Quantidade',
                        data: data[3],
                        color: '#2EBD85',
                        yAxis: 3,
                        visible: me.showLegend[3]
                        // tooltip: {
                        //     valueDecimals: 2
                        // }
                    },
                    {
                        type: 'line',
                        name: 'Nota',
                        data: data[4],
                        yAxis: 4,
                        visible: me.showLegend[4]
                        // tooltip: {
                        //     valueDecimals: 2
                        // }
                        
                    },
                ]
            });

            iColor= 0;
            iCont =0 ;
            me.chart.series.forEach(function(record){

                if(record.visible){

                    var color = Highcharts.getOptions().colors[iColor];

                    if(record.name == 'Quantidade' || record.name == 'Navigator 1'){
                        color = '#2EBD85';
                    }else{
                        
                        iColor++;
                    }
                    record.update({color:color},false);
                    
                }
                
                iCont++;
            });

            setTimeout(function(){
                me.chart.redraw();
            },250);

            setTimeout(function(){
                me.chart.redraw();
            },600);

    }
});
