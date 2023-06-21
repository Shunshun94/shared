var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.DateTimePicker = io.github.shunshun94.util.DateTimePicker || {};

io.github.shunshun94.util.DateTimePicker.DATE_REGEXP = /([\^\-―～]?)([01]?[0-9])\s*[\/／月\-・]\s*([0-3]?[0-9])\s*日?([\^\-―～]?)[日月火水木金土\s\　]*/;
io.github.shunshun94.util.DateTimePicker.TIME_REGEXP = /([012]?[0-9])\s*[\:：時]\s*([0-5][0-9])?\s*[分～~]*/

io.github.shunshun94.util.DateTimePicker.pickDate = (dateRegexpResult) => {
    const untilSign = dateRegexpResult[1] ? '～' : '';
    return `${untilSign}${dateRegexpResult[2].padStart(2, 0)}/${dateRegexpResult[3].padStart(2, 0)}`
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
    const dateRegexpResult = io.github.shunshun94.util.DateTimePicker.DATE_REGEXP.exec(text);
    const textRemovedDate = (dateRegexpResult ? text.replace(dateRegexpResult[0], '') : text).trim();

    const timeRegexpResult = io.github.shunshun94.util.DateTimePicker.TIME_REGEXP.exec(textRemovedDate);
    const textRemovedTime = (timeRegexpResult ? textRemovedDate.replace(timeRegexpResult[0], '') : textRemovedDate).trim();

    if(dateRegexpResult) {
        const date = io.github.shunshun94.util.DateTimePicker.pickDate(dateRegexpResult);
        const time = io.github.shunshun94.util.DateTimePicker.pickTime(timeRegexpResult);
        return {
            dateRegExp: dateRegexpResult,
            timeRegExp: timeRegexpResult,
            text: `${date}${time}`,
            datetimeRevmoed: textRemovedTime
        };
    }
    return {
        dateRegExp: dateRegexpResult,
        timeRegExp: timeRegexpResult,
        text: '',
        datetimeRevmoed: textRemovedTime
    };
};
