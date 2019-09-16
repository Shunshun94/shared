const getQueries = () => {
	const rawQuery = location.search.slice(1);
	if(rawQuery === '') {
		return {};
	}
	const query = decodeURI(rawQuery).split('&');
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
		},
		config: {
			circledRanges: '100,50,30,20,10,5,3',
			scale: 25,
			backgroundImage: '-'
		}
};

let characterIndex = 0;
for(var name in query) {
	if(! Boolean(data.config[name])) {
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
		data.config[name] = query[name];
	}
}

new Vue({
	el: '#sharedMap',
	data: {
		values: data
	}
});
