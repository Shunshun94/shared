var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trump = io.github.shunshun94.trump || {};
io.github.shunshun94.trump.TrumpSample = class {
	constructor() {
		this.$mountains = $('#mountains');
		this.$hands = $('#hands');
		this.$status = $('#status');

		this.mountains = [];
		this.hands = [];
		
		let firstCards = new io.github.shunshun94.trump.Deck();
		firstCards.shuffle();

		this.mountains.push(firstCards);

		this.draw();
		this.bindEvents();
	}

	toggleMountainCard(idx) {
		this.mountains[idx].cards[0].isOpen = ! this.mountains[idx].cards[0].isOpen;
	}
	getMountainCard(idx) {
		const drawnCards = this.mountains[idx].draw();
		drawnCards[0].isOpen = true;
		this.hands = this.hands.concat(drawnCards);
	}
	separateMountainCards(idx) {
		this.mountains.push(new io.github.shunshun94.trump.Deck({cards:this.mountains[idx].draw(Math.floor(this.mountains[idx].cards.length / 2))}));
	}
	openMountainCardsList(idx) {
		
	}
	toggleHandCard(idx) {
		this.hands[idx].isOpen = ! this.hands[idx].isOpen;
	}

	bindEvents() {
		this.$mountains.click((e)=>{
			const tag = $(e.target);
			const idx = tag.val();
			if(tag.hasClass('toggle')) {
				this.toggleMountainCard(idx);
				this.draw();
			} else if(tag.hasClass('draw')) {
				this.getMountainCard(idx);
				this.draw();
			} else if(tag.hasClass('separate')) {
				this.separateMountainCards(idx);
				this.draw();
			} else if(tag.hasClass('separate')) {
				this.openMountainCardsList(idx);
			}
		});
		this.$hands.click((e)=>{
			const tag = $(e.target);
			const idx = tag.val();
			if(tag.hasClass('toggle')) {
				this.toggleHandCard(idx);
				this.draw();
			}
		});
	}
	
	drawCard(card) {
		if(card.isOpen) {
			if(io.github.shunshun94.trump.Deck.SUIT[card.suit]) {
				return `${io.github.shunshun94.trump.Deck.SUIT[card.suit]}${io.github.shunshun94.trump.Deck.NUM[card.num]}`;
			} else {
				return 'JOKER';
			}
		} else {
			return '？';
		}
	}
	draw() {
		this.$mountains.empty();
		this.$hands.empty();
		this.mountains = this.mountains.filter((m)=>{return m.cards.length}); 
		this.mountains.forEach((m, i)=>{
			this.$mountains.append(`
				<div class="cards">
					<div class="card">${ this.drawCard(m.cards[0]) }</div>
					<div class="stackedCards">${m.cards.length}枚</div>
					<div class="actions">
						<button value="${i}" class="toggle">裏返す</button>
						<button value="${i}" class="draw">手札に加える</button>
						<button value="${i}" class="list">1枚選ぶ</button>
						<button value="${i}" class="separate">山札を分ける</button>
					</div>
				</div>
			`);
		});
		this.hands.forEach((c, i)=>{
			this.$hands.append(`<div class="cards"><div class="card">${ this.drawCard(c) }</div><div class="actions"><button value="${i}" class="toggle">裏返す</button></div></div>`);
		});
		
		this.$status.val(`**山札**\n${this.mountains.map((m)=>{return this.drawCard(m.cards[0])+'(残'+m.cards.length+'枚)'}).join('/')}\n\n**手札**\n${this.hands.map((c)=>{return this.drawCard(c)}).join('/')}`);
		
		
		
		
	}
};