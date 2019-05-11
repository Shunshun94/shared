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
	getMountainUnderCard(idx) {
		const drawnCards = this.mountains[idx].reverseDraw();
		this.hands = this.hands.concat(drawnCards);		
	}
	separateMountainCards(idx) {
		this.mountains.push(new io.github.shunshun94.trump.Deck(this.mountains[idx].draw(Math.floor(this.mountains[idx].cards.length / 2))));
	}
	openMountainCardsList(idx) {
		$('body').append(`<div id="backgroundScreen"></div>`);
		$('body').append(
				`<div id="cardsList" title="${Number(idx)+1}番目の山札カード一覧">
				${this.mountains[idx].cards.map((card, i)=>{
					const name = this.drawCard(card, true);
					return '<button class="cardsList-card" title="' + name + '" value="' + i + '">'+ name + '</button>'}).join('')
				}
				</div>`);
	}
	toggleHandCard(idx) {
		this.hands[idx].isOpen = ! this.hands[idx].isOpen;
	}

	pickOneCardFromMountain(mountainIndex, cardIndex) {
		let movedCard = Object.assign({}, this.mountains[mountainIndex].cards[cardIndex]);
		movedCard.isOpen = true;
		this.mountains[mountainIndex].cards = this.mountains[mountainIndex].cards.filter((dummy, i)=>{
			return i !== cardIndex;
		}).map((card)=>{card.isOpen = false; return card});
		this.mountains[mountainIndex].shuffle();
		this.mountains[mountainIndex].cards.unshift(movedCard);
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
			} else if(tag.hasClass('reverseDraw')) {
				this.getMountainUnderCard(idx);
				this.draw();
			} else if(tag.hasClass('list')) {
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
		$('body').click((e)=>{
			const closeList = () =>{
				$('#backgroundScreen').remove();
				$('#cardsList').remove();
			};
			const tag = $(e.target);
			if(tag.attr('id') === 'backgroundScreen') {
				const mountainIndex = Number(/\d+/.exec($('#cardsList').attr('title'))[0]) - 1;
				if(this.mountains[mountainIndex].cards[0].isOpen) {
					this.pickOneCardFromMountain(mountainIndex, 0);
				} else {
					this.mountains[mountainIndex].shuffle();
				}
				closeList();
				this.draw();
			} else if(tag.hasClass('cardsList-card')) {
				const mountainIndex = Number(/\d+/.exec($('#cardsList').attr('title'))[0]) - 1;
				this.pickOneCardFromMountain(mountainIndex, Number(tag.val()));
				closeList();
				this.draw();
			}
		});
		$('#status-copy').click((e)=>{
			this.$status.select();
			const result = document.execCommand('copy');
			if(result) {
				alertify.success('コピーしました');
			} else {
				alertify.error('コピーできませんでした');
			}
		});
	}
	
	drawCard(card, forceOpen=false) {
		if(card.isOpen || forceOpen) {
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
						<button value="${i}" class="reverseDraw">下の1枚取る</button>
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