Ext.define('App.view.dsh-pvd.Toolbar',{
    extend: 'Ext.Toolbar',
    xtype: 'toolbarpvd',
    itemId: 'toolbarpvd',
    region: 'north',
    requires:[
        'App.view.dsh-pvd.FiltrosWindow'
    ],
    vEmps: null,
    vMarcas: null,

    constructor: function() {
        var me = this;

        var btnFiltro = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-filter',
            tooltip: 'Consultar',
            margin: '1 1 1 4',
            handler: me.onBtnEmpClick
        });

        var btnClean = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-file',
            tooltip: 'Limpar',
            margin: '1 1 1 4'
        });

        var btnSearch = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-search',
            tooltip: 'Consultar',
            margin: '1 1 1 4',
            handler: function() {
                
                console.log(me.vEmps)
            }
        });

        Ext.applyIf(me, {

            items : [
                btnFiltro,
                btnClean,
                btnSearch
            ]
        });

        me.callParent(arguments);

    },

    onBtnEmpClick: function(btn){
        var me = this;

        var objWindow = Ext.create( 'App.view.dsh-pvd.FiltrosWindow');
        objWindow.show();

        if(me.vEmps)
            objWindow.down('#elEmp').setValue(me.vEmps);

        if(me.vMarcas)
            objWindow.down('#elMarca').setValue(me.vMarcas);

        objWindow.down('button[name=confirmar]').on('click',function(){

            var empSelect = objWindow.down('#elEmp').getValue();
            me.vEmps = empSelect;

            var marcaSelect = objWindow.down('#elMarca').getValue();
            me.vMarcas = marcaSelect;

            console.log(empSelect);
            console.log(marcaSelect);

            objWindow.close();
        });

    }
    
});