var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.OpenCampaignCalendar = io.github.shunshun94.trpg.OpenCampaignCalendar || {};

io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS = io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS || {};
io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.ONEDAY = 1000 * 60 * 60 * 24;
io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.DEFAULT_MODE = 'RAXIA_LIFE_3RD';
io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.COMMON_START_DATE = {
    RAXIA_LIFE_3RD: new Date('2025/11/01'),
    RAXIA_LIFE_NEO: new Date('2024/12/01'),
};
io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.WORLD_HEADER = {
    RAXIA_LIFE_3RD: 'アルコイリス時間',
    RAXIA_LIFE_NEO: 'アクシア時間',
};
io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.TODAY = (new Date()).toLocaleDateString('jp-JP');

/**
 * 月の先頭の日付を取得します
 * @param {Date} date 
 * @returns 与えた日の月の1日の0時0分0秒
 */
io.github.shunshun94.trpg.OpenCampaignCalendar.getMonthFirstDay = (date = new Date()) => {
	return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * 月の末尾の日付を取得します
 * @param {Date} date 
 * @returns 与えた日の月の翌月の1日の0時0分0秒の1ミリ秒前
 */
io.github.shunshun94.trpg.OpenCampaignCalendar.getMonthLastDay = (date = new Date()) => {
	return new Date(Number(new Date(date.getFullYear(), date.getMonth() + 1, 1)) - 1);
};

/**
 * 
 * @param {Date}} date 
 * @returns 与えた日の月の翌月の1日の0時0分0秒
 */
io.github.shunshun94.trpg.OpenCampaignCalendar.getNextMonthFirstDay = (date = new Date()) => {
	return new Date(Number(new Date(date.getFullYear(), date.getMonth() + 1, 1)));
};

/**
 * 指定した日数を加算した日付を返します
 * @param {Date} date 
 * @param {Integer} days 
 * @returns date の days 日後の Date
 */
io.github.shunshun94.trpg.OpenCampaignCalendar.addDays = (date, days) => {
	return new Date( Number(date) + (io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.ONEDAY * days) );
};

/**
 * 2つの日付について何ヶ月の差分があるか計算します。端数は切り捨てられます
 * @param {Date} from 
 * @param {Date} end 
 * @returns {Integer} end が from から何ヶ月経過した
 */
io.github.shunshun94.trpg.OpenCampaignCalendar.diffMonth = (from, end) => {
    const endRealYear  = end.getFullYear();
    const endRealMonth = end.getMonth();

    const fromRealYear  = from.getFullYear();
    const fromRealMonth = from.getMonth();

    const years = endRealYear - fromRealYear;
    return years * 12 + endRealMonth - fromRealMonth;
};

/**
 * 日付を YYYY/MM/DD 形式に変換する
 * @param {Date} date 
 * @returns YYYY/MM/DD 形式の日付
 */
io.github.shunshun94.trpg.OpenCampaignCalendar.toJapaneseDate = (date) => {
    return date.toLocaleDateString('jp-JP');
};

/**
 * 引数で与えた日が属している月の長さを計算します
 * @param {Date} date 
 * @returns date の月の長さ
 */
io.github.shunshun94.trpg.OpenCampaignCalendar.getMonthLength = (date) => {
    return (Number(io.github.shunshun94.trpg.OpenCampaignCalendar.getMonthLastDay(date)) - Number(io.github.shunshun94.trpg.OpenCampaignCalendar.getMonthFirstDay(date)) + 1) / (1000 * 60 * 60 * 24)
};

/**
 * 月を与えると季節を表す文字列を返却する
 * @param {Integer} month 月を表す数字。Januaryから順番に1からカウントする
 * @returns 3～5月は spring、6～8月は summar、9～11月は autumn、12～2月は winter を返す
 */
io.github.shunshun94.trpg.OpenCampaignCalendar.getSeason = (month) => {
    if( 3 <= month && month <= 5 ) {
        return 'spring';
    }
    if( 6 <= month && month <= 8 ) {
        return 'summer';
    }
    if( 9 <= month && month <= 11 ) {
        return 'autumn';
    }
    return 'winter';
};

/**
 * カレンダーに付与する追加のテキストを生成する
 * @param {*} raxiaDate ラクシア時間のオブジェクト。year, month, day の値を持つ
 * @param {*} mode モード。RAXIA_LIFE_3RD や RAXIA_LIFE_NEO を指定する
 * @returns 
 */
io.github.shunshun94.trpg.OpenCampaignCalendar.generateAdditinalText = (raxiaDate, mode) => {
    if (mode === 'RAXIA_LIFE_NEO') {
        return ` （アルフレイム新歴${raxiaDate.year + 322}年 / ラーヤ歴${String(raxiaDate.year + 5).padStart(2, '0')}年）`;
    }
    return '';
};

/**
 * ラクシア時間で第二引数日だけ時計を進めた値を返却する
 * @param {Object} raxiaDate ラクシア時間のオブジェクト。year, month, day の値を持つ
 * @param {Integer} days day を何日進めるのか
 * @returns 進めた後のラクシア時間のオブジェクト
 */
io.github.shunshun94.trpg.OpenCampaignCalendar.proceedRaxiaTime = (raxiaDate, days, mode) => {
    raxiaDate.day   += days;
    raxiaDate.month += Math.floor(raxiaDate.day         / 30);
    raxiaDate.day    =           (raxiaDate.day         % 30) || 30;
    raxiaDate.year  += Math.floor((raxiaDate.month - 1) / 12);
    raxiaDate.month  =           (raxiaDate.month       % 12) || 12;
    raxiaDate.text   = `${raxiaDate.year}年目　${String(raxiaDate.month).padStart(2, '0')}/${String(Math.ceil(raxiaDate.day)).padStart(2, '0')}${io.github.shunshun94.trpg.OpenCampaignCalendar.generateAdditinalText(raxiaDate, mode)}`;
    raxiaDate.simpleText = `${String(raxiaDate.month).padStart(2, '0')}${String(Math.ceil(raxiaDate.day)).padStart(2, '0')}`;
    raxiaDate.season = io.github.shunshun94.trpg.OpenCampaignCalendar.getSeason(raxiaDate.month);
    raxiaDate.delta = days;
    return raxiaDate;
};

/**
 * 私達の世界の日付とラクシアの日付の対照表を配列で生成します
 * @param {Date} displayFrom 表示の基準日となる日付を代入します。未指定の場合今日の日付が使われます
 * @param {Object} params fromRealDateおよびendRealDateが利用できます。fromRealDateはキャンペーン開始時の日付を、endRealDateは月末ないし月末までの10日以内の場合は翌月末の日が指定されます
 * @returns {Array} 私達の世界の日付とラクシアの日付の対照表の配列
 */
io.github.shunshun94.trpg.OpenCampaignCalendar.getDateArray = (params = {}) => {
    const mode  = params.mode || io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.DEFAULT_MODE;
    const fromRealDate = params.fromRealDate || io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.COMMON_START_DATE[mode];
    const displayFrom =  params.displayFrom || io.github.shunshun94.trpg.OpenCampaignCalendar.getMonthFirstDay(new Date());
    const endRealDate =  params.endRealDate || io.github.shunshun94.trpg.OpenCampaignCalendar.getMonthLastDay(io.github.shunshun94.trpg.OpenCampaignCalendar.addDays((params.displayFrom || new Date()), 20));

    const spentMonth = io.github.shunshun94.trpg.OpenCampaignCalendar.diffMonth(fromRealDate, displayFrom);
    let raxiaDate = {
        year:  Math.floor((4 + spentMonth * 6) / 12) + 1,
        month:            (4 + spentMonth * 6) % 12 || 12,
        day:   1,
    };
    raxiaDate = io.github.shunshun94.trpg.OpenCampaignCalendar.proceedRaxiaTime(raxiaDate, 0, mode);

    let cursor = displayFrom;
    const sentinel = Number(endRealDate);
    const result = [];

    while(Number(cursor) < sentinel) {
        const nextMonth = Number(io.github.shunshun94.trpg.OpenCampaignCalendar.getNextMonthFirstDay(cursor));
        const dayCount = io.github.shunshun94.trpg.OpenCampaignCalendar.getMonthLength(cursor);
        const delta = 180 / dayCount;
        while(Number(cursor) < nextMonth) {
            const realDay = cursor.toLocaleDateString('jp-JP')
            result.push({
                real: realDay,
                isToday: realDay === io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.TODAY ? 'today' : 'not-today',
                raxia: raxiaDate.text,
                season: raxiaDate.season,
                simpleText: raxiaDate.simpleText,
                delta: delta
            });
            cursor = io.github.shunshun94.trpg.OpenCampaignCalendar.addDays(cursor, 1);
            raxiaDate = io.github.shunshun94.trpg.OpenCampaignCalendar.proceedRaxiaTime(raxiaDate, delta, mode);
        }
        cursor = new Date(nextMonth);
    }
    const specialDays = io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS[mode]?.SPECIAL_DAYS || [];
    return result.map((d, i, array)=>{
        const start = d;
        const end = array[i + 1] || io.github.shunshun94.trpg.OpenCampaignCalendar.proceedRaxiaTime({
            year: 0, month: Number(d.raxia.split('　')[1].split('/')[0]), day: Number(d.raxia.split('　')[1].split('/')[1]),
        }, d.delta, mode);
        console.log(start, end);
        const targetSpecialDay = specialDays.filter((sd)=>{
            if (start.simpleText < end.simpleText) {
                return (start.simpleText <= sd.key) && (sd.key < end.simpleText);
            } else {
                // 年末年始をまたいでいる場合
                return (start.simpleText <= sd.key) && (sd.key < '1301') || ('0000' <= sd.key) && (sd.key < end.simpleText);
            }
        });
        d.specialDays = targetSpecialDay;
        return d;
    });
};

/**
 * 私達の世界のカレンダーとラクシアのカレンダーの対照表を作成します
 * @param {Array} rawDateArray getDateArray メソッドの結果です。代入しない場合引数無しで実行した結果を利用します
 * @returns {HTMLTableElement} html のエレメントのオブジェクトが返却されます
 */
io.github.shunshun94.trpg.OpenCampaignCalendar.generateHtml = (
    dateArray = io.github.shunshun94.trpg.OpenCampaignCalendar.getDateArray(),
    mode = io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.DEFAULT_MODE) => {
    console.log(dateArray);
    const generateElement = (tagName, attributes) => {
        const result = document.createElement(tagName);
        for(var key in attributes) { result[key] = attributes[key]; }
        return result;
    };
    const table = document.createElement('table');
    table.setAttribute('border', '1');
    const header = document.createElement('tr');
    header.append(generateElement('th', {textContent: '現実世界時間'}));
    header.append(generateElement('th', {textContent: io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.WORLD_HEADER[mode]}));
    header.append(generateElement('th', {textContent: 'イベント'}))
    table.append(header);
    dateArray.forEach((d)=>{
        const tr = document.createElement('tr');
        tr.append(generateElement('td', {textContent: d.real,  className: d.isToday}));
        tr.append(generateElement('td', {textContent: d.raxia, className: d.season }));
        tr.append(generateElement('td', {
            textContent: d.specialDays.map((sd)=>{return sd.list.map((event)=>{return event.name;}).join(', ')}).join(', '),
            className: 'event-cell'
        }));
        table.append(tr);
    });
    return table;
};
