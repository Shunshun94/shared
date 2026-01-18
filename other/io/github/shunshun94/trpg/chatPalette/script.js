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
