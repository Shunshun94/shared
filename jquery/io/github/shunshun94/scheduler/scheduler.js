var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.scheduler = io.github.shunshun94.scheduler || {};
io.github.shunshun94.scheduler.Scheduler = class {
	constructor($dom, opts = {}) {
		this.$html = $($dom);
		this.id = this.$html.attr('id') || 'io-github-shunshun94-scheduler-Scheduler';
		this.timezone = opts.timezone ? (Number(opts.timezone) || 0) : 0;
		this.appendable = opts.appendable ? Boolean(opts.appendable) : false;
		this.startDate = opts.startDate || new Date();
		this.dateFormat = opts.dateFormat || '%m/%d (%D)';
		
		this.buildComponents();
		this.bindEvents();
	}
	
	formatDate(date) {
		var month = date.getMonth() + 1;
		
		return this.dateFormat
		.replace(/%y/g, date.getFullYear())
		.replace(/%m/g, month)
		.replace(/%d/g, date.getDate())
		.replace(/%D/g, io.github.shunshun94.scheduler.Scheduler.DAYS[date.getDay()])
	}
	
	getDayLine(date) {
		var line = $(`<div class="${this.id}-date ${this.id}-date-${date.getDay()}" ` +
				`id="${this.id}-date-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}"></div>`);
		var dateColumn = $(`<div class="${this.id}-date-dateColumn"></div>`);
		dateColumn.text(this.formatDate(date));
		
		line.append(dateColumn);
		return line;
	}
	
	
	buildComponents() {
		const baseYear = this.startDate.getFullYear();
		const baseMonth = this.startDate.getMonth();
		const baseDay = this.startDate.getDate();
		
		
		for(var i = 0; i < io.github.shunshun94.scheduler.Scheduler.ONE_WEEK_DAYS ; i++) {
			this.$html.append(this.getDayLine(new Date(baseYear, baseMonth, baseDay + i)));
		}
	}
	
	bindEvents() {
		
	}
	
	
	
	
};


io.github.shunshun94.scheduler.Scheduler.ONE_WEEK_DAYS = 7;
io.github.shunshun94.scheduler.Scheduler.DAYS = ['Sun.', 'Mon', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
