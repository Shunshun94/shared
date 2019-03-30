var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.Time = io.github.shunshun94.util.Time || {};

io.github.shunshun94.util.Time.getDayHead = (tmpDate) => {
	const date = (typeof tmpDate === 'number') ? new Date(tmpDate) : tmpDate;
	console.log(date)
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

io.github.shunshun94.util.Time.getMonthDays = (param1, param2) => {
	if(param2) {
		const base = Number(new Date(`${param1}-${param2}`));
		const next = Number(new Date(`${param1}-${Number(param2) + 1}`));
		return Math.ceil((next - base) / io.github.shunshun94.util.Time.CONSTS.DAY);
	}
	if ((typeof param1) === 'string') {
		const base = new Date(param1);
		const next = new Date(base.getFullYear(), base.getMonth() + 1);
		return Math.ceil((Number(next) - Number(base)) / io.github.shunshun94.util.Time.CONSTS.DAY);
	} else if ((typeof param1) === 'number') {
		const now = new Date();
		const base = Number(new Date(now.getFullYear(), param1 - 1));
		const next = Number(new Date(now.getFullYear(), param1));
		return (next - base) / io.github.shunshun94.util.Time.CONSTS.DAY;
	} else {
		const base = Number(new Date(param1.getFullYear(), param1.getMonth()));
		const next = Number(new Date(param1.getFullYear(), param1.getMonth() + 1));
		return Math.ceil((next - base) / io.github.shunshun94.util.Time.CONSTS.DAY);
	}
};

io.github.shunshun94.util.Time.getWeekendsInTerm = (tmpStart, tmpEnd) => {
	const start = (typeof tmpStart === 'number') ? tmpStart : Number(tmpStart);
	const end = (typeof tmpEnd === 'number') ? tmpEnd : Number(tmpEnd);
	const _getFirstWeekend = () => {
		let _cursor = start;
		while( _cursor < end ) {
			const currentDate = new Date(_cursor);
			if( currentDate.getDay() === 0 ) {
				return Number(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1));
			}
			if( currentDate.getDay() === 6 ) {
				return Number(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
			}
			console.log(currentDate);
			_cursor = _cursor + io.github.shunshun94.util.Time.CONSTS.DAY;
		}
		return 0;
	};
	let cursor = _getFirstWeekend();
	if(cursor === 0) { return []; }
	let list = []
	while(cursor < end) {
		list.push({
			head: cursor,
			tail: cursor + (io.github.shunshun94.util.Time.CONSTS.DAY * 2)
		});
		cursor += io.github.shunshun94.util.Time.CONSTS.WEEK;
	}
	return list.map((weekend)=>{
		return {
			head: Math.max(weekend.head, start),
			tail: Math.min(weekend.tail, end)
		};
	}).map((weekend)=>{
		weekend.headDate = new Date(weekend.head);
		weekend.tailDate = new Date(weekend.tail);
		return weekend;
	});
};

io.github.shunshun94.util.Time.getDaytimeTermInTerm = (tmpStart, tmpEnd, tmpDayHead='09:00', tmpDayTail='18:00', exceptionalDay = []) => {
	if( ! /\d\d:\d\d/.test(tmpDayHead) || ! /\d\d:\d\d/.test(tmpDayTail) ) {
		throw '3rd and 4th argument must be \d\d:\d\d (for example, 09:00)';
	}
	const start = (typeof tmpStart === 'number') ? tmpStart : Number(tmpStart);
	const end = (typeof tmpEnd === 'number') ? tmpEnd : Number(tmpEnd);
	const dayHead = tmpDayHead.split(':');
	const dayTail = tmpDayTail.split(':');
	let cursor = Number(io.github.shunshun94.util.Time.getDayHead(start));
	let list = [];
	while( cursor < end ) {
		const target = new Date(cursor);
		if(! exceptionalDay.includes(target.getDay())) {
			list.push({
				head: Number(new Date(target.getFullYear(), target.getMonth(), target.getDate(), dayHead[0], dayHead[1])),
				tail: Number(new Date(target.getFullYear(), target.getMonth(), target.getDate(), dayTail[0], dayTail[1]))
			});
		}
		cursor += io.github.shunshun94.util.Time.CONSTS.DAY;
	}
	return list.map((weekend)=>{
		return {
			head: Math.max(weekend.head, start),
			tail: Math.min(weekend.tail, end)
		};
	}).map((weekend)=>{
		weekend.headDate = new Date(weekend.head);
		weekend.tailDate = new Date(weekend.tail);
		return weekend;
	});
};




io.github.shunshun94.util.Time.CONSTS = io.github.shunshun94.util.Time.CONSTS || {};
io.github.shunshun94.util.Time.CONSTS.MIN = 1000 * 60;
io.github.shunshun94.util.Time.CONSTS.HOUR = io.github.shunshun94.util.Time.CONSTS.MIN * 60;
io.github.shunshun94.util.Time.CONSTS.DAY = io.github.shunshun94.util.Time.CONSTS.HOUR * 24;
io.github.shunshun94.util.Time.CONSTS.WEEK = io.github.shunshun94.util.Time.CONSTS.DAY * 7;
