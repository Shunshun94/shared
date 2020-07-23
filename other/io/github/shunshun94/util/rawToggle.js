var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.toggle = io.github.shunshun94.util.toggle || {};
io.github.shunshun94.util.toggle.CLASSES = {
	HIDE: 'io-github-shunshun94-util-toggle-hide',
	BUTTON: 'io-github-shunshun94-util-toggle-button'
};
io.github.shunshun94.util.toggle.DEFAULT_OPTIONS = {
		isDefaultClosed: true,
		buttonOpenText: '開く',
		buttonCloseText: '閉じる',
		buttonClassList: []
};


io.github.shunshun94.util.toggle.entoggleElement = (targetDom, option=io.github.shunshun94.util.toggle.DEFAULT_OPTIONS )=>{
	let toggleButton = document.createElement("button");
	const openText = option.buttonOpenText || io.github.shunshun94.util.toggle.DEFAULT_OPTIONS.buttonOpenText;
	const closeText = option.buttonCloseText || io.github.shunshun94.util.toggle.DEFAULT_OPTIONS.buttonCloseText;
	toggleButton.className = `${io.github.shunshun94.util.toggle.CLASSES.BUTTON} ${(option.buttonClassList || io.github.shunshun94.util.toggle.DEFAULT_OPTIONS.buttonClassList).join(' ')}`;
	toggleButton.innerHTML = closeText;
	targetDom.insertBefore(toggleButton, targetDom.firstChild);
	toggleButton.onclick = (e)=>{
		if(toggleButton.innerHTML === openText) {
			toggleButton.innerHTML = closeText;
		} else {
			toggleButton.innerHTML = openText;
		}
		const children = targetDom.children;
		const length = children.length;
		for(let i = 0; i < length; i++) {
			const target = children[i];
			if(! target.className.includes(io.github.shunshun94.util.toggle.CLASSES.BUTTON)) {
				children[i].classList.toggle(io.github.shunshun94.util.toggle.CLASSES.HIDE);
			}
		}
	};
	if(option.isDefaultClosed || io.github.shunshun94.util.toggle.DEFAULT_OPTIONS.isDefaultClosed) {
		if(toggleButton.innerHTML === openText) {
			toggleButton.innerHTML = closeText;
		} else {
			toggleButton.innerHTML = openText;
		}
		const children = targetDom.children;
		const length = children.length;
		for(let i = 0; i < length; i++) {
			const target = children[i];
			if(! target.className.includes(io.github.shunshun94.util.toggle.CLASSES.BUTTON)) {
				children[i].classList.toggle(io.github.shunshun94.util.toggle.CLASSES.HIDE);
			}
		}
	}
};
