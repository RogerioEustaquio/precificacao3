Ext.define('App.view.cpcf.CpCfToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'CpCfToolbar',
    id: 'CpCfToolbar',
    itemId: 'CpCfToolbar',
    margin: '2 2 2 2',
    requires: [
        'App.view.cpcf.WindowNf',
        'Ext.ux.util.Format'
    ],
    constructor: function() {
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        var empbx = Ext.create('Ext.form.field.ComboBox',{
            width: 70,
            id: 'cbxempf',
            itemId: 'cbxempf',
            store: Ext.data.Store({
                fields: [{ name: 'idEmpresa' }, { name: 'apelido' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/CpCf/listarempresas',
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
            name: 'dtiniciof',
            id: 'dtiniciof',
            fieldLabel: 'Emissão de',
            margin: '2 2 2 12',
            width: 180,
            labelWidth: 72,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____'
        });

        var btdtfim = Ext.create('Ext.form.field.Date',{
            name: 'dtfimf',
            id: 'dtfimf',
            fieldLabel: 'até',
            margin: '2 2 2 2',
            width: 132,
            labelWidth: 20,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____'
        });

        var btdtinicioe = Ext.create('Ext.form.field.Date',{
            name: 'dtinicioef',
            id: 'dtinicioef',
            fieldLabel: 'Entrada de',
            margin: '2 2 2 12',
            width: 180,
            labelWidth: 68,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____'
        });

        var btdtfime = Ext.create('Ext.form.field.Date',{
            name: 'dtfimef',
            id: 'dtfimef',
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

                var emp = me.down('#cbxempf').getRawValue();
                var dtinicio = me.down('#dtiniciof').getRawValue();
                var dtfim = me.down('#dtfimf').getRawValue();
                var dtinicioe = me.down('#dtinicioef').getRawValue();
                var dtfime = me.down('#dtfimef').getRawValue();
                var nrnota = me.down('#nrnotaf').getRawValue();

                var pfiltro = me.up('container').down('#filtroPanelf');
                var gridmarca = pfiltro.down('#pmarcagridf').down('grid');

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

                var itemgrid = me.up('container').down('#container1f').down('#pprincipalf').down('#itemgridpanelf').down('grid');

                var params = {
                    emp: emp,
                    dtinicio: dtinicio,
                    dtfim:  dtfim,
                    dtinicioe: dtinicioe,
                    dtfime:  dtfime,
                    nrnota: nrnota,
                    marca: stringMarca
                };

                itemgrid.getStore().getProxy().setExtraParams(params);
                itemgrid.getStore().load();

            }
        });

        var btnnota = Ext.create('Ext.form.field.Text',{
            name: 'nrnotaf',
            id: 'nrnotaf',
            emptyText: 'Número Nota',
            width: 120
        });

        var btnfilter = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-filter',
            tooltip: 'Filtro',
            margin: '1 1 1 10',
            handler: function(form) {

                var panelFilter = Ext.getCmp('filtroPanelf');
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
                btnSearch,
                '->',
                {
                    xtype: 'button',
                    text: 'Listar Notas',
                    handler: function() {

                        var objWindow = Ext.getCmp('WindowNf');

                        if(!objWindow){
                            objWindow = Ext.create('App.view.cpcf.WindowNf');
                            objWindow.show();
                        }

                        var objNfItens = objWindow.down('grid');

                        var pfiltro = me.up('container').down('#filtroPanelf');
                        var gridmarca = pfiltro.down('#pmarcagridf').down('grid');

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

                        var itemgrid = me.up('container').down('#container1f').down('#pprincipalf').down('#itemgridpanelf').down('grid');

                        var arrayLinha = itemgrid.getSelection();

                        if(arrayLinha.length >0){

                            var objForm = objWindow.down('panel').down('form');

                            var emp         = arrayLinha[0].data.emp;
                            var dtinicio    = arrayLinha[0].data.dataInicio;
                            var dtfim       = arrayLinha[0].data.dataFim;
                            var dtinicioe   = arrayLinha[0].data.dataInicioe;
                            var dtfime      = arrayLinha[0].data.dataFime;
                            var nrnota      = me.down('#nrnotaf').getRawValue();
                            var idMarca     = arrayLinha[0].data.idMarca;
                            var cnpj        = arrayLinha[0].data.cnpj;
                            var nome        = arrayLinha[0].data.nome;

                            objForm.down('#filial').setValue(emp);
                            objForm.down('#fornecedor').setValue(arrayLinha[0].data.nome);

                            var exParams = {
                                    emp: emp,
                                    dtinicio: dtinicio,
                                    dtfim:  dtfim,
                                    dtinicioe: dtinicioe,
                                    dtfime:  dtfime,
                                    nrnota: nrnota,
                                    marca: stringMarca ,
                                    cnpj: cnpj,
                                    nome: nome
                                };

                            objNfItens.getStore().getProxy().setExtraParams(exParams);
                            objNfItens.getStore().load(
                                function(record){

                                    var objForm = objNfItens.up('panel').down('form');
                                    var objTotalAnt      = objForm.down('#totalAnterior');
                                    var objTotalOpe      = objForm.down('#totalOperacao');
                                    var objTotalOpeXAnt  = objForm.down('#totalOpeXAnt');
                                    var objTotalPOpeXAnt = objForm.down('#totalPOpeXAnt');
                                    var totalAnt     = 0,
                                        totalOpe     = 0,
                                        totalOpeXAnt = 0,
                                        totalPOpeXAnt= 0;

                                    for (let index = 0; index < record.length; index++) {
                                        
                                        var element = record[index].data;

                                        if(element.anteriorValor)
                                            totalAnt    += parseFloat(element.anteriorValor);
                                        if(element.opeValor)
                                            totalOpe    += parseFloat(element.opeValor);
                                        if(element.opeXAnteriorValor)
                                            totalOpeXAnt+= parseFloat(element.opeXAnteriorValor);
                                        
                                    }
                                    
                                    objTotalAnt.setValue(utilFormat.Value(totalAnt));
                                    objTotalOpe.setValue(utilFormat.Value(totalOpe));

                                    if(totalAnt)
                                        totalPOpeXAnt = (totalOpeXAnt/totalAnt)*100;

                                    totalOpeXAnt = (totalOpeXAnt < 0 || totalOpeXAnt > 0 ? utilFormat.Value(totalOpeXAnt) : null);
                                    objTotalOpeXAnt.setValue(totalOpeXAnt);

                                    totalPOpeXAnt = (totalPOpeXAnt < 0 || totalPOpeXAnt > 0 ? utilFormat.Value(totalPOpeXAnt) : null);
                                    objTotalPOpeXAnt.setValue(totalPOpeXAnt);
                                    
                                }
                            );

                        }else{
                            console.log('Selecione');
                        }

                    }
                }
            ]

        });

        me.callParent(arguments);

    }

});
