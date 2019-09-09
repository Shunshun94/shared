const getQueries = () => {
	const query = decodeURI(location.search.slice(1)).split('&');
	const paramLength = query.length;
	let result = {};
	for(var i = 0; i < paramLength; i++) {
		const pair = query[i].split('=');
		result[pair[0]] = pair.slice(1).join('=');
	}
	return result;
};

const query = getQueries();

const data = {
		characters:[],
		range: {
			x:-200,
			y:0
		}
};
const config = {
	scale:25
};

let characterIndex = 0;
for(var name in query) {
	if(! Boolean(config[name])) {
		let raw = query[name].split(',');
		data.characters.push({
			name: name,
			x: Number(raw[0] || 0),
			y: Number((raw.length >= 2) ?  raw[1] : 0),
			color: ((raw.length >= 3) ?  raw[2] : 'C8C8C8'),
			id: characterIndex
		});
		characterIndex++;
	} else {
		config[name] = query[name];
	}
}

new Vue({
	el: '#sharedMap',
	data: data,
	methods: {
		onMoveCharacter: function(e) {
			query[e.name.trim()] = `${e.x},${e.y},${e.color}`;
			let params = [];
			for(var key in query) {
				params.push(`${key}=${query[key]}`);
			}
			location.href = `${location.protocol}//${location.host}/${location.pathname}?${params.join('&')}`;
		},
		onDoubleClickCharacter: function(e) {
			this.range.x = e.x;
			this.range.y = e.y;
		}
	}
});
