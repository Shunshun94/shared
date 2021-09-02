// https://docs.ccfolia.com/developer-api/clipboard-api
var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ccfolia = io.github.shunshun94.trpg.ccfolia || {};
io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil = io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil || {};
io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil.v1_19 = io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil.v1_19 || {};

/**
 * 
 * @param {string|object} ココフォリアのClipboard APIに挿入するJSONまたはそのテキスト
 * @returns {object} ココフォリアのClipboard APIのCharacter
 */
io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil.v1_19.format = (tmp_data) => {
    if((typeof tmp_data) === 'string') {
        return JSON.parse(tmp_data).data
    } else {
        if(tmp_data.kind) {
            return tmp_data.data
        } else {
            return tmp_data;
        }
    }
};

io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil.v1_19._getParam = (data, text, depth) => {
    if(! Boolean(depth)) {
        throw "無限ループしている気がします";
    }
    for(const status of data.status) {
        if(status.label === text) {
            return status.value;
        }
    }
    for(const param of data.params) {
        if(param.label === text) {
            try {
                return io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil.v1_19.solveText(data, param.value, depth - 1);
            } catch(e) {
                throw `${text}を解決しようとして${param.value}を見つけました（残回数${depth-1}）\n${e}`;
            }
            
        }
    }
    const splitedText = {};
    data.commands.split('\n').filter((l)=>{return l.startsWith('//')}).forEach((l)=>{
        const splited = l.slice(2).split('=');
        if(splited.length > 1) {
            splitedText[splited[0]] = splited.slice(1).join('=');
        }
    });
    for(const internalParam in splitedText) {
        if(internalParam === text) {
            try {
                return io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil.v1_19.solveText(data, splitedText[internalParam], depth - 1);
            } catch(e) {
                throw `${text}を解決しようとして${splitedText[internalParam]}を見つけました（残回数${depth-1}）\n${e}`;
            }
        }
    }
    return text;
};

/**
 * ココフォリアのClipboard APIの値を用いて変数を解決します。例えばHPが12のキャラクターがいる場合に "{HP}+43" を解決すると "12+43" になります
 * @param {string|object} tmp_data ココフォリアのClipboard APIに挿入するJSONまたはそのテキスト
 * @param {string} text 変数を解決したい文字列
 * @param {number} depth 変数が入れ子になっている場合に何段階まで解決するのか。デフォルト値は10
 * @returns {object} 変数を解決済みの文字列
 * @throws depth の値よりも深い入れ子になっていた場合
 */
io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil.v1_19.solveText = (tmp_data, text, depth=10) => {
    const data = io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil.v1_19.format(tmp_data);
    const regexp = /{([^}]+)}/;
    while(regexp.test(text)) {
        const execResult = regexp.exec(text);
        const replacedValue = io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil.v1_19._getParam(data, execResult[1], depth);
        text = text.replace(execResult[0], replacedValue);
    }
    return text;
};

io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil.latest = io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil.v1_19;
