Ext.define('App.view.dsh-pvd.Toolbar',{
    extend: 'Ext.Toolbar',
    xtype: 'toolbarpvd',
    itemId: 'toolbarpvd',
    region: 'north',
    requires:[
        'App.view.dsh-pvd.WindowNode'
    ],
    vEmps: null,

    constructor: function() {
        var me = this;

        var btnWinEmp = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-list',
            margin: '1 1 1 4',
            handler: me.onBtnEmpClick

        });

        var btnFiltro = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-filter',
            tooltip: 'Consultar',
            margin: '1 1 1 4',
            handler: function() {

            }
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
                btnWinEmp,
                btnFiltro,
                btnSearch
            ]
        });

        me.callParent(arguments);

    },

    onBtnEmpClick: function(btn){
        var me = this;

        var objWindow = Ext.create('App.view.dsh-pvd.WindowNode');
            objWindow.show();

        if(me.vEmps)
            objWindow.down('#elEmp').setValue(me.vEmps);

        objWindow.down('button[name=confirmar]').on('click',function(){

            var empSelect = objWindow.down('#elEmp').getValue();
            me.vEmps = empSelect;

            objWindow.close();
        });
    }
    
});