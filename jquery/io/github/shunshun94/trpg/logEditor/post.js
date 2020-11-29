var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.Post = class {
	constructor(dom) {
		io.github.shunshun94.trpg.logEditor.tmp = dom;
		this.innerHtml = dom.html().trim();
		this.name = dom[0].localName;
		this.id = dom.attr('id') || '';
		this.classList = dom.attr('class') || '';
	}
	toString() {
		return this.getEditorDom();
	}
	getEditorDom() {
		return `<div class="io-github-shunshun94-trpg-logEditor-Post">
			<div class="${io.github.shunshun94.trpg.logEditor.CLASSES.HANDLE}">≡</div>
			<div class="io-github-shunshun94-trpg-logEditor-Post-params">
				id:<input type="text" value="${this.id}" class="io-github-shunshun94-trpg-logEditor-Post-params-id"/><br/>
				class:<input type="text" value="${this.classList}" class="io-github-shunshun94-trpg-logEditor-Post-params-class"/></div>
			<${this.name} class="io-github-shunshun94-trpg-logEditor-Post-item">${this.innerHtml}</${this.name}>
		</div>`;
	}
};