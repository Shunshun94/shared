var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.jsonToEditorHtml = (json) => {
	return `
	<div class="${io.github.shunshun94.trpg.logEditor.CLASSES.POST}">
	  <div class="${io.github.shunshun94.trpg.logEditor.CLASSES.HANDLE}">≡</div>
	  <div class="io-github-shunshun94-trpg-logEditor-Post-params">
	  	${io.github.shunshun94.trpg.logEditor.jsonToParams(json)}
	  </div>
	  <p>発言者：<span
	  	class="io-github-shunshun94-trpg-logEditor-Post-name"
	  	contenteditable="true">${json.name || ''}</span>
		<button
		title="名前をGMにする"
		class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAMECHANGE}">${io.github.shunshun94.trpg.logEditor.WORDS.HOSTPLAYER}</button>
		<button
		title="他の発言で使われている名前に変更する（右クリックで逆順序で変更）"
		class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAMECYCLE}">🔁</button>
	  </p>
	  <div 
	  	class="io-github-shunshun94-trpg-logEditor-Post-content"
	  	 contenteditable="true">${json.content.replaceAll('<div>', '<div >').replaceAll('</div>', '</div><!-- keep -->')}</div>
	  <button
	  	title="発言を複製する"
	  	class="${io.github.shunshun94.trpg.logEditor.CLASSES.DUPLICATE}">C</button>
	  <button
	  	title="直上の発言に発言内容をマージする"
	  	class="${io.github.shunshun94.trpg.logEditor.CLASSES.MERGE}">M</button>
	  <button
	  	title="発言を削除する"
	  	class="${io.github.shunshun94.trpg.logEditor.CLASSES.DELETE}">×</button>
	  <button
		title="発言を「」で囲む"
		class="${io.github.shunshun94.trpg.logEditor.CLASSES.PARENTHESES}">「」</button>
	</div>`;
};
io.github.shunshun94.trpg.logEditor.PARAMS = [
	{
		name:'tag',
		attrs: {
			list: io.github.shunshun94.trpg.logEditor.CLASSES.CAND_TAGS
		}
	},　{
		name:'id',
		shortcut: {
			rand: {
				text: 'ランダムのID',
				class: io.github.shunshun94.trpg.logEditor.CLASSES.RANDOM_ID
			}
		}
	}, {
		name:'class',
		attrs: {
			list: io.github.shunshun94.trpg.logEditor.CLASSES.CAND_CLASSES
		},
		shortcut: {
			toggleTab1: {
				text: '余談 ON/OFF',
				class: io.github.shunshun94.trpg.logEditor.CLASSES.TOGGLE_SUB
			}
		}
	},　{
		name:'style'
	}
];

io.github.shunshun94.trpg.logEditor.attrsJsonToHtml = (json) => {
	if(json.attrs) {
		const result = [];
		for(const key in json.attrs) {
			result.push(`${key}="${json.attrs[key]}"`);
		}
		return result.join('\n');
	} else {
		return '';
	}
};

io.github.shunshun94.trpg.logEditor.buttonJsonToHtml = (json) => {
	if(json.shortcut) {
		const result = [];
		for(const key in json.shortcut) {
			result.push(`<button
				class="io-github-shunshun94-trpg-logEditor-Post-params-param-button ${json.shortcut[key].class}"
			>${json.shortcut[key].text}</button>`);
		}
		return result.join('\n');
	} else {
		return '';
	}
};

io.github.shunshun94.trpg.logEditor.jsonToParams = (json) => {
	return io.github.shunshun94.trpg.logEditor.PARAMS.map((param)=>{
		return `
		<span class="io-github-shunshun94-trpg-logEditor-Post-params-param">
		  ${param.name}<input
		    type="text"
		    value="${json[param.name]}"
		    ${io.github.shunshun94.trpg.logEditor.attrsJsonToHtml(param)}
		    class="${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS} ${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-${param.name}" />
		    ${io.github.shunshun94.trpg.logEditor.buttonJsonToHtml(param)}
		</span>`;
	}).join('');
};

io.github.shunshun94.trpg.logEditor.getPostsByName = (name) => {
	return $(`.io-github-shunshun94-trpg-logEditor-Post-name`).filter((i,v)=>{
		return $(v).text() === name;
	}).parents(`.${io.github.shunshun94.trpg.logEditor.CLASSES.POST}`);
};

io.github.shunshun94.trpg.logEditor.getPostsByContentRegExp = (regexp) => {
	return $(`.io-github-shunshun94-trpg-logEditor-Post-content`).filter((i,v)=>{
		return regexp.test($(v).text());
	}).parents(`.${io.github.shunshun94.trpg.logEditor.CLASSES.POST}`);
};
