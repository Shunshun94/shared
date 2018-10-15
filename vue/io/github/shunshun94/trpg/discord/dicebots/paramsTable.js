const query = com.hiyoko.util.getQueries();
let tokenList = JSON.parse(localStorage.getItem('io-github-shunshun94-trpg-discord-Entrance-Token-TokenList') || '[null]');
const paramsTable = new Vue({
	el: '#params',
	data: {
		token: query.token || query.url || localStorage.getItem('io-github-shunshun94-trpg-discord-entry-token') || tokenList.reverse()[0] || '',
		room: query.room || query.channel || ''
	}
});
