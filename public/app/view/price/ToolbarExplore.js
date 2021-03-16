Ext.define('App.view.price.ToolbarExplore',{
    extend: 'Ext.Toolbar',
    xtype: 'toolbarexplore',
    itemId: 'toolbarexplore',
    region: 'north',
    requires:[
        'App.view.price.NodeWindowExplore',
        'App.view.price.FiltrosWindowExplore'
    ],
    vNiveis: [],
    vData: null,
    vEmps: [],
    vMarcas: [],
    vCurvas: [],
    vProdutos: [],

    initComponent: function() {
        var me = this;

        var today = new Date();
        var sysdate = today.getMonth() +'/'+ today.getFullYear();

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
                    fieldLabel: 'Mês Referência',
                    name: 'dataRef',
                    itemId: 'dataRef',
                    labelWidth: 100,
                    margin: '1 40 1 1',
                    value: sysdate
                }
            ]
        });

        me.callParent(arguments);

    },

    onBtnGrupo: function(){
        var me = this.up('toolbar');

        objWindow = Ext.create('App.view.price.NodeWindowExplore');
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

        var objWindow = Ext.create('App.view.price.FiltrosWindowExplore');
        objWindow.show();

        if(me.vData){
            objWindow.down('#data').setValue(me.vData);
            me.down('#dataRef').setValue(me.vData);
        }

        if(me.vEmps)
            objWindow.down('#elEmp').setValue(me.vEmps);

        if(me.vMarcas)
            objWindow.down('#elMarca').setValue(me.vMarcas);
        
        if(me.vCurvas)
            objWindow.down('#elCurva').setValue(me.vCurvas);
        
        if(me.vProdutos.length){

            var objProduto = objWindow.down('#elProduto');
            //Load na tag dos produtos selecionados //
            objProduto.getStore().getProxy().setExtraParams({tipoSql:2, codItem: Ext.encode(me.vProdutos)});
            objProduto.getStore().load();

            objProduto.setValue(me.vProdutos);
        }

        objWindow.down('button[name=confirmar]').on('click',function(){

            var dataValue = objWindow.down('#data').getRawValue();
            me.vData = dataValue;
            me.down('#dataRef').setValue(dataValue);

            var empSelect = objWindow.down('#elEmp').getValue();
            me.vEmps = empSelect;

            var marcaSelect = objWindow.down('#elMarca').getValue();
            me.vMarcas = marcaSelect;

            var curvaSelect = objWindow.down('#elCurva').getValue();
            me.vCurvas = curvaSelect;

            var produtoSelect = objWindow.down('#elProduto').getValue();
            me.vProdutos = produtoSelect;

            objWindow.close();
        });

    },

    onBtnConsultar: function(btn){
        var me = this.up('toolbar');

        var grid = me.up('container').down('panel').down('treepanel');

        var params = {
            data : me.vData,
            emps : Ext.encode(me.vEmps),
            marcas: Ext.encode(me.vMarcas),
            curvas: Ext.encode(me.vCurvas),
            niveis: Ext.encode(me.vNiveis),
            produtos: Ext.encode(me.vProdutos),
            ordem : Ext.encode(me.vOrdem)
        };

        grid.getStore().getProxy().setExtraParams(params);
        grid.getStore().load();

    }
    
});