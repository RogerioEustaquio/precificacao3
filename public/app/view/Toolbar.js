Ext.define('App.view.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'apptoolbar',

    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'button',
                    text: 'Ficha de Indicadores',
                    handler: function(){
                        window.document.location= BASEURL +'/#fii';
                    }
                },
                {
                    xtype: 'button',
                    text: 'Rastreador de Performance',
                    handler: function(){
                        window.document.location= BASEURL +'/#rpe';
                    }
                },
                // {
                //     xtype: 'button',
                //     text: 'Performance Venda Dia',
                //     handler: function(){
                //         window.document.location= BASEURL +'/#dashboardperformancevendadia';
                //     }
                // },
                // {
                //     xtype: 'button',
                //     text: 'Cotação Dolar Comercial',
                //     handler: function(){
                //         window.document.location= BASEURL +'/#cotacaodolarpomercial';
                //     }
                // }
            ]
        });

        me.callParent(arguments);
    }

});
