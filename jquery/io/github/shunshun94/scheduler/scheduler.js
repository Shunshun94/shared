var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.scheduler = io.github.shunshun94.scheduler || {};
io.github.shunshun94.scheduler.Scheduler = class {
	constructor($dom, opts = {}) {
		this.$html = $($dom);
		this.id = this.$html.attr('id') || 'io-github-shunshun94-scheduler-Scheduler';
		this.$html.addClass(io.github.shunshun94.scheduler.Scheduler.CLASS);
		this.timezone = opts.timezone ? (Number(opts.timezone) || 0) : 0;
		this.extendable = opts.extendable;
		this.appendable = (opts.appendable === undefined) ? io.github.shunshun94.scheduler.Scheduler.generateSchedule : opts.appendable;
		this.resizable = (opts.resizable === undefined) ? true : (opts.resizable || false); 
		this.dateFormat = opts.dateFormat || '%m/%d (%D)';
		this.schedules = {};
		this.deleteButtonGenerator = opts.deleteButtonGenerator || io.github.shunshun94.scheduler.Scheduler.defaultDeleteButtonGenerator;
		this.dummyAppendSchedule;
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
	
	addScheduleByDate(date) {
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
		
		const schedule = this.appendable(io.github.shunshun94.scheduler.Scheduler.rndString(),
				'10:00 ～ 14:00',
				new Date(Number(lastId[1]), Number(lastId[2]), Number(lastId[3]), 10),
				240,
				120,
				30);
		this.drawSchedules([schedule])[0];
		this.$html.trigger({
			type: io.github.shunshun94.scheduler.Scheduler.EVENTS.ADD_EVENT, added: schedule
		});
		return schedule
	}
	
	addSchedule(schedule) {
		this.$html.trigger({
			type: io.github.shunshun94.scheduler.Scheduler.EVENTS.ADD_EVENT, added: schedule
		});
		return this.updateSchedule(schedule);
	}
	
	getSchedules() {
		return io.github.shunshun94.scheduler.Scheduler.convertScheduleMapToArray(this.schedules);
	}
	
	getSchedule(schedule) {
		const id = schedule.id || schedule;
		return this.schedules[`${this.id}-date-scheduleColumn-schedule-${id}`];
		
	}
	
	updateSchedule(schedule) {
		return this.drawSchedule(schedule);
	}
	
	separateSchedule(schedule, clickedDay) {
		if(! window.confirm(`Do you want to separete "${schedule.label}"?`)) {
			return;
		}
		try {
			const newSchedules = this.separationIntervalAlgorithm(schedule, clickedDay);
			this.drawSchedules(newSchedules);
			this.deleteSchedule(schedule);
			this.$html.trigger({
				type: io.github.shunshun94.scheduler.Scheduler.EVENTS.SEPARATE_EVENT,
				schedules: newSchedules, deleted: schedule
			});
		} catch (err) {
			alert(err);
			console.warn(err);
		}
	}
	
	calcDummyAppendSchedule() {
		const minWidth = $(`.${this.id}-date-scheduleColumn`).width() / (24 * 60);
		const startPoint = 480 * minWidth;
		const endPoint =  (60 * 24 - (14 * 60 + 30)) * minWidth;
		return $('<div ' +
				`class="${this.id}-date-scheduleColumn-schedule-dummy ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-scheduleColumn-schedule-dummy" ` +
				`id="${this.id}-date-scheduleColumn-schedule-dummy" ` +
				`style="right:${endPoint}px;left:${startPoint}px;position:absolute;" >${io.github.shunshun94.scheduler.Scheduler.TEXTS.ADD}</div>`);
	}
	
	drawScheduleDay_(schedule, i, isHead, isLast) {
		const minWidth = $(`.${this.id}-date-scheduleColumn`).width() / (24 * 60);
		const startDate = new Date(schedule.prepare + (1000 * 60 * 60 * 24 * i));
		const endDate = new Date(schedule.tidyUp);
		const startPoint = isHead ? (startDate.getHours() * 60 + startDate.getMinutes()) * minWidth : 0;
		const endPoint = (isLast && startDate.getDate() === endDate.getDate()) ? (60 * 24 - (endDate.getHours() * 60 + endDate.getMinutes())) * minWidth : 0;
		const $base = $(`#${this.id}-date-${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()} > .${this.id}-date-scheduleColumn`);
		var $schedule = $('<div ' +
				`class="${this.id}-date-scheduleColumn-schedule ${this.id}-date-scheduleColumn-schedule-${schedule.id} ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-scheduleColumn-schedule" ` +
				`id="${this.id}-date-scheduleColumn-schedule-${schedule.id}-${i}" ` +
				`style="right:${endPoint}px;left:${startPoint}px;position:absolute;" >` + '</div>');
		$schedule.text(schedule.label);
		if(this.resizable) {
			var $separator = $(`<div class="${this.id}-date-scheduleColumn-schedule-separator ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-scheduleColumn-schedule-separator">SEPARATE</div>`);
			$schedule.append($separator);
		}

		if(isHead) {
			$schedule.addClass(`${this.id}-date-scheduleColumn-schedule-first`);
		}
		{
			const scheduleStart = new Date(schedule.start);
			const prepareStart = new Date(schedule.prepare);
			const isInStart = (		startDate.getFullYear() === scheduleStart.getFullYear() && 
									startDate.getMonth() === scheduleStart.getMonth() &&
									startDate.getDate() === scheduleStart.getDate());
			const isInPrepare = (	startDate.getFullYear() === prepareStart.getFullYear() && 
									startDate.getMonth() === prepareStart.getMonth() &&
									startDate.getDate() === prepareStart.getDate());
			if(isInStart && isInPrepare){
				$schedule.append('<div ' +
						`class="${this.id}-date-scheduleColumn-schedule-head ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-scheduleColumn-schedule-head" ` +
						`style="width:${schedule.length.head * minWidth}px;position:absolute;" ></div>`);
			} else if(isInStart) {
				$schedule.append('<div ' +
						`class="${this.id}-date-scheduleColumn-schedule-head ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-scheduleColumn-schedule-head" ` +
						`style="width:${(scheduleStart.getHours() * 60 + scheduleStart.getMinutes()) * minWidth}px;position:absolute;" ></div>`);
			} else if(isInPrepare) {
				$schedule.append('<div ' +
						`class="${this.id}-date-scheduleColumn-schedule-head ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-scheduleColumn-schedule-head" ` +
						`style="width:100%;position:absolute;" ></div>`);
			}
		}

		if(isLast) {
			$schedule.addClass(`${this.id}-date-scheduleColumn-schedule-last`);
		}
		{
			const scheduleEnd = new Date(schedule.end);
			const isInEnd = (		startDate.getFullYear() === scheduleEnd.getFullYear() && 
									startDate.getMonth() === scheduleEnd.getMonth() &&
									startDate.getDate() === scheduleEnd.getDate());
			const isInTidyUp = (	startDate.getFullYear() === endDate.getFullYear() && 
									startDate.getMonth() === endDate.getMonth() &&
									startDate.getDate() === endDate.getDate());
			if(isInEnd && isInTidyUp){
				$schedule.append('<div ' +
						`class="${this.id}-date-scheduleColumn-schedule-foot ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-scheduleColumn-schedule-foot" ` +
						`style="right:0px;width:${schedule.length.foot * minWidth}px;position:absolute;" ></div>`);
			} else if(isInEnd) {
				$schedule.append('<div ' +
						`class="${this.id}-date-scheduleColumn-schedule-foot ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-scheduleColumn-schedule-foot" ` +
						`style="right:0px;width:${(60 * 24 - (scheduleEnd.getHours() * 60 + scheduleEnd.getMinutes())) * minWidth}px;position:absolute;" ></div>`);
			} else if(isInTidyUp) {
				$schedule.append('<div ' +
						`class="${this.id}-date-scheduleColumn-schedule-foot ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-scheduleColumn-schedule-foot" ` +
						`style="right:0px;width:100%;position:absolute;" ></div>`);
			}
		}
		////////////////////////////////////
		const staticHeight = $base.height();
		if($base.length) {
			$base.append($schedule);
			if((isHead || isLast) && this.resizable) {
				var handles = [];
				if(isHead) {handles.push('w');handles.push('n');}
				if(isLast) {handles.push('e');handles.push('s');}
				$(`#${this.id}-date-scheduleColumn-schedule-${schedule.id}-${i}`).resizable({
					grid: [minWidth * 15, 0],
					ghost: true,
					helper: 'helper',
					handles: handles.join(','),
					minWidth: 0,
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
		if($(`.${this.id}-date-scheduleColumn-schedule-${schedule.id}`).length && this.resizable) {
			$($(`.${this.id}-date-scheduleColumn-schedule-${schedule.id}`)[0]).append(this.deleteButtonGenerator(schedule, this.id));
		}
		if(this.resizable) {
			this.generateEachSchedulePopupMenu(schedule);
		}
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
	
	deleteScheduleWithConfirm(schedule) {
		if(! window.confirm(`Do you want to delete "${schedule.label}"?`)) {
			return;
		}
		return this.deleteSchedule(schedule);
	}
	
	deleteSchedule(schedule) {
		if(this.schedules[`${this.id}-date-scheduleColumn-schedule-${schedule.id}`]) {
			delete this.schedules[`${this.id}-date-scheduleColumn-schedule-${schedule.id}`];
			$(`.${this.id}-date-scheduleColumn-schedule-${schedule.id}`).remove();
			this.$html.trigger({
				type: io.github.shunshun94.scheduler.Scheduler.EVENTS.DELETE_EVENT, deleted: schedule
			});
			return schedule.id;
		} else {
			return null;
		}
	}
	
	resized(e, movedSchedule) {
		const $dom = $(e.target);
		const staticHeight = $(`.${this.id}-date-scheduleColumn`).height();
		const id = $dom.attr('id').replace(/-\d+$/, '');
		const number = Number($dom.attr('id').replace(`${id}-`, ''));
		const minWidth = $(`.${this.id}-date-scheduleColumn`).width() / (24 * 60);
		$dom.css({
			top: '0px', height: staticHeight + 'px'
		});
		if(movedSchedule.originalSize.width === movedSchedule.size.width) {
			if($dom.hasClass(`${this.id}-date-scheduleColumn-schedule-first`)) {
				const tmpDay = new Date(this.schedules[id].prepare);
				if(movedSchedule.originalSize.height > movedSchedule.size.height) {
					this.schedules[id].prepare = Number(new Date(tmpDay.getFullYear(), tmpDay.getMonth(), tmpDay.getDate() + 1, tmpDay.getHours(), tmpDay.getMinutes()));
				} else {
					const days = Math.ceil((movedSchedule.size.height - movedSchedule.originalSize.height) / staticHeight); 
					this.schedules[id].prepare = Number(new Date(tmpDay.getFullYear(), tmpDay.getMonth(), tmpDay.getDate() - days, tmpDay.getHours(), tmpDay.getMinutes()));
				}
				this.schedules[id].start = this.schedules[id].prepare + this.schedules[id].length.head * 60 * 1000;
			}

			if($dom.hasClass(`${this.id}-date-scheduleColumn-schedule-last`)) {
				const tmpDay = new Date(this.schedules[id].tidyUp);
				if(movedSchedule.originalSize.height > movedSchedule.size.height) {
					this.schedules[id].tidyUp = Number(new Date(tmpDay.getFullYear(), tmpDay.getMonth(), tmpDay.getDate() - 1, tmpDay.getHours(), tmpDay.getMinutes()));
				} else {
					const days = Math.ceil((movedSchedule.size.height - movedSchedule.originalSize.height) / staticHeight); 
					this.schedules[id].tidyUp = Number(new Date(tmpDay.getFullYear(), tmpDay.getMonth(), tmpDay.getDate() + days, tmpDay.getHours(), tmpDay.getMinutes()));
				}
				this.schedules[id].end = this.schedules[id].tidyUp - this.schedules[id].length.foot * 60 * 1000;
			}
		} else {
			// 横幅
			if($dom.hasClass(`${this.id}-date-scheduleColumn-schedule-first`)) {
				const tmpDay = new Date(this.schedules[id].prepare);
				if($dom.width() <= io.github.shunshun94.scheduler.Scheduler.MIN_SCHEDULE_PIXEL_LENGTH) {
					this.schedules[id].prepare = Number(new Date(tmpDay.getFullYear(), tmpDay.getMonth(), tmpDay.getDate() + 1, 0, 0));
					this.schedules[id].start = this.schedules[id].prepare + this.schedules[id].length.head * 60 * 1000;
				} else {
					const prepareStart = ($dom.position().left / minWidth);
					this.schedules[id].prepare = Number(new Date(tmpDay.getFullYear(), tmpDay.getMonth(), tmpDay.getDate(), Math.floor(prepareStart / 60), prepareStart % 60));
					this.schedules[id].start = this.schedules[id].prepare + this.schedules[id].length.head * 60 * 1000;
				}
			}

			if($dom.hasClass(`${this.id}-date-scheduleColumn-schedule-last`)) {
				const tmpDayREExecResult = /(\d\d\d\d+)-(\d+)-(\d+)/.exec($dom.parent().attr('id'));
				const tmpDay = new Date(tmpDayREExecResult[1], tmpDayREExecResult[2], tmpDayREExecResult[3]);
				const finishTidyUp = ($dom.position().left + $(e.target).width()) / minWidth;
				this.schedules[id].tidyUp = Number(new Date(tmpDay.getFullYear(), tmpDay.getMonth(), tmpDay.getDate(), Math.floor(finishTidyUp / 60), finishTidyUp % 60));
				this.schedules[id].end = this.schedules[id].tidyUp - this.schedules[id].length.foot * 60 * 1000;
			}
		}

		this.schedules[id].length.total = (this.schedules[id].tidyUp -  this.schedules[id].prepare) / (1000 * 60)
		this.schedules[id].length.body = this.schedules[id].length.total - this.schedules[id].length.head - this.schedules[id].length.foot;

		if( this.schedules[id].length.body < 0) {
			this.deleteSchedule(this.schedules[id]);
		} else {
			this.drawSchedule(this.schedules[id]);
			this.$html.trigger({
				type: io.github.shunshun94.scheduler.Scheduler.EVENTS.RESIZE_EVENT,
				schedule: this.schedules[id]
			});	
		}
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
		var line = $(`<div class="${this.id}-date ${this.id}-date-${date.getDay()} ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-${date.getDay()}" ` +
				`id="${this.id}-date-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}"></div>`);
		var dateColumn = $(`<div class="${this.id}-date-dateColumn ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-dateColumn"` +
				`id="${this.id}-date-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-dateColumn"></div>`);
		dateColumn.text(this.formatDate(date));
		
		var schedule = $(`<div class="${this.id}-date-scheduleColumn ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-scheduleColumn"` +
				`id="${this.id}-date-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-scheduleColumn"></div>`);

		line.append(dateColumn);
		line.append(schedule);
		return line;
	}
	
	drawHeader() {
		var header = $(`<div class="${this.id}-date ${this.id}-date-header ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-header" id="${this.id}-date-header"></div>`);
		var dateColumn = $(`<div class="${this.id}-date-dateColumn ${this.id}-date-dateColumnHeader ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-dateColumn ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-dateColumnHeader"></div>`);
		dateColumn.text('Date');
		header.append(dateColumn);
		return header;
	}
	
	drawFooter() {
		var footer = $(`<div class="${this.id}-date-footer ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-footer" id="${this.id}-date-footer"></div>`);
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
		if(! this.resizable) {
			return;
		}
		for(var i = 0; i < length; i++) {
			this.generateAddSchedulePopupMenu(new Date(baseYear, baseMonth, baseDay + i));
		}
		
		this.dummyAppendSchedule = this.calcDummyAppendSchedule();
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
	
	generateEachSchedulePopupMenu(schedule, num = 0) {
		$(`.${this.id}-date-scheduleColumn-schedule-${schedule.id}`).mouseover((e) => {
			const $schedule = $(e.target);
			const $targetSeparator = $schedule.find(`.${this.id}-date-scheduleColumn-schedule-separator`);
			const $targetRemover = $(`.${this.id}-date-scheduleColumn-schedule-${schedule.id} > .${this.id}-date-scheduleColumn-schedule-remove`);
			if($targetSeparator.css('display') !== 'none') {
				return;
			}
			
			$targetSeparator.show();
			$targetRemover.show();
			$(`.${this.id}-date-scheduleColumn-schedule-${schedule.id}`).addClass(`${this.id}-date-scheduleColumn-schedule-hover`);
		});
		$(`.${this.id}-date-scheduleColumn-schedule-${schedule.id}`).mouseout((e) => {
			if(! 	($(e.relatedTarget).hasClass(`${this.id}-date-scheduleColumn-schedule-head`) ||
					 $(e.relatedTarget).hasClass(`${this.id}-date-scheduleColumn-schedule-tail`)||
					 $(e.relatedTarget).hasClass(`${this.id}-date-scheduleColumn-schedule-remove`) ||
					 $(e.relatedTarget).hasClass(`${this.id}-date-scheduleColumn-schedule-separator`)
			)) {
				this.resetPopUpVisual();
			}
		});
	}
	
	generateAddSchedulePopupMenu(date) {
		const baseYear = date.getFullYear();
		const baseMonth = date.getMonth();
		const baseDay = date.getDate();
		$(`#${this.id}-date-${baseYear}-${baseMonth}-${baseDay}-scheduleColumn`).mouseover((e) => {
			if(	$(`#${this.id}-date-${baseYear}-${baseMonth}-${baseDay}-scheduleColumn > .${this.id}-date-scheduleColumn-schedule-dummy`).length ||
				$(`#${this.id}-date-${baseYear}-${baseMonth}-${baseDay}-scheduleColumn > .${this.id}-date-scheduleColumn-schedule`).length) {
				return;
			}
			$(`.${this.id}-date-scheduleColumn-schedule-dummy`).remove();
			$(e.target).append(this.dummyAppendSchedule);
		});
		$(`#${this.id}-date-${baseYear}-${baseMonth}-${baseDay}-scheduleColumn`).mouseout((e) => {
			if(! $(e.relatedTarget).hasClass(`${this.id}-date-scheduleColumn-schedule-dummy`)) {
				$(`.${this.id}-date-scheduleColumn-schedule-dummy`).remove();
			}
		});
	}

	resetPopUpVisual() {
		$(`.${this.id}-date-scheduleColumn-schedule-dummy`).remove();
		$(`.${this.id}-date-scheduleColumn-schedule-separator`).hide();
		$(`.${this.id}-date-scheduleColumn-schedule-remove`).hide();
		$(`.${this.id}-date-scheduleColumn-schedule-hover`).removeClass(`${this.id}-date-scheduleColumn-schedule-hover`);
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
			
			if($target.hasClass(`${this.id}-date-scheduleColumn-schedule-remove`)) {
				this.deleteScheduleWithConfirm(this.schedules[$target.parent().attr('id').replace(/-\d+$/, '')]);
			}
			
			if($target.hasClass(`${this.id}-date-scheduleColumn-schedule-dummy`)) {
				this.addScheduleByDate($target.parent());
				$target.remove();
			}
			
			if($target.hasClass(`${this.id}-date-scheduleColumn-schedule-separator`)) {
				const $schedule = $target.parent();
				const scheduleDomId = $schedule.attr('id');
				const clickedDayArray = /(\d+)-(\d+)-(\d+)/.exec($schedule.parent().attr('id'));
				const clickedDay = new Date(clickedDayArray[1], clickedDayArray[2], clickedDayArray[3]);
				this.separateSchedule(
					this.schedules[scheduleDomId.replace(/-\d+$/, '')], clickedDay);
			}
		});
	}
};

io.github.shunshun94.scheduler.Scheduler.CLASS = 'io-github-shunshun94-scheduler-Scheduler';
io.github.shunshun94.scheduler.Scheduler.TEXTS = {
	ADD: 'スケジュールを追加する',
	REMOVE: '×'
};
io.github.shunshun94.scheduler.Scheduler.defaultDeleteButtonGenerator = (schedule, id) => {
	return `<button class="${id}-date-scheduleColumn-schedule-remove ${io.github.shunshun94.scheduler.Scheduler.CLASS}-date-scheduleColumn-schedule-remove">${io.github.shunshun94.scheduler.Scheduler.TEXTS.REMOVE}</button>`;
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

io.github.shunshun94.scheduler.Scheduler.SEPARATION_INTERVAL_ALGORITHM = (schedule, clickedDay) => {
	if(schedule.length.total < 60 * 24) {
		return io.github.shunshun94.scheduler.Scheduler.SEPARATION_INTERVAL_ALGORITHM_HALF(schedule);
	}
	
	const nextOfClickedDayNum = Number(new Date(clickedDay.getFullYear(), clickedDay.getMonth(), clickedDay.getDate() + 1));
	const clickedDayNum = Number(clickedDay);
	
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
	
	if(schedule.prepare > clickedDayNum) { // 初日
		const dayLength = (nextOfClickedDayNum - schedule.prepare) / (60 * 1000);
		// 開始2回、終了1回、1時間2回、前後空き時間30分が確保できないなら例外
		if(dayLength < schedule.length.head * 2 + schedule.length.foot + 150) {
			throw `Because ${schedule.label} dosen't have enough length, you can't separate this schedule.`
		}
		
		result[0].tidyUp = result[0].prepare + 60 * 1000 * ((dayLength / 2) - 15);
		result[1].prepare = result[0].tidyUp + 60 * 1000 * 30;
		
	} else if(schedule.tidyUp < nextOfClickedDayNum) { //最終日
		const dayLength = (schedule.tidyUp - clickedDayNum) / (60 * 1000);
		// 開始1回、終了2回、1時間2回、前後空き時間30分が確保できないなら例外
		if(dayLength < schedule.length.head + schedule.length.foot * 2 + 150) {
			throw `Because ${schedule.label} dosen't have enough length, you can't separate this schedule.`
		}
		
		result[0].tidyUp = clickedDayNum + 60 * 1000 * ((dayLength / 2) - 15);
		result[1].prepare = result[0].tidyUp + 60 * 1000 * 30;
	} else {
		result[0].tidyUp = clickedDayNum + 60 * 1000 * (11 * 60 + 45); // 11:45
		result[1].prepare = clickedDayNum + 60 * 1000 * (12 * 60 + 15); // 12:15
	}
	result[0].end = result[0].tidyUp - 60 * 1000 * schedule.length.foot;
	result[1].start = result[1].prepare + 60 * 1000 * schedule.length.head;
	result[0].length.body = (result[0].end - result[0].start) / (60 * 1000);
	result[1].length.body = (result[1].end - result[1].start) / (60 * 1000);
	result[0].length.total = (result[0].length.body + result[0].length.foot + result[0].length.head);
	result[1].length.total = (result[1].length.body + result[1].length.foot + result[1 ].length.head);

	return result;
};


io.github.shunshun94.scheduler.Scheduler.SEPARATION_INTERVAL_ALGORITHM_HALF = (schedule) => {
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

io.github.shunshun94.scheduler.Scheduler.MIN_SCHEDULE_PIXEL_LENGTH = 2.86;
io.github.shunshun94.scheduler.Scheduler.ONE_WEEK_DAYS = 7;
io.github.shunshun94.scheduler.Scheduler.DAYS = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
io.github.shunshun94.scheduler.Scheduler.EVENTS = {
	CLICK_EVENT: 'io-github-shunshun94-scheduler-Scheduler-EVENTS-CLICK_EVENT',
	RESIZE_EVENT: 'io-github-shunshun94-scheduler-Scheduler-EVENTS-RESIZE_EVENT',
	SEPARATE_EVENT: 'io-github-shunshun94-scheduler-Scheduler-EVENTS-SEPARATE_EVENT',
	DELETE_EVENT: 'io-github-shunshun94-scheduler-Scheduler-EVENTS-DELETE_EVENT',
	ADD_EVENT: 'io-github-shunshun94-scheduler-Scheduler-EVENTS-ADD_EVENT'
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
