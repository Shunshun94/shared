var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.scenarioTools = io.github.shunshun94.trpg.scenarioTools || {};
io.github.shunshun94.trpg.scenarioTools.ViceCityCheck = class {
	constructor($dom) {
		const id = $dom.attr('id');
		const query = this.getQuery();
		this.components = [
			new io.github.shunshun94.trpg.scenarioTools.ViceCityCheck.Calendar($dom.find(`#${id}-calendar`), query)
		];
		$dom.find(`#${id}-generate`).click((e)=>{
			const url = `${location.href.replace(location.search, '')}?${this.components.map((c)=>{return c.generateUrl()}).join('&')}`;
			$dom.find(`#${id}-url`).html(`<a href="${url}">${url}</a>`)
		});
	}
	getQuery(text = '') {
		var params = (text || location.search.slice(1)).split('&');
		var paramLength = params.length;
		var result = {};
		for(var i = 0; i < paramLength; i++) {
			var pair = params[i].split('=');
			result[pair[0]] = pair[1];
		}
		return result;
	}
};

io.github.shunshun94.trpg.scenarioTools.ViceCityCheck.Calendar = class {
	constructor($dom, status={}) {
		this.$dom = $dom;
		this.id = $dom.attr('id');
		this.tdClass = `${this.id}-table-day-tr-td`;
		this.currentTime = status.currentTime || 6;
		this.sleptTime = (status.sleptTime || '').split(',');
		this.lunchTime = (status.lunchTime || '').split(',');
		this.generateDom();
		this.drawTable();
		this.bindEvents();
	}
	generateUrl() {
		const currentTimesList = $(`.${this.tdClass}-done`);
		const currentTime = `currentTime=${currentTimesList.length ? this.getTimeId(currentTimesList.last()) : 0}`;

		const sleptTimesList = $.makeArray($(`.${this.tdClass}-slept`));
		console.log(sleptTimesList[2])
		const sleptTime = `sleptTime=${sleptTimesList.map((d)=>{return this.getTimeId($(d))}).join(',')}`;

		const lunchTimesList = $.makeArray($(`.${this.tdClass}-lunch`));
		const lunchTime = `lunchTime=${lunchTimesList.map((d)=>{return this.getTimeId($(d))}).join(',')}`;

		return `${currentTime}&${sleptTime}&${lunchTime}`;
	}

	getTimeId($dom) {
		return Number($dom.attr('id').replace(`${this.tdClass}-`, ''));
	}
	bindEvents() {
		$(`.${this.id}-table-day-tr-td`).click((e)=>{
			const $clicked = $(e.target);
			const timeId = this.getTimeId($clicked);
			for(var i = 0; i < timeId; i++) {
				const $td = $(`#${this.tdClass}-${i}`); 
				$td.addClass(`${this.tdClass}-done`);
				if($td.text() === '未') {
					$(`#${this.tdClass}-${i}`).text('済');
				}
			}
			const currentText = $clicked.text(); 
			if(currentText === '未') {
				$clicked.text('済');
				$clicked.addClass(`${this.tdClass}-done`);
			} else if(currentText === '済') {
				$clicked.text('寝');
				$clicked.addClass(`${this.tdClass}-slept`);
			} else if(currentText === '寝') {
				$clicked.text('食');
				$clicked.addClass(`${this.tdClass}-lunch`);
				$clicked.removeClass(`${this.tdClass}-slept`);
			} else {
				$clicked.text('未');
				$clicked.removeClass(`${this.tdClass}-done`);
				$clicked.removeClass(`${this.tdClass}-lunch`);
			}
			
		});
	}
	
	drawTable() {
		for(var i = 0; i < this.currentTime; i++) {
			$(`#${this.tdClass}-${i}`).addClass(`${this.tdClass}-done`);
			$(`#${this.tdClass}-${i}`).text('済');
		}
		this.sleptTime.forEach((day, i)=>{
			$(`#${this.tdClass}-${day}`).addClass(`${this.tdClass}-slept`);
			$(`#${this.tdClass}-${day}`).text('寝');
		});
		this.lunchTime.forEach((day, i)=>{
			$(`#${this.tdClass}-${day}`).addClass(`${this.tdClass}-lunch`);
			$(`#${this.tdClass}-${day}`).text('食');
		});
		
	}
	generateDom() {
		let dayCount = 0;
		let $table = $(
				`<table id="${this.id}-table" border="1">
					<thead>
						<tr>
							<th>日</th>
							<th colspan="6">朝</th>
							<th colspan="6">昼</th>
							<th colspan="6">夜</th>
							<th colspan="6">未明</th>
							<th>備考</th>
						</tr>
					</thead>
				</table>`);
		let $tbody = $('<tbody></tbody>');
		for(var i = 0; i < io.github.shunshun94.trpg.scenarioTools.ViceCityCheck.Calendar.CONSTS.SUPPORTED_DAY; i++) {
			let $dayTr = $(`<tr 
						id="${this.id}-table-day-tr-${i}"
						class="${this.id}-table-day-tr">
							<th>${i+1}</th>
						</tr>`);
			for(var j = 0; j < io.github.shunshun94.trpg.scenarioTools.ViceCityCheck.Calendar.CONSTS.HOURS; j++) {
				$dayTr.append(`<td
					class="${this.tdClass}"
					id="${this.tdClass}-${j+i*24}"
					title="${i+1}日目 ${(j+6 < 24 ? j+6 : j-18) }時">未</td>`);
			}
			if(i === 25) {
				$dayTr.append(`<td>VC p.30参照</td>`);
			} else {
				$dayTr.append(`<td></td>`);
			}
			$tbody.append($dayTr);
		}
		$table.append($tbody);
		this.$dom.append($table);
	}
};
io.github.shunshun94.trpg.scenarioTools.ViceCityCheck.Calendar.CONSTS = {
	SUPPORTED_DAY: 30,
	HOURS: 24
};

io.github.shunshun94.trpg.scenarioTools.ViceCityCheck.RndEvents = class {
	
};

io.github.shunshun94.trpg.scenarioTools.ViceCityCheck.Trump30Table = class {
	
};

io.github.shunshun94.trpg.scenarioTools.ViceCityCheck.Missions = class {
	
};

io.github.shunshun94.trpg.scenarioTools.ViceCityCheck.Counters = class {
	
};
