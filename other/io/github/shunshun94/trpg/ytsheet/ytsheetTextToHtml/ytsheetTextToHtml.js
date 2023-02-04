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
    }, {
        name: 'strike',
        regexp: /%%([^%]*)%%/,
        result: (exec, option)=>{ return `<span style="text-decoration: line-through;">${exec[1]}</span>` }
    }, {
        name: 'underline',
        regexp: /__([^_]*)__/,
        result: (exec, option)=>{ return `<span style="text-decoration: underline;">${exec[1]}</span>` }
    }, {
        name: 'transparent',
        regexp: /{{([^}]*)}}/,
        result: (exec, option)=>{ return `<span style="color:transparent;">${exec[1]}</span>` }
    }, {
        name: 'ruby',
        regexp: /[|｜]([^|｜]+)《([^》]+)》/,
        result: (exec, option)=>{ return `<ruby>${exec[1]}<rt>${exec[2]}</rt></ruby>` }
    }, {
        name: 'commmon_link',
        regexp: /\[([^>]+)>(https?:\/\/.+)\]/,
        result: (exec, option)=>{ return `<a href="${exec[2]}" target="_blank">${exec[1]}</a>` }
    }, {
        name: 'commmon_link_escaped',
        regexp: /\[(.+)&gt;(https?:\/\/.+)\]/,
        result: (exec, option)=>{ return `<a href="${exec[2]}" target="_blank">${exec[1]}</a>` }
    }, {
        name: 'sheet_link',
        regexp: /\[(.+)#([a-zA-Z0-9\-]+)\]/,
        result: (exec, option)=>{ return `<a href="?id=${exec[2]}" target="_blank">${exec[1]}</a>` }
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