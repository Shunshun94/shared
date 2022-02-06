var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.CommandTree = io.github.shunshun94.util.CommandTree || {};

io.github.shunshun94.util.CommandTree.CONSTS = {
    OUTPUT_TYPES: {
        JSON: io.github.shunshun94.util.CommandTree.outputAsJson
    }
};

io.github.shunshun94.util.CommandTree.generate._parseLinesRecursive = (lines, currentResult={}) => {
    const linesMap = {};
    lines.forEach((d) => {
        const target = d[0];
        if(target.startsWith('$')) {

        } else {
            if(linesMap[target]) {
                linesMap[target] = [];
            }
            linesMap[target].push(d.slice(1))
        }
    });
};

io.github.shunshun94.util.CommandTree.generate = (input, exportType=io.github.shunshun94.util.CommandTree.CONSTS.OUTPUT_TYPES.JSON) => {
    const commands = inputs.split('\n').map((l)=>{return l.trim().split(' ')});
    const parseResult = io.github.shunshun94.util.CommandTree.generate._parseLinesRecursive(commands);
    return exportType(parseResult);
};

io.github.shunshun94.util.CommandTree.outputAsJson = (input) => {
    return input;
};