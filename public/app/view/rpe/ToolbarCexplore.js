Ext.define('App.view.rpe.ToolbarCexplore',{
    extend: 'Ext.Toolbar',
    xtype: 'toolbarcexplore',
    itemId: 'toolbarcexplore',
    region: 'north',
    requires:[
        'App.view.rpe.NodeWindowCexplore',
        'App.view.rpe.FiltrosWindowCexplore'
    ],
    vNiveis: [],
    vData: null,
    vdatainicioa: null,
    vdatafinala: null,
    vdatainiciob: null,
    vdatafinalb: null,
    vEmps: [],
    vMarcas: [],
    vCurvas: [],
    vProdutos: [],

    initComponent: function() {
        var me = this;

        // var today = new Date();
        // var sysdate = today.getMonth() +'/'+ today.getFullYear();

        var btnGrupo = Ext.create('Ext.button.Button',{
            iconCls: 'fa fa-list',
            margin: '1 1 1 4',
            handler: me.onBtnGrupo
        });

        var btnFiltro = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-filter',
            tooltip: 'Filtro',
            margin: '1 1 1 4',
            handler: me.onBtnFiltros
        });

        var btnConsultar = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-search',
            tooltip: 'Consultar',
            margin: '1 1 1 4',
            handler: me.onBtnConsultar
        });

        Ext.applyIf(me, {

            items : [
                btnGrupo,
                btnFiltro,
                btnConsultar,
                '->',
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Período A',
                    name: 'dataRefa',
                    itemId: 'dataRefa',
                    labelWidth: 64,
                    margin: '1 20 1 1',
                    // value: sysdate
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Período B',
                    name: 'dataRefb',
                    itemId: 'dataRefb',
                    labelWidth: 64,
                    margin: '1 20 1 1',
                    // value: sysdate
                }
            ]
        });

        me.callParent(arguments);

    },

    onBtnGrupo: function(){
        var me = this.up('toolbar');

        objWindow = Ext.create('App.view.rpe.NodeWindowCexplore');
        objWindow.show();

        var btnConfirmar = objWindow.down('panel').down('toolbar').down('form').down('button');

        if(me.vNiveis)
            objWindow.down('panel').down('form').down('#bxElement').setValue(me.vNiveis);

        btnConfirmar.on('click',
            function(){

                var myform = objWindow.down('panel').down('form');
                var niveis = myform.down('#bxElement').getValue();
                me.vNiveis = niveis;

                var gridOrder = myform.down('grid').getStore().getData();
                // var pstring  = '';
                var arrayOrder = new Array();
                gridOrder.items.forEach(function(record){

                    if(record.data.ordem){
                        // if(!pstring){
                        //     pstring  = record.data.campo+' '+record.data.ordem
                        // }else{
                        //     pstring += ', '+record.data.campo+' '+record.data.ordem;
                        // }
                        arrayOrder.push(record.data);
                    }
                    
                });
                // console.log(arrayOrder);

                me.vOrdem = arrayOrder;

                objWindow.close();

            }
        );
    },

    onBtnFiltros: function(btn){
        var me = this.up('toolbar');

        var objWindow = Ext.create('App.view.rpe.FiltrosWindowCexplore');
        objWindow.show();

        if(me.vdatainicioa){
            objWindow.down('#datainicioa').setValue(me.vdatainicioa);
        }
        if(me.vdatafinala){
            objWindow.down('#datafinala').setValue(me.vdatafinala);
        }
        if(me.vdatainiciob){
            objWindow.down('#datainiciob').setValue(me.vdatainiciob);
        }
        if(me.vdatafinalb){
            objWindow.down('#datafinalb').setValue(me.vdatafinalb);
        }

        if(me.vEmps)
            objWindow.down('#elEmp').setValue(me.vEmps);

        if(me.vMarcas)
            objWindow.down('#elMarca').setValue(me.vMarcas);
        
        if(me.vMarcas)
            objWindow.down('#elgrupomarca').setValue(me.vMarcas);
        
        if(me.vProdutos.length){

            var objProduto = objWindow.down('#elProduto');
            //Load na tag dos produtos selecionados //
            objProduto.getStore().getProxy().setExtraParams({tipoSql:2, codItem: Ext.encode(me.vProdutos)});
            objProduto.getStore().load();

            objProduto.setValue(me.vProdutos);
        }

        objWindow.down('button[name=confirmar]').on('click',function(){

            var dataValue = objWindow.down('#datainicioa').getRawValue();
            me.vdatainicioa = dataValue;
            var dataValue = objWindow.down('#datafinala').getRawValue();
            me.vdatafinala = dataValue;

            var datainicioa = me.vdatainicioa ? me.vdatainicioa : '' ;
            var datafinala = me.vdatafinala ? me.vdatafinala : '' ;
            me.down('#dataRefa').setValue(datainicioa+' até '+ datafinala);

            var dataValue = objWindow.down('#datainiciob').getRawValue();
            me.vdatainiciob = dataValue;
            var dataValue = objWindow.down('#datafinalb').getRawValue();
            me.vdatafinalb = dataValue;

            var datainiciob = me.vdatainiciob ? me.vdatainiciob : '' ;
            var datafinalb = me.vdatafinalb ? me.vdatafinalb : '' ;
            me.down('#dataRefb').setValue(datainiciob+' até '+datafinalb);

            var empSelect = objWindow.down('#elEmp').getValue();
            me.vEmps = empSelect;

            var marcaSelect = objWindow.down('#elMarca').getValue();
            me.vMarcas = marcaSelect;

            var marcaSelect = objWindow.down('#elgrupomarca').getValue();
            me.vMarcas = marcaSelect;

            // var curvaSelect = objWindow.down('#elCurva').getValue();
            // me.vCurvas = curvaSelect;

            var produtoSelect = objWindow.down('#elProduto').getValue();
            me.vProdutos = produtoSelect;

            objWindow.close();
        });

    },

    onBtnConsultar: function(btn){
        var me = this.up('toolbar');

        var grid = me.up('container').down('panel').down('treepanel');

        var params = {
            datainicioa : me.vdatainicioa,
            datafinala  : me.vdatafinala,
            datainiciob : me.vdatainiciob,
            datafinalb  : me.vdatafinalb,
            emps : Ext.encode(me.vEmps),
            marcas: Ext.encode(me.vMarcas),
            // curvas: Ext.encode(me.vCurvas),
            niveis: Ext.encode(me.vNiveis),
            produtos: Ext.encode(me.vProdutos),
            ordem : Ext.encode(me.vOrdem)
        };

        grid.getStore().getProxy().setExtraParams(params);
        grid.getStore().load();

    }
    
});