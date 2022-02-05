var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.table = io.github.shunshun94.util.table || {};

io.github.shunshun94.util.table.countTextLength = (str) => {
    // https://zukucode.com/2017/04/javascript-string-length.html
    let length = 0;
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
            length += 1;
        } else {
            length += 2;
        }
    }
    return length;
};

io.github.shunshun94.util.table.calcColumnsLength = (tableArray) => {
    const result = tableArray[0].map((d)=>{return 0});
    tableArray.forEach((tr)=>{
        tr.forEach((td, i)=>{
            result[i] = Math.max(result[i], io.github.shunshun94.util.table.countTextLength(td));
        });
    });
    return result.map((d)=>{
        if(d % 2 === 1) {
            return d + 1;
        } else {
            return d;
        }
    });
};

io.github.shunshun94.util.table.adjustTable = (tableArray, columnsLength) => {
    return tableArray.map((tr)=>{
        return tr.map((td, i)=>{
            const diff = columnsLength[i] - io.github.shunshun94.util.table.countTextLength(td);
            return ' '.repeat(diff) + td;
        });
    });
};

io.github.shunshun94.util.table.generateSeparator = (columnsLength, sept='┼') => {
    return columnsLength.map((d)=>{
        return '─'.repeat(d / 2);
    }).join(sept);
};

io.github.shunshun94.util.table.exportAsAATable = (tableArray, columnsLength) => {
    const separator = io.github.shunshun94.util.table.generateSeparator(columnsLength);
    return `┌${io.github.shunshun94.util.table.generateSeparator(columnsLength, '┬')}┐\n` + tableArray.map((tr)=>{
        return `│${tr.join('│')}│`;
    }).join(`\n├${separator}┤\n`) + `\n└${io.github.shunshun94.util.table.generateSeparator(columnsLength, '┴')}┘`;
};

io.github.shunshun94.util.table.generateTable = (tableArray, mode='AA') => {
    const move = {
        'AA': io.github.shunshun94.util.table.generateTableAsAA
    };
    return move[mode](tableArray);
};

io.github.shunshun94.util.table.generateTableAsAA = (tableArray) => {
    const columnsLength = io.github.shunshun94.util.table.calcColumnsLength(tableArray);
    const adjustedElements = io.github.shunshun94.util.table.adjustTable(tableArray, columnsLength);
    return io.github.shunshun94.util.table.exportAsAATable(adjustedElements, columnsLength);
};

io.github.shunshun94.util.table.calcTableSize = (aa) => {
    const lines = aa.split('\n');
    return {
        x: io.github.shunshun94.util.table.countTextLength(lines[0]) / 2,
        y: lines.length
    };
};

io.github.shunshun94.util.table.getTableColumns = (seed, mode='html') => {
    const move = {
        'html': io.github.shunshun94.util.table.getTableColumnsFromHtmlStr,
        'json': io.github.shunshun94.util.table.getTableColumnsFromObjectArray
    };
    return move[mode](seed);
};

io.github.shunshun94.util.table.getTableColumnsFromObjectArray = (objectArray) => {
    const columns = [];
    for(var key in objectArray[0]) {
        columns.push(key);
    }
    return objectArray.map((d)=>{
        return columns.map((key)=>{
            return String(d[key]);
        });
    });
};

io.github.shunshun94.util.table.getTableColumnsFromHtmlStr = (htmlStr) => {
    const dom = (new DOMParser()).parseFromString(htmlStr, 'text/html');
    return Array.from(dom.body.children[0].children[0].children).map((tr)=>{
        return Array.from(tr.children).map((td)=>{return td.innerText});
    });
};


