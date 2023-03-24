var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.scheduler = io.github.shunshun94.scheduler || {};
io.github.shunshun94.scheduler.SchedulerSvg = io.github.shunshun94.scheduler.SchedulerSvg || {};

io.github.shunshun94.scheduler.SchedulerSvg.CONSTS = io.github.shunshun94.scheduler.SchedulerSvg.CONSTS || {};
io.github.shunshun94.scheduler.SchedulerSvg.CONSTS.DAYS = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
io.github.shunshun94.scheduler.SchedulerSvg.CONSTS.DAYS.DEFAULT_COLOR = ['coral', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'mediumturquoise'];

io.github.shunshun94.scheduler.SchedulerSvg.generateSvg = (schedules = false, tmp_options = {}) => {
    const options = io.github.shunshun94.scheduler.SchedulerSvg.getOptions(schedules, tmp_options);
    const base = io.github.shunshun94.scheduler.SchedulerSvg.drawBase(options);
    options.schedules.forEach((schedule, scheduleIndex)=>{
        io.github.shunshun94.scheduler.SchedulerSvg.drawSchedule(schedule, options, scheduleIndex).forEach((scheduleSvg)=>{base.append(scheduleSvg);});
    });
    return base;
};

io.github.shunshun94.scheduler.SchedulerSvg.getOptions = (schedules = false, options = {}) => {
    options.timezone = options.timezone ? (Number(options.timezone) || 0) : ((new Date()).getTimezoneOffset() / 60) * -1;
    const timeDiff = options.timezone * (1000 * 60 * 60);
    options.schedules = (options.initialSchedule || schedules || []).sort((a, b) => {
        return a.prepare - b.prepare;
    }).map((s)=>{
        const result = {
            prepare: s.prepare + timeDiff,
            start: s.start + timeDiff,
            end: s.end + timeDiff,
            tidyUp: s.tidyUp + timeDiff,
            id: s.id,
            label: s.label || io.github.shunshun94.scheduler.SchedulerSvg.generateDefaultLabel(s),
            length: s.length
        };
        return result;
    });
    options.dateFormat = options.dateFormat || '%m/%d (%D)';
    options.holidays = options.holidays || {};
    options.startDate = io.github.shunshun94.scheduler.SchedulerSvg.modifyDateToHead(options.startDate || (options.schedules[0] ? new Date(options.schedules[0].prepare) : new Date()));
    options.dayLength = options.endDate ? io.github.shunshun94.scheduler.SchedulerSvg.calcDayCounts({
        tidyUp: options.endDate, prepare: options.startDate
    }) + 1 : Number(options.initialLength) || 7;
    options.endDate = options.endDate || new Date(Number(options.startDate) + (1000 * 60 * 60 * 24) * options.dayLength);

    options.height = options.height || 40;
    options.leftWidth = options.leftWidth || 110;
    options.rightWidth = options.rightWidth || 840;

    options.prepareColor = options.prepareColor || 'khaki';
    options.tidyUpColor = options.tidyUpColor || 'khaki';
    options.bodyColor = options.bodyColor || 'mediumseagreen';
    options.opacity = options.opacity || options.transparent || '0.75';

    options.dayColor = options.dayColor || {};
    io.github.shunshun94.scheduler.SchedulerSvg.CONSTS.DAYS.forEach((dayName, i)=>{
        options.dayColor[i] = options.dayColor[dayName] || options.dayColor[i] || io.github.shunshun94.scheduler.SchedulerSvg.CONSTS.DAYS.DEFAULT_COLOR[i];
    });

    options.timeSeparationCount = options.timeSeparationCount || 12;

    return options;
};

io.github.shunshun94.scheduler.SchedulerSvg.generateDefaultLabel = (schedule, OVER_THREE_MONTH_LABEL = 'NON STOP') => {
    const timeToString = (milliSec) => {
        const date = new Date(milliSec);
        return `${String(date.getHours()).padStart(2, 0)}:${String(date.getMinutes()).padStart(2, 0)}`;
    };
    const dateToString = (milliSec) => {
        const date = new Date(milliSec);
        return io.github.shunshun94.scheduler.SchedulerSvg.dateToString(date, '%m/%d');
    };
    if(        schedule.length.total < (60 * 28      )) {
        return `${timeToString(schedule.start)} ～ ${timeToString(schedule.end)}`;
    } else if( schedule.length.total < (60 * 24 * 8  )) {
        return `${dateToString(schedule.start)} ${timeToString(schedule.start)} ～ ${dateToString(schedule.end)} ${timeToString(schedule.end)}`;
    } else if( schedule.length.total < (60 * 24 * 100)) {
        return `${dateToString(schedule.start)} ～ ${dateToString(schedule.end)}`;
    } else {
        return OVER_THREE_MONTH_LABEL;
    }
};

