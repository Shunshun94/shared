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

/**
 * 
 * @param {string|object} ココフォリアのClipboard APIに挿入するJSONまたはそのテキスト
 * @param {string} ステータスを変更するためのコマンド。":HP-18" といったフォーマットになる（この場合は HP を18減少させる）
 * @returns {object} ステータス更新後のココフォリアのClipboard APIのCharacter
 * @throws なんらかの事由で更新できなかった場合
 */
io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil.v1_19.updateStatus = (tmp_data, tmp_command) => {
    let command = tmp_command;
    const data = io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil.v1_19.format(tmp_data);
    if(data.status.length === 0) { throw '操作すべきステータスの値がありません'; }
    let noUpdateFlag = true;
    const regexp = /^:([^+=-]+)([+-=])(\d+)/;
    const regExpResult = regexp.exec(command);
    if(! Boolean(regExpResult)) {
        throw `入力された式 ${command} が処理できませんでした。 :${data.status[0].label}+10 や :${data.status[0].label}-5 といったフォーマットで入力してください。`;
    }
    const target = data.status.map((d, i)=>{
        d.index = i;
        return d;
    }).filter((d)=>{
        return d.label === regExpResult[1];
    });
    if(target.length === 0) {
        throw `操作するステータス ${regExpResult[1]} が見つかりませんでした`;
    }
    const beforeValue = String(data.status[target[0].index].value);
    while(regexp.test(command)) {
        const execResult = regexp.exec(command);
        if(execResult[2] === '+') {
            data.status[target[0].index].value = Number(data.status[target[0].index].value) + Number(execResult[3]);
        }else if(execResult[2] === '-') {
            data.status[target[0].index].value = Number(data.status[target[0].index].value) - Number(execResult[3]);
        }else if(execResult[2] === '=') {
            data.status[target[0].index].value = Number(execResult[3]);
        }
        command = command.replace(`${execResult[2]}${execResult[3]}`, '');
    }
    data.updateStatusResult = `${data.status[target[0].index].label} : ${beforeValue} → ${data.status[target[0].index].value}`;
    return data;
};

io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil.latest = io.github.shunshun94.trpg.ccfolia.ClipboardApiUtil.v1_19;
