var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.table = io.github.shunshun94.table || {};
io.github.shunshun94.table.FixedTable = class {
	constructor(opt = {}, $dom) {
		this.table = $dom || opt.dom || opt.$dom || $('.io-github-shunshun94-table-FixedTable');
		if(this.table.length > 1) {
			this.table.each((i, v)=>{
				new io.github.shunshun94.table.FixedTable(opt, $(v));
			})
		} else {
			if( this.table.length === 0 ) {
				console.error('1st Argument: %o\n2nd Argument %o', opt, $dom);
				throw "io.github.shunshun94.table.FixedTable requires jQuery Element as 2nd argument";
			}
			if( this.table.find('thead').length === 0 || this.table.find('tbody').length === 0 ) {
				console.error('table element is %o', this.table);
				throw "In io.github.shunshun94.table.FixedTable, table element must includes thead and tbody";
			}
			this.colColumns = opt.colColumns || opt.col || 1;
			this.originalWidth = this.table.width();
			this.width = Number(opt.width) || false;

			this.cellsWidth = opt.cellsWidth || opt.cellWidth || this.table.find('thead>tr:nth-child(1)>*').map((i,v)=>{return $(v).width()}).get();
			this.cellsHeight = opt.cellsHeight || opt.cellsHeight || this.table.find('tr>*:first-child').map((i,v)=>{return $(v).height()}).get();

			this.headHeight = opt.headHeight || this.table.find('thead').height();
			this.bodyHeight = opt.bodyHeight || this.table.find('tbody').height();
			this.totalHeight = this.headHeight + this.bodyHeight + 20;
			this.setCss();
			this.bindEvents();
		}
	}
	
	setCss() {
		this.table.css({
			'box-sizing': 'border-box',
			'position':'relative',
			'overflow':'scroll',
			'width': this.width ? `${this.width}px` : '100%',
			'height':`${this.totalHeight}px`,
			'display':'block'
		});
		this.table.find('*').css('box-sizing', 'border-box');
		this.table.find('thead').css({
			'position': 'absolute',
			'left': 'auto',
			'top': 'auto',
			'z-index':2
		});
		if(this.table.find('thead').css('background-color') === 'rgba(0, 0, 0, 0)') {
			this.table.find('thead').css('background-color', 'white');
		} 
		this.table.find('tbody').css({
			'position': 'absolute',
			'top': `${this.headHeight}px`,
			'height': `${this.bodyHeight}px`,
			'overflow': 'scroll'
		});
		this.table.find('tr').css({
			'display': 'block',
			'width': `${this.originalWidth}px`,
			'position': 'relative'
		});
		this.table.find('td,th').css({
			'vertical-align':' top',
			'position':' relative'
		});
		this.cellsWidth.forEach((v, i)=>{
			this.table.find(`tr>*:nth-child(${i+1})`).width(v);
		});
		
		for(var i = 0; i < this.colColumns; i++) {
			const elem = this.table.find(`tr>*:nth-child(${i+1})`);
			elem.css({
				'position':' relative',
				'z-index':'1'
			});
			if(elem.css('background-color') === 'rgba(0, 0, 0, 0)') {
				elem.css('background-color', 'white');
			} 
		}
		
		this.table.find(`tr`).each((i, v)=>{
			$(v).find('*').height(this.cellsHeight[i]);
		});
	}
	
	bindEvents() {
		this.table.scroll((e)=>{
			const rightLength = this.table.scrollLeft();
			for(var i = 0; i < this.colColumns; i++) {
				this.table.find(`tr>*:nth-child(${i+1})`).css('left', `${rightLength}px`);
			}
		});
	}
};