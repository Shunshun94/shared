var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.scheduler = io.github.shunshun94.scheduler || {};
io.github.shunshun94.scheduler.Scheduler = class {
	constructor($dom, opts = {}) {
		this.$html = $($dom);
		this.id = this.$html.attr('id') || 'io-github-shunshun94-scheduler-Scheduler';
		this.timezone = opts.timezone ? (Number(opts.timezone) || 0) : 0;
		this.extendable = opts.extendable;
		this.appendable = (opts.appendable === undefined) ? io.github.shunshun94.scheduler.Scheduler.generateSchedule : opts.appendable;
		this.dateFormat = opts.dateFormat || '%m/%d (%D)';
		this.schedules = {};
		this.initialLength = Number(opts.initialLength) || io.github.shunshun94.scheduler.Scheduler.ONE_WEEK_DAYS;
		const initialSchedule = (opts.initialSchedule || io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE).sort((a, b) => {
			return a.prepare - b.prepare;
		});
		this.startDate = opts.startDate || (initialSchedule[0] ? new Date(initialSchedule[0].prepare) : new Date());
		this.separationIntervalAlgorithm = opts.separationIntervalAlgorithm || io.github.shunshun94.scheduler.Scheduler.SEPARATION_INTERVAL_ALGORITHM;
		
		this.buildComponents(initialSchedule);
		this.bindEvents();
		this.drawSchedules(initialSchedule);
	}
	
	getSchedules() {
		return io.github.shunshun94.scheduler.Scheduler.convertScheduleMapToArray(this.schedules);
	}
	
	updateSchedule(schedule) {
		return drawSchedule(schedule);
	}
	
	drawScheduleDay_(schedule, i, isHead, isLast) {
		const baseStyle = 'box-sizing:border-box;position:absolute;top:0px;bottom:0px;text-align:center;overflow:hidden;';
		const minWidth = $(`.${this.id}-date-scheduleColumn`).width() / (24 * 60);
		const startDate = new Date(schedule.prepare + (1000 * 60 * 60 * 24 * i));
		const endDate = new Date(schedule.tidyUp);
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
					minWidth: (schedule.length.head + schedule.length.foot + 60) * minWidth,
					stop: this.resized.bind(this)
				});
			}
		}
		return $schedule;
	}
	
	calcDayCounts(start, end) {
		const timezoneDiff = ((new Date()).getTimezoneOffset() * 60 * 1000) - 1;
		var endDay =  new Date(end);
		var startDay = new Date(start);
		startDay.setHours(0); startDay.setMinutes(0);
		return Math.ceil((endDay - startDay) / (1000*60*60*24));
	}

	drawSchedule(schedule) {
		$(`.${this.id}-date-scheduleColumn-schedule-${schedule.id}`).remove();
		const days = this.calcDayCounts(schedule.prepare, schedule.tidyUp);
		for(var i = 0; i < days; i++) {
			this.drawScheduleDay_(schedule, i, Boolean(i == 0), Boolean(i == days - 1));
		}
		this.generateEachSchedulePopupMenu(schedule);
		this.schedules[`${this.id}-date-scheduleColumn-schedule-${schedule.id}`] = schedule;
		return $(`.${this.id}-date-scheduleColumn-schedule-${schedule.id}`);
	}

	drawSchedules(initialSchedule) {
		var list = [];
		initialSchedule.forEach((schedule) => {
			list.push(this.drawSchedule(schedule));
		});
		return list;
	}
	
	deleteSchedule(schedule) {
		if(! window.confirm(`Do you want to delete "${schedule.label}"?`)) {
			return;
		}
		this.$html.trigger({
			type: io.github.shunshun94.scheduler.Scheduler.EVENTS.DELETE_EVENT, deleted: schedule
		});
		return this.deleteSchedule_(schedule);
	}
	
	deleteSchedule_(schedule) {
		delete this.schedules[`${this.id}-date-scheduleColumn-schedule-${schedule.id}`];
		$(`.${this.id}-date-scheduleColumn-schedule-${schedule.id}`).remove();
		return schedule.id;
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
		var dateColumn = $(`<div class="${this.id}-date-dateColumn"` +
				`id="${this.id}-date-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-dateColumn"></div>`);
		dateColumn.text(this.formatDate(date));
		
		var schedule = $(`<div class="${this.id}-date-scheduleColumn"` +
				`id="${this.id}-date-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-scheduleColumn"></div>`);

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
	
	addSchedule(date) {
		const lastId = /(\d\d\d\d+)-(\d+)-(\d+)/.exec($(date).attr('id'));
		const baseDateMorning = new Date(Number(lastId[1]), Number(lastId[2]), Number(lastId[3]));
		const baseDateNight = new Date(Number(lastId[1]), Number(lastId[2]), Number(lastId[3]) + 1);
		const baseYear = baseDateMorning.getFullYear();
		const baseMonth = baseDateMorning.getMonth();
		const baseDay = baseDateMorning.getDate();
		const targetSchedules = this.getSchedules().filter((schedule) => {
			return	(baseDateMorning < schedule.prepare && baseDateNight > schedule.prepare) || 
					(baseDateMorning < schedule.tidyUp && baseDateNight > schedule.tidyUp);
		});
		if(targetSchedules.length) {
			alert(`In ${baseYear}/${baseMonth + 1}/${baseDay}, ${targetSchedules[0].label} is places. Use separation to add more schedules.`);
			console.warn(`In ${baseYear}/${baseMonth + 1}/${baseDay}, ${targetSchedules[0].label} is places. Use separation to add more schedules.`, targetSchedules);
			return;
		}
		this.drawSchedules([this.appendable(io.github.shunshun94.scheduler.Scheduler.rndString(),
				'9:00 ～ 18:00',
				new Date(Number(lastId[1]), Number(lastId[2]), Number(lastId[3]), 9),
				540,
				120,
				30)]);
	}
	
	drawFooter() {
		var footer = $(`<div class="${this.id}-date-footer" id="${this.id}-date-footer"></div>`);
		footer.text('▼')
		return footer;
	}
	
	appendDayLines(startDate, length) {
		const baseYear = startDate.getFullYear();
		const baseMonth = startDate.getMonth();
		const baseDay = startDate.getDate();
		
		if($(`#${this.id}-date-footer`).length) {
			for(var i = 0; i < length ; i++) {
				$(`#${this.id}-date-footer`).before(this.getDayLine(new Date(baseYear, baseMonth, baseDay + i)));
			}
		} else {
			for(var i = 0; i < length ; i++) {
				this.$html.append(this.getDayLine(new Date(baseYear, baseMonth, baseDay + i)));
			}
		}
		
		for(var i = 0; i < length; i++) {
			this.generateAddSchedulePopupMenu(new Date(baseYear, baseMonth, baseDay + i));
		}
	}
	
	buildComponents(initialSchedule) {
		this.$html.append(this.drawHeader());
		this.appendDayLines(this.startDate, this.initialLength);
		if(this.extendable) {
			this.$html.append(this.drawFooter());
		}
	}
	
	onClickFooter(e) {
		const lastId = /(\d\d\d\d+)-(\d+)-(\d+)/.exec($(`.${this.id}-date`).last().attr('id'));
		const baseDate = new Date(Number(lastId[1]), Number(lastId[2]), Number(lastId[3]) + 1);
		this.appendDayLines(baseDate, io.github.shunshun94.scheduler.Scheduler.ONE_WEEK_DAYS);
		var scheduleList = this.getSchedules();
		this.drawSchedules(scheduleList);
	}
	
	onClickSchedule(e) {
		const $target = $(e.target);
		this.$html.trigger({
			type: io.github.shunshun94.scheduler.Scheduler.EVENTS.CLICK_EVENT,
			schedule: this.schedules[$target.attr('id').replace(/-\d+$/, '') ]
		});
	}
	
	separateSchedule(schedule) {
		if(! window.confirm(`Do you want to separete "${schedule.label}"?`)) {
			return;
		}
		try {
			const newSchedules = this.separationIntervalAlgorithm(schedule);
			this.drawSchedules(newSchedules);
			this.deleteSchedule_(schedule);
			this.$html.trigger({
				type: io.github.shunshun94.scheduler.Scheduler.EVENTS.SEPARATE_EVENT,
				schedules: newSchedules, deleted: schedule
			});
		} catch (err) {
			alert(err);
			console.warn(err);
		}
	}
	
	generateEachSchedulePopupMenu(schedule, num = 0) {
		var popupMenu = new PopupMenu();
		popupMenu.add(`Separating ${schedule.label}`, (e) => {this.separateSchedule(schedule)});
		popupMenu.add(`Delete ${schedule.label}`, (e) => {this.deleteSchedule(schedule)});

		const elems = document.getElementsByClassName(`${this.id}-date-scheduleColumn-schedule-${schedule.id}`);
		for(var i = 0; i < elems.length; i++) {
			popupMenu.bind(elems[i]);
		}
		return popupMenu;
	}
	
	generateAddSchedulePopupMenu(date) {
		const baseYear = date.getFullYear();
		const baseMonth = date.getMonth();
		const baseDay = date.getDate();
		var popupMenu = new PopupMenu();
		popupMenu.add(`Append new schedule for ${this.formatDate(date)}`, (e) => {this.addSchedule(e)});
		popupMenu.bind(document.getElementById(`io-github-shunshun94-scheduler-Scheduler-date-${baseYear}-${baseMonth}-${baseDay}-scheduleColumn`));
	}
	
	bindEvents() {
		this.$html.click((e) => {
			const $target = $(e.target);
			if($target.hasClass(`${this.id}-date-scheduleColumn-schedule`)) {
				this.onClickSchedule(e);
			}
			if($target.hasClass(`${this.id}-date-footer`)) {
				this.onClickFooter(e);
			}
		});
	}
};


