var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.DOMS = {
	BODY: $('body')
};
io.github.shunshun94.trpg.logEditor.EVENTS = {
	FILE_LOADED: 'io-github-shunshun94-trpg-logEditor-file-loaded'
};
io.github.shunshun94.trpg.logEditor.CLASSES = {
	POST: 'io-github-shunshun94-trpg-logEditor-Post',
	HANDLE: 'io-github-shunshun94-trpg-logEditor-Post-handle',
	DUPLICATE: 'io-github-shunshun94-trpg-logEditor-Post-duplicate',
	MERGE: 'io-github-shunshun94-trpg-logEditor-Post-merge',
	DELETE: 'io-github-shunshun94-trpg-logEditor-Post-delete',
	RANDOM_ID: 'io-github-shunshun94-trpg-logEditor-Post-params-param-button-random_id',
	TOGGLE_SUB: 'io-github-shunshun94-trpg-logEditor-Post-params-param-button-toggle_sub',
	CAND_TAGS: 'io-github-shunshun94-trpg-logEditor-candidates-tags',
	CAND_CLASSES: 'io-github-shunshun94-trpg-logEditor-candidates-tags',
	SELECTED: 'io-github-shunshun94-trpg-logEditor-Post-selected',
	INPUTS: 'io-github-shunshun94-trpg-logEditor-Post-params-param-input',
	CONTENT: 'io-github-shunshun94-trpg-logEditor-Post-content',
	NAME: 'io-github-shunshun94-trpg-logEditor-Post-name',
	SAVE: 'io-github-shunshun94-trpg-logEditor-save'
};

io.github.shunshun94.trpg.logEditor.DOMS.BODY.on(io.github.shunshun94.trpg.logEditor.EVENTS.FILE_LOADED, (e, domList)=>{
	console.log(domList);
	new io.github.shunshun94.trpg.logEditor.Editor(domList.doms);
});
