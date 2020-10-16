Ext.define('App.view.dsh-pvd.TreeGrid',{
    extend: 'Ext.tree.Panel',
    xtype: 'treegrid',
    itemId: 'treegrid',
    rootVisible: false,
    constructor: function() {
        var me = this;

        var myModel = Ext.create('Ext.data.TreeModel', {
                            fields: [ { name: 'grupo', type: 'string'},
                                      { name: 'rol', type: 'number'},
                                      { name: 'lb', type: 'number'},
                                      { name: 'mb', type: 'number'}
                                    ]
                        });

        var mystore = Ext.create('Ext.data.TreeStore', {
            model: myModel,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: BASEURL + '/api/dshpvd/listarNfEstoque',
                encode: true,
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    messageProperty: 'message',
                    root: 'data'
                }
            },
            root: {
                expanded: true,
                text: "",
                // children: [],
                "data": []
            }
        });

        Ext.applyIf(me, {

            store: mystore,
            columns: [
                {
                    xtype: 'treecolumn', // this is so we know which column will show the tree
                    text: '',
                    dataIndex: 'grupo',
                    flex: 1,
                    sortable: true,
                    
                },
                {
                    text: 'ROL',
                    dataIndex: 'rol',
                    align: 'rigth'
                },
                {
                    text: 'LB',
                    dataIndex: 'lb',
                    align: 'rigth'
                },
                {
                    text: 'MB',
                    dataIndex: 'mb',
                    align: 'rigth'
                }
            ],
            listeners: {
                click: {
                    element: 'el', //bind to the underlying el property on the panel
                    fn: function(e){ console.log( this.getLoader()); }
                },
                dblclick: {
                    element: 'body', //bind to the underlying body property on the panel
                    fn: function(){ console.log('dblclick body'); }
                }
            }

        });

        me.callParent(arguments);

    }
    
});