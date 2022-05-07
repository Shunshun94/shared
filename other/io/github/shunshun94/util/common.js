var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};

/** 
 * target が undefined ないし null の場合に Error を throw します
 * @param {Object} target 対象となる Object
 * @param {String} opt_desc
 */
io.github.shunshun94.util.rejectEmpty = (target, opt_desc) => {
	var desc = opt_desc ? opt_desc : 'Inputed variable is ';
	if(typeof target === 'undefined'){
		throw new Error(desc + ' (undefined)');
	}
	if(target === null){
		throw new Error(desc + ' (null)');
	}
};

/**
 * URL の Query 部分を取得する関数です
 * @param {String} opt_query Query
 * @return {Map.<String, String>}
 */
io.github.shunshun94.util.getQueries = (opt_query) => {
	const query = opt_query ? opt_query : location.search.substring(1);
	var result = new Map();
	query.split('&').forEach((param) => {
        const pair = param.split('=');
        result.set(pair[0], pair.slice(1).join('='));
	});
	return result;
};

/**
 * クエリの値に基づいて html の input / textarea に値を挿入します
 * @returns 値が挿入された input / textarea
 */
io.github.shunshun94.util.setValuesFromQueries = () => {
	const queries = io.github.shunshun94.util.getQueries();
    const doms = [];
    queries.forEach((value, key)=>{
		const elementById = document.getElementById(key);
		if(elementById) {
			elementById.value = value.replace(/\\n/gm, '\n');
            doms.push(elementById);
		}
		const elementsByClass = document.getElementsByClassName(key);
        Array.from(elementsByClass).forEach((dom)=>{
            doms.push(dom);
            dom.value = value.replace(/\\n/gm, '\n');
        });
    });
    return doms;
};

/** 
  * ランダムな文字列を作成する関数です
  * @param {Number} opt_length 生成される文字列の長さです。接頭語・接尾語の長さは含まれません
  * @param {String} opt_prefix 返り値の先頭に付く接頭語です
  * @param {String} opt_suffix 返り値の先頭に付く接尾語です
  * @return {String}
  */
io.github.shunshun94.util.rndString = (opt_length, opt_prefix, opt_suffix) => {
	var length = opt_length || 8;
	var prefix = opt_prefix || '';
	var suffix = opt_suffix || '';
	
	var randomString = '';
	var baseString ='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for(var i=0; i<length; i++) {
		randomString += baseString.charAt( Math.floor( Math.random() * baseString.length) );
	}
	return `${prefix}${randomString}${suffix}`;
};

/**
 * LocalStorage に map 形式の値が入っている場合に、特定のキーの値だけ更新します
 * @param {String} storageId LocalStorage の Storage Id
 * @param {String} key LocalStorage のキーで引いてくる map のキー
 * @param {*} value 更新後の値
 * @returns LocalStorage の Storage Id で引いてきた更新後の値の全体
 */
io.github.shunshun94.util.updateLocalStorage = (storageId, key, value) => {
	var data = JSON.parse(localStorage.getItem(storageId) || '{}');
	data[key] = value;
	localStorage.setItem(storageId, JSON.stringify(data));
	return data;
};

/**
 * LocalStorage に map 形式の値が入っている場合に、特定のキーの値だけ取得します
 * @param {String} storageId 
 * @param {String} key 
 * @returns LocalStorage の Storage Id で引いてきた map の指定した key の値
 */
io.github.shunshun94.util.getLocalStorage = (storageId, key) => {
	var data = JSON.parse(localStorage.getItem(storageId) || '{}');
	return data[key];
};

/**
 * 2つの配列を引数として受け、1つの配列にします
 * io.github.shunshun94.util.mergeArray([1,2,3,4,5], [6,7,8,9,10], (a,b)=>{return a+b;});
 * // => [7, 9, 11, 13, 15]
 * @param {Array} arrayA 元になる配列の1つ
 * @param {Array} arrayB 元になる配列の1つ
 * @param {Function} func 双方の配列の値に対して行う処理
 * @return {Array} func の処理を受けた後の配列
 */
io.github.shunshun94.util.mergeArray = (arrayA, arrayB, func) => {
	if(arrayA.length !== arrayB.length){
		throw new Error('arguments of margeArray are not same length.');
	}
	return arrayA.map((aValue, i)=>{
        return func(aValue, arrayB[i], arrayA, arrayB, i);
    });
};

