var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ytsheet = io.github.shunshun94.trpg.ytsheet || {};
io.github.shunshun94.trpg.ytsheet.TextToHtml = io.github.shunshun94.trpg.ytsheet.TextToHtml || {};

io.github.shunshun94.trpg.ytsheet.TextToHtml.CONSTS = {
    COMMMENT_OUT: 'io.github.shunshun94.trpg.ytsheet.TextToHtml.CONSTS.COMMENT_OUT'
};

io.github.shunshun94.trpg.ytsheet.TextToHtml.lineReplacers = [
    {
        name: 'comment_out',
        regexp: /^\/\/.*/,
        result: (exec, option)=>{ return ''; }
    }, {
        name: 'common_line',
        regexp: /^-{4,}\s*$/,
        result: (exec, option)=>{ return `<hr/>` }
    }, {
        name: 'dotted line',
        regexp: /^( \*){4,}\s*$/,
        result: (exec, option)=>{ return `<hr style="border-style:dotted;"/>` }
    }, {
        name: 'dashed line',
        regexp: /^( \-){4,}\s*$/,
        result: (exec, option)=>{ return `<hr style="border-style:dashed;"/>` }
    }, {
        name: 'align-left',
        regexp: /^LEFT:(.*)$/,
        result: (exec, option)=>{ return `<span style="display:block;text-align:left;">${exec[1]}</span>` }
    }, {
        name: 'align-center',
        regexp: /^CENTER:(.*)$/,
        result: (exec, option)=>{ return `<span style="display:block;text-align:center;">${exec[1]}</span>` }
    }, {
        name: 'align-right',
        regexp: /^RIGHT:(.*)$/,
        result: (exec, option)=>{ return `<span style="display:block;text-align:right;">${exec[1]}</span>` }
    }, {
        name: 'header-lv3',
        regexp: /^\*\*\*(.+)$/,
        result: (exec, option)=>{ return `<h4>${exec[1].trim()}</h4>`; }
    }, {
        name: 'header-lv2',
        regexp: /^\*\*(.+)$/,
        result: (exec, option)=>{ return `<h3>${exec[1].trim()}</h3>`; }
    }, {
        name: 'header-lv1',
        regexp: /^\*(.+)$/,
        result: (exec, option)=>{ return `<h2>${exec[1].trim()}</h2>`; }
    }
];

io.github.shunshun94.trpg.ytsheet.TextToHtml.lineDecorateReplacers = [
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
        name: 'dot',
        regexp: /《《([^}]*)》》/,
        result: (exec, option)=>{ return `<span style="text-emphasis: dot filled;">${exec[1]}</span>` }
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
        regexp: /\[\[([^>]+)>(https?:\/\/.+)\]\]/,
        result: (exec, option)=>{ return `<a href="${exec[2]}" target="_blank">${exec[1]}</a>` }
    }, {
        name: 'commmon_link_escaped',
        regexp: /\[\[(.+)&gt;(https?:\/\/.+)\]\]/,
        result: (exec, option)=>{ return `<a href="${exec[2]}" target="_blank">${exec[1]}</a>` }
    }, {
        name: 'sheet_link',
        regexp: /\[(.+)#([a-zA-Z0-9\-]+)\]/,
        result: (exec, option)=>{ return `<a href="?id=${exec[2]}" target="_blank">${exec[1]}</a>` }
    }
];

io.github.shunshun94.trpg.ytsheet.TextToHtml.replaceLines = (input, options) => {
    return input.split('\n').map((line)=>{
        for(var i in io.github.shunshun94.trpg.ytsheet.TextToHtml.lineReplacers) {
            const replacer = io.github.shunshun94.trpg.ytsheet.TextToHtml.lineReplacers[i];
            const regexpResult = replacer.regexp.exec(line)
            if(regexpResult) {
                return replacer.result(regexpResult, options);
            }
        }
        return `${line}\n`;
    }).join('');
};

io.github.shunshun94.trpg.ytsheet.TextToHtml.decorateLines = (input, options) => {
    return input.split('\n').map((line)=>{
        return io.github.shunshun94.trpg.ytsheet.TextToHtml.lineDecorateReplacers.reduce((currentValue, replacer)=>{
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
    return io.github.shunshun94.trpg.ytsheet.TextToHtml.decorateLines(
        io.github.shunshun94.trpg.ytsheet.TextToHtml.replaceLines(input, options),
        options).trim().replaceAll('\n', '<br>\n');
};