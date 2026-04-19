var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
/**
 * XML を JSON に変換する関数
 * @param {XMLDocument} xml 
 * @returns パースされた XML に基づいて生成された JSON オブジェクト
 * @description XML を JSON に変換する関数。要素ノードの属性は "@attributes" プロパティに格納され、テキストノードはそのまま値として返される。子ノードは再帰的に処理され、同名のノードが複数存在する場合は配列として格納される。
 */
io.github.shunshun94.util.xmlToJson = (xml) => {
    let obj = {};

    if (xml.nodeType === 1) { // 要素ノード
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let attr of xml.attributes) {
                obj["@attributes"][attr.nodeName] = attr.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) { // テキストノード
        return xml.nodeValue.trim();
    }

    // 子ノードを再帰処理
    if (xml.hasChildNodes()) {
        for (let child of xml.childNodes) {
            const nodeName = child.nodeName;
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
