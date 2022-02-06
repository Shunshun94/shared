var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.CommandTree = io.github.shunshun94.util.CommandTree || {};

io.github.shunshun94.util.CommandTree._parseLinesRecursive = (lines) => {
    const linesMap = {};
    lines.forEach((d) => {
        const target = d[0];
        if(! linesMap[target]) {
            linesMap[target] = [];
        }
        const newLine = d.slice(1);
        if(newLine.length) {
            linesMap[target].push(newLine);
        }
    });
    const result = {};
    for(const key in linesMap) {
        const targetLines = linesMap[key];
        if(targetLines.length) {
            result[key] = io.github.shunshun94.util.CommandTree._parseLinesRecursive(targetLines);
        } else {
            result[key] = {};
        }
    }
    return result;
};

io.github.shunshun94.util.CommandTree.generate = (input, exportType=io.github.shunshun94.util.CommandTree.CONSTS.OUTPUT_TYPES.JSON) => {
    const commands = input.split('\n').filter((l)=>{return l;}).map((l)=>{return l.trim().split(' ')});
    const parseResult = io.github.shunshun94.util.CommandTree._parseLinesRecursive(commands);
    return exportType(parseResult);
};

io.github.shunshun94.util.CommandTree.outputAsJson = (input) => {
    return input;
};

io.github.shunshun94.util.CommandTree.calcDepthRecursive = (object) => {
    const resultList = [];
    for(const key in object) {
        resultList.push(io.github.shunshun94.util.CommandTree.calcDepthRecursive(object[key]));
    }
    if(resultList.length) {
        return Math.max.apply(null, resultList) + 1;
    } else {
        return 0;
    }
};

io.github.shunshun94.util.CommandTree.generateHtmlRecursive = (object, maxDepth, currentDepth=0, lastEmtpyColumnClassName = io.github.shunshun94.util.CommandTree.CONSTS.CLASS_NAME.EMPTY) => {
    let result = [];
    for(const key in object) {
        const emptyColumnClassName = `${lastEmtpyColumnClassName}-${key}`;
        const title = `<td colspan="${maxDepth - currentDepth}">${key}</td>`;
        const children = io.github.shunshun94.util.CommandTree.generateHtmlRecursive(object[key], maxDepth, currentDepth + 1, emptyColumnClassName);
        if(currentDepth) {
            result.push([
                '<tr>',
                `\t<td class="${emptyColumnClassName}" rowspan="${children.length + 1}"></td>`,
                '\t' + title,
                '\t<td><!-- 説明文 --></td>',
                '</tr>'].join('\n'));
        } else {
            result.push([
                '<tr>',
                '\t' + title,
                '\t<td><!-- 説明文 --></td>',
                '</tr>'].join('\n'));
        }
        result = result.concat(children);
    }
    if(currentDepth) {
        return result;
    } else {
        return '<table border="1">\n' + result.join('\n') + '\n</table>';
    }
};

io.github.shunshun94.util.CommandTree.outputAsHtml = (object) => {
    const depth = io.github.shunshun94.util.CommandTree.calcDepthRecursive(object);
    return io.github.shunshun94.util.CommandTree.generateHtmlRecursive(object, depth);
};

io.github.shunshun94.util.CommandTree.CONSTS = {
    CLASS_NAME: {
        EMPTY : 'io-github-shunshun94-util-CommandTree-emptyColumn'
    },
    OUTPUT_TYPES: {
        JSON: io.github.shunshun94.util.CommandTree.outputAsJson,
        HTML: io.github.shunshun94.util.CommandTree.outputAsHtml
    }
};