io.github.shunshun94.scheduler.SchedulerSvg.modifyDateToHead = (date) => {
    date.setHours(0);
    date.setMinutes(0);
    return date;
};

io.github.shunshun94.scheduler.SchedulerSvg.dateToString = (date, format) => {
    const month = date.getMonth() + 1;

    return format
        .replace(/%y/g, date.getFullYear())
        .replace(/%m/g, month)
        .replace(/%d/g, date.getDate())
        .replace(/%D/g, io.github.shunshun94.scheduler.SchedulerSvg.CONSTS.DAYS[date.getDay()]);
};

io.github.shunshun94.scheduler.SchedulerSvg.calcDayCounts = (schedule) => {
    const endDay =   new Date(schedule.tidyUp);
    const startDay = io.github.shunshun94.scheduler.SchedulerSvg.modifyDateToHead(new Date(schedule.prepare));
    return Math.ceil((endDay - startDay) / (1000 * 60 * 60 * 24));
};

io.github.shunshun94.scheduler.SchedulerSvg.drawScheduleRect = (targetHead, targetTail, sentinelHead, sentinelTail, className, options) => {
    const oneDay = (1000 * 60 * 60 * 24);
    const head = (targetHead < sentinelHead) ? 1          : ((targetHead - 1) % oneDay);
    const tail = (targetTail > sentinelTail) ? oneDay - 1 : ((targetTail - 1) % oneDay);
    const rect = document.createElement('rect');
    rect.classname = `io-github-shunshun94-scheduler-SchedulerSvg-date-schedule-${className}`;
    rect.setAttribute('x',            options.leftWidth + options.rightWidth * (head / oneDay));
    rect.setAttribute('y',            options.height * (options.distanceFromTop + options.idx));
    rect.setAttribute('width',        options.rightWidth * (tail - head) / oneDay);
    rect.setAttribute('height',       options.height);
    rect.setAttribute('stroke',       'black');
    rect.setAttribute('fill',         options[`${className}Color`]);
    rect.setAttribute('fill-opacity', options.opacity);
    rect.setAttribute('stroke-width', 1);
    return rect;
};

io.github.shunshun94.scheduler.SchedulerSvg.drawScheduleText = (schedule, options) => {
    const oneDay = (1000 * 60 * 60 * 24);
    const targetHead   = schedule.start;
    const targetTail   = schedule.end;
    const sentinelHead = options.sentinelHead;
    const sentinelTail = options.sentinelTail;
    const head = (targetHead < sentinelHead) ? 1          : ((targetHead - 1) % oneDay);
    const tail = (targetTail > sentinelTail) ? oneDay - 1 : ((targetTail - 1) % oneDay);
    const elementLength = options.rightWidth * (tail - head) / oneDay;
    const fontSize = options.height / 3;
    if( elementLength * 1.7 < schedule.label.length * fontSize ) {
        return [];
    }
    const text = document.createElement('text');
    text.classname = 'io-github-shunshun94-scheduler-SchedulerSvg-date-schedule-text';
    text.textContent = schedule.label;
    text.setAttribute('text-anchor',  'middle');
    text.setAttribute('x',            options.leftWidth + options.rightWidth * ((head + tail) / (oneDay * 2)));
    text.setAttribute('y',            options.height * (options.distanceFromTop + options.idx) + options.height * 4 / 6);
    text.setAttribute('font-size',    fontSize);
    return text;
};

io.github.shunshun94.scheduler.SchedulerSvg.drawSchedulePrepare = (schedule, options) => {
    return io.github.shunshun94.scheduler.SchedulerSvg.drawScheduleRect(
        schedule.prepare,     schedule.start,
        options.sentinelHead, options.sentinelTail,
        'prepare',            options
    );
};

