var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.Shamir = io.github.shunshun94.util.Shamir || {};

/**
 * 秘密の値そのものを生成します
 * @param {Number} secret 
 * @param {Number} sharedMemberCount 
 * @param {Number} requiredMemberCount 
 */
io.github.shunshun94.util.Shamir.calculateSharedSecret = (secret, sharedMemberCount = 3, requiredMemberCount = 2) => {
    if(sharedMemberCount < requiredMemberCount) { throw "秘密を共有する人数は必要な秘密の人数以上である必要があります"; }
    const polynormal = io.github.shunshun94.util.Shamir.generateSharedSecretGeneratePolynormal(secret, requiredMemberCount + 1);
    const result = [];
    for(var i = 0; i < sharedMemberCount; i++) {
        const x = Math.floor(Math.random() *100);
        result.push([x, polynormal.map((a, n)=>{
            return a * Math.pow(x, n);
        }).reduce((a, b)=>{ return a + b;})]);
    }
    return result;
};

/**
 * 多項式を生成します
 * @param {Number} secret 
 * @param {Number} polynormalCount 
 * @returns {Array<Number>} 各項のaの値
 */
io.github.shunshun94.util.Shamir.generateSharedSecretGeneratePolynormal = (secret, polynormalCount) => {
    const a = [];
    a.push(secret);
    for(var i = 0; i < polynormalCount; i++) {
        a.push(Math.random() * 10);
    }
    return a;
};


