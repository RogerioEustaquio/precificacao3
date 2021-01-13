Ext.define('App.view.rpe.EixoWindow', {
    extend: 'Ext.window.Window',
    xtype: 'eixowindow',
    itemId: 'eixowindow',
    height: 300,
    width: 800,
    title: 'Seleção de Eixos',
    requires:[
        'App.view.rpe.PluginDragDropTag',
        'App.view.rpe.ChartsBubbleExample'
    ],
    layout: 'fit',
    constructor: function() {
        var me = this;

        var elementbx = Ext.create('Ext.form.field.Tag',{
            name: 'bxElement',
            itemId: 'bxElement',
            store: Ext.data.Store({
                fields: [{ name: 'id', type: 'string' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/rpe/listareixos',
                    timeout: 120000,
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            // width: '80%',
            flex: 1,
            queryParam: 'id',
            queryMode: 'local',
            displayField: 'name',
            valueField: 'id',
            emptyText: 'name',
            fieldLabel: 'Eixos (x, y, z)',
            margin: '1 10 1 1',
            plugins:'dragdroptag',
            filterPickList: true,
            publishes: 'value',
            listeners: {
            }
        
        });
        elementbx.store.load();

        var btnConfirm = Ext.create('Ext.button.Button',{

            text: 'Confirmar',
            margin: '1 2 1 1',
            // handler: function(form) {
            //     console.log(elementbx.getValue());
            // }
        });


        Ext.applyIf(me, {
            
            items:[
                {
                    xtype:'panel',
                    layout: 'border',
                    items:[
                        {
                            xtype: 'panel',
                            region: 'north',
                            border: false,
                            layout: 'hbox',
                            items: [
                                elementbx,
                                btnConfirm
                            ]
                        },
                        {
                            xtype: 'panel',
                            region: 'center',
                            itemId: 'panelchart',
                            layout:'fit',
                            items: [
                                {
                                    xtype: 'chartsbubbleexample',
                                    // title: 'Chart Bubble'
                                }
                            ]
                        }
                    ]
                }
            ]
        });


        // elementbx.mon(elementbx,{
        //     mouseDown: function() {
        //         console.log('down');
        //     },
        //     mouseUp: function() {
        //         console.log(this.value);
        //     }
        // });

        elementbx.on({
            select: function(){
                // console.log('select this.value');
                var utilFormat = Ext.create('Ext.ux.util.Format');
                var xyz = this.value;
                var charts = this.up('panel').up('panel').down('#panelchart').down('chartsbubbleexample');

                var storeEixo = this.getStore().getData().autoSource.items;

                // Na cosulta valores retornarão via Ajax da consulta real
                var cont = 0;
                var x='',y='',z='',xtext='',ytext ='';
                storeEixo.forEach(function(record){

                    if(cont == 0){
                        xtext = (xyz[0]) ? xyz[0] : record.data.id;
                        
                        for (let index = 0; index < storeEixo.length; index++) {
                            const element = storeEixo[index];

                            if(element.data.id == xyz[0] ){
                                x = element.data.vExemplo ;
                                break;
                            }else{
                                x = 15;
                            }
                        }
                    }

                    if(cont == 1){
                        ytext = (xyz[1]) ? xyz[1] : record.data.id;

                        for (let index = 0; index < storeEixo.length; index++) {
                            const element = storeEixo[index];

                            if(element.data.id == xyz[1]){
                                y = element.data.vExemplo ;
                                break;
                            }else{
                                y = 25;
                            }
                        }
                    }
                    if(cont == 2){
                        ztext = (xyz[2]) ? xyz[2] : record.data.id;

                        for (let index = 0; index < storeEixo.length; index++) {
                            const element = storeEixo[index];

                            if(element.data.id == xyz[2] ){
                                z = element.data.vExemplo ;
                                break;
                            }else{
                                z = 35;
                            }
                        }
                    }

                    cont++;

                });
                

                var newSerie = {
                    data : [
                        { x: x, y: y, z: z, name: 'A', country: 'A' },
                        { x: 0, y: 0, z: 0, name: 'B', country: 'B' },
                        { x: 10000, y: 60, z: 600, name: 'C', country: 'C' }
                    ]
                };

                charts.chart.update(
                    {
                        tooltip: {
                            formatter: function () {
            
                                var pointFormat = '<table>';
                                pointFormat += '<tr><th colspan="2"><h3>'+''+'</h3></th></tr>';
                                pointFormat += '</table>';
                                pointFormat += '<table>';
                                pointFormat += '<tr><th align="left">'+xtext+'</th><td  align="left">'+utilFormat.Value2(x,0)+'</td></tr>';
                                pointFormat += '<tr><th align="left">'+ytext+'</th><td  align="left">'+utilFormat.Value2(y,2)+'</td></tr>';
                                pointFormat += '<tr><th align="left">'+ztext+'</th><td  align="left">'+utilFormat.Value2(z,0)+'</td></tr>';
                                pointFormat += '</table>';
            
                                return pointFormat;
                            }
                        },
                        xAxis : {
                            title:{
                                text: xtext
                            }
                        },
                        yAxis: {
                            title:{
                                text: ytext
                            }
                        },
                        series: [newSerie]
                    }
                );

            }
        });

        me.callParent(arguments);


    }

});