/**
 * 配列の値を分類した map を作成します
 * JSON.stringify(io.github.shunshun94.util.mapToObject(io.github.shunshun94.util.groupArray([1,2,3,4,5,6,7,8,9,10], (val) => {return val % 3;})));
 * // => {"0":[3,6,9],"1":[1,4,7,10],"2":[2,5,8]}
 * @param {Array} array 分類する配列
 * @param {Function} groupBy 分類するための値を返す関数
 * @returns 分類後の map
 */
io.github.shunshun94.util.groupArray = (array, groupBy) => {
	var result = new Map();
    array.forEach((value, i)=>{
        const groupId = groupBy(value, i, array);
        if(result.has(groupId)) {
            result.get(groupId).push(value);
        } else {
            result.set(groupId, [value]);
        }
    });
	return result;
};

/**
 * オブジェクトを JavaScript の Map に変換します
 * @param {Object} map 
 * @returns 変換後の Map
 */
io.github.shunshun94.util.objectToMap = (map) => {
    const result = new Map();
    for(var key in map) {
        result.set(key, map[key]);
    }
    return result;
};

/**
 * JavaScript の Map をオブジェクトに変換します
 * @param {Map} map 
 * @returns {Object}
 */
io.github.shunshun94.util.mapToObject = (map) => {
    const result = {};
    map.forEach((value, key)=>{
        result[key] = value;
    });
    return result;
};

/**
 * map から特定の値だけ取り除きます
 * @param {Map} map 
 * @param {Function} func 
 * @returns 
 */
io.github.shunshun94.util.filterMap = (map, func) => {
	var result = new Map();
    map.forEach((value, key)=>{
        if(func(value, key, map)) {
            result.set(key, value);
        }
    });
	return result;
};

/**
 * map のオブジェクト全てに対して処理を行います
 * @param {Map} map 
 * @param {Function} func 
 * @returns 全ての値に対して処理を実施した後の Map
 */
io.github.shunshun94.util.mapMap = (map, func) => {
	var result = new Map();
    map.forEach((value, key)=>{
        result.set(key, func(value, key, map));
    });
	return result;
};

/**
 * 第一引数をそのまま返却します
 * @param {*} param 
 * @returns 
 */
io.github.shunshun94.util.returnMe = (param) => {return param;};

/**
 * Map の Value を Array に詰め直します
 * io.github.shunshun94.util.mapToArray(io.github.shunshun94.util.objectToMap({a:0, b:4, c:53}))
 * // => [0, 4, 53]
 * 
 * io.github.shunshun94.util.mapToArray(io.github.shunshun94.util.objectToMap({a:0, b:4, c:53}), (value, key)=>{
 *     return {key: key, value: value} 
 * });
 * // => [{"key":"a","value":0},{"key":"b","value":4},{"key":"c","value":53}]
 * @param {Map} map 
 * @param {Function} func 
 * @returns 
 */
io.github.shunshun94.util.mapToArray = (map, func=io.github.shunshun94.util.returnMe) => {
    const result = [];
    map.forEach((value, key)=>{result.push(func(value, key, map));});
    return result;
};

/**
 * 数値が最大の物を返却します。
 * io.github.shunshun94.util.max([{name:'a', num:2}, {name:'b', num:7}, {name:'c', num:3}], (item)=>{return item.num});
 * // => {name:'b', num:7}
 * 
 * io.github.shunshun94.util.max([2, 7, 3]);
 * // => 7
 * @param {Array.<*|Number>} array 最大の値をとる候補の配列
 * @param {Function} opt_func 比較したい値を取り出す関数
 * @returns {*|Number}
 */
io.github.shunshun94.util.max = (array, opt_func) => {
    if(opt_func) {
        const sorted = array.map((d, i) => {
            return {
                id: i,
                value: opt_func(d)
            };
        }).sort((a,b) => {
            return b.value - a.value;
        });
        return array[sorted[0].id];
    } else {
        return Math.max.apply(null, array);
    }
};

/**
 * 数値が最小の物を返却します。
 * io.github.shunshun94.util.max([{name:'a', num:2}, {name:'b', num:7}, {name:'c', num:3}], (item)=>{return item.num});
 * // => {name:'a', num:2}
 * 
 * io.github.shunshun94.util.max([2, 7, 3]);
 * // => 2
 * @param {Array.<*|Number>} array 最大の値をとる候補の配列
 * @param {Function} opt_func 比較したい値を取り出す関数
 * @returns {*|Number}
 */
