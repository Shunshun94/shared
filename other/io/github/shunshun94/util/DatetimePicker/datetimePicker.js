var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.DateTimePicker = io.github.shunshun94.util.DateTimePicker || {};

io.github.shunshun94.util.DateTimePicker.DATE_REGEXP = /([\^\-―～]?)([01]?[0-9])\s*[\/／月\-・]\s*([0-3]?[0-9])\s*日?([\^\-―～]?)[日月火水木金土\s\　]*/;
io.github.shunshun94.util.DateTimePicker.TIME_REGEXP = /([012]?[0-9])\s*[\:：時]\s*([0-5][0-9])?\s*[分～~]*/

io.github.shunshun94.util.DateTimePicker.pickDate = (dateRegexpResult) => {
    if(dateRegexpResult) {
        const untilSign = dateRegexpResult[1] ? '～' : '';
        const afterSign = dateRegexpResult[4] ? '～' : '';
        return `${untilSign}${dateRegexpResult[2].padStart(2, 0)}/${dateRegexpResult[3].padStart(2, 0)}${afterSign}`;
    } else {
        return '';
    }
};

io.github.shunshun94.util.DateTimePicker.pickTime = (timeRegexpResult) => {
    if(timeRegexpResult) {
        const hours   = timeRegexpResult[1];
        const minutes = timeRegexpResult[2];
        return ` ${hours.padStart(2, 0)}:${minutes ? (minutes.padStart(2, 0)) : '00'}`;
    } else {
        return '';
    }
};

io.github.shunshun94.util.DateTimePicker.pick = (input) => {
    const text = input.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    }).trim();

    const regexpAppliedText = [
        io.github.shunshun94.util.DateTimePicker.applyDateRegExp,
        io.github.shunshun94.util.DateTimePicker.applyTimeRegExp
    ].reduce((currentValue, func)=>{
        return func(currentValue);
    }, {text: text});

    const date = regexpAppliedText.date;
    const time = regexpAppliedText.time;

    if(date) {
        return {
            dateRegExp: regexpAppliedText.dateRegexpResult,
            timeRegExp: regexpAppliedText.timeRegexpResult,
            text: `${date}${time}`,
            datetimeRevmoed: regexpAppliedText.text
        };
    }
    return {
        dateRegExp: regexpAppliedText.dateRegexpResult,
        timeRegExp: regexpAppliedText.timeRegexpResult,
        text: '',
        datetimeRevmoed: regexpAppliedText.text
    };
};

io.github.shunshun94.util.DateTimePicker.applyTimeRegExp = (currentMap) => {
    const timeRegexpResult = io.github.shunshun94.util.DateTimePicker.TIME_REGEXP.exec(currentMap.text);
    const textRemovedTime = (timeRegexpResult ? currentMap.text.replace(timeRegexpResult[0], '') : currentMap.text).trim();
    currentMap.text = textRemovedTime;
    currentMap.timeRegexpResult = timeRegexpResult;
    currentMap.time = io.github.shunshun94.util.DateTimePicker.pickTime(timeRegexpResult);
    return currentMap;
};

io.github.shunshun94.util.DateTimePicker.applyDateRegExp = (currentMap) => {
    const dateRegexpResult = io.github.shunshun94.util.DateTimePicker.DATE_REGEXP.exec(currentMap.text);
    const textRemovedDate = (dateRegexpResult ? currentMap.text.replace(dateRegexpResult[0], '') : currentMap.text).trim();
    currentMap.text = textRemovedDate;
    currentMap.dateRegexpResult = dateRegexpResult;
    currentMap.date = io.github.shunshun94.util.DateTimePicker.pickDate(dateRegexpResult);
    return currentMap;
};
