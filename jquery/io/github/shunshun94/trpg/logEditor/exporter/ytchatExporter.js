var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.ytchatExporter = io.github.shunshun94.trpg.logEditor.export.ytchatExporter || {};

io.github.shunshun94.trpg.logEditor.export.ytchatExporter.CONSTS = {
    REGEXPS: {
        BGM: /bgm:(\d+):(.*)$/,
        BG: /bg:(.*)$/
    }
}

io.github.shunshun94.trpg.logEditor.export.ytchatExporter.isSubTab = (post) => {
    const tabClasses = post.class.split(' ').filter((c)=>{
        const target = c.trim();
        return /^tab\d+$/.test(target) && (target !== 'tab0');
    });
    if(tabClasses.length) {
        return /tab(\d+)/.exec(tabClasses[0])[1];
    } else {
        return false;
    }
};

io.github.shunshun94.trpg.logEditor.export.ytchatExporter.getSuffix = () => {
    return `</div>
    </article>
    </div>
    <div id="foot-area" style="display:none;">
    <aside class="credit"></aside>
    <aside class="credit">
      <h3>BGMリスト</h3>
      <ul></ul>
    </aside>
    <aside class="credit">
      <h3>背景リスト</h3>
      <ul></ul>
    </aside>
    <footer></footer>
    </div>
    <div id="bottom-bar">
        <dl>
        <dt>背景</dt><dd id="bg-title">－</dd>
        <dt>BGM</dt><dd id="bgm-title">－</dd><div id="yt-player-area"><div id="yt-player"></div></div>
        </dl>
    </div>
    </body>
    </html>`;
};

io.github.shunshun94.trpg.logEditor.export.ytchatExporter.getPrefix = (title) => {
	return `<!DOCTYPE html>
	<html>
	<head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1">
	  <title>${title}</title>
	  <link rel="stylesheet" media="all" href="https://hiyo-hitsu.sakura.ne.jp/ytchat/lib/css/base.css">
	  <link rel="stylesheet" media="all" href="https://hiyo-hitsu.sakura.ne.jp/ytchat/lib/css/config.css">
	  <link rel="stylesheet" media="all" href="https://hiyo-hitsu.sakura.ne.jp/ytchat/lib/css/logs.css">
	  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css" integrity="sha384-KA6wR/X5RY4zFAHpv/CnoG2UW1uogYfdnP67Uv7eULvTveboZJg0qUpmJZb5VqzN" crossorigin="anonymous">
	  <script src="https://hiyo-hitsu.sakura.ne.jp/ytchat/lib/js/logs.js" defer></script>
	</head>
	<body id="logviewer">
	  <div class="bg-image bg-front"></div>
	  <div class="bg-image bg-back"></div>
	  <div id="loading"><div id="loading-animation"></div></div>
	  <div id="image-box" style="display:none"><img id="image-box-image"></div>
	  <div id="sound-confirm" style="display:none;">
		<p>
		  このログにはＢＧＭが含まれています。<br>
		  音量設定をＯＮにしますか？<br>
		  <small>(後からでもメニューから設定変更できます)</small><br>
		  
		  <span class="mute-button" onclick="soundOn();soundConfirmClose();bgScroll();"></span>
		  <span class="mute-button muted" onclick="soundOff();soundConfirmClose();"></span>
		</p>
	  </div>
	<div id="right">
	  <input type="checkbox" id="menu-toggle">
	  <aside id="menu" class="box">  
		<h2>メニュー<label for="menu-toggle"></label></h2>
		<ul id="tablist" style="display:none;">
		  <li><label><input type="checkbox" id="tab-on-1" checked onchange="tabSelect(1)"><b>メイン</b></label></li>
		  <li><label><input type="checkbox" id="tab-on-2" checked onchange="tabSelect(2)"><b>サブ</b></label></li>
		  <li><label for="secret-on"><input type="checkbox" id="secret-on" onchange="secretView()"><b>秘話</b></label></li>
		</ul>
		<dl class="options" id="options-sound">
		  <dt>サウンド音量 <span id="option-sound-view">100</span> %</dd><dd><input id="option-sound" type="range" min="0.01" max="1" step="0.01" value="1"><br>
		  <span class="mute-button muted" id="option-mute-button"></span></dd>
		</dl>
		<dl class="options">
		  <dt>背景不透過 <span id="option-opacity-view">70</span> %</dt><dd><input id="option-opacity" type="range" min="0.0" max="1.0" step="0.01" value="0.7"></dd>
		  <dt>文字の輝度 <span id="option-font-lightness-view">100</span> %</dd><dd><input id="option-font-lightness" type="range" min="50" max="100" step="1" value="100"></dd>
		  <dt>文字サイズ <span id="option-font-size-view">100</span> %</dd><dd><input id="option-font-size" type="range" min="80" max="130" step="1" value="100"></dd>
		  <dt>日本語フォント</dd><dd><select id="option-font-family-jp"><optgroup label="Webフォント（GoogleFonts）">
	  <option value='"Noto Sans JP"'>Noto Sans JP</option>
	  <option value='"Kosugi"'>小杉ゴシック</option>
	  <option value='"Kosugi Maru"'>小杉丸ゴシック</option>
	  <option value='"Sawarabi Gothic"'>さわらびゴシック</option>
	</optgroup>
	<optgroup label="Windows標準フォント">
	  <option value='"UD Digi Kyokasho NP-R"'>UDデジタル教科書体（Win10～）</option>
	  <option value='"BIZ UDGothic"' selected>BIZ UDゴシック（Win10～）</option>
	  <option value='"BIZ UDMincho"'>BIZ UD明朝（Win10～）</option>
	  <option value='"Meiryo"'>メイリオ</option>
	</optgroup>
	<optgroup label="Windows/Mac共通標準フォント">
	  <option value='"YuGothic","Yu Gothic"'>游ゴシック（Win8～）</option>
	</optgroup>
	<optgroup label="Mac標準フォント">
	  <option value='"YuKyokasho Yoko"'>游教科書体</option>
	  <option value='"Hiragino Sans"'>ヒラギノ角ゴシック</option>
	  <option value='"Hiragino Maru Gothic ProN"'>ヒラギノ丸ゴ</option>
	  <option value='"Klee"'>クレー</option>
	  <option value='"Tsukushi A Round Gothic"'>筑紫A丸ゴシック</option>
	  <option value='"Toppan Bunkyu Gothic"'>凸版文久ゴシック</option>
	</optgroup></select></dd>
		</dl>
		<div id="loglist-area">
		<details open style="display:none;">
		  <summary class="bold">現行ログ</summary>
		  <ul id="roomlist">
		  </ul>
		  </details>
		<details style="display:none;">
		<summary class="bold">過去ログ</summary>
		  <ul id="loglist"></ul>
		</details>
		
		</div>
		<ul style="display:none;"></ul>
	  </aside>
	</div>
	<div id="base" class="box">
	  <header>
		<h1>${title}</h1>
	  </header>
	  <article id="contents">
	  <div class="logs logs-font">`;
};

