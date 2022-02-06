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

io.github.shunshun94.util.CommandTree.CONSTS = {
    OUTPUT_TYPES: {
        JSON: io.github.shunshun94.util.CommandTree.outputAsJson
    }
};