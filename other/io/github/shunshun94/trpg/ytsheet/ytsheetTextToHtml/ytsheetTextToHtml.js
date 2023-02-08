var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ytsheet = io.github.shunshun94.trpg.ytsheet || {};
io.github.shunshun94.trpg.ytsheet.TextToHtml = io.github.shunshun94.trpg.ytsheet.TextToHtml || {};

io.github.shunshun94.trpg.ytsheet.TextToHtml.CONSTS = {
    COMMMENT_OUT: 'io.github.shunshun94.trpg.ytsheet.TextToHtml.CONSTS.COMMENT_OUT'
};

io.github.shunshun94.trpg.ytsheet.TextToHtml.multiLinesReplacers = [
    {
        name: 'definition_list',
        regexp: /^:([^|]*)\|(.*)$/,
        result: (execs, option)=>{
            const result = [];
            execs.forEach((exec)=>{
                if(exec[1]) {
                    result.push({
                        dt: exec[1],
                        dd: []
                    });
                }
                if(result.length) {
                    result[result.length - 1].dd.push(exec[2]);
                }
            });
            return ['<dl>',
                result.map((d)=>{
                    return `<dt>${d.dt}</dt><dd>${d.dd.join('\n')}</dd>`;
                }),
                '</dl>'].flat();
        }
    }, {
        name: 'table',
        regexp: /^\|.*\|$/,
        result: (execs, option) => {
            const columns = execs.map((exec)=>{return exec[0].slice(1, -1).split('|');});
            const result = ['<table border="1">'];
            let row_num = 0;
            columns.forEach((line)=>{
                result.push('<tr>');
                let col_num = 0;
                let colspan = 1;
                line.forEach((column)=>{
                    let rowspan = 1;
                    console.log(`check from columns[${row_num + rowspan}][${col_num}]  (columnLength: ${columns.length})`);
                    while( columns[ row_num + rowspan ] && columns[ row_num + rowspan ][col_num] === '~' ) { rowspan++; console.log(`columns[${row_num + rowspan}][${col_num}] is '~' (columnLength: ${columns.length})`) }
                    col_num++;
                    if ( column === '>' || column === '&gt;' ) {
                        colspan++;
                        // colspan を増やすだけで何もしない
                    } else if( column === '~' ) {
                        // 何もしない
                    } else {
                        let elem = `td`;
                        let item = column;
                        if(/^~/.test(column)) {
                            elem = 'th';
                            item = column.substring(1);
                        }
                        result.push(`<${elem} ${colspan > 1 ? `colspan="${colspan}"` : ''} ${rowspan > 1 ? `rowspan="${rowspan}"` : ''}>${item}</${elem}>`);
                    }
                });
                result.push('</tr>');
                row_num++;
            });
            result.push('</table>');
            return [result.join('')];
        }
    }
];

io.github.shunshun94.trpg.ytsheet.TextToHtml.lineReplacers = [
    {
        name: 'comment_out',
        regexp: /^\/\/.*/,
        result: (exec, option)=>{ return ''; }
    }, {
        name: 'common_line',
        regexp: /^-{4,}$/,
        result: (exec, option)=>{ return `<hr/>` }
    }, {
        name: 'dotted line',
        regexp: /^( \*){4,}$/,
        result: (exec, option)=>{ return `<hr style="border-style:dotted;"/>` }
    }, {
        name: 'dashed line',
        regexp: /^( \-){4,}$/,
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
    }, {
        name: 'summary-header-lv3',
        regexp: /^\[>\]\*\*\*(.+)$/,
        result: (exec, option)=>{ return [
            '<details>', `<summary><h4 style="display:inline;">${exec[1].trim()}</h4></summary>`
        ]; }
    }, {
        name: 'summary-header-lv2',
        regexp: /^\[>\]\*\*(.+)$/,
        result: (exec, option)=>{ return [
            '<details>', `<summary><h3 style="display:inline;">${exec[1].trim()}</h3></summary>`
        ]; }
    }, {
        name: 'summary-header-lv1',
        regexp: /^\[>\]\*(.+)$/,
        result: (exec, option)=>{ return [
            '<details>', `<summary><h2 style="display:inline;">${exec[1].trim()}</h2></summary>`
        ]; }
    }, {
        name: 'summary',
        regexp: /^\[>\](.+)$/,
        result: (exec, option)=>{ return [
            '<details>', `<summary>${exec[1].trim()}</summary>`
        ]; }
    }, {
        name: 'summary-header-lv3-escaped',
        regexp: /^\[&gt;\]\*\*\*(.+)$/,
        result: (exec, option)=>{ return [
            '<details>', `<summary><h4 style="display:inline;">${exec[1].trim()}</h4></summary>`
        ]; }
    }, {
        name: 'summary-header-lv2-escaped',
        regexp: /^\[&gt;\]\*\*(.+)$/,
        result: (exec, option)=>{ return [
            '<details>', `<summary><h3 style="display:inline;">${exec[1].trim()}</h3></summary>`
        ]; }
    }, {
        name: 'summary-header-lv1-escaped',
        regexp: /^\[&gt;\]\*(.+)$/,
        result: (exec, option)=>{ return [
            '<details>', `<summary><h2 style="display:inline;">${exec[1].trim()}</h2></summary>`
        ]; }
    }, {
        name: 'summary-escaped',
        regexp: /^\[&gt;\](.+)$/,
        result: (exec, option)=>{ return [
            '<details>', `<summary>${exec[1].trim()}</summary>`
        ]; }
    }, {
        name: 'summary-closed',
        regexp: /^\[\-{3,}\](.*)$/,
        result: (exec, option)=>{ return `</details>`; }
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

io.github.shunshun94.trpg.ytsheet.TextToHtml.replaceMultiLinesRecursive = (input, options, replacers) => {
    if(replacers.length === 0) {return input;}
    const replacer = replacers[0];
    const result = [];
    let targets = [];
    for(var i = 0; i < input.length; i++) {
        const exec = replacer.regexp.exec(input[i]);
        if(exec) {
            targets.push(exec);
        } else {
            if( targets.length ) {
                result.push(replacer.result(targets, options));
                targets = [];
            }
            result.push(input[i]);
        }
    }
    if( targets.length ) {
        result.push(replacer.result(targets, options));
    }

    return io.github.shunshun94.trpg.ytsheet.TextToHtml.replaceMultiLinesRecursive(
        result.flat(), options,
        replacers.slice(1)
    );
};

io.github.shunshun94.trpg.ytsheet.TextToHtml.replaceMultiLines = (input, options) => {
    const lines = input.split('\n');
    const result = [];
    return io.github.shunshun94.trpg.ytsheet.TextToHtml.replaceMultiLinesRecursive(
        lines,
        options,
        io.github.shunshun94.trpg.ytsheet.TextToHtml.multiLinesReplacers).join('\n');
};

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
    }).flat().join('');
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
    return [
        io.github.shunshun94.trpg.ytsheet.TextToHtml.replaceMultiLines,
        io.github.shunshun94.trpg.ytsheet.TextToHtml.replaceLines,
        io.github.shunshun94.trpg.ytsheet.TextToHtml.decorateLines
    ].reduce((currentInput, func)=>{
        return func(currentInput, options);
    }, input).trim().replaceAll('\n', '<br>\n');
};