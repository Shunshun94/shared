var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.ytsheet = io.github.shunshun94.trpg.sw2.ytsheet || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS || {};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.MAX_LEVEL = 17;

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.CRITICAL_COEFFCIENTS = {
  7: 36/15,
  8: 36/21,
  9: 36/26,
  10: 36/30,
  11: 36/33,
  12: 36/35,
  13: 1
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.BATTLE_SKILLS = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.BATTLE_SKILLS || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.BATTLE_SKILLS.TIMING = {
    '準': '△',
    '常': '○',
    '主': '＞',
    '補': '≫',
    '宣': '🗨'
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.FAIRY_ELEMENTS = {
  Earth: '土', Water: '水・氷', Fire:'炎', Wind:'風', Light:'光', Dark:'闇'
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.MAGIC_SUFFIX = {
  'Sor': {name:'真語魔法'},
  'Con': {name:'操霊魔法'},
  'Pri': {name:'神聖魔法'},
  'Mag': {name:'魔動機術'},
  'Fai': {name:'妖精魔法', secondLine: (json)=>{
      const list = [];
      for(var key in io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.FAIRY_ELEMENTS) {
          if(json[`fairyContract${key}`]) {
              list.push(`「${io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.FAIRY_ELEMENTS[key]}」`);
          }
      }
      return `使用する属性は${list.join('')}です。`;
  }},
  'Dem': {name:'召異魔法'},
  'Dru': {name:'森羅魔法'},
  'Gri': {name:'秘奥魔法', skill:'magicGramarye'}
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.NOMAGIC_SUFFIX = {
  'Enh': {name:'練技', skill:'craftEnhance',    mark:'▶≫△'},
  'Alc': {name:'賦術', skill:'craftAlchemy',    mark:'≫△'},
  'Geo': {name:'相域', skill:'craftGeomancy',   mark:'≫'},
  'War': {name:'鼓咆', skill:'craftCommand',    mark:'≫'},
  'Mys': {name:'占瞳', skill:'craftDivination', mark:'▶'}
};

// コボルドの攻撃能力そのまんま
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.DEFAULT_WEAPON = {
  name: 'ナイフ',
  expected: 8,
  acc: 3,
  accTotal: 10
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.BATTLE_SKILLS.FILTER = {
    '投げ': (skills, json)=>{
      const acc = Number(json.bonusDex) + Number(json.lvGra);
      const expected = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.calcExpectedDamage({
        dmgTotal: Number(json.bonusStr) + Number(json.lvGra),
        rate: skills.list.includes('投げ強化Ⅱ') ? 30 : (skills.list.includes('投げ強化Ⅰ') ? 20 : 10),
        crit:12
      });
      return {
        timing: ['主'],
        list: [`投げ攻撃／${acc}（${acc + 7}）／回避力／消滅&lt;br&gt;近接攻撃として対象1体を投げ飛ばします。対象は「2d+${expected - 7}」点の物理ダメージを受け、転倒します。`]
      }
    },
    '2回攻撃':(skills)=>{
      const withoutDoubleAttacksList = skills.list.filter((d)=>{return d !== '2回攻撃'});
      const doubleAttacks = skills.list.filter((d)=>{return d === '2回攻撃'});
      skills.list = [`${doubleAttacks.length + 1}回攻撃`].concat(withoutDoubleAttacksList);
      return skills;
    },
    '複数宣言': (skills)=>{
      skills.list = [skills.list.sort().reverse()[0]];
      return skills;
    },
    '魔法適性': (skills)=>{
      if(skills.list.includes('魔法拡大すべて')) {
        skills.list = skills.list.filter((d)=>{return ! d.startsWith('魔法拡大／')});
      }
      return skills;
    }
};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.BATTLE_SKILLS.LIST = {
    "足さばき": {
      timing: "常"
    },
    "追い打ち": {
      timing: "常"
    },
    "ガーディアンⅠ": {
      timing: "常",
      group: 'かばう'
    },
    "ガーディアンⅡ": {
      timing: "常",
      group: 'かばう'
    },
    "かいくぐり": {
      timing: "常",
      skip: true
    },
    "回避行動Ⅰ": {
      timing: "常",
      skip: true
    },
    "回避行動Ⅱ": {
      timing: "常",
      skip: true
    },
    "頑強": {
      timing: "常",
      skip: true
    },
    "キャパシティ": {
      timing: "常",
      skip: true
    },
    "鼓咆陣率追加Ⅰ": {
      timing: "常",
      skip: true
    },
    "鼓咆陣率追加Ⅱ": {
      timing: "常",
      skip: true
    },
    "鼓咆陣率追加Ⅲ": {
      timing: "常",
      skip: true
    },
    "射手の体術": {
      timing: "常",
      skip: true
    },
    "終律増強": {
      timing: "常",
      group: '呪歌'
    },
    "呪歌追加Ⅰ": {
      timing: "常",
      skip: true
    },
    "呪歌追加Ⅱ": {
      timing: "常",
      skip: true
    },
    "呪歌追加Ⅲ": {
      timing: "常",
      skip: true
    },
    "スローイングⅠ": {
      timing: "常",
      group: '射撃'
    },
    "スローイングⅡ": {
      timing: "常",
      group: '射撃'
    },
    "双撃": {
      timing: "常",
      group: '2回攻撃'
    },
    "相克の標的": {
      timing: "常"
    },
    "相克の別離": {
      timing: "常"
    },
    "ターゲッティング": {
      timing: "常",
      group: '射撃'
    },
    "鷹の目": {
      timing: "常",
      group: '射撃'
    },
    "超頑強": {
      timing: "常",
      skip: true
    },
    "抵抗強化Ⅰ": {
      timing: "常",
      skip: true
    },
    "抵抗強化Ⅱ": {
      timing: "常",
      skip: true
    },
    "特殊楽器習熟": {
      timing: "常",
      skip: true
    },
    "跳び蹴り": {
      timing: "常"
    },
    "投げ強化Ⅰ": {
      timing: "常",
      group: '投げ'
    },
    "投げ強化Ⅱ": {
      timing: "常",
      group: '投げ'
    },
    "二刀流": {
      timing: "常",
      skip: true
    },
    "二刀無双": {
      timing: "常",
      skip: true
    },
    "ハーモニー": {
      timing: "常",
      group: '呪歌'
    },
    "武器習熟Ａ／ソード": {
      timing: "常",
      skip: true
    },
    "武器習熟Ａ／アックス": {
      timing: "常",
      skip: true
    },
    "武器習熟Ａ／スピア": {
      timing: "常",
      skip: true
    },
    "武器習熟Ａ／メイス": {
      timing: "常",
      skip: true
    },
    "武器習熟Ａ／スタッフ": {
      timing: "常",
      skip: true
    },
    "武器習熟Ａ／フレイル": {
      timing: "常",
      skip: true
    },
    "武器習熟Ａ／ウォーハンマー": {
      timing: "常",
      skip: true
    },
    "武器習熟Ａ／絡み": {
      timing: "常",
      skip: true
    },
    "武器習熟Ａ／格闘": {
      timing: "常",
      skip: true
    },
    "武器習熟Ａ／投擲": {
      timing: "常",
      skip: true
    },
    "武器習熟Ａ／ボウ": {
      timing: "常",
      skip: true
    },
    "武器習熟Ａ／クロスボウ": {
      timing: "常",
      skip: true
    },
    "武器習熟Ａ／ブロウガン": {
      timing: "常",
      skip: true
    },
    "武器習熟Ａ／ガン": {
      timing: "常",
      skip: true
    },
    "武器習熟Ｓ／ソード": {
      timing: "常",
      skip: true
    },
    "武器習熟Ｓ／アックス": {
      timing: "常",
      skip: true
    },
    "武器習熟Ｓ／スピア": {
      timing: "常",
      skip: true
    },
    "武器習熟Ｓ／メイス": {
      timing: "常",
      skip: true
    },
    "武器習熟Ｓ／スタッフ": {
      timing: "常",
      skip: true
    },
    "武器習熟Ｓ／フレイル": {
      timing: "常",
      skip: true
    },
    "武器習熟Ｓ／ウォーハンマー": {
      timing: "常",
      skip: true
    },
    "武器習熟Ｓ／絡み": {
      timing: "常",
      skip: true
    },
    "武器習熟Ｓ／格闘": {
      timing: "常",
      skip: true
    },
    "武器習熟Ｓ／投擲": {
      timing: "常",
      skip: true
    },
    "武器習熟Ｓ／ボウ": {
      timing: "常",
      skip: true
    },
    "武器習熟Ｓ／クロスボウ": {
      timing: "常",
      skip: true
    },
    "武器習熟Ｓ／ブロウガン": {
      timing: "常",
      skip: true
    },
    "武器習熟Ｓ／ガン": {
      timing: "常",
      skip: true
    },
    "武器の達人": {
      timing: "常",
      skip: true
    },
    "賦術強化Ⅰ": {
      timing: "常",
      skip: true
    },
    "賦術強化Ⅱ": {
      timing: "常",
      skip: true
    },
    "賦術全遠隔化": {
      timing: "常",
      group: '賦術'
    },
    "踏みつけ": {
      timing: "常"
    },
    "ブロッキング": {
      timing: "常",
      group: 'かばう'
    },
    "変幻自在Ⅰ": {
      timing: "常",
      group: '複数宣言',
      replace: '複数宣言＝2回'
    },
    "変幻自在Ⅱ": {
      timing: "常",
      group: '複数宣言',
      replace: '複数宣言＝3回'
    },
    "防具習熟Ａ／金属鎧": {
      timing: "常",
      skip: true
    },
    "防具習熟Ａ／非金属鎧": {
      timing: "常",
      skip: true
    },
    "防具習熟Ａ／盾": {
      timing: "常",
      skip: true
    },
    "防具習熟Ｓ／金属鎧": {
      timing: "常",
      skip: true
    },
    "防具習熟Ｓ／非金属鎧": {
      timing: "常",
      skip: true
    },
    "防具習熟Ｓ／盾": {
      timing: "常",
      skip: true
    },
    "防具の達人": {
      timing: "常",
      skip: true
    },
    "魔晶石の達人": {
      timing: "常",
      skip: true
    },
    "魔法拡大の達人": {
      timing: "常",
      group: '魔法適性'
    },
    "マリオネット": {
      timing: "常",
      group: '魔法適性'
    },
    "魔力強化Ⅰ": {
      timing: "常",
      skip: true
    },
    "魔力強化Ⅱ": {
      timing: "常",
      skip: true
    },
    "命中強化Ⅰ": {
      timing: "常",
      skip: true
    },
    "命中強化Ⅱ": {
      timing: "常",
      skip: true
    },
    "両手利き": {
      timing: "主",
      group: '2回攻撃',
      replace: '2回攻撃'
    },
    "連続賦術": {
      timing: "常"
    },
    "練体の極意": {
      timing: "常"
    },
    "ＭＰ軽減／ソーサラー": {
      timing: "常",
      group: '魔法適性'
    },
    "ＭＰ軽減／コンジャラー": {
      timing: "常",
      group: '魔法適性'
    },
    "ＭＰ軽減／プリースト": {
      timing: "常",
      group: '魔法適性'
    },
    "ＭＰ軽減／マギテック": {
      timing: "常",
      group: '魔法適性'
    },
    "ＭＰ軽減／フェアリーテイマー": {
      timing: "常",
      group: '魔法適性'
    },
    "ＭＰ軽減／ドルイド": {
      timing: "常",
      group: '魔法適性'
    },
    "ＭＰ軽減／デーモンルーラー": {
      timing: "常",
      group: '魔法適性'
    },
    "ＭＰ軽減／ウィザード": {
      timing: "常",
      group: '魔法適性'
    },
    "ＭＰ軽減／グリモワール": {
      timing: "常",
      group: '魔法適性'
    },
    "自己占瞳": {
      timing: "常"
    },
    "占瞳操作": {
      timing: "常"
    },
    "代償軽減Ⅰ": {
      timing: "常"
    },
    "代償軽減Ⅱ": {
      timing: "常"
    },
    "代償半減": {
      timing: "常"
    },
    "魔導書習熟Ａ": {
      timing: "常",
      skip: true
    },
    "魔導書習熟Ｓ": {
      timing: "常",
      skip: true
    },
    "魔導書の達人": {
      timing: "常",
      skip: true
    },
    "魔器習熟Ａ": {
      timing: "常",
      skip: true
    },
    "魔器習熟Ｓ": {
      timing: "常",
      skip: true
    },
    "魔器の達人": {
      timing: "常",
      skip: true
    },
    "切り払い": {
      timing: "常"
    },
    "無尽の盾": {
      timing: "常"
    },
    "ファントムカウンター": {
      timing: "常"
    },
    "急所狙い": {
      timing: "常"
    },
    "心眼": {
      timing: "常"
    },
    "零距離射撃": {
      timing: "常",
      group: '射撃'
    },
    "インファイトⅠ": {
      timing: "宣"
    },
    "インファイトⅡ": {
      timing: "宣"
    },
    "囮攻撃Ⅰ": {
      timing: "宣"
    },
    "囮攻撃Ⅱ": {
      timing: "宣"
    },
    "カード軽減": {
      timing: "宣",
      group: '賦術'
    },
    "楽素転換": {
      timing: "宣",
      group: '呪歌'
    },
    "影矢": {
      timing: "宣",
      group: '射撃'
    },
    "カニングキャストⅠ": {
      timing: "宣",
      group: '魔法適性'
    },
    "カニングキャストⅡ": {
      timing: "宣",
      group: '魔法適性'
    },
    "かばうⅠ": {
      timing: ["宣", "準"],
      group: 'かばう'
    },
    "かばうⅡ": {
      timing: ["宣", "準"],
      group: 'かばう'
    },
    "斬り返しⅠ": {
      timing: "宣"
    },
    "斬り返しⅡ": {
      timing: "宣"
    },
    "牙折り": {
      timing: "宣"
    },
    "クイックキャスト": {
      timing: "宣",
      group: '魔法適性'
    },
    "クリティカルキャストⅠ": {
      timing: "宣",
      group: '魔法適性'
    },
    "クリティカルキャストⅡ": {
      timing: "宣",
      group: '魔法適性'
    },
    "牽制攻撃Ⅰ": {
      timing: "宣",
      replace: '手早い斬撃&lt;br&gt;命中力判定に+1のボーナス修正を得ます。この能力は、カテゴリ＜金属鎧＞を装備しているキャラクターには効果を持ちません。'
    },
    "牽制攻撃Ⅱ": {
      timing: "宣"
    },
    "牽制攻撃Ⅲ": {
      timing: "宣"
    },
    "高度な柔軟性": {
      timing: "宣"
    },
    "シールドバッシュⅠ": {
      timing: "主",
      replaceFunction: (json) => {
        const acc = Number(json.bonusDex) + Number(json.lvFig || json.lvFen) + 2;
        const expected = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.calcExpectedDamage({
          dmgTotal: Number(json.bonusStr) + Number(json.lvFig || json.lvFen),
          rate:Number(json.shield1Reqd),
          crit:12
        });
        return `シールドバッシュ／${acc}（${acc + 7}）／回避力／消滅&lt;br&gt;近接攻撃として対象1体に盾による打撃を行います。対象は「2d+${expected - 7}」点の物理ダメージを受け、転倒します。`;
      }
    },
    "シールドバッシュⅡ": {
      timing: "主",
      replaceFunction: (json) => {
        const acc = Number(json.bonusDex) + Number(json.lvFig || json.lvFen) + 2;
        const expected = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.calcExpectedDamage({
          dmgTotal: Number(json.bonusStr) + Number(json.lvFig || json.lvFen),
          rate:Number(json.shield1Reqd),
          crit:12
        });
        return `シールドバッシュ／${acc}（${acc + 7}）／回避力／消滅&lt;br&gt;近接攻撃として対象1体に盾による打撃を行います。対象は「2d+${expected - 7}」点の物理ダメージを受け、転倒します。`;
      }
    },
    "シャドウステップⅠ": {
      timing: "宣"
    },
    "シャドウステップⅡ": {
      timing: "宣"
    },
    "シュアパフォーマー": {
      timing: "宣",
      group: '呪歌'
    },
    "スキルフルプレイ": {
      timing: "宣",
      group: '呪歌'
    },
    "捨て身攻撃Ⅰ": {
      timing: "宣"
    },
    "捨て身攻撃Ⅱ": {
      timing: "宣"
    },
    "捨て身攻撃Ⅲ": {
      timing: "宣"
    },
    "先陣の才覚": {
      timing: "準"
    },
    "全力攻撃Ⅰ": {
      timing: "宣"
    },
    "全力攻撃Ⅱ": {
      timing: "宣"
    },
    "全力攻撃Ⅲ": {
      timing: "宣"
    },
    "ダブルキャスト": {
      timing: "宣",
      group: '魔法適性'
    },
    "挑発攻撃Ⅰ": {
      timing: "宣"
    },
    "挑発攻撃Ⅱ": {
      timing: "宣"
    },
    "露払い": {
      timing: "宣"
    },
    "ディフェンススタンス": {
      timing: "宣"
    },
    "テイルスイングⅠ": {
      timing: "宣"
    },
    "テイルスイングⅡ": {
      timing: "宣"
    },
    "薙ぎ払いⅠ": {
      timing: "宣"
    },
    "薙ぎ払いⅡ": {
      timing: "宣"
    },
    "バイオレントキャストⅠ": {
      timing: "宣",
      group: '魔法適性'
    },
    "バイオレントキャストⅡ": {
      timing: "宣",
      group: '魔法適性'
    },
    "必殺攻撃Ⅰ": {
      timing: "宣"
    },
    "必殺攻撃Ⅱ": {
      timing: "宣"
    },
    "必殺攻撃Ⅲ": {
      timing: "宣"
    },
    "魔法拡大／威力確実化": {
      timing: "宣",
      group: '魔法適性'
    },
    "魔法拡大／確実化": {
      timing: "宣",
      group: '魔法適性'
    },
    "魔法拡大／数": {
      timing: "宣",
      group: '魔法適性'
    },
    "魔法拡大／距離": {
      timing: "宣",
      group: '魔法適性'
    },
    "魔法拡大／時間": {
      timing: "宣",
      group: '魔法適性'
    },
    "魔法拡大／範囲": {
      timing: "宣",
      group: '魔法適性'
    },
    "魔法拡大すべて": {
      timing: "宣",
      group: '魔法適性'
    },
    "魔法収束": {
      timing: "宣",
      group: '魔法適性'
    },
    "魔法制御": {
      timing: "宣",
      group: '魔法適性'
    },
    "魔力撃": {
      timing: "宣",
      replaceFunction: (json)=>{
        const getMagicInfo = (json) => {
            const result = {
                max: 0,
                texts: []
            };
            const magicList = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.MAGIC_SUFFIX;
            for(var key in magicList) {
                if(json[`lv${key}`]) {
                    const category = magicList[key];
                    const power = Number(json[`magicPower${key}`]);
                    if( power > result.max) {
                        result.max = power;
                    }
                    if(category.secondLine) {
                        result.texts.push(`▶${category.name}${json[`lv${key}`]}レベル／魔力${power}（${power + 7}）&lt;br&gt;${category.secondLine(json)}`);
                    }else if(category.skill) {
                        let i = 1;
                        const skillList = [];
                        while(json[`${category.skill}${i}`]) {
                            skillList.push(`【${json[`${category.skill}${i}`]}】`);
                            i++;
                        }
                        result.texts.push(`▶${category.name}${json[`lv${key}`]}レベル／魔力${power}（${power + 7}）&lt;br&gt;${skillList.join('')}の${category.name}を使用します。`);
                    } else {
                        result.texts.push(`▶${category.name}${json[`lv${key}`]}レベル／魔力${power}（${power + 7}）`);
                    }
                }
            }
            return result;
        };
        const magic = getMagicInfo(json);
        return `魔力撃＝＋${magic.max}ダメージ`;
      }
    },
    "マルチアクション": {
      timing: "宣",
      group: '魔法適性'
    },
    "鎧貫きⅠ": {
      timing: "宣"
    },
    "鎧貫きⅡ": {
      timing: "宣"
    },
    "鎧貫きⅢ": {
      timing: "宣"
    },
    "乱撃Ⅰ": {
      timing: "宣"
    },
    "乱撃Ⅱ": {
      timing: "宣"
    },
    "双占瞳": {
      timing: "宣"
    },
    "痛撃": {
      timing: "宣"
    },
    "跳躍攻撃": {
      timing: "宣"
    },
    "封印撃": {
      timing: "宣"
    },
    "ヒットアンドアウェイ": {
      timing: "宣"
    },
    "曲射": {
      timing: "宣",
      group: '射撃'
    },
    "デュアルアクション": {
      timing: "宣",
      group: '魔法適性'
    },
    "狙撃": {
      timing: "主",
      group: '射撃'
    },
    "ワードブレイク": {
      timing: "主"
    },

    "タフネス": {
      timing:"常",
      skip: true
    },
    "追加攻撃": {
      timing:"主",
      group: '2回攻撃',
      replace: '2回攻撃'
    },
    "投げ攻撃": {
      timing:"主",
      group: '投げ'
    },
    "カウンター": {
      timing:"常"
    },
    "舞い流し": {
      timing:"常"
    },
    "バトルマスター": {
      timing:"常",
      group: '複数宣言',
      replace: '複数宣言＝2回'
    },
    "ルーンマスター": {
      timing:"常",
      group: '複数宣言',
      replace: '複数宣言＝2回'
    },
    "トレジャーハント": {
      timing:"常",
      skip: true
    },
    "ファストアクション": {timing:"常"},
    "トレジャーマスター": {
      timing:"常",
      skip: true
    },
    "匠の技": {
      timing:"常",
      skip: true
    },
    "影走り": {
      timing:"常"
    },
    "治癒適性": {
      timing:"常"
    },
    "サバイバビリティ": {
      timing:"常"
    },
    "不屈": {
      timing:"常"
    },
    "ポーションマスター": {
      timing:"常"
    },
    "韋駄天": {
      timing:"常"
    },
    "縮地": {
      "timing":"常"
    },
    "ランアンドガン": {
      timing:"常"
    },
    "鋭い目": {
      timing:"常",
      skip: true
    },
    "弱点看破": {
      timing:"常",
      skip: true
    },
    "マナセーブ": {
      timing:"常",
      group: '魔法適性'
    },
    "マナ耐性": {
      timing:"常"
    },
    "賢人の知恵": {
      timing:"常",
      skip: true
    },
    '掠め取り':{
      timing:"常",
      skip: true
    },
    'クルードテイク':{
      timing:"常",
      skip: true
    }
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.RACE_ABILITY = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.RACE_ABILITY || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.RACE_ABILITY.LIST = {
  "剣の加護／運命変転": {},
  "暗視": {skip: true},
  "剣の加護／優しき水": {
    replaceFunction: (json) => {
      const level = Number(json.level);
      if(level < 6) {
        return '○剣の加護／優しき水';
      } else {
        return '○剣の加護／優しき水&lt;br&gt;この能力を位置が同じくする1体にも与えることができます';
      }
    }
  },
  "剣の加護／厳つき氷": {
    replaceFunction: (json) => {
      const level = Number(json.level);
      const major = `＞厳つき氷／必中&lt;br&gt;「射程／形状：2（30m）／起点指定」で「対象1体」に「${level}」点の水・氷属性の確定ダメージを与えます。この効果を使用すると、MPを1点消費します。この効果は1ラウンドに1回だけ使えます。`;
      if(level < 6) {
        return major;
      } else if(level < 11) {
        return [
          major, `≫厳つき氷／必中&lt;br&gt;「射程／形状：2（30m）／起点指定」で「対象1体」に「3」点の水・氷属性の確定ダメージを与えます。この効果を使用すると、MPを1点消費します。この効果は同名の主動作の能力と合わせて1ラウンドに1回だけ使えます。`
        ].join('&lt;br&gt;&lt;br&gt;');
      } else {
        return [
          major, `≫厳つき氷／必中&lt;br&gt;「射程／形状：2（30m）／起点指定」で「対象1体」に「5」点の水・氷属性の確定ダメージを与えます。この効果を使用すると、MPを1点消費します。この効果は同名の主動作の能力と合わせて1ラウンドに1回だけ使えます。`
        ].join('&lt;br&gt;&lt;br&gt;');
      }
    }
  },
  "剣の加護／厳つき氷": {},
  "剣の加護／炎身": {
    replaceFunction: (json) => {
      const level = Number(json.level);
      if(level < 6) {
        return '○剣の加護／炎身';
      } else if(level < 11) {
        return '○剣の加護／炎身&lt;br&gt;この能力を位置が同じくする1体にも与えることができます';
      } else {
        return '○剣の加護／炎身&lt;br&gt;この能力を位置が同じくする1体にも与えることができます。さらに、純エネルギー属性のダメージを被るとき、自動的にその算出ダメージを半減します。純エネルギー属性で「抵抗：半減」の効果を「抵抗：消滅」として受けます。';
      }
    }
  },
  "第六感": {skip: true},
  "HP変換": {
    replaceFunction: (json) => {
      const level = Number(json.level);
      if(level < 6) {
        return '▶HP変換';
      } else if(level < 11) {
        return '△≫HP変換';
      } else {
        return '△≫HP変換&lt;br&gt;1日に2回まで使用できます';
      }
    }
  },
  "異貌": {
    replaceFunction: (json) => {
      const level = Number(json.level);
      if(level < 6) {
        return '≫異貌';
      } else if(level < 11) {
        return '≫異貌&lt;br&gt;使用時の打撃点は+1点されます';
      } else {
        return '≫異貌&lt;br&gt;使用時の打撃点は+1点され、命中力判定に+1のボーナス修正を受け、さらに魔力に+1のボーナス修正を受けます';
      }
    }
  },
  "弱点／土": {},
  "弱点／水・氷": {},
  "弱点／炎": {},
  "弱点／風": {},
  "暗視(獣変貌)": {skip: true},
  "獣変貌": {
    replaceFunction: (json) => {
      const level = Number(json.level);
      if(level < 6) {
        return '▶獣変貌';
      } else if(level < 11) {
        return '△≫獣変貌';
      } else {
        return '△≫獣変貌&lt;br&gt;使用時はさらに回避力判定と先制判定に+1のボーナス修正を受けます';
      }
    }
  },
  "鱗の皮膚": {skip: true},
  "尻尾が武器": {skip: true},
  "剣の加護／風の翼": {},
  "マナ不干渉": {},
  "虫や植物との意思疎通": {skip: true},
  "繁茂する生命": {skip: true},
  "通じ合う意識": {},
  "見えざる手": {skip: true},
  "姿なき職人": {},
  "吸精": {
    replaceFunction: (json) => {
      const level = Number(json.level);
      const mndB = Number(json.bonusMnd);
      const base = mndB+Number(json.sin);
      const suffix = `この効果は1日で${mndB}回までしか行えません。また、MPを持つ「分類：人族（アルヴ以外）」「分類：蛮族」のキャラクターにしか使用できず、効果はありません。`;
      if(level < 6) {
        return `＞吸精／必中&lt;br&gt;「射程／形状：接触／―」で「対象1体」のマナを吸い取り、自らのものとします。対象のMPに「${base}」点の確定ダメージを与え、同時に使用者のMPをその適用ダメージと同じ値だけ回復します。${suffix}`;
      } else if(level < 11) {
        return `＞吸精／必中&lt;br&gt;「射程／形状：1（10m）／起点指定」で「対象1体」のマナを吸い取り、自らのものとします。対象のMPに「${base}」点の確定ダメージを与え、同時に使用者のMPをその適用ダメージと同じ値だけ回復します。${suffix}`;
      } else {
        return `＞吸精／必中&lt;br&gt;「射程／形状：1（10m）／起点指定」で「対象1体」のマナを吸い取り、自らのものとします。対象のMPに「${base+2}」点の確定ダメージを与え、同時に使用者のMPをその適用ダメージと同じ値だけ回復します。${suffix}`;
      }
    }
  },
  "月光の守り": {
    replaceFunction: (json) => {
      const level = Number(json.level);
      if(level < 6) {
        return '';
      } else if(level < 11) {
        return '○月光の守り&lt;br&gt;毒、病気、呪い属性で受ける物理・魔法ダメージを常に3点軽減します';
      } else {
        return '○月光の守り&lt;br&gt;毒、病気、呪い属性で受ける物理・魔法ダメージを常に6点軽減します';
      }
    }
  },
  "輝く肉体": { replace: '≫輝く肉体' },
  "太陽の再生": {skip: true},
  "太陽の子": {},
  "蛮族の身体": {skip: true},
  "未熟な翼": {},
  "切り裂く風": {
    replaceFunction: (json) => {
      const level = Number(json.level);
      const lifeB = Number(json.bonusVit);
      const base = level+lifeB;
      const level1 = `＞切り裂く風1／${base}（${base + 7}）／精神抵抗力／半減&lt;br&gt;「射程／形状：2（30m）／起点指定」で対象1体に「威力10+${base}」点の風属性の魔法ダメージを与えます。使用するとMPを4点消費します。`;
      const level2 = `＞切り裂く風2／${base}（${base + 7}）／精神抵抗力／半減&lt;br&gt;「射程／形状：2（30m）／起点指定」で対象1体に「威力30+${base}」点の風属性の魔法ダメージを与えます。使用するとMPを8点消費します。`;
      const level3 = `＞切り裂く風3／${base}（${base + 7}）／精神抵抗力／半減&lt;br&gt;「射程／形状：2（30m）／起点指定」で対象1体に「威力50+${base}」点の風属性の魔法ダメージを与えます。使用するとMPを12点消費します。`
      if(level < 6) {
        return [level1].join('&lt;br&gt;&lt;br&gt;');
      } else if(level < 11) {
        return [level1, level2].join('&lt;br&gt;&lt;br&gt;');
      } else {
        return [level1, level2, level3].join('&lt;br&gt;&lt;br&gt;');
      }
    }
  },
  "水中適性": {},
  "甲殻の手": {skip: true},
  "石化の視線": {
    replaceFunction: (json) => {
      const level = Number(json.level);
      const mindB = Number(json.bonusMnd);
      const base = level+mindB;
      return `≫石化の視線／${base}（${base + 7}）／精神抵抗力／消滅&lt;br&gt;「射程／形状：2（30m）／起点指定」で対象1体に石化進行（『Ⅱ』368項／『ML』65項）。使用するとMPを5点消費します。`;
    }
  },
  "毒の血液": {},
  "剛力": {skip: true},
  "巨人化": {
    replaceFunction: (json) => {
      const level = Number(json.level);
      if(level < 11) {
        return `＞巨人化&lt;br&gt;巨人化し、巨人形態となります。巨人形態になると回避力判定に-1のペナルティ修正を受けますが、打撃点とHPの現在値・最大値が12点上昇します。および生命抵抗力判定に+2のボーナス修正を受けます。`;
      } else {
        return `△≫巨人化&lt;br&gt;巨人化し、巨人形態となります。巨人形態になると回避力判定に-1のペナルティ修正を受けますが、打撃点とHPの現在値・最大値が12点上昇します。および生命抵抗力判定に+2のボーナス修正を受けます。`;
      }
    }
  },
  "奈落の落とし子": {skip: true},
  "奈落の身体／アビストランク": {skip: true},
  "奈落の身体／アビスアーム": {
    modifyStatus: (json) => {
      const level = Number(json.level);
      return {status1Damage: (level < 6) ? '+2' : ((level < 11) ? '+3' : '+4')};
    },
    replaceFunction: ()=>{return '';}
  },
  "奈落の身体／アビスアイ": {
    modifyStatus: (json) => {
      const level = Number(json.level);
      return {
        status1Accuracy:    (level < 6) ? 2 : 1,
        status1AccuracyFix: (level < 6) ? 2 : 1

      };
    },
    replaceFunction: ()=>{return '';}
  },
  "水・氷耐性": {},
  "バブルフォーム": {},
  "妖精の加護": {},
  "浮遊": {},
  "魂の輝き": {},
  "鉱石の生命": {},
  "晶石の身体": {skip: true},
  "魔法の申し子": {},
  "デジャヴ": {skip: true},
  "猫変化": {},
  "獣性の発露": {},
  "戦乙女の光羽": {},
  "戦乙女の祝福": {},
  "刻まれし聖印": {skip: true},
  "神の恩寵": {skip: true},
  "神の御名と共に": {},
  "神の兵士": {},
  "神への礼賛": {},
  "神の庇護": {},
  "神への祈り": {},
  "剣の加護／水の申し子": {},
  "カリスマ": {},
  "痛みに弱い": {},
  "溢れるマナ": {skip: true},
  "マナの手": {},
  "造られし強さ": {},
  "鋼鉄の翼": {},
  "契約の絆": {},
  "黒炎の遣い手": {},
  "魔剣の所持": {skip: true},
  "飛行（飛翔）": {
    replace: `○飛行（飛翔）&lt;br&gt;近接攻撃における命中力・回避力判定に+1のボーナス修正を得ます`
  },
  "竜化": {},
  "限定竜化": {},
  "邪視と瞳石": {},
  "猛毒の血液": {},
  "魔物化": {},
  "水中活動": {},
  "無呼吸活動": {},
  "仲間との連携": {
    replace: `○仲間との連携&lt;br&gt;※能力に合わせて編集してください`
  },
  "敵への憤怒": {
    replace: `○敵への憤怒&lt;br&gt;※能力に合わせて編集してください`
  },
  "半馬半人": {skip: true},
  "馬人の武術": {skip: true},
  "弱体化": {},
  "トロールの体躯": {skip: true},
  "限定再生": {},
  "ラミアの身体": {skip: true},
  "ラミアの吸血": {},
  "変化": {},
  "獣人の力": {},
  "獣化": {},
  "種の限界": {skip: true},
  "軽視": {},
  "小さな匠": {skip: true},
  "吸血の祝福": {},
  "忌むべき血": {},
  "炎無効": {},
  "バルカンの宝石": {skip: true},
  "強制召喚": {}
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.RACE_LANGUAGE = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.RACE_LANGUAGE || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.RACE_LANGUAGE.LIST = {
  "ソレイユ": {
    "language": [
      "交易共通語",
      "ソレイユ語"
    ]
  },
  "フィー": {
    "language": [
      "交易共通語",
      "妖精語"
    ]
  },
  "センティアン（イグニス）": {
    "language": []
  },
  "ラルヴァ": {
    "language": [
      "交易共通語"
    ]
  },
  "ドレイク（ナイト）": {
    "language": [
      "交易共通語",
      "汎用蛮族語",
      "ドレイク語"
    ]
  },
  "バルカン": {
    "language": [
      "汎用蛮族語",
      "バルカン語"
    ]
  },
  "ドワーフ": {
    "language": [
      "交易共通語",
      "ドワーフ語"
    ]
  },
  "ミアキス": {
    "language": [
      "交易共通語",
      "ミアキス語"
    ]
  },
  "アルヴ": {
    "language": [
      "交易共通語"
    ]
  },
  "ウィークリング（タンノズ）": {
    "language": [
      "交易共通語",
      "汎用蛮族語"
    ]
  },
  "ウィークリング（バジリスク）": {
    "language": [
      "交易共通語",
      "汎用蛮族語"
    ]
  },
  "ウィークリング（ミノタウロス）": {
    "language": [
      "交易共通語",
      "汎用蛮族語"
    ]
  },
  "ウィークリング（ガルーダ）": {
    "language": [
      "交易共通語",
      "汎用蛮族語"
    ]
  },
  "ウィークリング（マーマン）": {
    "language": [
      "交易共通語",
      "汎用蛮族語"
    ]
  },
  "ドレイク（ブロークン）": {
    "language": [
      "交易共通語",
      "汎用蛮族語",
      "ドレイク語"
    ]
  },
  "ライカンスロープ": {
    "language": [
      "交易共通語",
      "汎用蛮族語",
      "ライカンスロープ語"
    ]
  },
  "バジリスク": {
    "language": [
      "交易共通語",
      "汎用蛮族語",
      "バジリスク語",
      "ドレイク語",
      "妖魔語"
    ]
  },
  "リザードマン": {
    "language": [
      "汎用蛮族語",
      "リザードマン語",
      "ドラゴン語"
    ]
  },
  "エルフ": {
    "language": [
      "交易共通語",
      "エルフ語"
    ]
  },
  "エルフ（スノウエルフ）": {
    "language": [
      "交易共通語",
      "エルフ語"
    ]
  },
  "エルフ（ミストエルフ）": {
    "language": [
      "交易共通語",
      "エルフ語"
    ]
  },
  "フロウライト": {
    "language": [
      "交易共通語"
    ]
  },
  "アビスボーン": {
    "language": [
      "交易共通語"
    ]
  },
  "ナイトメア（ドワーフ）": {
    "language": [
      "交易共通語",
      "ドワーフ語"
    ]
  },
  "ナイトメア（リルドラケン）": {
    "language": [
      "交易共通語",
      "ドラゴン語"
    ]
  },
  "ナイトメア（ソレイユ）": {
    "language": [
      "交易共通語",
      "ソレイユ語"
    ]
  },
  "ナイトメア（エルフ）": {
    "language": [
      "交易共通語",
      "エルフ語"
    ]
  },
  "ナイトメア（シャドウ）": {
    "language": [
      "交易共通語",
      "シャドウ語"
    ]
  },
  "ナイトメア（人間）": {
    "language": [
      "交易共通語"
    ]
  },
  "グラスランナー": {
    "language": [
      "交易共通語",
      "グラスランナー語"
    ]
  },
  "グラスランナー（アリーシャ）": {
    "language": [
      "交易共通語",
      "グラスランナー語"
    ]
  },
  "グラスランナー（クリメノス）": {
    "language": [
      "交易共通語",
      "グラスランナー語"
    ]
  },
  "ダークドワーフ": {
    "language": [
      "交易共通語",
      "ドワーフ語",
      "汎用蛮族語"
    ]
  },
  "ルーンフォーク": {
    "language": [
      "交易共通語",
      "魔動機文明語"
    ]
  },
  "ルーンフォーク（護衛型ルーンフォーク）": {
    "language": [
      "交易共通語",
      "魔動機文明語"
    ]
  },
  "ルーンフォーク（戦闘型ルーンフォーク）": {
    "language": [
      "交易共通語",
      "魔動機文明語"
    ]
  },
  "ケンタウロス": {
    "language": [
      "汎用蛮族語",
      "ケンタウロス語"
    ]
  },
  "ハイマン": {
    "language": [
      "交易共通語",
      "魔法文明語"
    ]
  },
  "ノーブルエルフ": {
    "language": [
      "エルフ語",
      "魔法文明語"
    ]
  },
  "シャドウ": {
    "language": [
      "交易共通語",
      "シャドウ語"
    ]
  },
  "レプラカーン": {
    "language": [
      "交易共通語",
      "魔動機文明語"
    ]
  },
  "レプラカーン（放浪種レプラカーン）": {
    "language": [
      "交易共通語",
      "魔動機文明語"
    ]
  },
  "レプラカーン（探索種レプラカーン）": {
    "language": [
      "交易共通語",
      "魔動機文明語"
    ]
  },
  "メリア": {
    "language": [
      "交易共通語",
      "妖精語"
    ]
  },
  "メリア（ファンギーメリア）": {
    "language": [
      "交易共通語",
      "妖精語"
    ]
  },
  "メリア（カーニバラスメリア）": {
    "language": [
      "交易共通語",
      "妖精語"
    ]
  },
  "ティエンス": {
    "language": [
      "交易共通語",
      "魔神語"
    ]
  },
  "ティエンス（ティエンス魔解種）": {
    "language": [
      "交易共通語",
      "魔神語"
    ]
  },
  "ティエンス（ティエンス機解種）": {
    "language": [
      "交易共通語",
      "魔神語"
    ]
  },
  "マナフレア": {
    "language": [
      "魔法文明語"
    ]
  },
  "スプリガン": {
    "language": [
      "交易共通語",
      "魔法文明語",
      "巨人語"
    ]
  },
  "ヴァルキリー": {
    "language": [
      "交易共通語"
    ]
  },
  "ラミア": {
    "language": [
      "交易共通語",
      "汎用蛮族語",
      "ドレイク語"
    ]
  },
  "リルドラケン": {
    "language": [
      "交易共通語",
      "ドラゴン語"
    ]
  },
  "リルドラケン（小翼種リルドラケン）": {
    "language": [
      "交易共通語",
      "ドラゴン語"
    ]
  },
  "リルドラケン（有毛種リルドラケン）": {
    "language": [
      "交易共通語",
      "ドラゴン語"
    ]
  },
  "コボルド": {
    "language": [
      "交易共通語",
      "汎用蛮族語",
      "妖魔語"
    ]
  },
  "センティアン（カルディア）": {
    "language": []
  },
  "リカント": {
    "language": [
      "交易共通語",
      "リカント語"
    ]
  },
  "リカント（小型草食獣リカント）": {
    "language": [
      "交易共通語",
      "リカント語"
    ]
  },
  "リカント（大型草食獣リカント）": {
    "language": [
      "交易共通語",
      "リカント語"
    ]
  },
  "ダークトロール": {
    "language": [
      "汎用蛮族語",
      "巨人語"
    ]
  },
  "人間": {
    "language": [
      "交易共通語"
    ]
  },
  "センティアン（ルミエル）": {
    "language": []
  },
  "魔動天使": {
    "language": [
      "交易共通語",
      "魔動機文明語"
    ]
  },
  "タビット": {
    "language": [
      "交易共通語"
    ]
  },
  "タビット（リパス種タビット）": {
    "language": [
      "交易共通語"
    ]
  },
  "タビット（パイカ種タビット）": {
    "language": [
      "交易共通語"
    ]
  }
};