io.github.shunshun94.scheduler.SchedulerSvg.drawScheduleBody = (schedule, options) => {
    return io.github.shunshun94.scheduler.SchedulerSvg.drawScheduleRect(
        schedule.start,       schedule.end,
        options.sentinelHead, options.sentinelTail,
        'body',            options
    );
};

io.github.shunshun94.scheduler.SchedulerSvg.drawScheduleTidyUp = (schedule, options) => {
    return io.github.shunshun94.scheduler.SchedulerSvg.drawScheduleRect(
        schedule.end,         schedule.tidyUp,
        options.sentinelHead, options.sentinelTail,
        'tidyUp',             options
    );
};

io.github.shunshun94.scheduler.SchedulerSvg.shouldDraw = (targetHead, targetTail, sentinelHead, sentinelTail) => {
    return ((targetTail > sentinelHead) && (targetTail < sentinelTail)) || // ケツが中に入っている
           ((targetHead > sentinelHead) && (targetHead < sentinelTail)) || // アタマが中に入っている
           ((targetHead < sentinelHead) && (targetTail > sentinelTail));   // その日をすべて内包している
};

io.github.shunshun94.scheduler.SchedulerSvg.drawScheduleByDay = (schedule, options) => {
    const result = [];
    const oneDay = (1000 * 60 * 60 * 24);
    options.sentinelHead = Number(io.github.shunshun94.scheduler.SchedulerSvg.modifyDateToHead(new Date(schedule.prepare + oneDay * options.idx))) + options.timezone * (1000 * 60 * 60);
    options.sentinelTail = Number(options.sentinelHead) + oneDay;

    if(io.github.shunshun94.scheduler.SchedulerSvg.shouldDraw( schedule.prepare, schedule.start, options.sentinelHead, options.sentinelTail )) {
        // prepare の描画
        result.push(io.github.shunshun94.scheduler.SchedulerSvg.drawSchedulePrepare(schedule, options));
    }
    if(io.github.shunshun94.scheduler.SchedulerSvg.shouldDraw( schedule.start, schedule.end, options.sentinelHead, options.sentinelTail )){
        // スケジュール本体の描画
        result.push(io.github.shunshun94.scheduler.SchedulerSvg.drawScheduleBody(schedule, options));
        result.push(io.github.shunshun94.scheduler.SchedulerSvg.drawScheduleText(schedule, options));
    }
    if(io.github.shunshun94.scheduler.SchedulerSvg.shouldDraw( schedule.end, schedule.tidyUp, options.sentinelHead, options.sentinelTail )) {
        // tidyUp の描画
        result.push(io.github.shunshun94.scheduler.SchedulerSvg.drawScheduleTidyUp(schedule, options));
    }
    return result;
};

io.github.shunshun94.scheduler.SchedulerSvg.drawSchedule = (schedule, options) => {
    const result = [];
    options.distanceFromTop = io.github.shunshun94.scheduler.SchedulerSvg.calcDayCounts({
        prepare: Number(options.startDate), tidyUp:schedule.prepare
    });
    const length = io.github.shunshun94.scheduler.SchedulerSvg.calcDayCounts(schedule);
    for(var i = 0; i < length; i++) {
        const day = new Date(Number(schedule.prepare) + (1000 * 60 * 60 * 24) * i);
        if((day >= options.startDate) && (day <= options.endDate)) {
            options.idx = i;
            result.push(io.github.shunshun94.scheduler.SchedulerSvg.drawScheduleByDay(schedule, options));
        }
    }
    return result.flat();
};

io.github.shunshun94.scheduler.SchedulerSvg.drawBase = (options = {}) => {
    const svg = io.github.shunshun94.scheduler.SchedulerSvg.drawSvgElement(options);
    io.github.shunshun94.scheduler.SchedulerSvg.drawTimeScale(options).forEach((element)=>{svg.append(element);});
    for(var i = 0; i < options.dayLength; i++) {
        const day = new Date(Number(options.startDate) + (1000 * 60 * 60 * 24) * i);
        options.idx = i;
        options.day = day.getDay();
        io.github.shunshun94.scheduler.SchedulerSvg.drawDayRect(day, options).forEach((element)=>{svg.append(element);});
    }
    for(var j = 0; j < (options.timeSeparationCount - 1); j++) {
        options.idx = j;
        svg.append(io.github.shunshun94.scheduler.SchedulerSvg.timeSeparationLine(options));
    }
    return svg;
};

