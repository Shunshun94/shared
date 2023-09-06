/**
 * skillConsts.js の io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.RACE_LANGUAGE.LIST を生成する
 * rl.pl の結果を使う
 */

const convertToRACE_LANGUAGE_LIST = (object) => {
    const result = {};
    for(var raceName in object) {
        const race = object[raceName];
        if(race.variant) {
            const baseLanguage = race.language ? race.language.filter((lang)=>{return lang[1];}).map((lang)=>{return lang[0];}) : false;
            const hasCommonRace = race.ability;
            if(hasCommonRace) {
                result[raceName] = {language: baseLanguage || race.language.filter((lang)=>{return lang[1];}).map((lang)=>{return lang[0];})}
            }
            for(var category in race.variant) {
                result[ `${raceName}（${category}）` ] = {
                    language: baseLanguage || race.variant[category].language.filter((lang)=>{return lang[1];}).map((lang)=>{return lang[0];})
                };
            }
        } else {
            result[raceName] = {language: race.language.filter((lang)=>{return lang[1];}).map((lang)=>{return lang[0];})};
        }
    }
    return result;
};

