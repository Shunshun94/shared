var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};

io.github.shunshun94.trpg.calDx3SuccessRateCache = {};
io.github.shunshun94.trpg.calDx3SuccessRateDiceMax = 10;
io.github.shunshun94.trpg.calDx3SuccessRateCache.CriticalRate = {};
io.github.shunshun94.trpg.calDx3SuccessRateCache.BasicSuccessRate = {};
io.github.shunshun94.trpg.calDx3SuccessRateCache.SuccessRate = {};

io.github.shunshun94.trpg.calcDx3SuccessRate = (expected = 30, dice = 10, critical = 10, fixed = 0, isFirstDice = true) => {
	if(critical < 2) {throw "クリティカル値は2以上である必要があります";}
	if(dice < 1) { return 0; }
	const target = isFirstDice ? ((expected - fixed > 1) ? expected - fixed : 2) : expected - fixed;
	if(isFirstDice && (target < 3)) { // ファンブルじゃなければ成功
		return 1 - Math.pow(0.1, dice);
	}
	if( target <= io.github.shunshun94.trpg.calDx3SuccessRateDiceMax ) {
		return io.github.shunshun94.trpg.getDx3BasicSuccessRate(target, dice, critical);
	} else {
		const key = `${target}_${dice}_${critical}`;
		if(io.github.shunshun94.trpg.calDx3SuccessRateCache.SuccessRate[key]) { return io.github.shunshun94.trpg.calDx3SuccessRateCache.SuccessRate[key]; }
		let result = 0;
		for(let i = 0; i < dice; i++ ) {
			const criticalRate = io.github.shunshun94.trpg.getDx3CriticalDicesRate(dice-i,dice,critical);
			result += criticalRate * io.github.shunshun94.trpg.calcDx3SuccessRate(target - io.github.shunshun94.trpg.calDx3SuccessRateDiceMax, dice-i, critical, 0, false);
		}
		io.github.shunshun94.trpg.calDx3SuccessRateCache.SuccessRate[key] = result;
		return result;
	}
};

io.github.shunshun94.trpg.getDx3BasicSuccessRate = (expected, dice, critical) => {
	if(critical < 2) {throw "クリティカル値は2以上である必要があります";}
	const key = `${expected}_${dice}_${critical}`;
	if(io.github.shunshun94.trpg.calDx3SuccessRateCache.BasicSuccessRate[key]) {return io.github.shunshun94.trpg.calDx3SuccessRateCache.BasicSuccessRate[key];}
	if(expected > critical) {
		const result = 1 - Math.pow(((critical / io.github.shunshun94.trpg.calDx3SuccessRateDiceMax) - 0.1), dice);
		io.github.shunshun94.trpg.calDx3SuccessRateCache.BasicSuccessRate[key] = result;
		return result;
	} else {
		const result = 1 - Math.pow(((expected / io.github.shunshun94.trpg.calDx3SuccessRateDiceMax) - 0.1), dice);
		io.github.shunshun94.trpg.calDx3SuccessRateCache.BasicSuccessRate[key] = result;
		return result;
	}
};

io.github.shunshun94.trpg.getDx3CriticalDicesRate = (expected, dice, critical) => {
	if(critical < 2) {throw "クリティカル値は2以上である必要があります";}
	const key = `${expected}_${dice}_${critical}`;
	if(io.github.shunshun94.trpg.calDx3SuccessRateCache.CriticalRate[key]) {return io.github.shunshun94.trpg.calDx3SuccessRateCache.CriticalRate[key];}
	const singlecriticalRate = ((io.github.shunshun94.trpg.calDx3SuccessRateDiceMax + 1) - critical) / io.github.shunshun94.trpg.calDx3SuccessRateDiceMax;
	const criticalDiceRate = Math.pow(singlecriticalRate, expected);
	const uncriticalDiceRate = Math.pow(1 - singlecriticalRate, dice - expected);
	const combination = io.github.shunshun94.trpg.combination(dice, expected);
	const result = criticalDiceRate * uncriticalDiceRate * combination;
	io.github.shunshun94.trpg.calDx3SuccessRateCache.CriticalRate[key] = result;
	return result;
};

io.github.shunshun94.trpg.combination = (n, m) => {
	let a = 1;
	let b = 1;
	for(let i = 0; i < m; i++) {
		a *= (n - i);
		b *= (m - i);
	}
	return a/b;
}; 