io.github.shunshun94.scheduler.SchedulerSvg.drawTimeString = (options) => {
    const text = document.createElement('text');
    text.classname = 'io-github-shunshun94-scheduler-SchedulerSvg-date-scheduleColumn';
    text.textContent = (options.idx + 1) * (24 / options.timeSeparationCount);
    text.setAttribute('text-anchor',  'middle');
    text.setAttribute('x',            options.leftWidth + (options.rightWidth / options.timeSeparationCount) * (options.idx + 1));
    text.setAttribute('y',            options.height * 5 / 6);
    text.setAttribute('font-size',    options.height / 3);
    return text;
};

io.github.shunshun94.scheduler.SchedulerSvg.drawTimeScale = (options) => {
    const result = [];
    for(var j = 0; j < (options.timeSeparationCount - 1); j++) {
        options.idx = j;
        result.push(io.github.shunshun94.scheduler.SchedulerSvg.drawTimeString(options));
    }
    return result;
};

io.github.shunshun94.scheduler.SchedulerSvg.timeSeparationLine = (options) => {
    const line = document.createElement('line');
    const x = options.leftWidth + (options.rightWidth / options.timeSeparationCount) * (options.idx + 1);
    line.setAttribute('x1',           x);
    line.setAttribute('y1',           options.height);
    line.setAttribute('x2',           x);
    line.setAttribute('y2',           options.height * (options.dayLength + 1));
    line.setAttribute('stroke',       'gray');
    line.setAttribute('stroke-width', 1);
    return line;
};

io.github.shunshun94.scheduler.SchedulerSvg.drawSvgElement = (options) => {
    const svg = document.createElement('svg');
    svg.setAttribute('height', options.height * (options.dayLength + 1));
    svg.setAttribute('width', options.leftWidth + options.rightWidth);
    svg.setAttribute('version', '1.1');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    return svg;
};

io.github.shunshun94.scheduler.SchedulerSvg.drawDayRect = (day, options) => {
    return [
        io.github.shunshun94.scheduler.SchedulerSvg.drawLeftRect(options),
        io.github.shunshun94.scheduler.SchedulerSvg.drawRightRect(options),
        io.github.shunshun94.scheduler.SchedulerSvg.drawDayInformation(day, options)
    ];
};

io.github.shunshun94.scheduler.SchedulerSvg.drawDayInformation = (day, options) => {
    const text = document.createElement('text');
    text.classname = 'io-github-shunshun94-scheduler-SchedulerSvg-date-dateColumn-date';
    text.textContent = io.github.shunshun94.scheduler.SchedulerSvg.dateToString(day, options.dateFormat);
    text.setAttribute('x', 2);
    text.setAttribute('y', options.height * (options.idx + 1) + options.height * 4 / 6);
    text.setAttribute('font-size', options.height / 3);
    return text;
};

io.github.shunshun94.scheduler.SchedulerSvg.drawRightRect = (options) => {
    const rect = document.createElement('rect');
    rect.classname = 'io-github-shunshun94-scheduler-SchedulerSvg-date-scheduleColumn';
    rect.setAttribute('x',            options.leftWidth);
    rect.setAttribute('y',            options.height * (options.idx + 1));
    rect.setAttribute('width',        options.rightWidth);
    rect.setAttribute('height',       options.height);
    rect.setAttribute('stroke',       'black');
    rect.setAttribute('fill',         'transparent');
    rect.setAttribute('stroke-width', 1);
    return rect;
};

io.github.shunshun94.scheduler.SchedulerSvg.drawLeftRect = (options) => {
    const rect = document.createElement('rect');
    rect.classname = 'io-github-shunshun94-scheduler-SchedulerSvg-date-dateColumn';
    rect.setAttribute('x',            '0');
    rect.setAttribute('y',            options.height * (options.idx + 1));
    rect.setAttribute('width',        options.leftWidth);
    rect.setAttribute('height',       options.height);
    rect.setAttribute('stroke',       'black');
    rect.setAttribute('fill',         options.dayColor[options.day]);
    rect.setAttribute('stroke-width', 1);
    return rect;
};

var module = module || {};
module.exports = io.github.shunshun94.scheduler.SchedulerSvg;
