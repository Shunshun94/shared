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
	    ${ json.name ? `<div class="io-github-shunshun94-trpg-logEditor-Post-name">${json.name}</div>` : '' }
	  <div 
	  	class="io-github-shunshun94-trpg-logEditor-Post-content"
	  	 contenteditable="true">${json.content}</div>
	  <button
	  	title="発言を複製する"
	  	class="${io.github.shunshun94.trpg.logEditor.CLASSES.DUPLICATE}">C</button>
	  <button
	  	title="直上の発言に発言内容をマージする"
	  	class="${io.github.shunshun94.trpg.logEditor.CLASSES.MERGE}">M</button>
	  <button
	  	title="発言を削除する"
	  	class="${io.github.shunshun94.trpg.logEditor.CLASSES.DELETE}">×</button>
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
