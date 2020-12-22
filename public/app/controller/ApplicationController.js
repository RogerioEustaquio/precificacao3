Ext.define('App.controller.ApplicationController', {
    extend: 'Ext.app.Controller',

    requires: [
        'App.view.Toolbar',
        'App.view.home.HomePanel',
        'App.view.dolar.CotacaoDolarComercialPanel',
        'App.view.fii.FiiPanel',
        'App.view.rpe.RpePanel',
        'App.view.dsh-pvd.DashboardPerformanceVendaDiaPanel',
    ],

    control: {

    },

    routes: {
        'home': { action: 'homeAction' },
        'cotacaodolarpomercial': { action: 'cotacaodolarpomercialAction' },
        'fii': { action: 'fiiAction' },
        'rpe': { action: 'rpeAction' },
        'dashboardperformancevendadia': { action: 'dashboardperformancevendadiaAction' },
    },

    controllerEvent: function(){
        var me = this;

        return {
            'apptoolbar #home': {
                click: function(btn) {
                    me.redirectTo('home')
                }
            },

            // 'apptoolbar button[action=recarregar]': {
            'apptoolbar #cotacaodolarpomercial': {
                click: function(btn) {
                    me.redirectTo('cotacaodolarpomercial')
                }
            }
        }
    },

    init: function() {
        var me = this;

        me.control(me.controllerEvent());
        me.configViewport();
    },

    goActionMasterTab: function(route, closable){
        this.addMasterTab(route, route + 'panel', closable);
    },

    homeAction: function(){
        // this.goActionMasterTab('home', true)
        this.goActionMasterTab('rpe', true)
    },

    cotacaodolarpomercialAction: function(){
        this.goActionMasterTab('cotacaodolarpomercial', true)
    },

    fiiAction: function(){
        this.goActionMasterTab('fii', true)
    },

    rpeAction: function(){
        this.goActionMasterTab('rpe', true)
    },

    dashboardperformancevendadiaAction: function(){
        this.goActionMasterTab('dashboardperformancevendadia', true)
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
    
    addMasterTab: function(route, xtype, closable){
        var me = this,
            viewport = me.getViewport(),
            viewportTabs = viewport.down('#applicationtabs'),
            tab = viewportTabs.down(xtype);

        if(!tab){
            tab = viewportTabs.add({
                closable: closable,
                xtype: xtype,
                route: route, 
                listeners: {
                    show: function(aTab){
                        me.redirectTo(aTab.route)
                    },
                    destroy: function(aTab){
                        if(aTab.xtype === 'homepanel')
                        me.redirectTo('#')
                    }
                }
            });
        };
        
        viewportTabs.setActiveItem(tab);
    },

    getViewport: function(){
        return App.getApplication().getMainView();
    },

    getCurrentRoute: function(){
        return App.getApplication().getRouter().getRoute(this.getCurrentRouteName());
    }
    
});
