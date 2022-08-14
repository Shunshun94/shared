var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.ytsheet = io.github.shunshun94.trpg.sw2.ytsheet || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.BATTLE_SKILLS = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.BATTLE_SKILLS || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.BATTLE_SKILLS.TIMING = {
    '準': '△',
    '常': '○',
    '主': '＞',
    '補': '≫',
    '宣': '🗨'
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
        const magic = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getMagicInfo(json);
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
        return '≫異貌&lt;br&gt;使用持の打撃点は+1点されます';
      } else {
        return '≫異貌&lt;br&gt;使用持の打撃点は+1点され、命中力判定に+1のボーナス修正を受け、さらに魔力に+1のボーナス修正を受けます';
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
  "吸精": {},
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
  "輝く肉体": {},
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