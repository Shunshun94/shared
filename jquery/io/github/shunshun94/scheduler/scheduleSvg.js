var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.scheduler = io.github.shunshun94.scheduler || {};
io.github.shunshun94.scheduler.SchedulerSvg = io.github.shunshun94.scheduler.SchedulerSvg || {};

io.github.shunshun94.scheduler.SchedulerSvg.generateSvg = (schedules = false, options = {}) => {
    const initialSchedule = (options.initialSchedule || schedules || []).sort((a, b) => {
        return a.prepare - b.prepare;
    });
    const base = io.github.shunshun94.scheduler.SchedulerSvg.drawBase(initialSchedule, options);
    return base;
};

io.github.shunshun94.scheduler.SchedulerSvg.drawBase = (schedule, options = {}) => {
    const timezone = options.timezone ? (Number(options.timezone) || 0) : 0;
    const dateFormat = options.dateFormat || '%m/%d (%D)';
    const holidays = options.holidays || {};
    const dayLength = Number(options.initialLength) || 7;
    const startDate = options.startDate || (schedule[0] ? new Date(schedule[0].prepare) : new Date());
    const isStyleActive = options.isStyleActive || options.style || false;

    const height = options.height || 40;
    const leftWidth = options.leftWidth || 110;
    const rightWidth = options.rightWidth || 850;

    const svg = document.createElement('svg');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('height', height * dayLength);
    svg.setAttribute('width', leftWidth + rightWidth);
    if(isStyleActive){ svg.style = `height:${height * dayLength}px;width:${leftWidth + rightWidth}px;display:block;`; }

    for(var i = 0; i < dayLength; i++) {
        const day = new Date(Number(startDate) + (1000 * 60 * 60 * 24) * i);
        io.github.shunshun94.scheduler.SchedulerSvg.drawDayRect(day, {
            height: height,
            leftWidth:  leftWidth,
            rightWidth: rightWidth,
            dateFormat: dateFormat,
            isStyleActive: isStyleActive,
            idx: i
        }).forEach((element)=>{
            svg.append(element);
        });
    }
    return svg;
};

io.github.shunshun94.scheduler.SchedulerSvg.drawDayRect = (day, options) => {
    const leftRect = document.createElement('rect');
    leftRect.setAttribute('x',            '0');
    leftRect.setAttribute('y',            options.height * options.idx);
    leftRect.setAttribute('width',        options.leftWidth);
    leftRect.setAttribute('height',       options.height);
    leftRect.setAttribute('stroke',       'black');
    leftRect.setAttribute('fill',         'transparent');
    leftRect.setAttribute('stroke-width', 1);
    if(options.isStyleActive) { leftRect.style = `height:${options.height}px;width:${options.leftWidth}px;display:block;`; }
    return [leftRect];
};