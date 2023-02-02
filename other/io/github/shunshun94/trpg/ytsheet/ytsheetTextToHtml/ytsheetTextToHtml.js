var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ytsheet = io.github.shunshun94.trpg.ytsheet || {};
io.github.shunshun94.trpg.ytsheet.TextToHtml = io.github.shunshun94.trpg.ytsheet.TextToHtml || {};

io.github.shunshun94.trpg.ytsheet.TextToHtml.lineReplacers = [
    {
        name: 'italic',
        regexp: /'''([^']*)'''/,
        result: (exec, option)=>{ return `<span style="font-style:italic;">${exec[1]}</span>` }
    }, {
        name: 'bold',
        regexp: /''([^']*)''/,
        result: (exec, option)=>{ return `<span style="font-weight: bold;">${exec[1]}</span>` }
    }
];

io.github.shunshun94.trpg.ytsheet.TextToHtml.replaceLines = (input, options) => {
    return input.split('\n').map((line)=>{
        return io.github.shunshun94.trpg.ytsheet.TextToHtml.lineReplacers.reduce((currentValue, replacer)=>{
            let text = currentValue;
            while(replacer.regexp.test(text)) {
                const execResult = replacer.regexp.exec(text);
                text = text.replace(execResult[0], replacer.result(execResult, options));
            }
            return text;
        }, line);
    }).join('\n');
};

io.github.shunshun94.trpg.ytsheet.TextToHtml.convert = (input, options = {}) => {
    return io.github.shunshun94.trpg.ytsheet.TextToHtml.replaceLines(input, options).replaceAll('\n', '<br>\n');
};