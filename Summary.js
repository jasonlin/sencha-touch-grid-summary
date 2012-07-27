Ext.define('Ext.ux.touch.grid.feature.Summary', {
	extend   : 'Ext.ux.touch.grid.feature.Abstract',
    requires : [
        'Ext.ux.touch.grid.feature.Abstract'
    ],

	config: {
		events: {
			store: {
				load: 'printSummaryRow'
			}
		},
		
		summaryRow: {
			xtype: "component",
			docked: 'bottom',
			cls    : 'x-grid-summary-row'
		}
	},
	
	init: function(grid){
		var store = grid.getStore();
		if(!store.isLoading()){
			grid.on('painted', 'printSummaryRow', this, { buffer : 50 });
		}
	},
	
	applySummaryRow: function(newRow, oldRow){
		//console.log('new:');
		//console.log(newRow);
		//console.log('old:');
		//console.log(oldRow);
		return Ext.factory(newRow, Ext.Component, oldRow);
	},
	
	updateSummaryRow: function(newRow, oldRow){
		//console.log('new:');
		//console.log(newRow);
		//console.log('old:');
		//console.log(oldRow);	
		var me = this,
			grid = me.getGrid();
		if(oldRow){
			grid.remove(oldRow);
		}
		
		if(newRow){
			grid.insert(0, newRow);
		}
	},
	
	printSummaryRow: function(grid){
		if(!(grid instanceof Ext.ux.touch.grid.View)){
			grid = this.getGrid();
		}
		
		var me = this,
			store = grid.getStore(),
			columns = grid.getColumns(),
			cNum = columns.length,
			tpl        = [],
			c = 0,
			basePrefix = Ext.baseCSSPrefix,
			column,
			attributes,
			css,
			styles,
			innerText,width,renderer;
			

		
		if(store.isLoading()){
			store.on('load', 'printSummaryRow', me, { single: true });
			return;
		}
		
		store.on('clear', 'printSummaryRow', me, { single: true });
		store.on('updaterecord', 'printSummaryRow', me, { single: true});
		store.on('addrecords', 'printSummaryRow', me, { single: true});
		store.on('removerecords', 'printSummaryRow', me, { single: true});
		
		for (; c < cNum; c++) {
			column = columns[c];
            css           = [basePrefix + 'grid-cell'];
            styles        = [];
			attributes    = ['dataindex="' + column.dataIndex + '"'];
			css.push(basePrefix + 'grid-cell-hd');
			width         = column.width;
			renderer      = column['summaryRenderer'] || this._defaultRenderer;
			
			if(column.hidden)
				continue;
			
			styles.push('width: ' + width + (Ext.isString(width) ? '' : 'px') + ';');
            if (styles.length > 0) {
                attributes.push('style="' + styles.join(' ') + '"');
            }
			
			// get store summary
			innerText = column.summaryType ? this.getSummary(store, column.summaryType, column.dataIndex) : '';
			
			// call summary renderer			
			innerText = column.summaryType ? renderer.call(this, innerText, store, column.dataIndex) : '';
			
            tpl.push('<div class="' + css.join(' ') + '" ' + attributes.join(' ') + '>' + innerText + '</div>');			
		}
		
		tpl = tpl.join('');
		//console.log(tpl);
		summaryRow = this.getSummaryRow();
		summaryRow.setHtml(tpl);
		
		if(store.getCount() == 0){
			this.hideSummaryRow();
		} else {
			this.showSummaryRow();
		}
	},
	
	showSummaryRow: function(){
		var row = this.getSummaryRow();
		if(row.isHidden())
			row.show();
	},
	
	hideSummaryRow: function(){
		var row = this.getSummaryRow();
		if(!row.isHidden())
			row.hide();
	},
	
    toggleSummaryRow: function(visible){
        //this.showSummaryRow = !!visible;
		var row = this.getSummaryRow();
		if(row.isHidden())
			row.show();
		else
			row.hide();
    },	
	
	_defaultRenderer: function(value, store, field){
		return value;
	},
	
    getSummary: function (store, type, field) {
        if (type) {
            switch (type) {
                case 'count':
					//console.log('count:'+store.getCount());
                    return store.getCount();
                case 'min':
					//console.log('min:'+store.min(field));
                    return store.min(field);
                case 'max':
					//console.log('max:'+store.max(field));
                    return store.max(field);
                case 'sum':
					//console.log('sum:'+store.sum(field));
                    return store.sum(field);
                case 'average':
					//console.log('average:'+store.average(field));
                    return store.average(field);
                default:
                    return '';                    
            }
        } else {
			return '';
		}
    }
});