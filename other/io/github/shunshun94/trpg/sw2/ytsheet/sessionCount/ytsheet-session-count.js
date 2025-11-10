
var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.ytsheet = io.github.shunshun94.trpg.sw2.ytsheet || {};
io.github.shunshun94.trpg.sw2.ytsheet.countSession = io.github.shunshun94.trpg.sw2.ytsheet.countSession || {};

io.github.shunshun94.trpg.sw2.ytsheet.countSession.prizeToCode = (prize)=>{
    const resultArray = [];
    for(var key in prize) {
        resultArray.push(`${key}=${prize[key]}`);
    }
    return resultArray.join(' / ');
};

io.github.shunshun94.trpg.sw2.ytsheet.countSession.countSession = (json, algorithm='RaxiaLife3rd') => {
    let result = 0;
    const max = Number(json.historyNum) + 1;
    for(var sessionCount = 1; sessionCount < max; sessionCount++) {
        if(io.github.shunshun94.trpg.sw2.ytsheet.countSession.isSessionAsPlayer[algorithm](json, sessionCount)){ result++; }
    }
    return result;
}

io.github.shunshun94.trpg.sw2.ytsheet.countSession.isSessionAsPlayer = io.github.shunshun94.trpg.sw2.ytsheet.countSession.isSessionAsPlayer || {};

io.github.shunshun94.trpg.sw2.ytsheet.countSession.isSessionAsPlayer.isGmEqualPlayer = (json, gm) => {
    if( gm === '' ) { return false; } // GM名が空欄の場合はGM回とはしない
    return ['自分', '私'].includes(gm) || gm.includes(json.playerName) || json.playerName.includes(gm)
};

io.github.shunshun94.trpg.sw2.ytsheet.countSession.isSessionAsPlayer.RaxiaLife3rd = (json, idx) => {
    const exp   = json[`history${idx}Exp`]   || '';
    const money = json[`history${idx}Money`] || '';
    const gm    = json[`history${idx}Gm`]    || '';

    // 自分が GM の場合はカウントしない
    if( io.github.shunshun94.trpg.sw2.ytsheet.countSession.isSessionAsPlayer.isGmEqualPlayer(json, gm) ) {
        return false;
    }

    // 報酬が両方とも空または 0 の場合はカウントしない(GM回と思われる)
    if((exp === '' || exp === '0') && (money === '' || money === '0')) {
        return false;
    }

    // 経験点のみが設定されている場合はカウントしない(ピンゾロ経験値の集計行と思われる)
    if(exp && (money === '' || money === '0') && (gm === '')) {
        return false;
    }
    return true;
};

io.github.shunshun94.trpg.sw2.ytsheet.countSession.isSessionAsPlayer.RaxiaLifeNeo = (json, idx) => {
    const exp   = json[`history${idx}Exp`]   || '';
    const money = json[`history${idx}Money`] || '';
    const gm    = json[`history${idx}Gm`]    || '';
    const code = io.github.shunshun94.trpg.sw2.ytsheet.countSession.prizeToCode({ exp: exp, money: money});

    if( gm === '' || io.github.shunshun94.trpg.sw2.ytsheet.countSession.isSessionAsPlayer.isGmEqualPlayer(json, gm) ) {
        return false;
    }

    if(io.github.shunshun94.trpg.sw2.ytsheet.countSession.CONSTS.RaxiaLifeNeo.prisePairs.includes(code)) {
        return false;
    }

    if((exp === '' || exp === '0') &&
       (money === '' || money === '0')) {
        return false;
    }

    return true;
};

io.github.shunshun94.trpg.sw2.ytsheet.countSession.CONSTS = io.github.shunshun94.trpg.sw2.ytsheet.countSession.CONSTS || {};
io.github.shunshun94.trpg.sw2.ytsheet.countSession.CONSTS.RaxiaLifeNeo = io.github.shunshun94.trpg.sw2.ytsheet.countSession.CONSTS.RaxiaLifeNeo || {};
io.github.shunshun94.trpg.sw2.ytsheet.countSession.CONSTS.RaxiaLifeNeo.prisePairs = [
    {exp:  250, money:   500},
    {exp:  660, money:  1320},
    {exp: 1080, money:  2160},
    {exp: 1750, money:  3500},
    {exp: 2750, money:  5500},
    {exp: 3330, money:  6660},
    {exp: 5000, money: 10000}
].map(io.github.shunshun94.trpg.sw2.ytsheet.countSession.prizeToCode);
