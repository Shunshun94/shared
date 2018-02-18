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
		this.dateFormat = opts.dateFormat || '%m/%d (%D)';
		this.initialSchedule = (opts.initialSchedule || io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE).sort((a, b) => {
			return a.prepare - b.prepare;
		});
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
		const startDate = new Date(this.initialSchedule[0].prepare) || new Date();
		const baseYear = startDate.getFullYear();
		const baseMonth = startDate.getMonth();
		const baseDay = startDate.getDate();
		
		
		for(var i = 0; i < io.github.shunshun94.scheduler.Scheduler.ONE_WEEK_DAYS ; i++) {
			this.$html.append(this.getDayLine(new Date(baseYear, baseMonth, baseDay + i)));
		}
	}
	
	bindEvents() {
		
	}
	
	
	
	
};


io.github.shunshun94.scheduler.Scheduler.generateSchedule = (
	label,
	startDate,
	length = 540,
	prepare = 0,
	tidyUp = 0
) => {
	var result = {};
	startDateNum = Number(startDate);
	result.label = label;
	result.start = startDateNum;
	result.end = startDateNum + length * 60 * 1000;
	result.prepare =  startDateNum - prepare * 60 * 1000;
	result.tidyUp = result.end + tidyUp * 60 * 1000;
	return result;
};

io.github.shunshun94.scheduler.Scheduler.ONE_WEEK_DAYS = 7;
io.github.shunshun94.scheduler.Scheduler.DAYS = ['Sun.', 'Mon', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE = new Date();
io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES = {
	YEAR: io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.getFullYear(),
	MONTH: io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.getMonth(),
	DATE: io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.getDate(),
	HOUR: 9, MIN: 0
};

io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE = [0,1,2,3,4,5,6].map((diff) => {
	return io.github.shunshun94.scheduler.Scheduler.generateSchedule(
			`Schedule - ${diff + 1}`,
			new Date(
			io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.YEAR,
			io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.MONTH,
			io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.DATE + diff,
			io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.HOUR,
			io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.MIN),
			540, 120, 30
	);
});
