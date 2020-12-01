var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.jsonToEditorHtml = (json) => {
	return `
	<div class="io-github-shunshun94-trpg-logEditor-Post">
	  <div class="${io.github.shunshun94.trpg.logEditor.CLASSES.HANDLE}">≡</div>
	  <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.MERGE}">⇑</button>
	  <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.DELETE}">×</button>
	  <div class="io-github-shunshun94-trpg-logEditor-Post-params">
	  	${io.github.shunshun94.trpg.logEditor.jsonToParams(json)}
	  </div>
	    ${ json.name ? `<div class="io-github-shunshun94-trpg-logEditor-Post-name">
	      ${json.name}
	    </div>` : '' }
	  <div class="io-github-shunshun94-trpg-logEditor-Post-content">
	    ${json.content}
	  </div>
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
			rand: 'ランダムのID'
		}
	}, {
		name:'class',
		attrs: {
			list: io.github.shunshun94.trpg.logEditor.CLASSES.CAND_CLASSES
		},
		shortcut: {
			toggleTab1: '余談 ON/OFF'
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
				class="io-github-shunshun94-trpg-logEditor-Post-params-param-button io-github-shunshun94-trpg-logEditor-Post-params-param-button-${key}"
			>${json.shortcut[key]}</button>`);
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
		    id="io-github-shunshun94-trpg-logEditor-Post-params-param-input-${param.name}"
		    ${io.github.shunshun94.trpg.logEditor.attrsJsonToHtml(param)}
		    class="io-github-shunshun94-trpg-logEditor-Post-params-param-input" />${io.github.shunshun94.trpg.logEditor.buttonJsonToHtml(param)}
		</span>`;
	}).join('');
};
