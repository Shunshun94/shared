var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.util = com.hiyoko.util || {};

com.hiyoko.util.test = com.hiyoko.util.test || {};

/** 
 * @param {Object} target
 * @param {string} opt_desc
 */
com.hiyoko.util.rejectEmpty = function(target, opt_desc){
	var desc = opt_desc ? opt_desc : 'Inputed variable is ';
	if(typeof target === 'undefined'){
		throw new Error(desc + ' (undefined)');
	}
	if(target === null){
		throw new Error(desc + ' (null)');
	}
};

/**
 * URL の Query 部分を取得する関数 
 * @param {string} opt_query Query。
 * @return {Object.<string, string>}  Query の連想配列
 */
com.hiyoko.util.getQueries = function(opt_query) {
	var query = opt_query ? '?' + opt_query : location.search;
	var params = (query.slice(1)).split('&');
	var paramLength = params.length;
	var result = {};
	for(var i = 0; i < paramLength; i++) {
		var pair = params[i].split('=');
		result[pair[0]] = pair[1];
	}
	return result;
};

com.hiyoko.util.getQueriesV3 = (opt_query) => {
	const query = opt_query ? '?' + opt_query : location.search;
	const params = (query.slice(1)).split('&');
	var result = {};
	params.forEach((param)=>{
		let pair = param.split('=');
		result[pair[0]] = pair.slice(1).join('=');
	});
	return result;
};

com.hiyoko.util.setQueries = ()=>{
	const queries = com.hiyoko.util.getQueries();
	for(var key in queries) {
		const elementById = document.getElementById(key);
		if(elementById) {
			elementById.value = queries[key].replace(/\\n/gm, '\n');
		}
		const elementsByClass = document.getElementsByClassName(key);
		const elementsByClassLength = elementsByClass.length;
		if(elementsByClassLength) {
			for(var i = 0; i < elementsByClassLength; i++) {
				elementsByClass[i].value = queries[key].replace(/\\n/gm, '\n');
			}
		}
	}
};

/** 
  * ランダムな文字列を作成する関数です。
  * @param {number} opt_length 生成される文字列の長さです。接頭語・接尾語の長さは含まれません
  * @param {string} opt_prefix 返り値の先頭に付く接頭語です
  * @param {string} opt_suffix 返り値の先頭に付く接尾語です
  * @return {String}
  */
com.hiyoko.util.rndString = function(opt_length, opt_prefix, opt_suffix){
	var length = opt_length || 8;
	var prefix = opt_prefix || '';
	var suffix = opt_suffix || '';
	
	var randomString = '';
	var baseString ='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for(var i=0; i<length; i++) {
		randomString += baseString.charAt( Math.floor( Math.random() * baseString.length));
	}
	return prefix + randomString + suffix;
};

/**
 * 
 * @param {string} formatString
 * @param {...string} var_args
 * @return {string} Formatted string.
 */
com.hiyoko.util.format = function(formatString, var_args) {
	var doubleBackSlash = com.hiyoko.util.rndString(12, '#', '#');
	var escapedParcentS = com.hiyoko.util.rndString(12, '#', '#');
	formatString = formatString.replace(/\\\\/g, doubleBackSlash).replace(/\\%s/g, escapedParcentS);
	var formatString_splited = formatString.split(/%s/);
	var len = arguments.length < formatString_splited.length ? arguments.length : formatString_splited.length;
	for(var i = 1; i < len; i++) {
		formatString_splited[i - 1] += arguments[i];
	}
	if(arguments.length < formatString_splited.length) {
		for(var i = arguments.length; i < formatString_splited.length; i++) {
			formatString_splited[i - 1] += '%s';
		}
	}
	return formatString_splited.join('').replace(new RegExp(doubleBackSlash, 'g'), '\\').replace(new RegExp(escapedParcentS, 'g'), '%s');
};

/**
 * 
 * @param {string} str
 * @param {number} time
 * @return {string}
 */
com.hiyoko.util.stringTimes = function(str, time){
	var text = '';
	for(var i = 0; i < time; i++){
		text += str;
	}
	return text;
}

com.hiyoko.util.updateLocalStorage = function(storageId, key, value) {
	var data = JSON.parse(localStorage.getItem(storageId) || '{}');
	data[key] = value;
	localStorage.setItem(storageId, JSON.stringify(data));
	return data;
};

com.hiyoko.util.getLocalStorage = function(storageId, key) {
	var data = JSON.parse(localStorage.getItem(storageId) || '{}');
	return data[key];
};

