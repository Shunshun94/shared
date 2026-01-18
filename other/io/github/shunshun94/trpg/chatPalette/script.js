var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ChatPalette = io.github.shunshun94.trpg.ChatPalette || {};

/**
 * チャットパレットのスクリプトをパースします
 * マークダウンの見出し形式または上下を = で囲まれたテキストを見出しとし、
 * 見出しをキーとして入力されたテキストを分割、各見出しごとに配列として格納したオブジェクトを返します
 * @param {String} rawPalette チャットパレットの文字列
 * @returns パース結果のオブジェクト
 */
io.github.shunshun94.trpg.ChatPalette.parse = (rawPalette) => {
    const lines = rawPalette.replaceAll(/=+\n(.+)\n=+/mg, (_, name)=>{return `### ${name}`}).split(/\r\n|\r|\n/);
    const result = {};
    let currentKey = '追加部分';
    let currentLines = [];
    const flushCurrentLines = () => {
        const filtered = currentLines.filter(line => line.trim() !== '');
        if (filtered.length) {
            result[currentKey] = filtered;
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const headingMatch = line.match(/^\s*#{1,6}\s*(.+?)\s*#*\s*$/);
        if (headingMatch) {
            flushCurrentLines();
            currentKey = headingMatch[1];
            currentLines = [];
        } else if((! line.startsWith('//'))) {
            currentLines.push(line);
        }
    }
    flushCurrentLines();

    return result;
};

/**
 * 出力を html として吐き出させます
 * @param {element} paletteSection チャットパレットの入力欄を含む details 要素
 * @param {element} previewArea プレビュー表示エリアの要素
 * @param {String} saveKey ローカルストレージに保存する際のキー
 */
io.github.shunshun94.trpg.ChatPalette.buildPreview = (
    paletteSection = document.getElementById('palette-section'),
    previewArea = document.getElementById('preview-area'),
    saveKey = 'io-github-shunshun94-trpg-chat-palette'
) => {
    previewArea.innerHTML = '';
    const inputtedText = paletteSection.getElementsByTagName('textarea')[0].value;
    const parseResult = io.github.shunshun94.trpg.ChatPalette.parse(inputtedText);
    Object.keys(parseResult).forEach((key, i) => {
        const details = document.createElement('details');
        details.className = `preview-item-${i} preview-item-container`;
        const summary = document.createElement('summary');
        summary.innerText = key;
        details.appendChild(summary);
        parseResult[key].forEach((line, j) => {
            const lineDiv = document.createElement('div');
            lineDiv.textContent = line;
            lineDiv.className = `preview-item-${i}-${j} preview-item-line`;
            details.appendChild(lineDiv);
        });
        previewArea.appendChild(details);
    });
    paletteSection.open = false;
    localStorage.setItem(saveKey, inputtedText);
};

/**
 * チャットパレットの項目をクリックした際にコピーします
 * @param {Event} event 
 */
io.github.shunshun94.trpg.ChatPalette.copyItem = (event) => {
    if( event.target.classList.contains('preview-item-line') ) {
        navigator.clipboard.writeText(event.target.textContent);
    }
};

/**
 * アプリ起動時にチャットパレットの内容をローカルストレージから復元します
 * @param {element} paletteSection チャットパレットの入力欄を含む details 要素
 * @param {String} saveKey ローカルストレージに保存する際のキー
 */
io.github.shunshun94.trpg.ChatPalette.initialize = (
    paletteSection = document.getElementById('palette-section'),
    saveKey = 'io-github-shunshun94-trpg-chat-palette'
) => {
    const savedText = localStorage.getItem(saveKey);
    if (savedText) {
        paletteSection.getElementsByTagName('textarea')[0].value = savedText;
    }
};

io.github.shunshun94.trpg.ChatPalette.consts = {};
io.github.shunshun94.trpg.ChatPalette.consts.SAMPLE_PALETTE = `
### ■非戦闘系
2d+3+3 冒険者＋器用
2d+3+1 冒険者＋敏捷
2d+3+4 冒険者＋筋力
2d+3+3 冒険者＋生命
2d+3+1 冒険者＋知力
2d+3+3 冒険者＋精神
2d+2+3 レンジャー技巧
2d+2+1 レンジャー運動
2d+2+1 レンジャー観察


### ■薬草
k10[13]+2+3 〈救命草〉
k0[13]+2+3 〈魔香草〉

### ■宣言特技
[宣]《薙ぎ払いⅠ》

### ■武器攻撃系
//命中修正=0
//C修正=0
//追加D修正=0
//必殺効果=0
//クリレイ=0
2d+7+{命中修正} 命中力／モール2H
k35[(12+{C修正})]+8+{追加D修正}{出目修正} ダメージ／モール2H

//出目修正=$+{クリレイ}#{必殺効果}
### ■抵抗回避
//生命抵抗修正=0
//精神抵抗修正=0
//回避修正=0
2d+6+{生命抵抗修正} 生命抵抗力
2d+6+{精神抵抗修正} 精神抵抗力

k10[13]+5 救命草
k0[13]+5 魔香草

### ■能力値
### ■技能レベル

### ■代入パラメータ`;
