var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.Shamir = io.github.shunshun94.util.Shamir || {};

/**
 * 文字列をシェアから生成します
 * @param {Array} shares calculateSharedSecretFromTextで生成したシェアをしきい値以上
 * @returns 秘密の文字列
 */
io.github.shunshun94.util.Shamir.calculateSecretStringFromShares = (shares) => {
    return shares[0].y.map((dummy, i)=>{
        return shares.map((share)=>{
            return [share.x, share.y[i]]
        });
    }).map((sharedbyChar)=>{
        return String.fromCodePoint(Math.round(io.github.shunshun94.util.Shamir.calcLagrangeInterPolation(sharedbyChar)));
    }).join('').trim();
};

/**
 * シェアを文字列から生成します
 * @param {String} secret 秘密の文字列
 * @param {Number|Array<Number>} sharedMemberCount （省略可能）シェアを分け持つ人数。またはシェアを分け持つそれぞれが持つ、多項式に代入される x の値の配列。省略した場合は [1,2,3]
 * @param {Number} requiredMemberCount （省略可能）秘密を復元するのに求められる最小のシェア数。しきい値。省略した場合は2
 * @returns 各々が持つべきシェア
 */
io.github.shunshun94.util.Shamir.calculateSharedSecretFromText = (secret, sharedMemberCount = [1,2,3], requiredMemberCount = 2) => {
    let sharedXArray = io.github.shunshun94.util.Shamir.generatesharedXArray(sharedMemberCount, requiredMemberCount);
    const shares = io.github.shunshun94.util.Shamir.generateNumbersFromString(secret).map((secret)=>{
        return io.github.shunshun94.util.Shamir.calculateSharedSecretFromNumber(secret, sharedXArray, requiredMemberCount);
    });
    return sharedXArray.map((x, i)=>{
        return {
            x: x,
            y: shares.map((pairList, j)=>{
                return pairList[i][1];
            })
        };
    });
};

/**
 * ラグランジュの補完公式を用いて多項式 F(x) の値を計算します
 * @param {Array<Array<Number>>} secrets 復元のために用いる値
 * @param {Number} x （省略可能）xに代入する値。省略した場合は 0
 */
io.github.shunshun94.util.Shamir.calcLagrangeInterPolation = (secrets, x = 0) => {
    return secrets.map((pairi, i)=>{
        const xi = pairi[0];
        const yi = pairi[1];
        const upper = secrets.map((pair, j)=>{
            if(i === j) {return 1;}
            return x - pair[0];
        }).reduce((a,b)=>{return a * b});
        const under = secrets.map((pair, j)=>{
            if(i === j) {return 1;}
            return xi - pair[0];
        }).reduce((a,b)=>{return a * b});
        return yi * upper / under;
    }).reduce((a,b)=>{return a + b});
};

/**
 * 数字からシェアを生成します
 * @param {Number} secret 秘密の数字
 * @param {Array<Number>} sharedMemberCount （省略可能）シェアを分け持つそれぞれが持つ、多項式に代入される x の値の配列。省略した場合は [1,2,3]
 * @param {Number} requiredMemberCount （省略可能）秘密を復元するのに求められる最小のシェア数。しきい値。省略した場合は 2
 * @returns {Array<Array<Number>>} 秘密分散法のシェアの配列
 */
io.github.shunshun94.util.Shamir.calculateSharedSecretFromNumber = (secret, sharedMemberCount = [1,2,3], requiredMemberCount = 2) => {
    const polynormal = io.github.shunshun94.util.Shamir.generateSharedSecretGeneratePolynormal(secret, requiredMemberCount - 1);
    return sharedMemberCount.map((x)=>{
        return [x, polynormal.map((a, n)=>{
            return a * Math.pow(x, n);
        }).reduce((a, b)=>{ return a + b;})];
    });
};

/**
 * （外部からの利用は想定されない）calculateSharedSecretFromText が使う引数から各 share の x の値の配列を得るための関数
 * @param {a} sharedMemberCount 
 * @param {*} requiredMemberCount 
 * @returns 
 */
io.github.shunshun94.util.Shamir.generatesharedXArray = (sharedMemberCount, requiredMemberCount) => {
    if(Array.isArray(sharedMemberCount)){
        if(sharedMemberCount.length < requiredMemberCount) { throw `秘密を共有する人数は必要な秘密の人数以上である必要があります（共有人数 = ${sharedMemberCount.length} / 必要人数 = ${requiredMemberCount}）`; }
        if(sharedMemberCount.filter((d)=>{return ! Number.isFinite(d)}).length) {
            throw "第2引数は Array<Number> または Number である必要があります";    
        }
        return sharedMemberCount;
    }else if(Number.isFinite(sharedMemberCount)) {
        if(sharedMemberCount < requiredMemberCount) { throw `秘密を共有する人数は必要な秘密の人数以上である必要があります（共有人数 = ${sharedMemberCount} / 必要人数 = ${requiredMemberCount}）`; }
        sharedXArray = [];
        for(var i = 0; i < sharedMemberCount; i++) {
            sharedXArray.push( i + 1 );
        }
        return sharedXArray;
    }
    throw "sharedMemberCount の値は Array<Number> または Number である必要があります";
};


/**
 * （外部からの利用は想定されない）多項式を生成します
 * @param {Number} secret 定数項の値
 * @param {Number} polynormalCount 多項式の次数
 * @returns {Array<Number>} 各項のaの値
 */
io.github.shunshun94.util.Shamir.generateSharedSecretGeneratePolynormal = (secret, polynormalCount) => {
    const a = [];
    a.push(secret);
    for(var i = 0; i < polynormalCount; i++) {
        a.push(Math.random() * 400 - 200);
    }
    return a;
};

/**
 * 文字列を数字の配列に変換する
 * @param {String} seed 元となる文字列
 * @param {Number} opt_MaxLength （省略可能）文字列が取りうる最大の長さ。与えない場合は元となる文字列の長さより長い最小の20の倍数
 * @returns seed を数字の配列に変換したもの
 */
io.github.shunshun94.util.Shamir.generateNumbersFromString = (seed = 'pass', opt_MaxLength) => {
    const fixedLength = opt_MaxLength ? opt_MaxLength : (Math.floor(seed.length / 20) + 1) * 20;
    const fixedSeed = seed.padEnd(fixedLength);
    const result = [];
	for(let i = 0; i < fixedLength; i++) {
        result.push(io.github.shunshun94.util.Shamir.fixedCharCodeAt(fixedSeed, i));
	}
	return result;
};

/**
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt で提案されている charCodeAt
 * @param {String} str 
 * @param {Number} idx 
 * @returns 
 */
io.github.shunshun94.util.Shamir.fixedCharCodeAt = (str, idx) => {
    idx = idx || 0;
    var code = str.charCodeAt(idx);
    var hi, low;

    if (0xD800 <= code && code <= 0xDBFF) {
      hi = code;
      low = str.charCodeAt(idx + 1);
      if (isNaN(low)) {
        throw 'High surrogate not followed by low surrogate in fixedCharCodeAt()';
      }
      return (
        (hi - 0xD800) * 0x400) +
        (low - 0xDC00) + 0x10000;
    }
    if (0xDC00 <= code && code <= 0xDFFF) {
      return false;
    }
    return code;
  }