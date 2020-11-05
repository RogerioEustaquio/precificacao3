Ext.define('App.controller.ApplicationController', {
    extend: 'Ext.app.Controller',

    requires: [
        'App.view.Toolbar',
        'App.view.home.Main',
        'App.view.dsh-pvd.Main',
        'App.view.fii.Main'
    ],

    control: {

    },

    routes: {
        'home': { action: 'homeAction' },
        'dashboard-performance-venda-dia': { action: 'dashboardPerformanceVendaDiaAction' },
        'fii': { action: 'fiiAction' }
    },

    init: function() {
        var me = this;

        me.configViewport();
    },

    homeAction: function(){
        this.addMasterTab('homemain', true);
    },

    dashboardPerformanceVendaDiaAction: function(){
        this.addMasterTab('dshpvdmain', true);
    },

    fiiAction: function(){
        var objWindow = Ext.create('App.view.fii.Main');
        objWindow.show();
    },

    configViewport: function(){
        var me = this,
            viewport = me.getViewport();
        
        if(viewport){
            viewport.add({
                itemId: 'applicationtabs',
                region: 'center',
                xtype: 'tabpanel',
                layout: 'fit'
            });
        }
    },
    
    addMasterTab: function(xtype, closable){
        var me = this,
            viewport = me.getViewport(),
            viewportTabs = viewport.down('#applicationtabs'),
            tab = viewportTabs.down(xtype);

        if(!tab){
            tab = viewportTabs.add({
                closable: closable,
                xtype: xtype
            });
        };
        
        viewportTabs.setActiveItem(tab);
    },

    getViewport: function(){
        return App.getApplication().getMainView();
    }
    
});