io.github.shunshun94.trpg.logEditor.export.ytchatExporter.convertDateToMyFormat = (date = new Date()) => {
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

io.github.shunshun94.trpg.logEditor.export.ytchatExporter.postToHtml = (post, tmpId) => {
    const id = Number(tmpId) + 1;
    const now = io.github.shunshun94.trpg.logEditor.export.ytchatExporter.convertDateToMyFormat();
    if(post.name === 'YTCHAT_SYSTEM') {
        const lines = post.content.split('\n').filter((d)=>{return d.trim();});
        console.log(lines);
        if(post.content.startsWith('bgm:')) {
            const tmpUrl = io.github.shunshun94.trpg.logEditor.export.ytchatExporter.CONSTS.REGEXPS.BGM.exec(lines[0]);
            if(tmpUrl) {
                const volume = tmpUrl[1];
                const url = tmpUrl[2];
                const who = (lines.length > 1) ? lines[1] : 'BGMを変更';
                const title = (lines.length > 2) ? lines[2] : '';
                return `<dl id="line-${id}" class="system bgm important main ${post.class}" data-user="!SYSTEM" data-tab="1" data-tab-name="メイン">
                <dt style="${post.style}">!SYSTEM</dt>
                <dd class="comm" data-date="${now}"><span class="bgm-border" data-url="${url}" data-title="${title}" data-vol="${volume}"></span>${who}</dd>
                <dd class="info bgm" data-date="${now}" data-game="">${title}<small>${volume}％</small> <a class="link-yt" href="${url}" target="_blank"></a></dd></dl>`;
            }
        }
        if(post.content.startsWith('bg:')) {
            const tmpUrl = io.github.shunshun94.trpg.logEditor.export.ytchatExporter.CONSTS.REGEXPS.BG.exec(lines[0]);
            if(tmpUrl) {
                const url = tmpUrl[1];
                const who = (lines.length > 1) ? lines[1] : '背景を変更';
                const where = (lines.length > 2) ? lines[2] : '';
                return `<dl id="line-${id}" class="system bg important main ${post.class}" data-user="!SYSTEM" data-tab="1" data-tab-name="メイン">
                <dt style="${post.style}">!SYSTEM</dt>
                <dd class="comm" data-date="${now}"><span class="bg-border" data-url="${url}" data-title="${where}"></span>${who}</dd>
                <dd class="info bg" data-date="${now}" data-game="">${where}</dd></dl>`;
            }
        }
    }
    const isSub = io.github.shunshun94.trpg.logEditor.export.ytchatExporter.isSubTab(post);
    const baseClass = isSub ? '' : 'main';
    const baseTabName = isSub ? 'サブ' : 'メイン';  
    if(post.tag === 'p') {
      const baseTabName = isSub ? 'サブ' : 'メイン';
      return `<dl id="line-${id}" class="${baseClass} ${post.class}" data-user="${post.name}" data-tab="${isSub}" data-tab-name="${baseTabName}" style="${post.style}">
          <dt>${post.name}</dt>
          <dd id="${post.id}" class="comm" data-date="${now}">${post.content}</dd></dl>`
    } else if(post.tag === 'hr'){
      return `<dl id="line-${id}" class="${baseClass} ${post.class}" data-user="${post.name}" data-tab="${isSub}" data-tab-name="" style="${post.style}">
          <dd id="${post.id}" class="comm" data-date="${now}"><hr/></dd></dl>`
    } else {
      return `<dl id="line-${id}" class="${baseClass} ${post.class}" data-user="${post.name}" data-tab="${isSub}" data-tab-name="" style="${post.style}">
          <dd id="${post.id}" class="comm" data-date="${now}"><${post.tag}>${post.content}</${post.tag}></dd></dl>`
    }

};

io.github.shunshun94.trpg.logEditor.export.ytchatExporter.exec = (doms, head, omit, mode) => {
    const postData = Array.from(doms.children()).map(jQuery)
        .map((dom, id)=>{
            try {
                return io.github.shunshun94.trpg.logEditor.export.ytchatExporter.convertDomToElements(dom, id);
            } catch(e) {
                console.error(e, dom, id);
                return '';
            }
        });
      const posts = postData.map((dom, id)=>{
            try {
                return io.github.shunshun94.trpg.logEditor.export.ytchatExporter.postToHtml(dom, id);
            } catch(e) {
                console.error(e, dom, id);
                return '';
            }
        }).join('\n');
        const titleCandidate = postData.filter((p)=>{
          return p.tag === 'h1' || p.tag === 'h2';
        });
        const title = (titleCandidate.length) ? titleCandidate[0].content.trim() : `saved_${Number(new Date())}`;
        io.github.shunshun94.trpg.logEditor.export.ytchatExporter.download(
            io.github.shunshun94.trpg.logEditor.export.ytchatExporter.getPrefix(title) +
            posts +
            io.github.shunshun94.trpg.logEditor.export.ytchatExporter.getSuffix(), title);
};

io.github.shunshun94.trpg.logEditor.export.ytchatExporter.convertDomToElements = (dom) => {
    const id = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-id`).val().trim();
    const tag = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-tag`).val().trim();
    const style = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-style`).val().trim();
    const classes = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-class`).val().trim();
    const name = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).text().trim();
	const content = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.CONTENT}`).html().replace(/^<div>/, '').
    replaceAll('\t', '').replaceAll('\n', '').
    replaceAll('</div><!-- keep -->', '</dummy>').
    replaceAll('<div><br></div>', '<br>').
    replaceAll('<div>', '<br>').
    replaceAll('</div>', '').
    replaceAll('</dummy>', '</div>').
    replaceAll(/<br\/?>/gm, '\n').trim();
    return {
        tag: tag,
        name: name,
        content: content,
        id: id,
        style: style,
        class: classes
    };
};

io.github.shunshun94.trpg.logEditor.export.ytchatExporter.download = (html, title) => {
	const url = window.URL.createObjectURL(new Blob([ html ], { "type" : 'text/html;charset=utf-8;' }));
	const dlLink = document.createElement("a");
	document.body.appendChild(dlLink);
	dlLink.download = title;
	dlLink.href = url;
	dlLink.click();
	dlLink.remove();
	URL.revokeObjectURL(url);
};