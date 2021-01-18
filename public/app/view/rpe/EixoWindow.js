Ext.define('App.view.rpe.EixoWindow', {
    extend: 'Ext.window.Window',
    xtype: 'eixowindow',
    itemId: 'eixowindow',
    id: 'eixowindow',
    height: 300,
    width: 800,
    title: 'Seleção de Eixos',
    requires:[
        'App.view.rpe.PluginDragDropTag',
        'App.view.rpe.ChartsBubbleExample'
    ],
    layout: 'fit',
    closeAction: 'method-hide',
    eixos: null,
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
            emptyText: 'Selecione os Indicadores',
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
            itemId: 'btnconfirmar',
            margin: '1 2 1 1',
            handler: function(btn) {

                // var objChart = Ext.getCmp('chartsbrandpositioning');
                // console.log(objChart);


                // Enviar paramentros de selecão de eixo e atualizar chart

                me.fireEvent('onConfirmarClick', btn);

            }
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

        elementbx.on({
            change: function(){
                // console.log('select this.value');

                var xyz = this.value;

                var storeEixo = this.getStore().getData().autoSource.items;

                // Na cosulta valores retornarão via Ajax da consulta real
                var cont = 0;
                var newSerie='',x='',y='',z='',xtext='ROL',ytext ='MB',ztext='CC',xId='rol',yId='mb',zId='cc';
                storeEixo.forEach(function(record){

                    if(cont == 0){

                        for (let index = 0; index < storeEixo.length; index++) {
                            const element = storeEixo[index];

                            if(element.data.id == xyz[0] ){
                                xtext = element.data.name;
                                x = element.data.vExemplo ;
                                xId = element.data.id;
                                break;
                            }else{
                                x = 15;
                            }
                        }
                    }

                    if(cont == 1){

                        for (let index = 0; index < storeEixo.length; index++) {
                            const element = storeEixo[index];

                            if(element.data.id == xyz[1]){
                                ytext = element.data.name;
                                y = element.data.vExemplo ;
                                yId = element.data.id;
                                break;
                            }else{
                                y = 25;
                            }
                        }
                    }
                    
                    if(cont == 2){

                        for (let index = 0; index < storeEixo.length; index++) {
                            const element = storeEixo[index];

                            if(element.data.id == xyz[2] ){
                                ztext = element.data.name;
                                z = element.data.vExemplo ;
                                zId = element.data.id;
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
                        { x: 800000, y: 25, z: 800, name: 'B', country: 'B' },
                        { x: 1200000, y: 32, z: 900, name: 'C', country: 'C' }
                    ]
                };

                me.idEixos= {
                    x: xId.toLowerCase(),
                    y: yId.toLowerCase(),
                    z: zId.toLowerCase()
                };

                xyztext = {
                    x: xtext,
                    y: ytext,
                    z: ztext
                };
                
                me.textEixos = xyztext;

                elementbx.xyztext = xyztext;

                me.onAtualizaChart(newSerie,xtext,ytext,ztext);

            }
        });


        me.callParent(arguments);

    },

    // initComponent: function(){
    //     var me = this;

    //     // me.addEvents('onConfirmarClick');

    //     me.callParent(arguments);
    // },

    onAtualizaChart: function(newSerie,xtext,ytext,ztext){

        var utilFormat = Ext.create('Ext.ux.util.Format');
        var charts = this.down('panel').down('#panelchart').down('chartsbubbleexample');

        charts.chart.update(
            {
                tooltip: {
                    formatter: function () {

                        var pointFormat = '<table>';
                        pointFormat += '<tr><th colspan="2">'+this.point.name+'</th></tr>';
                        pointFormat += '<tr><th align="left">'+xtext+':</th><td  align="left">'+utilFormat.Value2(this.point.x,0)+'</td></tr>';
                        pointFormat += '<tr><th align="left">'+ytext+':</th><td  align="left">'+utilFormat.Value2(this.point.y,2)+'</td></tr>';
                        pointFormat += '<tr><th align="left">'+ztext+':</th><td  align="left">'+utilFormat.Value2(this.point.z,0)+'</td></tr>';
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