/**
 * @param {Array} arrayA
 * @param {Array} arrayB
 * @param {Function} func
 * @return {Array} 
 */
com.hiyoko.util.mergeArray = function(arrayA, arrayB, func) {
	if(arrayA.length !== arrayB.length){
		throw new Error('arguments of margeArray are not same length.');
	}
	var result = [];
	var length = arrayA.length;
	for(var i = 0; i < length; i++){
		result.push(func(arrayA[i], arrayB[i]));
	}
	return result;
};

com.hiyoko.util.groupArray = function(array, groupBy) {
	var result = {};
	var length = array.length;
	for(var i = 0; i < length; i++) {
		groupId = groupBy(array[i], i, array);
		if(! result[groupId]) {
			result[groupId] = [];
		}
		result[groupId].push(array[i]);
	}
	return result;
}

com.hiyoko.util.forEachMap = function(map, func) {
	for(var key in map) {
		func(map[key], key, map);
	}
};

com.hiyoko.util.filterMap = function(map, func) {
	var result = {};
	for(var key in map) {
		if(func(map[key], key, map)) {
			result[key] = map[key];
		}
	}
	return result;
};

com.hiyoko.util.mapMap = function(map, func) {
	var result = {}
	for(var key in map) {
		result[key] = func(map[key], key, map);
	}
	return result;
};

com.hiyoko.util.max = function(array) {
	return Math.max.apply(null, array);
};

com.hiyoko.util.min = function(array) {
	return Math.min.apply(null, array);
};
com.hiyoko.util.extend = function(superClass, subClass) {
	var list = superClass.prototype;
	for(var key in list) {
		subClass.prototype[key] = list[key];
	}
};

com.hiyoko.util.addStuffRight = function(base, length, opt_char){
	var char = opt_char ? opt_char : " ";
	return com.hiyoko.util.stringTimes(char, length - base.length) + base;
};

/**
 * 
 * @param {String} str
 * @param {number} time
 */
com.hiyoko.util.stringTimes = function(str, time){
	var text = "";
	for(var i = 0; i < time; i++){
		text += str;
	}
	return text;
};

/**
 * 
 * @param {number} int 16進数6桁で表現されるカラーコードを10進数に直したもの
 * @returns {String} #RRGGBB の形で表現されるカラーコード
 */
com.hiyoko.util.intToColor = function(int){
	if(int == -1){
		return "transparent";
	}
	return "#" + com.hiyoko.util.addStuffRight(int.toString(16), 6, "0");
};

com.hiyoko.util.listMonthBeforeAfter = (base = new Date(), before = 12, after = before) => {
	var target = base;
	var result = [];
	target.setMonth((base).getMonth() - (before + 1));
	for(var i = 0; i < (before + after + 1); i++) {
		target.setMonth(target.getMonth() + 1);
		result.push(Number(new Date(target.getFullYear(), target.getMonth(), 1)))
	}
	return result;
};

/**
 * 数字にカンマを挿入して返却する。 1234567 -> 1,234,567
 * @param {num} カンマを挿入したい数字
 * @param {separator} カンマ以外のものを桁の区切りに使いたい場合に指定する。与えなければカンマ
 * @param {decimalPoint} ピリオド以外のものを桁の区切りに使いたい場合に指定する。与えなければピリオド
 * @returns {String} カンマが挿入された数字の文字列
 */
com.hiyoko.util.insertCommaToNum = (num, separator = ',', decimalPoint = '.') => {
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
		result =  strs[0].split("").reverse().map((d, i)=>{
			if(i && i%3===0) {
				return `${d}${separator}`;
			}
				return d;
			}).reverse().join('');
	}

	if(strs.length === 2) {
		const length = strs[1].length - 1;
		return `${result}${decimalPoint}` + strs[1].split("").map((d, i)=>{
			if(i && i%3===2 && i!==length) {
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
 * @param {string} title ファイルのタイトル
 * @param {string} content ファイルの内容
 */
com.hiyoko.util.downloadFile = (title, content) => {
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
 * wait する。 async と await を使わないと利用できないので注意
 * @param {number} msec 待ち時間。ミリ秒で入れること。例えば5秒待たせたいなら5000
 * @returns Promise
 */
com.hiyoko.util.wait = (msec)=>{
	return new Promise((resolve)=>{
		setTimeout(()=>{resolve(msec)}, msec);
	});
};
