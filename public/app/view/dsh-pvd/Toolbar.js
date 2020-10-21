Ext.define('App.view.dsh-pvd.Toolbar',{
    extend: 'Ext.Toolbar',
    xtype: 'toolbarpvd',
    itemId: 'toolbarpvd',
    region: 'north',
    requires:[
        'App.view.dsh-pvd.FiltrosWindow'
    ],
    vData: null,
    vEmps: null,
    vMarcas: null,
    vCurvas: null,

    initComponent: function() {
        var me = this;

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
                btnFiltro,
                btnConsultar
            ]
        });

        me.callParent(arguments);

    },

    onBtnFiltros: function(btn){
        var me = this.up('toolbar');

        var objWindow = Ext.create( 'App.view.dsh-pvd.FiltrosWindow');
        objWindow.show();

        if(me.vData)
            objWindow.down('#data').setValue(me.vData);

        if(me.vEmps)
            objWindow.down('#elEmp').setValue(me.vEmps);

        if(me.vMarcas)
            objWindow.down('#elMarca').setValue(me.vMarcas);
        
        if(me.vCurvas)
            objWindow.down('#elCurva').setValue(me.vCurvas);

        objWindow.down('button[name=confirmar]').on('click',function(){

            var dataValue = objWindow.down('#data').getRawValue();
            me.vData = dataValue;

            var empSelect = objWindow.down('#elEmp').getValue();
            me.vEmps = empSelect;

            var marcaSelect = objWindow.down('#elMarca').getValue();
            me.vMarcas = marcaSelect;

            var curvaSelect = objWindow.down('#elCurva').getValue();
            me.vCurvas = curvaSelect;

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
        };

        grid.getStore().getProxy().setExtraParams(params);
        grid.getStore().load();

    }
    
});