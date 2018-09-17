$('body').click((e)=>{
	const $dom = $(e.target);
	if($dom.hasClass(io.github.shunshun94.util.UnDoubleClickable.CLASS)) {
		let events = [];
		const clickEvents = ($._data($dom.get(0), 'events') || io.github.shunshun94.util.UnDoubleClickable.DUMMY).click;
		if(clickEvents.length === 0) {
			return;
		}
		for(var i = 0; i < clickEvents.length; i++) {
			events.push(clickEvents[i].handler);
		}
		$dom.off("click");
		setTimeout(()=>{
			events.forEach((e) => {
				$dom.click(e);
			});
		}, io.github.shunshun94.util.UnDoubleClickable.TIME_LENGTH);
	}
});

var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.UnDoubleClickable = io.github.shunshun94.util.UnDoubleClickable || {};
io.github.shunshun94.util.UnDoubleClickable.CLASS = 'io-github-shunshun94-util-UnDoubleClickable';
io.github.shunshun94.util.UnDoubleClickable.DUMMY = {click:[]};
io.github.shunshun94.util.UnDoubleClickable.TIME_LENGTH = 1000;