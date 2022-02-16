var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.magicInputer = io.github.shunshun94.trpg.sw2.magicInputer || {};
io.github.shunshun94.trpg.sw2.magicInputer.CONSTS = io.github.shunshun94.trpg.sw2.magicInputer.CONSTS || {};
io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID = 'io-github-shunshun94-trpg-sw2-magicInputer';
io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.EVENT = `${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-append`;
io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.CATEGORIES = {
    SORCERER:    '真語魔法',
    CONJURER:    '操霊魔法',
    WIZARD:      '深智魔法',
    PRIEST:      '神聖魔法',
    MAGITECH:    '魔動機術',
    FAIRY_TAMER: '妖精魔法',
    DRUID:       '森羅魔法',
    DEMON_RULER: '召異魔法',
    GRIMOIRE:    '秘奥魔法'
};

io.github.shunshun94.trpg.sw2.magicInputer.generateMagicCategorySelect = ()=>{
    const list = [];
    const map = io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.CATEGORIES;
    for(const key in map) {
        list.push(`<option value="${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASSES[key]}">${map[key]}</option>`);
    }
    return `<select id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-category">${list.join('')}</select>`;
};

io.github.shunshun94.trpg.sw2.magicInputer.generate = () => {
    return `<table border="1" id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}">
        <tr>
            <th>魔法の種別</th><td>${io.github.shunshun94.trpg.sw2.magicInputer.generateMagicCategorySelect()}</td>
            <th>レベル・クラス</th><td><input
                id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-level"
                type="number" min="1" max="16" value="1" /></td>
        </tr>
        <tr>
            <th>名称</th><td colspan="3"><input type="text" id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-name" /></td>
        </tr>
        <tr>
            <th>消費</th><td><input type="text" id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-cost" /></td>
            <th>対象</th><td><input type="text"
                id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-target"
                list="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-target-list"
                /></td>
        </tr>
        <tr>
            <th>射程/形状</th><td><input type="text"
                id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-range"
                list="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-range-list"
                /></td>
            <th>時間</th><td><input type="text"
                id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-time"
                list="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-time-list"
                /></td>
        </tr>
        <tr>
            <th>抵抗</th><td><input type="text"
                id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-regist"
                list="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-regist-list"
                /></td>
            <th>属性</th><td><input type="text"
                id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-attribute"
                list="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-attribute-list"
                /></td>
        </tr>
        <tr>
            <th>マギスフィア</th><td><select
                id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-size">
                    <option value="">マギスフィアを使わない</option>
                    <option value="小">全てのサイズで使用可能</option>
                    <option value="中">中・大で使用可能</option>
                    <option value="大">大でのみ使用可能</option>
                </select>
                </td>
            <th>タイミング</th><td><select
                id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-timing">
                    <option value="">主動作のみ</option>
                    <option value="≫">補助動作可</option>
                    <option value="≫△">補助動作・戦闘準備可</option>
                    <option value="△">戦闘準備可</option>
                </select>
                </td>
        </tr>
        <tr>
            <th>概要</th><td colspan="3"><input type="text" id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-overview" /></td>
        </tr>
        <tr>
            <th>効果</th><td colspan="3"><textarea rows="4" id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-detail"></textarea></td>
        </tr>
        <tr>
            <th>詠唱</th><td colspan="3"><input type="text" id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-chant" /></td>
        </tr>
        <tr><td colspan="4"><button id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-append">追加</button></td></tr>
    </table>

    <datalist id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-target-list">
        <option value="1体" />
        <option value="1体全" />
        <option value="1体X" />
        <option value="1エリア(半径3m)/5" />
        <option value="1エリア(半径5m)/15" />
        <option value="1エリア(半径6m)/20" />
        <option value="術者" />
        <option value="物体1つ" />
        <option value="魔法1つ" />
        <option value="空間" />
        <option value="任意の地点" />
        <option value="接触点" />
        <option value="弾丸" />
    </datalist>
    <datalist id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-range-list">
        <option value="1(10m)/起点指定" />
        <option value="1(10m)/射撃" />
        <option value="2(30m)/起点指定" />
        <option value="2(30m)/射撃" />
        <option value="2(50m)/起点指定" />
        <option value="2(50m)/射撃" />
        <option value="2(30m)/貫通" />
        <option value="2(50m)/貫通" />
        <option value="接触/-" />
        <option value="術者/-" />
        <option value="1(移動力m)/突破" />
    </datalist>
    <datalist id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-regist-list">
        <option value="半減" />
        <option value="消滅" />
        <option value="短縮" />
        <option value="任意" />
        <option value="なし" />
        <option value="必中" />
    </datalist>
    <datalist id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-time-list">
        <option value="一瞬" />
        <option value="3分(18ラウンド)" />
        <option value="1分(6ラウンド)" />
        <option value="30秒(3ラウンド)" />
        <option value="10秒(1ラウンド)" />
        <option value="一瞬/3分(18ラウンド)" />
        <option value="一瞬/1分(6ラウンド)" />
        <option value="一瞬/30秒(3ラウンド)" />
        <option value="一瞬/10秒(1ラウンド)" />
        <option value="1時間" />
        <option value="3時間" />
        <option value="6時間" />
        <option value="12時間" />
        <option value="1日" />
        <option value="3日" />
        <option value="7日" />
        <option value="永続" />
    </datalist>
    <datalist id="${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-attribute-list">
        <option value="断空" />
        <option value="衝撃" />
        <option value="純エネルギー" />
        <option value="土" />
        <option value="水・氷" />
        <option value="炎" />
        <option value="風" />
        <option value="雷" />
        <option value="毒" />
        <option value="病気" />
        <option value="精神効果" />
        <option value="精神効果（弱）" />
        <option value="呪い" />
        <option value="呪い＋精神効果" />
    </datalist>`;  
};

io.github.shunshun94.trpg.sw2.magicInputer.bindEvent = () => {
    document.getElementById(`${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-append`).onclick = (e) => {
        const event = document.createEvent("HTMLEvents");
        event.initEvent(io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.EVENT, true, true);
        document.getElementById(`${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-append`).dispatchEvent(event);
    };
};

io.github.shunshun94.trpg.sw2.magicInputer.getValues = (dom=document.getElementById(io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID)) => {
    const result = {};
    const insertValue = (d)=>{
        const column = d.id.replace(`${io.github.shunshun94.trpg.sw2.magicInputer.CONSTS.ID}-`, '');
        result[column] = d.value;
    };
    Array.from(dom.getElementsByTagName('input')).forEach(insertValue);
    Array.from(dom.getElementsByTagName('select')).forEach(insertValue);
    Array.from(dom.getElementsByTagName('textarea')).forEach(insertValue);
    result.range = result.range.replace('/', '/\n');
    result.time = result.time.replace('(', '\n(');
    return result;
};