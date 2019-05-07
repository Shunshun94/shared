var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trump = io.github.shunshun94.trump || {};
io.github.shunshun94.trump.Deck = class {
	constructor(opt={}) {
		this.cards = opt.cards || opt.set || io.github.shunshun94.trump.Deck.FULL;
		this.cards = this.cards.map((v)=>{
			if(v.isOpen === undefined) {
				v.isOpen = false;
			}
			return v;
		});
	}
	rndString() {
		let randomString = '';
		const baseString ='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		for(var i=0; i<6; i++) {
			randomString += baseString.charAt( Math.floor( Math.random() * baseString.length));
		}
		return randomString;
	}
	shuffle(sortHash = 'sortHash') {
		this.cards = this.cards.map((c)=>{
			c[sortHash] = this.rndString();
			return c;
		}).sort((a,b)=>{
			if(a[sortHash] > b[sortHash]){return 1}else{return -1}
		}).map((c)=>{
			delete c[sortHash];
			return c;
		});
		return this.cards;
	}
	getTotal() {
		return this.cards.reduce((a, b)=>{if(b.suit !== 'J'){return a + b.num} else {return a} }, 0);
	}
	addCard(suit, num, opt={}) {return this.appendCard(suit, num, opt);}
	appendCard(suit, num, opt={}) {
		opt.suit = suit;
		opt.num = num;
		return this.appendCards([opt]);
	}
	addCards(list){return this.appendCards(list);}
	appendCards(rawList) {
		const list = rawList.cards ? rawList.cards : rawList;
		this.cards = this.cards.concat(list);
		return cards;
	}
	removeCard(suit, num) {
		return this.removeCards([{suit: suit, num:num}]);
	}
	removeCards(list) {
		let removedList = [];
		this.cards = this.cards.filter((c)=>{
			const isKept = list.filter((l)=>{
				let flag = true;
				for(var key in l) {
					flag = flag && (l[key] === c[key])
				}
				return flag;
			}).length === 0;
			if(isKept) {
				return true;
			} else {
				removedList.push(c);
				return false;
			}
		});
		return removedList;
	}
	draw(rawCount = 1) {
		let result = []
		const count = Math.min(rawCount, this.cards.length);
		for(var i = 0; i < count; i++) {
			result.push(this.cards.shift());
		}
		return result;
	}
};
io.github.shunshun94.trump.Deck.SUIT = {
	S: '♠',
	C: '♣',
	H: '♥',
	D: '♦'
};
io.github.shunshun94.trump.Deck.FULL = [
	{
		"suit": "S",
		"num": 1
	},
	{
		"suit": "S",
		"num": 2
	},
	{
		"suit": "S",
		"num": 3
	},
	{
		"suit": "S",
		"num": 4
	},
	{
		"suit": "S",
		"num": 5
	},
	{
		"suit": "S",
		"num": 6
	},
	{
		"suit": "S",
		"num": 7
	},
	{
		"suit": "S",
		"num": 8
	},
	{
		"suit": "S",
		"num": 9
	},
	{
		"suit": "S",
		"num": 10
	},
	{
		"suit": "S",
		"num": 11
	},
	{
		"suit": "S",
		"num": 12
	},
	{
		"suit": "S",
		"num": 13
	},
	{
		"suit": "C",
		"num": 1
	},
	{
		"suit": "C",
		"num": 2
	},
	{
		"suit": "C",
		"num": 3
	},
	{
		"suit": "C",
		"num": 4
	},
	{
		"suit": "C",
		"num": 5
	},
	{
		"suit": "C",
		"num": 6
	},
	{
		"suit": "C",
		"num": 7
	},
	{
		"suit": "C",
		"num": 8
	},
	{
		"suit": "C",
		"num": 9
	},
	{
		"suit": "C",
		"num": 10
	},
	{
		"suit": "C",
		"num": 11
	},
	{
		"suit": "C",
		"num": 12
	},
	{
		"suit": "C",
		"num": 13
	},
	{
		"suit": "H",
		"num": 1
	},
	{
		"suit": "H",
		"num": 2
	},
	{
		"suit": "H",
		"num": 3
	},
	{
		"suit": "H",
		"num": 4
	},
	{
		"suit": "H",
		"num": 5
	},
	{
		"suit": "H",
		"num": 6
	},
	{
		"suit": "H",
		"num": 7
	},
	{
		"suit": "H",
		"num": 8
	},
	{
		"suit": "H",
		"num": 9
	},
	{
		"suit": "H",
		"num": 10
	},
	{
		"suit": "H",
		"num": 11
	},
	{
		"suit": "H",
		"num": 12
	},
	{
		"suit": "H",
		"num": 13
	},
	{
		"suit": "D",
		"num": 1
	},
	{
		"suit": "D",
		"num": 2
	},
	{
		"suit": "D",
		"num": 3
	},
	{
		"suit": "D",
		"num": 4
	},
	{
		"suit": "D",
		"num": 5
	},
	{
		"suit": "D",
		"num": 6
	},
	{
		"suit": "D",
		"num": 7
	},
	{
		"suit": "D",
		"num": 8
	},
	{
		"suit": "D",
		"num": 9
	},
	{
		"suit": "D",
		"num": 10
	},
	{
		"suit": "D",
		"num": 11
	},
	{
		"suit": "D",
		"num": 12
	},
	{
		"suit": "D",
		"num": 13
	},
	{
		"suit": "J",
		"num": 14
	},
	{
		"suit": "J",
		"num": 15
	}
];