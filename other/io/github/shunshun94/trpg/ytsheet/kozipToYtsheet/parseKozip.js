const parse = (xml) => {
    const json = xmlToJson(xml).character.character;
    const spec = json.detail['能力'];
    const info = json.detail['魔物知識'];
    const resource = json.detail['リソース'];
    const result = {
        description: spec['説明']?.text,
        disposition: info['反応']?.text,
        gameVersion: '2.5',
        habitat: info['生息地']?.text,
        initiative: info['先制値']?.text,
        intellect: info['知能']?.text,
        language: info['言語']?.text,
        lv: spec['レベル']?.text,
        mndResist: info['精神抵抗力']?.text,
        mndResistFix: Number(info['精神抵抗力']?.text || 0) + 7,
        mobility: info['移動速度']?.text,
        monsterName: json.common?.name?.text,
        partsNum: (resource.HP) ? '1' : Object.keys(resource).length,
        perception: info['知覚']?.text,
        reputation: info['知名度']?.text.split(/[\/／]/)[0],
        'reputation+': info['知名度']?.text.split(/[\/／]/)[1],
        statusNum: (resource.HP) ? '1' : Object.keys(resource).length,
        taxa: info['分類']?.text,
        type: 'm',
        vitResist: info['生命抵抗力']?.text,
        vitResistFix: Number(info['生命抵抗力']?.text || 0) + 7,
        weakness: info['弱点']?.text
    };
    
    if(resource.HP) {
            result[`status1Accuracy`] = spec[`命中力`]?.text;
            result[`status1AccuracyFix`] = Number(spec[`命中力`]?.text) ? Number(spec[`命中力`]?.text) + 7 : '' ;
            result[`status1Damage`] = spec[`打撃点`]?.text;
            result[`status1Defense`] = resource[`防護点`]?.text;
            result[`status1Evasion`] = spec[`回避力`]?.text;
            result[`status1EvasionFix`] = Number(spec[`回避力`]?.text) ? Number(spec[`回避力`]?.text) + 7 : '' ;
            result[`status1Hp`] = resource[`HP`]?.text;
            result[`status1Mp`] = resource[`MP`]?.text;
            result[`status1Style`] = `${spec[`攻撃方法`]?.text}`;
            result.skills = spec[`特殊能力`]?.text;
    } else {
        const skills = [];
        Object.keys(resource).forEach((partsName, index) => {
            const parameterKey = `status${index + 1}`;
            result[`${parameterKey}Accuracy`] = spec[partsName][`命中力(${partsName})`]?.text;
            result[`${parameterKey}AccuracyFix`] = Number(spec[partsName][`命中力(${partsName})`]?.text) ? Number(spec[partsName][`命中力(${partsName})`]?.text) + 7 : '' ;
            result[`${parameterKey}Damage`] = spec[partsName][`打撃点(${partsName})`]?.text;
            result[`${parameterKey}Defense`] = resource[partsName][`防護点(${partsName})`]?.text;
            result[`${parameterKey}Evasion`] = spec[partsName][`回避力(${partsName})`]?.text;
            result[`${parameterKey}EvasionFix`] = Number(spec[partsName][`回避力(${partsName})`]?.text) ? Number(spec[partsName][`回避力(${partsName})`]?.text) + 7 : '' ;
            result[`${parameterKey}Hp`] = resource[partsName][`HP(${partsName})`]?.text;
            result[`${parameterKey}Mp`] = resource[partsName][`MP(${partsName})`]?.text;
            result[`${parameterKey}Style`] = `${spec[partsName][`攻撃方法(${partsName})`]?.text}(${partsName})`;
            skills.push(spec[partsName][`特殊能力(${partsName})`]?.text);
        });
        result.skills = skills.join('\n\n');
    }

    

    return result;
};

const getName = (xml) => {
    if(xml.nodeType !== 1) {
        return null;
    }
    for (let attr of xml.attributes) {
        if (attr.nodeName === 'name') {
            return attr.nodeValue.split(/\s/)[0];
        }
    }
    return null;
};

const xmlToJson = (xml) => {
  let obj = {};

  if (xml.nodeType === 1) { // 要素ノード
    if (xml.attributes.length > 0) {
      for (let attr of xml.attributes) {
        if(attr.nodeName != 'name') {
            obj[attr.nodeName] = attr.nodeValue;
        }
      }
    }
  } else if (xml.nodeType === 3) { // テキストノード
    return xml.nodeValue.trim();
  }

  // 子ノードを再帰処理
  if (xml.hasChildNodes()) {
    for (let child of xml.childNodes) {
      const nodeName = getName(child) || child.nodeName.replace(/^#/, '');
      const value = xmlToJson(child);
      if (value !== "") {
        if (!obj[nodeName]) {
          obj[nodeName] = value;
        } else {
          if (!Array.isArray(obj[nodeName])) {
            obj[nodeName] = [obj[nodeName]];
          }
          obj[nodeName].push(value);
        }
      }
    }
  }
  return obj;
}
