Ext.define('App.view.dsh-pvd.Toolbar',{
    extend: 'Ext.Toolbar',
    xtype: 'toolbarpvd',
    itemId: 'toolbarpvd',
    region: 'north',
    requires:[
        'App.view.dsh-pvd.NodeWindow',
        'App.view.dsh-pvd.FiltrosWindow'
    ],
    vNiveis: [],
    vData: null,
    vEmps: [],
    vMarcas: [],
    vCurvas: [],
    vProdutos: [],

    initComponent: function() {
        var me = this;

        var btnGrupo = Ext.create('Ext.button.Button',{
            iconCls: 'fa fa-list',
            margin: '1 1 1 4',
            handler: me.onBtnGrupo
        });

        var btnFiltro = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-filter',
            tooltip: 'Consultar',
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
                btnConsultar
            ]
        });

        me.callParent(arguments);

    },

    onBtnGrupo: function(){
        var me = this.up('toolbar');

        objWindow = Ext.create('App.view.dsh-pvd.NodeWindow');
        objWindow.show();

        var btnConfirmar = objWindow.down('panel').down('toolbar').down('form').down('button');

        btnConfirmar.on('click',
            function(){

                var niveis = objWindow.down('panel').down('form').down('#bxElement').getValue();
                me.vNiveis = niveis;

                objWindow.close();

            }
        );
    },

    onBtnFiltros: function(btn){
        var me = this.up('toolbar');

        var objWindow = Ext.create('App.view.dsh-pvd.FiltrosWindow');
        objWindow.show();

        if(me.vData)
            objWindow.down('#data').setValue(me.vData);

        if(me.vEmps)
            objWindow.down('#elEmp').setValue(me.vEmps);

        if(me.vMarcas)
            objWindow.down('#elMarca').setValue(me.vMarcas);
        
        if(me.vCurvas)
            objWindow.down('#elCurva').setValue(me.vCurvas);
        
        me.vProdutos = [];

        objWindow.down('button[name=confirmar]').on('click',function(){

            var dataValue = objWindow.down('#data').getRawValue();
            me.vData = dataValue;

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
        };

        grid.getStore().getProxy().setExtraParams(params);
        grid.getStore().load();

    }
    
});