io.github.shunshun94.util.min = (array, opt_func) => {
    if(opt_func) {
        const sorted = array.map((d, i) => {
            return {
                id: i,
                value: opt_func(d)
            };
        }).sort((a,b) => {
            return a.value - b.value;
        });
        return array[sorted[0].id];
    } else {
        return Math.min.apply(null, array);
    }
};

/**
 * 10進数の数字を16進数のカラーコードに変換します
 * io.github.shunshun94.util.intToColor(16711680);
 * // => #ff0000
 * @param {Number} int 16進数6桁で表現されるカラーコードを10進数のnumberで書いたもの
 * @returns {String} #RRGGBB の形で表現されるカラーコード
 */
io.github.shunshun94.util.intToColor = (int) => {
	if(int == -1){
		return "transparent";
	}
	return "#" + Number(int).toString(16).padStart(6, '0');
};

/**
 * 基準となる日の前後指定した期間の月頭の日を Number 形式で返します
 * @param {Date} base 基準となる日
 * @param {Number} before 前何ヶ月分について出力するか
 * @param {Number} after 後何ヶ月分について出力するか
 * @returns {Array.<Number>}
 */
io.github.shunshun94.util.listMonthBeforeAfter = (base = new Date(), before = 12, after = before) => {
	var target = base;
	var result = [];
	target.setMonth((base).getMonth() - (before + 1));
	for(var i = 0; i < (before + after + 1); i++) {
		target.setMonth(target.getMonth() + 1);
		result.push(Number(new Date(target.getFullYear(), target.getMonth(), 1)));
	}
	return result;
};

/**
 * 数字にカンマを挿入して返却する。 1234567 -> 1,234,567
 * @param {Number} num カンマを挿入したい数字
 * @param {String} opt_separator カンマ以外のものを桁の区切りに使いたい場合に指定する。与えなければカンマ
 * @param {String} opt_decimalPoint ピリオド以外のものを桁の区切りに使いたい場合に指定する。与えなければピリオド
 * @returns {String} カンマが挿入された数字の文字列
 */
io.github.shunshun94.util.insertCommaToNum = (num, separator = ',', decimalPoint = '.') => {
	const strs = String(num).split('.');
	let result = '';

	if(num < 0) {
		const chars = strs[0].split("").reverse();
		const length = chars.length - 1;
		result = chars.map((d, i)=>{
			if(i && i%3===0 && i!==length) {
				return `${d}${separator}`;
			}
				return d;
			}).reverse().join('');
	} else {
		result =  strs[0].split("").reverse().map((d, i) => {
			if(i && i%3===0) {
				return `${d}${separator}`;
			}
				return d;
			}).reverse().join('');
	}

	if(strs.length === 2) {
		const length = strs[1].length - 1;
		return `${result}${decimalPoint}` + strs[1].split("").map((d, i) => {
			if(i && i%3 === 2 && i !== length) {
				return `${d}${separator}`;
			}
				return d;
			}).join('');
	} else {
		return result;
	}
};

/**
 * ファイルをダウンロードさせます
 * @param {String} title ファイルのタイトル
 * @param {String} content ファイルの内容
 */
io.github.shunshun94.util.downloadFile = (title, content) => {
	const url = window.URL.createObjectURL(new Blob([ content ], { "type" : 'text/plain;charset=utf-8;' }));
	const a = document.createElement("a");
	document.body.appendChild(a);
	a.download = title;
	a.href = url;
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
};

/**
 * 引数に与えた内容をクリップボードにコピーさせます
 * @param {String} text 
 * @returns {Promise}
 */
io.github.shunshun94.util.insertToClipboard = (text) => {
    return navigator.clipboard.writeText(text);  
};

/**
 * クリップボードの中身を取得します
 * @returns {String}
 */
io.github.shunshun94.util.getFromClipboard = async () => {
    const text = await navigator.clipboard.readText();
    return text;
};

/**
 * wait します。 async と await を使わないと利用できないので注意
 * @param {Number} msec 待ち時間。ミリ秒で入れること。例えば5秒待たせたいなら5000
 * @returns Promise
 */
io.github.shunshun94.util.wait = (msec) => {
	return new Promise((resolve) => {
		setTimeout(() => {resolve(msec)}, msec);
	});
};
