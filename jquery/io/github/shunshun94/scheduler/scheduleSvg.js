var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.scheduler = io.github.shunshun94.scheduler || {};
io.github.shunshun94.scheduler.SchedulerSvg = io.github.shunshun94.scheduler.SchedulerSvg || {};

io.github.shunshun94.scheduler.SchedulerSvg.CONSTS = io.github.shunshun94.scheduler.SchedulerSvg.CONSTS || {};
io.github.shunshun94.scheduler.SchedulerSvg.CONSTS.DAYS = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];

io.github.shunshun94.scheduler.SchedulerSvg.generateSvg = (schedules = false, tmp_options = {}) => {
    const options = io.github.shunshun94.scheduler.SchedulerSvg.getOptions(schedules, tmp_options);
    const base = io.github.shunshun94.scheduler.SchedulerSvg.drawBase(options);
    return base;
};

io.github.shunshun94.scheduler.SchedulerSvg.getOptions = (schedules = false, options = {}) => {
    options.schedules = (options.initialSchedule || schedules || []).sort((a, b) => {
        return a.prepare - b.prepare;
    });
    options.timezone = options.timezone ? (Number(options.timezone) || 0) : 0;
    options.holidays = options.holidays || {};
    options.dayLength = Number(options.initialLength) || 7;
    options.startDate = options.startDate || (options.schedules[0] ? new Date(options.schedules[0].prepare) : new Date());

    options.height = options.height || 40;
    options.leftWidth = options.leftWidth || 110;
    options.rightWidth = options.rightWidth || 840;
    return options;
};

io.github.shunshun94.scheduler.SchedulerSvg.drawBase = (options = {}) => {
    const svg = io.github.shunshun94.scheduler.SchedulerSvg.drawSvgElement(options);
    for(var i = 0; i < options.dayLength; i++) {
        const day = new Date(Number(options.startDate) + (1000 * 60 * 60 * 24) * i);
        options.idx = i;
        io.github.shunshun94.scheduler.SchedulerSvg.drawDayRect(day, options).forEach((element)=>{svg.append(element);});
    }
    for(var i = 0; i < 7; i++) {
        options.idx = i;
        svg.append(io.github.shunshun94.scheduler.SchedulerSvg.timeSeparationLine(options));
    }
    return svg;
};

io.github.shunshun94.scheduler.SchedulerSvg.timeSeparationLine = (options) => {
    const line = document.createElement('line');
    const x = options.leftWidth + (options.rightWidth / 8) * (options.idx + 1);
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
    text.classname = `io-github-shunshun94-scheduler-SchedulerSvg-date-dateColumn-date`;
    text.textContent = `${day.getMonth() + 1}/${day.getDate()} (${io.github.shunshun94.scheduler.SchedulerSvg.CONSTS.DAYS[day.getDay()]})`;
    text.setAttribute('x', 2);
    text.setAttribute('y', options.height * (options.idx + 1) + options.height * 4 / 6);
    text.setAttribute('font-size', options.height / 3);
    return text;
};

io.github.shunshun94.scheduler.SchedulerSvg.drawRightRect = (options) => {
    const rect = document.createElement('rect');
    rect.classname = `io-github-shunshun94-scheduler-SchedulerSvg-date-scheduleColumn`;
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
    rect.classname = `io-github-shunshun94-scheduler-SchedulerSvg-date-dateColumn`;
    rect.setAttribute('x',            '0');
    rect.setAttribute('y',            options.height * (options.idx + 1));
    rect.setAttribute('width',        options.leftWidth);
    rect.setAttribute('height',       options.height);
    rect.setAttribute('stroke',       'black');
    rect.setAttribute('fill',         'transparent');
    rect.setAttribute('stroke-width', 1);
    return rect;
};