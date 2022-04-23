var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.Time = io.github.shunshun94.util.Time || {};

io.github.shunshun94.util.Time.getDayHead = (tmpDate) => {
	const date = (typeof tmpDate === 'number') ? new Date(tmpDate) : tmpDate;
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
			_cursor = _cursor + io.github.shunshun94.util.Time.CONSTS.DAY;
		}
		return 0;
	};
	let cursor = _getFirstWeekend();
	if(cursor === 0) { return []; }
	let list = [];
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

io.github.shunshun94.util.Time.getConflictedTerm = (base, term) => {
	// REF https://qiita.com/yaju/items/a58a78f41ee41258a5fe
	if( base.head >= term.head ) {
		if ( term.tail >= base.head) {
			if ( term.tail <= base.tail ) {
				return { // 1
					head: base.head,
					tail: term.tail,
					headDate: new Date(base.head),
					tailDate: new Date(term.tail),
					length: term.tail - base.head
				};
			}
			if (term.tail > base.tail) {
				return { // 4
					head: base.head,
					tail: base.tail,
					headDate: new Date(base.head),
					tailDate: new Date(base.tail),
					length: base.tail - base.head
				};
			}
		}
	} else {
		if ( base.tail >= term.head ) {
			if ( base.tail <= term.tail ) {
				return {
					head: term.head,
					tail: base.tail,
					headDate: new Date(term.head),
					tailDate: new Date(base.tail),
					length: base.tail - term.head
				};
			} else {
				return {
					head: term.head,
					tail: term.tail,
					headDate: new Date(term.head),
					tailDate: new Date(term.tail),
					length: term.tail - term.head
				};
			}
		}
	}
	// 5, 6
	return {
		length: 0,
		head: null, tail: null,
		headDate: null, tailDate: null
	};
};

io.github.shunshun94.util.Time.getConflictedTerms = (listA, listB) => {
	let resultCand = [];
	listA.forEach((termA)=>{
		listB.forEach((termB)=>{
			resultCand.push(io.github.shunshun94.util.Time.getConflictedTerm(termA, termB));
		});
	});
	let calcMap = {};
	return resultCand.filter((d)=>{
		const key = `${d.head}-${d.tail}`;
		if(calcMap[key]) {
			return false;
		} else {
			calcMap[key] = true;
			return d.length;
		}
	});
};

io.github.shunshun94.util.Time.dateToDayString = (date) => {
	return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * 文字列を YYYY/MM/DD 形式に変換します
 * @param {String} str 
 */
io.github.shunshun94.util.Time.convertStringToDay = (str, beforePriority=false) => {
	if(str.includes('-') || str.includes('/') || str.includes('.')) {
		const tmp = new Date((new Date(str)).toISOString());
		return io.github.shunshun94.util.Time.dateToDayString(tmp);
	}
	if(/\d\d\d\d\d\d\d\d/.test(str)) {
		return `${str.substring(0,4)}/${str.substring(4,6)}/${str.substring(6,8)}`;
	}
	if(/\d\d\d\d\d\d\d/.test(str)) {
		const d = {
			year:  str.substring(0,4),

			month1:str.substring(4,5),
			day2:  str.substring(5,7),

			month2:str.substring(4,6),
			day1:  str.substring(6,7)
		};
		if( d.month1 === '0' ) { // 5文字目が0 = YYYYMMD 形式
			return `${d.year}/${d.month2}/0${d.day1}`;
		}
		if( Number(d.month1) > 1 ) { // 5文字目が0,1以外 = YYYYMDD 形式
			return `${d.year}/0${d.month1}/${d.day2}`;
		}
		if( d.month2.endsWith('0') || d.month2.endsWith('1') || d.month2.endsWith('2') ) {
			// 2022123 は 2022/1/23 なのか 2022/12/3 なのかはわからない
			// beforePriority で決める。
			// beforePriority が true  なら YYYYMDD
			// beforePriority が false なら YYYYMMD
			if(beforePriority) {
				return `${d.year}/0${d.month1}/${d.day2}`;
			} else {
				return `${d.year}/${d.month2}/0${d.day1}`;
			}
		}
		return `${d.year}/0${d.month1}/${d.day2}`;
	}
	if(/\d\d\d\d\d\d/.test(str)) {
		const d = {
			yymmdd: {
				year:  str.substring(0,2),
				month: str.substring(2,4),
				day:   str.substring(4,6)
			},
			yyyymd: {
				year:  str.substring(0,4),
				month: str.substring(4,5),
				day:   str.substring(5,6)
			}
		};
		if( Number(d.yymmdd.month) < 13 ) { // YYMMDD と判断
			return `${String((new Date()).getFullYear()).substring(0,2)}${d.yymmdd.year}/${d.yymmdd.month}/${d.yymmdd.day}`;
		} else {
			return `${d.yyyymd.year}/0${d.yyyymd.month}/0${d.yyyymd.day}`;
		}
	}
	throw `"${str}" は対応していない形式です`;
};

io.github.shunshun94.util.Time.CONSTS = io.github.shunshun94.util.Time.CONSTS || {};
io.github.shunshun94.util.Time.CONSTS.MIN = 1000 * 60;
io.github.shunshun94.util.Time.CONSTS.HOUR = io.github.shunshun94.util.Time.CONSTS.MIN * 60;
io.github.shunshun94.util.Time.CONSTS.DAY = io.github.shunshun94.util.Time.CONSTS.HOUR * 24;
io.github.shunshun94.util.Time.CONSTS.WEEK = io.github.shunshun94.util.Time.CONSTS.DAY * 7;
