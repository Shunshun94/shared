var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.SW2_PCLister = io.github.shunshun94.trpg.SW2_PCLister || {};

io.github.shunshun94.trpg.SW2_PCLister.getUrl = (url) => {
    return new Promise((resolve, reject)=>{
        $.ajax({
            type:'get',
            url: url,
            async:true,
            dataType:'jsonp'
        }).done(resolve);
    });
};

io.github.shunshun94.trpg.SW2_PCLister.isVampireBlood = (url) => {
    return url.startsWith('https://charasheet.vampire-blood.net/');
};

io.github.shunshun94.trpg.SW2_PCLister.getGuiUrl = (url) => {
    if(io.github.shunshun94.trpg.SW2_PCLister.isVampireBlood(url)) {
        return /https:\/\/charasheet.vampire-blood.net\/[a-fm0-9]+/.exec(url)[0];
    } else {
        return url;
    }
};

io.github.shunshun94.trpg.SW2_PCLister.getJsonpUrl = (url) => {
    if(io.github.shunshun94.trpg.SW2_PCLister.isVampireBlood(url)) {
        const validatedUrl = /https:\/\/charasheet.vampire-blood.net\/[a-fm0-9]+/.exec(url)[0];
        return `${validatedUrl}.js`;
    } else {
        return `${url}&mode=json`;
    }
};

io.github.shunshun94.trpg.SW2_PCLister.getSheetGetter = (url, data) => {
    if(io.github.shunshun94.trpg.SW2_PCLister.isVampireBlood(url)) {
        return io.github.shunshun94.trpg.SW2_PCLister.getVampireBlood;
    }
    if(data.type === 'm') {
        return io.github.shunshun94.trpg.SW2_PCLister.getYtSheetEnemy;
    } else {
        return io.github.shunshun94.trpg.SW2_PCLister.getYtSheetPC;
    }
};

io.github.shunshun94.trpg.SW2_PCLister.getSheet = (url) => {
    return new Promise((resolve, reject)=>{
        const jsonpUrl = io.github.shunshun94.trpg.SW2_PCLister.getJsonpUrl(url);
        io.github.shunshun94.trpg.SW2_PCLister.getUrl(jsonpUrl).then((data)=>{
            const sheetGetter = io.github.shunshun94.trpg.SW2_PCLister.getSheetGetter(url, data);
            resolve(sheetGetter(data).map((character)=>{
                character.url = io.github.shunshun94.trpg.SW2_PCLister.getGuiUrl(url);
                return character;
            }));
        });
    });
};

io.github.shunshun94.trpg.SW2_PCLister.getVampireBlood = (data) => {
    const result = {
        name:              data.pc_name,
        hp:         Number(data.HP             ),
        mp:         Number(data.MP             ),
        life:       Number(data.life_resist    ),
        mental:     Number(data.mental_resist  ),
        dodge:      Number(data.kaihi          ),
        guard:      Number(data.bougo          ),
        enemy:      Number(data.mamono_sikibetu),
        initiative: Number(data.sensei         ),
        type:       'c'
    };
    if(data.arms_hit) {
        result.hit  = Math.max.apply(null, data.arms_hit.map((d)=>{return Number(d)}));
        result.rate = Math.max.apply(null, data.arms_iryoku.map((d)=>{return Number(d)}));
        result.damage=Math.max.apply(null, data.arms_damage.map((d)=>{return Number(d)}));
    } else {
        result.hit = 0;
    }
    result.magic =   Math.max.apply(null, [5,6,7,8,9,17].map((n)=>{return Number(data[`maryoku${n}`]);}));
    return [result];
};

io.github.shunshun94.trpg.SW2_PCLister.getYtSheetEnemy = (data) => {
    const count = Number(data.statusNum) + 1;
    const result = [];
    const name = data.monsterName;

    const magicList = [...data.skills.matchAll(/魔力(\d+)/gm)];
    const magic = magicList.length ? Math.max.apply(null, magicList.map((m)=>{
        return Number(m[1]);
    })) : 0;

    const numberSuffix = ( (data.mount) && ( Number(data.lv) - Number(data.lvMin) ) ) ? `-${Number(data.lv) - Number(data.lvMin) + 1}` : '';
    for(let i = 1; i < count; i++) {
        const parts = {
            name:       `${name}: ${data[`status${i}Style`]}`,
            hp:         Number(data[`status${i}${numberSuffix}Hp`]      ) || 0,
            mp:         Number(data[`status${i}${numberSuffix}Mp`]      ) || 0,
            life:       Number(data.vitResist                           ) || Number(data[`status${i}${numberSuffix}Vit`]) || 0,
            mental:     Number(data.mndResist                           ) || Number(data[`status${i}${numberSuffix}Mnd`]) || 0,
            dodge:      Number(data[`status${i}${numberSuffix}Evasion`] ) || 0,
            hit:        Number(data[`status${i}${numberSuffix}Accuracy`]) || 0,
            magic:      magic,
            guard:      Number(data[`status${i}${numberSuffix}Defense`] ) || 0,
            enemy:      Number(data.reputation                          ) || 0,
            initiative: Number(data.initiative                          ) || 0,
            rate:       20,
            type:       'm'
        };
        const damageRegExpResult = /2d6?([+-]\d+)/.exec(data[`status${i}${numberSuffix}Damage`]);
        if(damageRegExpResult) {
            parts.damage = Number(damageRegExpResult[1] - 2);
        } else {
            parts.damage = -2;
        }
        result.push(parts);
    }
    return result;
};

io.github.shunshun94.trpg.SW2_PCLister.getYtSheetPC = (data) => {
    const result = {
        name:              data.characterName,
        hp:         Number(data.hpTotal           ),
        mp:         Number(data.mpTotal           ),
        life:       Number(data.vitResistTotal    ),
        mental:     Number(data.mndResistTotal    ),
        dodge:      Number(data.defenseTotal1Eva  ),
        guard:      Number(data.defenseTotal1Def  ),
        enemy:      Number(data.monsterLore       ),
        initiative: Number(data.initiative        ),
        type:       'c'
    };
    const weaponsHit = Array(Number(data.weaponNum)).fill().map((dummy, i)=>{return Number(data[`weapon${i + 1}AccTotal`]);});
    const weaponsRate = Array(Number(data.weaponNum)).fill().map((dummy, i)=>{return Number(data[`weapon${i + 1}Rate`]);});
    const weaponsDamage = Array(Number(data.weaponNum)).fill().map((dummy, i)=>{return Number(data[`weapon${i + 1}DmgTotal`]);});
    result.hit    = Math.max.apply(null, weaponsHit);
    result.rate   = Math.max.apply(null, weaponsRate);
    result.damage = Math.max.apply(null, weaponsDamage);

    const magicsCast = ['Sor', 'Con', 'Pri', 'Mag', 'Fai', 'Dem', 'Dru'].map((name)=>{
        return Number(data[`magicPower${name}`]) + Number(data[`magicCastAdd${name}`] || 0);
    });
    result.magic =   Math.max.apply(null, magicsCast);
    return [result];
};

