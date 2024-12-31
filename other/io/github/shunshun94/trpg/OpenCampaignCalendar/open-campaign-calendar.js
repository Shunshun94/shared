var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.OpenCampaignCalendar = io.github.shunshun94.trpg.OpenCampaignCalendar || {};

io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS = io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS || {};
io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.ONEDAY = 1000 * 60 * 60 * 24;
io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.COMMON_START_DATE = new Date('2024/12/1');

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
 * ラクシア時間で第二引数日だけ時計を進めた値を返却する
 * @param {Object} raxiaDate ラクシア時間のオブジェクト。year, month, day の値を持つ
 * @param {Integer} days day を何日進めるのか
 * @returns 進めた後のラクシア時間のオブジェクト
 */
io.github.shunshun94.trpg.OpenCampaignCalendar.proceedRaxiaTime = (raxiaDate, days) => {
    raxiaDate.day   += days;
    raxiaDate.month += Math.floor(raxiaDate.day         / 30);
    raxiaDate.day    =           (raxiaDate.day         % 30) || 30;
    raxiaDate.year  += Math.floor((raxiaDate.month - 1) / 12);
    raxiaDate.month  =           (raxiaDate.month       % 12) || 12;
    raxiaDate.text = `${raxiaDate.year}/${raxiaDate.month}/${Math.ceil(raxiaDate.day)}/`;
    return raxiaDate;
};

/**
 * 私達の世界の日付とラクシアの日付の対照表を配列で生成します
 * @param {Date} displayFrom 表示の基準日となる日付を代入します。未指定の場合今日の日付が使われます
 * @param {Object} params fromRealDateおよびendRealDateが利用できます。fromRealDateはキャンペーン開始時の日付を、endRealDateは月末ないし月末までの10日以内の場合は翌月末の日が指定されます
 * @returns {Array} 私達の世界の日付とラクシアの日付の対照表の配列
 */
io.github.shunshun94.trpg.OpenCampaignCalendar.getDateArray = (tempDisplayFrom = new Date(), params = {}) => {
    const fromRealDate = params.fromRealDate || io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.COMMON_START_DATE;
    const endRealDate = params.endRealDate || io.github.shunshun94.trpg.OpenCampaignCalendar.getMonthLastDay(io.github.shunshun94.trpg.OpenCampaignCalendar.addDays(tempDisplayFrom, 20));
    const displayFrom = io.github.shunshun94.trpg.OpenCampaignCalendar.getMonthFirstDay(tempDisplayFrom);

    const spentMonth = io.github.shunshun94.trpg.OpenCampaignCalendar.diffMonth(fromRealDate, displayFrom);
    let raxiaDate = {
        year:  Math.floor((4 + spentMonth * 6) / 12) + 1,
        month:            (4 + spentMonth * 6) % 12 || 12,
        day:   1,
    };
    raxiaDate = io.github.shunshun94.trpg.OpenCampaignCalendar.proceedRaxiaTime(raxiaDate, 0);

    let cursor = displayFrom;
    const sentinel = Number(endRealDate);
    const result = [];

    while(Number(cursor) < sentinel) {
        const nextMonth = Number(io.github.shunshun94.trpg.OpenCampaignCalendar.getNextMonthFirstDay(cursor));
        const dayCount = io.github.shunshun94.trpg.OpenCampaignCalendar.getMonthLength(cursor);
        const delta = 180 / dayCount;
        while(Number(cursor) < nextMonth) {
            result.push({
                real: cursor.toLocaleDateString('jp-JP'),
                raxia: raxiaDate.text
            })
            cursor = io.github.shunshun94.trpg.OpenCampaignCalendar.addDays(cursor, 1);
            raxiaDate = io.github.shunshun94.trpg.OpenCampaignCalendar.proceedRaxiaTime(raxiaDate, delta);
        }
        cursor = new Date(nextMonth);
    }
    return result;
};

/**
 * 私達の世界のカレンダーとラクシアのカレンダーの対照表を作成します
 * @param {Array} dateArray getDateArray メソッドの結果です。代入しない場合引数無しで実行した結果を利用します
 * @returns {HTMLTableElement} html のエレメントのオブジェクトが返却されます
 */
io.github.shunshun94.trpg.OpenCampaignCalendar.generateHtml = (dateArray = io.github.shunshun94.trpg.OpenCampaignCalendar.getDateArray()) => {
    const table = document.createElement('table');
    table.setAttribute('border', '1');
    const header = document.createElement('tr');
    const realHeader = document.createElement('th');
    realHeader.textContent = '現実世界時間';
    header.append(realHeader);
    const raxiaHeader = document.createElement('th');
    raxiaHeader.textContent = 'ラクシア時間';
    header.append(raxiaHeader);
    table.append(header);
    dateArray.forEach((d)=>{
        const tr = document.createElement('tr');
        const real = document.createElement('td');
        real.textContent = d.real;
        tr.append(real);
        const raxia = document.createElement('td');
        raxia.textContent = d.raxia;
        tr.append(raxia);
        table.append(tr);
    });
    return table;
};