io.github.shunshun94.scheduler.Scheduler.rndString = (length=8, prefix='', suffix='') => {
	const baseString ='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var randomString = '';
	for(var i=0; i<length; i++) {
		randomString += baseString.charAt( Math.floor( Math.random() * baseString.length));
	}
	return prefix + randomString + suffix;
};

io.github.shunshun94.scheduler.Scheduler.convertScheduleMapToArray = (map) => {
	var result = [];
	for(var key in map) {
		result.push(map[key]);
	}
	return result.sort((a, b) => {
		return a.prepare - b.prepare;
	});
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

io.github.shunshun94.scheduler.Scheduler.SEPARATION_INTERVAL_ALGORITHM = (schedule) => {
	if(schedule.length.body < ((schedule.length.foot + schedule.length.head) * 2 + 120)) {
		throw `Because ${schedule.label} dosen't have enough length, you can't separate this schedule.`
	}
	var result = [{
		id: `${schedule.id}_0`,
		label: `${schedule.label}_0`,
		start: schedule.start,
		prepare: schedule.prepare,
		length: {
			head: schedule.length.head,
			foot: schedule.length.foot
		}
	}, {
		id: `${schedule.id}_1`,
		label: `${schedule.label}_1`,
		end: schedule.end,
		tidyUp: schedule.tidyUp,
		length: {
			head: schedule.length.head,
			foot: schedule.length.foot
		}
	}];
	
	
	result[0].end = result[0].prepare + (schedule.length.total / 2 - 15 - schedule.length.foot) * 60 * 1000;
	result[0].tidyUp = result[0].prepare + ((schedule.length.total / 2) - 15) * 60 * 1000;
	
	result[1].prepare = result[0].tidyUp + 30 * 60 * 1000;
	result[1].start = result[0].tidyUp + (schedule.length.head + 30) * 60 * 1000;
	
	result[0].length.body = (result[0].end - result[0].start) / (60 * 1000);
	result[1].length.body = result[0].length.body;
	result[0].length.total = (result[0].length.body + result[0].length.foot + result[0].length.head);
	result[1].length.total = result[0].length.total;
	
	return result;
};

io.github.shunshun94.scheduler.Scheduler.toStringSchedule = (schedule) => {
	return `"${schedule.label}" ${new Date(schedule.prepare)} ～ ${new Date(schedule.tidyUp)} ` +
	`${schedule.length.total}分間 (含 準備：${schedule.length.head}分 / 片づけ:${schedule.length.foot}分)`
};

io.github.shunshun94.scheduler.Scheduler.ONE_WEEK_DAYS = 7;
io.github.shunshun94.scheduler.Scheduler.DAYS = ['Sun.', 'Mon', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
io.github.shunshun94.scheduler.Scheduler.EVENTS = {
	CLICK_EVENT: 'io-github-shunshun94-scheduler-Scheduler-EVENTS-CLICK_EVENT',
	RESIZE_EVENT: 'io-github-shunshun94-scheduler-Scheduler-EVENTS-RESIZE_EVENT',
	SEPARATE_EVENT: 'io-github-shunshun94-scheduler-Scheduler-EVENTS-SEPARATE_EVENT',
	DELETE_EVENT: 'io-github-shunshun94-scheduler-Scheduler-EVENTS-DELETE_EVENT'
};
io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE = new Date();
io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES = {
	YEAR: io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.getFullYear(),
	MONTH: io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.getMonth(),
	DATE: io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.getDate(),
	HOUR: 9, MIN: 0
};

io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE = [0,1,3,7].map((diff, i) => {
	const startDate = new Date(
			io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.YEAR,
			io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.MONTH,
			io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.DATE + diff,
			io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.HOUR,
			io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.MIN);
	return io.github.shunshun94.scheduler.Scheduler.generateSchedule(
			diff,
			`${io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.HOUR}:` +
			`${String(io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.MIN).padStart(2, '0')} ～ ` +
			`${(io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.HOUR + 9 + (24 * i)) % 24}:` +
			`${String((io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE_BASEDATE.VALUES.MIN + 540 + 60 * 24 * i) % 60).padStart(2, '0')}`,
			startDate,
			540 + (60 * 24 * i), 120, 30
	);
});
