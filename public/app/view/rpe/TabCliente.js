Ext.define('App.view.rpe.TabCliente', {
    extend: 'Ext.panel.Panel',
    xtype: 'tabcliente',
    itemId: 'tabcliente',
    closable: false,
    requires: [
        'App.view.rpe.ChartsClientePosicionamento',
        'App.view.rpe.FiltroClientePosicionamento',
        'App.view.rpe.EixoClienteWindow'
    ],
    title: 'Cliente',
    layout: 'card',
    border: false,
    tbar: {
        border: false,
        items:[
            {
                xtype: 'button',
                text: 'Posicionamento',
                handler: function(){
                
                    var bolha = Ext.create('App.view.rpe.chartsclienteposicionamento');
    
                    var panelBolha =  this.up('panel').down('#containerbolha').down('#panelbolha');
    
                    if(panelBolha.items.length == 0){
                        panelBolha.add(bolha);
                    }
                    this.up('panel').setActiveItem(0);
                }
            }
        ]
    },
    items:[
        {
            xtype: 'container',
            layout:'border',
            itemId: 'containerbolha',
            items:[
                {
                    xtype:'filtroclienteposicionamento',
                    region: 'west'
                },
                {
                    xtype: 'panel',
                    region: 'center',
                    layout: 'fit',
                    itemId: 'panelbolha',
                    tbar:[
                        {
                            xtype: 'button',
                            iconCls: 'fa fa-filter',
                            handler: function() {
                                var filtromarca =  this.up('panel').up('container').down('#filtroclienteposicionamento');
                                var hidden = (filtromarca.hidden) ? false : true;
                                filtromarca.setHidden(hidden);
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'fa fa-search',
                            margin: '0 0 0 2',
                            tooltip: 'Consultar',
                            handler: function() {

                                var me = this.up('panel').up('container').up('panel');
                                var panelBolha =  this.up('panel');

                                var idEixos = null;
                                var textEixos = null

                                var window = Ext.getCmp('eixoclientewindow');
                                if(window){
                                    idEixos = window.idEixos;
                                    textEixos = window.textEixos;
                                }

                                me.onConsultar(panelBolha,idEixos,textEixos);
                
                            }
                        },
                        '->',
                        {
                            xtype: 'button',
                            iconCls: 'fa fa-cog',
                            handler: function() {

                                var me = this.up('panel').up('container').up('panel');
                                var panelBolha =  this.up('panel');

                                var window = Ext.getCmp('eixoclientewindow');
                                if(!window){
                                    window = Ext.create('App.view.rpe.EixoClienteWindow', {
                                        listeners: {
                                            render: function(w){

                                                w.down('#btnconfirmar').on('click',function(btn){

                                                    var xyz = w.down('#bxElement').getValue();
                                                    var storeEixo = w.down('#bxElement').getStore().getData().autoSource.items;

                                                    w.close();

                                                    // Na cosulta valores retornarão via Ajax da consulta real
                                                    var cont = 0;
                                                    var newSerie='',x='',y='',z='',xtext='ROL',ytext ='MB',ztext='CC';
                                                    storeEixo.forEach(function(record){

                                                        if(cont == 0){

                                                            for (let index = 0; index < storeEixo.length; index++) {
                                                                const element = storeEixo[index];

                                                                if(element.data.id == xyz[0] ){
                                                                    xtext = element.data.name;
                                                                    break;
                                                                }
                                                            }
                                                        }

                                                        if(cont == 1){

                                                            for (let index = 0; index < storeEixo.length; index++) {
                                                                const element = storeEixo[index];

                                                                if(element.data.id == xyz[1]){
                                                                    ytext = element.data.name;
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                        
                                                        if(cont == 2){

                                                            for (let index = 0; index < storeEixo.length; index++) {
                                                                const element = storeEixo[index];

                                                                if(element.data.id == xyz[2] ){
                                                                    ztext = element.data.name;
                                                                    break;
                                                                }
                                                            }
                                                        }

                                                        cont++;

                                                    });
                                                    
                                                    var x = xyz[0] ? xyz[0].toLowerCase() : 'rol';
                                                    var y = xyz[1] ? xyz[1].toLowerCase() : 'mb';
                                                    var z = xyz[2] ? xyz[2].toLowerCase() : 'nf';

                                                    var idEixos = {
                                                        x: x,
                                                        y: y,
                                                        z: z
                                                    };

                                                    var textEixos = {
                                                        x: xtext,
                                                        y: ytext,
                                                        z: ztext
                                                    };

                                                    me.onConsultar(panelBolha,idEixos,textEixos);

                                                });
                                            }
                                        }
                                    });
                                }

                                window.show();

                            }
                        }
                    ],
                    items:[
                        {
                            xtype: 'chartsclienteposicionamento'
                        }
                    ]
                    
                }
            ]
        }
    ],

    onConsultar: function(panelBolha,idEixos,textEixos){
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        var filtro =  panelBolha.up('container').down('#filtroclienteposicionamento');
        var filial = filtro.down('#clifilial').getValue();
        var datainicio = filtro.down('#clidatainicio').getRawValue();
        var datafim = filtro.down('#clidatafim').getRawValue();
        var marcas = filtro.down('#climarca').getValue();
        var produto = filtro.down('#cliproduto').getValue();
        var pareto = filtro.down('#clipareto').getValue();
        
        var params = {
            filial: Ext.encode(filial),
            datainicio : datainicio,
            datafim: datafim,
            idMarcas: Ext.encode(marcas),
            produto: Ext.encode(produto),
            pareto: Ext.encode(pareto)
        };

        if(!idEixos){

            idEixos = {
                x: 'rol',
                y: 'mb',
                z: 'nf'
            };
            
        }
        if(!textEixos){

            textEixos = {
                x: 'ROL',
                y: 'MB',
                z: 'NF'
            };
            
        }
        
        var xtext = textEixos.x;
        var ytext = textEixos.y;
        var ztext = textEixos.z;

        var charts = panelBolha.down('#chartsclienteposicionamento');

        var seriesLength = (charts.chart.series) ? charts.chart.series.length : 0 ;

        for(var i = seriesLength - 1; i > -1; i--)
        {
            charts.chart.series[i].remove();
        }
        charts.setLoading(true);
        charts.chart.update(false,false);

        Ext.Ajax.request({
            url: BASEURL +'/api/clienteposicionamento/clienteposicionamento',
            method: 'POST',
            params: params,
            async: true,
            timeout: 240000,
            success: function (response) {
                var result = Ext.decode(response.responseText);

                charts.setLoading(false);
                // charts.chart.hideLoading();
                if(result.success){

                    rsarray = result.data;
                    var cont = 0;
                    
                    // charts.chart.xAxis[0].setCategories(rsarray.categories);

                    var vSerie = Object();
                    var vData = Array();

                    var x='',y='',z='';
                    var arrayPJ = Array();
                    var arrayPF = Array();
                    var decX = 0,decY = 2,decZ = 0;
                    rsarray.forEach(function(record){

                        x = record[idEixos.x];
                        y = record[idEixos.y];

                        // decX = record['dec'+idEixos.x];
                        // decY = record['dec'+idEixos.y];

                        if(record.tipoPessoa == 'J'){
                            arrayPJ.push([parseFloat(x),parseFloat(y)]);
                        }else{
                            arrayPF.push([parseFloat(x),parseFloat(y)]);
                        }

                        cont++;
                    });

                    arraySeriePj=  {
                            name: 'Pessoa Jurídica',
                            color: 'rgba(223, 83, 83, .5)',
                            data : arrayPJ
                        };
                    arraySeriePf =
                        {
                            name: 'Pessoa Física',
                            color: 'rgba(119, 152, 191, .5)',
                            data : arrayPF
                        };

                    charts.chart.addSeries(arraySeriePj);
                    charts.chart.addSeries(arraySeriePf);

                    var extraUpdate = {

                        subtitle:{
                            text: result.referencia.incio + ' até ' + result.referencia.fim
                        },
                        tooltip: {
                            headerFormat: '<b>{series.name}</b><br>',
                            pointFormat: '{point.x}, {point.y}'
                        },
                        xAxis : {
                            title:{
                                text: xtext
                            },
                            labels: {
                               formatter: function () {
                                    return utilFormat.Value2(this.value,parseFloat(decX));
                               }
                            }
                        },
                        yAxis: {
                            title:{
                                text: ytext
                            },
                            labels: {
                               formatter: function () {
                                    return utilFormat.Value2(this.value,parseFloat(decY));
                               }
                            }
                        }

                    };

                    charts.chart.update(extraUpdate);

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
                
            },
            error: function() {
                rsarray = [];
                charts.setLoading(false);
                // charts.chart.hideLoading();

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
})