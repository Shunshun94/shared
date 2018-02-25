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
		this.schedules = {};
		
		const initialSchedule = (opts.initialSchedule || io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE).sort((a, b) => {
			return a.prepare - b.prepare;
		});
		this.buildComponents(initialSchedule);
		this.drawSchedules(initialSchedule);
		this.bindEvents();
	}
	
	drawScheduleDay_(schedule, i, isHead, isLast) {
		const baseStyle = 'box-sizing:border-box;position:absolute;top:0px;bottom:0px;text-align:center;overflow:hidden;';
		const minWidth = $(`.${this.id}-date-scheduleColumn`).width() / (24 * 60);
		const startDate = new Date(schedule.prepare + (1000 * 60 * 60 * 24 * i));
		const endDate = new Date(schedule.tidyUp + (1000 * 60 * 60 * 24 * i));
		const startPoint = isHead ? (startDate.getHours() * 60 + startDate.getMinutes()) * minWidth : 0;
		const endPoint = isLast ? (60 * 24 - (endDate.getHours() * 60 + endDate.getMinutes())) * minWidth : 0;
		
		var $schedule = $('<div ' +
				`class="${this.id}-date-scheduleColumn-schedule ${this.id}-date-scheduleColumn-schedule-${schedule.id}" ` +
				`id="${this.id}-date-scheduleColumn-schedule-${schedule.id}-${i}" ` +
				`style="right:${endPoint}px;left:${startPoint}px;${baseStyle}" >` + '</div>');
		$schedule.text(schedule.label);
		if(isHead) {
			$schedule.append('<div ' +
					`class="${this.id}-date-scheduleColumn-schedule-head" ` +
					`style="width:${schedule.length.head * minWidth}px;${baseStyle}" ></div>`);
		}
		if(isLast) {
			$schedule.append('<div ' +
					`class="${this.id}-date-scheduleColumn-schedule-foot" ` +
					`style="width:${schedule.length.foot * minWidth}px;${baseStyle}right:0px;" ></div>`);
		}
		
		////////////////////////////////////
		const $base = $(`#${this.id}-date-${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()} > .${this.id}-date-scheduleColumn`);
		const staticHeight = $base.height();
		if($base.length) {
			$base.append($schedule);
			if(isHead || isLast) {
				var handles = [];
				if(isHead) {handles.push('w');}
				if(isLast) {handles.push('e');}
				$(`#${this.id}-date-scheduleColumn-schedule-${schedule.id}-${i}`).resizable({
					grid: minWidth * 10,
					ghost: true,
					helper: 'helper',
					handles: handles.join(','),
					minWidth: (schedule.length.head + schedule.length.foot + 10) * minWidth,
					stop: this.resized.bind(this)
				});
			}
		}
		return $schedule;
	}
	
	drawSchedule(schedule) {
		$(`.${this.id}-date-scheduleColumn-schedule-${schedule.id}`).remove();
		const days = Math.ceil((schedule.tidyUp/(1000*60*60*24)) - Math.floor(schedule.prepare/(1000*60*60*24))) - 1;
		for(var i = 0; i < days; i++) {
			this.drawScheduleDay_(schedule, i, Boolean(i == 0), Boolean(i == days - 1));
		}
		this.schedules[`${this.id}-date-scheduleColumn-schedule-${schedule.id}`] = schedule;
		return $(`.${this.id}-date-scheduleColumn-schedule-${schedule.id}`)
	}

	drawSchedules(initialSchedule) {
		initialSchedule.forEach((schedule) => {
			this.drawSchedule(schedule);
		});
	}
	
	resized(e, movedSchedule) {
		const minWidth = $(`.${this.id}-date-scheduleColumn`).width() / (24 * 60);
		const staticHeight = $(`.${this.id}-date-scheduleColumn`).height();
		const id = $(e.target).attr('id').replace(/-\d+$/, '');
		const number = Number($(e.target).attr('id').replace(`${id}-`, ''));
		$(e.target).css({
			top: '0px', height: staticHeight + 'px'
		});
		const count = $(`.${id}`).length;

		if(number === 0) {
			const tmpDay = new Date(this.schedules[id].prepare);
			const prepareStart = (movedSchedule.position.left - $(e.target).parent().position().left) / minWidth;
			this.schedules[id].prepare = Number(new Date(tmpDay.getFullYear(), tmpDay.getMonth(), tmpDay.getDate(), Math.floor(prepareStart / 60), prepareStart % 60));
			this.schedules[id].start = this.schedules[id].prepare + this.schedules[id].length.head * 60 * 1000;
		}

		if(number === count - 1) {
			const tmpDay = new Date(this.schedules[id].tidyUp);
			const finishTidyUp = (movedSchedule.position.left + movedSchedule.size.width - $(e.target).parent().position().left) / minWidth;
			this.schedules[id].tidyUp = Number(new Date(tmpDay.getFullYear(), tmpDay.getMonth(), tmpDay.getDate(), Math.floor(finishTidyUp / 60), finishTidyUp % 60));
			this.schedules[id].end = this.schedules[id].tidyUp - this.schedules[id].length.foot * 60 * 1000;
		}

		this.schedules[id].length.total = (this.schedules[id].tidyUp -  this.schedules[id].prepare) / (1000 * 60)
		this.schedules[id].length.body = this.schedules[id].length.total - this.schedules[id].length.head - this.schedules[id].length.foot;

		this.drawSchedule(this.schedules[id]);
		this.$html.trigger({
			type: io.github.shunshun94.scheduler.Scheduler.EVENTS.RESIZE_EVENT,
			schedule: this.schedules[id]
		});
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
		
		var schedule = $(`<div class="${this.id}-date-scheduleColumn"></div>`);
		
		line.append(dateColumn);
		line.append(schedule);
		return line;
	}
	
	drawHeader() {
		var header = $(`<div class="${this.id}-date ${this.id}-date-header" id="${this.id}-date-header"></div>`);
		var dateColumn = $(`<div class="${this.id}-date-dateColumn ${this.id}-date-dateColumnHeader"></div>`);
		dateColumn.text('Date');
		header.append(dateColumn);
		return header;
	}
	
	buildComponents(initialSchedule) {
		const startDate = new Date(initialSchedule[0].prepare) || new Date();
		const baseYear = startDate.getFullYear();
		const baseMonth = startDate.getMonth();
		const baseDay = startDate.getDate();
		
		this.$html.append(this.drawHeader());
		for(var i = 0; i < io.github.shunshun94.scheduler.Scheduler.ONE_WEEK_DAYS ; i++) {
			this.$html.append(this.getDayLine(new Date(baseYear, baseMonth, baseDay + i)));
		}
	}
	
	bindEvents() {
		this.$html.click((e) => {
			const $target = $(e.target);
			if($target.hasClass(`${this.id}-date-scheduleColumn-schedule`)) {
				this.$html.trigger({
					type: io.github.shunshun94.scheduler.Scheduler.EVENTS.CLICK_EVENT,
					schedule: this.schedules[$target.attr('id').replace(/-\d+$/, '') ]
				});
			}
		});
	}
};


