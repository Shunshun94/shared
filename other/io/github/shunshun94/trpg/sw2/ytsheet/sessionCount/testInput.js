const testDataRaxiaLifeNeo = {
    playerName: 'ひよこ',
};

let expectedSessionCount = 0;

const testsRaxiaLifeNeo = [
    {
        Title: 'GM 回（報酬はレギュ通り１・GM名が「ひよこ」（PL 名と同一）)',
        Exp: '250',
        Money: '500',
        Gm: 'ひよこ',
        ExpectedResult: false,
    }, {
        Title: 'GM 回（報酬はレギュ通り２・GM名が「オレだぜ」)',
        Exp: '3330',
        Money: '6660',
        Gm: 'オレだぜ',
        ExpectedResult: false,
    }, {
        Title: 'GM 回（報酬はレギュ通り３・GM名が空欄)',
        Exp: '1080',
        Money: '2160',
        Gm: '',
        ExpectedResult: false,
    }, {
        Title: 'GM 回（報酬はレギュ通り３・GM名の記入なし）',
        Exp: '1080',
        Money: '2160',
        ExpectedResult: false,
    }, {
        Title: 'GM 回（報酬上限に達しちゃった回１、GM名が「自分」）',
        Exp: '120',
        Money: '1320',
        Gm: '自分',
        ExpectedResult: false,
    }, {
        Title: 'GM 回（報酬上限に達しちゃった回２、GM名が「ひよこ」（PL 名と同一））',
        Exp: '120',
        Money: '1320',
        Gm: 'ひよこ',
        ExpectedResult: false,
    }, {
        Title: 'GM 回（報酬上限に達しちゃった回３、GM名が「ひよ」（PL名に含まれる文字列））',
        Exp: '120',
        Money: '1320',
        Gm: 'ひよ',
        ExpectedResult: false,
    }, {
        Title: 'GM 回（報酬上限に達しちゃった回４、GM名が「ひよこちゃん」（PL名を含む文字列））',
        Exp: '120',
        Money: '1320',
        Gm: 'ひよこちゃん',
        ExpectedResult: false,
    }, {
        Title: 'GM 回（既に報酬上限に達している回１、GM名が「自分」・Expが未記入）',
        Money: '1320',
        Gm: '自分',
        ExpectedResult: false,
    }, {
        Title: 'GM 回（既に報酬上限に達している回２、GM名が「ひよこ」（PL 名と同一）・Expに0を記載）',
        Exp: '0',
        Money: '1320',
        Gm: 'ひよこ',
        ExpectedResult: false,
    }, {
        Title: 'GM 回（既に報酬上限に達している回３、GM名が「ひよ」（PL名に含まれる文字列）・Expが未記入）',
        Money: '1320',
        Gm: 'ひよ',
        ExpectedResult: false,
    }, {
        Title: 'GM 回（既に報酬上限に達している回４、GM名が「ひよこちゃん」（PL名を含む文字列）・Expに0を記載）',
        Exp: '0',
        Money: '1320',
        Gm: 'ひよこちゃん',
        ExpectedResult: false,
    }, {
        Title: 'GM 回（既に報酬上限に達している回５、GM名が空欄）',
        ExpectedResult: false,
    }, {
        Title: 'メモ　全部未記入の場合',
        ExpectedResult: false,
    }, {
        Title: 'メモ　ピンゾロの集計の場合',
        Exp: '50*23',
        ExpectedResult: false,
    }, {
        Title: '通常のセッション',
        Exp: '1150+50*3',
        Money: '703',
        Gm: '誰か',
        ExpectedResult: true,
    }, {
        Title: '通常のセッション（経験点上限に達していて経験点未記入の場合）',
        Money: '703',
        Gm: '誰か',
        ExpectedResult: true,
    }, {
        Title: '通常のセッション（経験点上限に達していて経験点に0を記入している場合）',
        Exp: '0',
        Money: '703',
        Gm: '誰か',
        ExpectedResult: true,
    }
];

testDataRaxiaLifeNeo.historyNum = String(testsRaxiaLifeNeo.length);

testsRaxiaLifeNeo.forEach((testCase, i)=>{
    for(var key in testCase) {
        testDataRaxiaLifeNeo[`history${i + 1}${key}`] = testCase[key];
    }
    if(testCase.ExpectedResult) { expectedSessionCount++; }
});
