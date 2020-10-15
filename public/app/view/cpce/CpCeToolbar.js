Ext.define('App.view.cpce.CpCeToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'CpCeToolbar',
    id: 'CpCeToolbar',
    itemId: 'CpCeToolbar',
    margin: '2 2 2 2',
    requires: [
    ],
    constructor: function() {
        var me = this;

        var empbx = Ext.create('Ext.form.field.ComboBox',{
            width: 70,
            id: 'cbxemp',
            itemId: 'cbxemp',
            store: Ext.data.Store({
                fields: [{ name: 'idEmpresa' }, { name: 'apelido' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/CpCe/listarempresas',
                    timeout: 120000,
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            queryParam: 'codigo',
            queryMode: 'local',
            displayField: 'nome',
            valueField: 'nome',
            emptyText: 'Emp',
            forceSelection: true,
            disabled: true,
            margin: '1 1 1 1',
            listeners: {
            }
        });

        empbx.store.load(function(r){
            empbx.enable();
            empbx.select(USUARIO.empresa);
        });

        var btdtinicio = Ext.create('Ext.form.field.Date',{
            name: 'dtinicio',
            id: 'dtinicio',
            fieldLabel: 'Emissão de',
            margin: '2 2 2 12',
            width: 180,
            labelWidth: 72,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____'
        });

        var btdtfim = Ext.create('Ext.form.field.Date',{
            name: 'dtfim',
            id: 'dtfim',
            fieldLabel: 'até',
            margin: '2 2 2 2',
            width: 132,
            labelWidth: 20,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____'
        });

        var btdtinicioe = Ext.create('Ext.form.field.Date',{
            name: 'dtinicioe',
            id: 'dtinicioe',
            fieldLabel: 'Entrada de',
            margin: '2 2 2 12',
            width: 180,
            labelWidth: 68,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____'
        });

        var btdtfime = Ext.create('Ext.form.field.Date',{
            name: 'dtfime',
            id: 'dtfime',
            fieldLabel: 'até',
            margin: '2 2 2 2',
            width: 132,
            labelWidth: 20,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____'
        });

        var btnSearch = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-search',
            tooltip: 'Consultar',
            margin: '1 1 1 10',
            handler: function(form) {

                
                var emp = '';

                if(me.down('#cbxemp').getRawValue()){
                    var emp = me.down('#cbxemp').selection.data.idEmpresa;
                }
                
                if(!emp){
                    Ext.Msg.alert('info', 'Selecione uma Empresa.');
                    return null;
                }
                
                var dtinicio = me.down('#dtinicio').getRawValue();
                var dtfim = me.down('#dtfim').getRawValue();
                var dtinicioe = me.down('#dtinicioe').getRawValue();
                var dtfime = me.down('#dtfime').getRawValue();
                var nrnota = me.down('#nrnota').getRawValue();

                var itemgrid = me.up('container').down('#container1').down('#pprincipal').down('#itemgridpanel').down('grid');
       
                var pfiltro = me.up('container').down('#filtroPanel');
                var gridmarca = pfiltro.down('#pmarcagrid').down('grid');

                var arraySession = gridmarca.getSelection();

                stringMarca ='';
                for (let index = 0; index < arraySession.length; index++) {
                    var element = arraySession[index];

                    if(stringMarca){
                        stringMarca += ','+element.data.idMarca;
                    }else{
                        stringMarca = element.data.idMarca;
                    }
                }

                var pform            = pfiltro.down('#pform').down('form');
                var produto          = pform.down('#bxproduto').getValue();
                var pcurva           = pform.down('#curva').getValue();
                var pfaixacli        = pform.down('#faixacli').getValue();
                var pfaixacusto      = pform.down('#faixacusto').getValue();
                var pvariaUltentrada = pform.down('#variaUltentrada').getValue();
                var pvariaUltcusto   = pform.down('#variaUltcusto').getValue();
                var pvariaCustomedio = pform.down('#variaCustomedio').getValue();
                var pvariaEmergmedio = pform.down('#variaEmergmedio').getValue();
                var pvaria3mes       = pform.down('#varia3mes').getValue();
                var pvaria6mes       = pform.down('#varia6mes').getValue();
                var pvaria12mes      = pform.down('#varia12mes').getValue();

                var params = {
                    emp: emp,
                    dtinicio: dtinicio,
                    dtfim:  dtfim,
                    dtinicioe: dtinicioe,
                    dtfime:  dtfime,
                    nrnota: nrnota,
                    produto: produto,
                    curva: pcurva,
                    faixacli: pfaixacli,
                    faixacusto: pfaixacusto,
                    variaUltentrada: pvariaUltentrada,
                    variaUltcusto: pvariaUltcusto,
                    variaCustomedio: pvariaCustomedio,
                    variaEmergmedio: pvariaEmergmedio,
                    varia3mes: pvaria3mes,
                    varia6mes: pvaria6mes,
                    varia12mes: pvaria12mes,
                    marca: stringMarca
                };

                itemgrid.getStore().getProxy().setExtraParams(params);
                itemgrid.getStore().loadPage(1);

            }
        });

        var btnnota = Ext.create('Ext.form.field.Text',{
            name: 'nrnota',
            id: 'nrnota',
            emptyText: 'Número Nota',
            width: 120
        });

        var btnfilter = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-filter',
            tooltip: 'Filtro',
            margin: '1 1 1 10',
            handler: function(form) {

                var panelFilter = Ext.getCmp('filtroPanel');
                if(panelFilter.hidden == true){
                    panelFilter.setHidden(false);
                }else{
                    panelFilter.setHidden(true);
                }

            }
        });

        Ext.applyIf(me, {

            items: [
                empbx,
                btdtinicio,
                btdtfim,
                btdtinicioe,
                btdtfime,
                btnnota,
                btnfilter,
                btnSearch
            ]

        });

        me.callParent(arguments);

    }

});