io.github.shunshun94.scheduler.Scheduler.generateSchedule = (
	id,
	label,
	startDate,
	length = 540,
	prepare = 0,
	tidyUp = 0
) => {
	var result = {};
	startDateNum = Number(startDate);
	result.id = id;
	result.label = label;
	result.start = startDateNum;
	result.end = startDateNum + length * 60 * 1000;
	result.prepare =  startDateNum - prepare * 60 * 1000;
	result.tidyUp = result.end + tidyUp * 60 * 1000;
	result.length = {
			head: prepare,
			body: length,
			foot: tidyUp,
			total: prepare + length + tidyUp
	};
	return result;
};

io.github.shunshun94.scheduler.Scheduler.ONE_WEEK_DAYS = 7;
io.github.shunshun94.scheduler.Scheduler.DAYS = ['Sun.', 'Mon', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
io.github.shunshun94.scheduler.Scheduler.EVENTS = {
	CLICK_EVENT: 'io-github-shunshun94-scheduler-Scheduler-EVENTS-CLICK_EVENT',
	RESIZE_EVENT: 'io-github-shunshun94-scheduler-Scheduler-EVENTS-RESIZE_EVENT'
};
io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE = new Date();
io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES = {
	YEAR: io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.getFullYear(),
	MONTH: io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.getMonth(),
	DATE: io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.getDate(),
	HOUR: 9, MIN: 0
};

io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE = [0,1,3].map((diff, i) => {
	return io.github.shunshun94.scheduler.Scheduler.generateSchedule(
			diff,
			`Schedule - ${i + 1}`,
			new Date(
			io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.YEAR,
			io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.MONTH,
			io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.DATE + diff,
			io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.HOUR,
			io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.MIN),
			540 + (60 * 24 * i), 120, 30
	);
});
