Ext.define('App.view.fii.Toolbar',{
    extend: 'Ext.Toolbar',
    xtype: 'fiitoolbar',
    itemId: 'fiitoolbar',
    region: 'north',
    requires:[
    ],

    initComponent: function() {
        var me = this;

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
                btnFiltro,
                btnConsultar
            ]
        });

        me.callParent(arguments);

    },

    onBtnFiltros: function(btn){
        var me = this.up('toolbar');

        if(me.up('container').down('#panelwest').hidden){
            me.up('container').down('#panelwest').setHidden(false);
        }else{
            me.up('container').down('#panelwest').setHidden(true);
        }
        
    },

    onBtnConsultar: function(btn){
        var me = this.up('toolbar');

        var idEmpresas  = me.up('container').down('#panelwest').down('#elEmp').getValue();
        var idMarcas    = me.up('container').down('#panelwest').down('#elMarca').getValue();
        var codProdutos = me.up('container').down('#panelwest').down('#elProduto').getValue();

        var grid = me.up('container').down('#panelcenter').down('grid');

        var params = {
            idEmpresas: Ext.encode(idEmpresas),
            idMarcas: Ext.encode(idMarcas),
            codProdutos: Ext.encode(codProdutos)
        };

        grid.getStore().getProxy().setExtraParams(params);
        grid.getStore().load(
            // function(record){
            //     var columns = grid.getView().getHeaderCt().getGridColumns();
            //     Ext.each(columns, function (col) {
            //               col.setText();
            //           }
            //     });
            // }
        );

    }
    
});