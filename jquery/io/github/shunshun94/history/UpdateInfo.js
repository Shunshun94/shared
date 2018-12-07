var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.UpdateInfo = class {
	constructor(history, key=`${io.github.shunshun94.UpdateInfo.STORAGE_KEY}${location.pathname.replace(/\//gm, '-')}`) {
		const lastConfimed = new Date(localStorage.getItem(key) || 0);
		const shownHistory = history.filter((h)=>{
			return h.date > lastConfimed;
		});
		if(shownHistory.length === 0) {
			console.log('no update')
			return;
		}
		const logDom = shownHistory.map((h)=>{
			return `<h3 class="${io.github.shunshun94.UpdateInfo.CLASS.log}-date">${io.github.shunshun94.UpdateInfo.METHODS.dateToString(h.date)}</h3>` +
			h.body.map((t)=>{
				if(t.startsWith('<') && t.endsWith('>')) {
					return t;
				} else {
					return `<span class="${io.github.shunshun94.UpdateInfo.CLASS.log}-text">${t}</span>`;
				}
			}).join('');
		}).join('');
		$('body').append(`<div class="${io.github.shunshun94.UpdateInfo.CLASS.back}"></div>`);
		$('body').append(`<div class="${io.github.shunshun94.UpdateInfo.CLASS.log}">
		<h2>${io.github.shunshun94.UpdateInfo.TEXT.title}</h2>${logDom}</div>`)
		localStorage.setItem(key, shownHistory[0].date.toString());
		
		$(`.${io.github.shunshun94.UpdateInfo.CLASS.back}`).click((e)=>{
			$(`.${io.github.shunshun94.UpdateInfo.CLASS.back}`).remove();
			$(`.${io.github.shunshun94.UpdateInfo.CLASS.log}`).remove();
		});
	}
	
	
	
};

io.github.shunshun94.UpdateInfo.STORAGE_KEY = 'io-github-shunshun94-UpdateInfo-STORAGE_KEY-';
io.github.shunshun94.UpdateInfo.CLASS = {
	back: 'io-github-shunshun94-UpdateInfo-back',
	log: 'io-github-shunshun94-UpdateInfo-log'
};
io.github.shunshun94.UpdateInfo.TEXT = {
	title: '最近の更新'
};
io.github.shunshun94.UpdateInfo.METHODS = {
	dateToString: (date)=>{
		return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
	}	
};
