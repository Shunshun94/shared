const tests = [
    {
        input: `SwordWorld2.5: KeyNo.20c[10]+9 ＞ 2D:[1,2]=3 ＞ 1+9 ＞ 10`,
        boost: 0,
        expected: `k20[10]+9$11#+0`,
        note: '通常の変転'
    }, {
        input: `SwordWorld2.5: KeyNo.20c[10]+9 ＞ 2D:[1,2]=3 ＞ 1+9 ＞ 10`,
        boost: 1,
        expected: `k20[10]+9$12#+0`,
        note: 'ブーストあり(+1)'
    }, {
        input: `SwordWorld2.5: KeyNo.20c[10]+9 ＞ 2D:[1,2]=3 ＞ 1+9 ＞ 10`,
        boost: 2,
        expected: `k20[10]+9$12#+0`,
        note: 'ブーストがあってもダイス目が12を超えることはない'
    }, {
        input: `SwordWorld2.5: KeyNo.20c[10]+9 ＞ 2D:[2,2]=4 ＞ 2+9 ＞ 11`,
        boost: 2,
        expected: `k20[10]+9$12#+0`,
        note: 'ブーストあり(+2)'
    }, {
        input: `SwordWorld2.5: KeyNo.20c[9]+9 ＞ 2D:[1,2]=3 ＞ 1+9 ＞ 10`,
        boost: 0,
        expected: `k20[9]+9$11#+0`,
        note: '通常の変転(クリティカルが9の場合)'
    }, {
        input: `SwordWorld2.5: KeyNo.48c[11]a[+2]+9 ＞ 2D:[1,1]=2 ＞ ** ＞ 自動的失敗`,
        boost: 0,
        expected: `k48[11]+9$12#+2`,
        note: '自動失敗時の変転'
    }, {
        input: `SwordWorld2.5: KeyNo.48c[11]a[+2] ＞ 2D:[1,1]=2 ＞ ** ＞ 自動的失敗`,
        boost: 0,
        expected: `k48[11]+0$12#+2`,
        note: '自動失敗時の変転(追加ダメージなし)'
    }, {
        input: `SwordWorld2.5: KeyNo.48c[11]a[+2]+9 ＞ 2D:[5,2]=9 ＞ 12+9 ＞ 21`,
        boost: 2,
        expected: `k48[11]+9$9#+2`,
        note: '必殺攻撃時の変転'
    }, {
        input: `SwordWorld2.5: KeyNo.48c[11]a[+2]+9 ＞ 2D:[4,5 5,4 1,6]=11,11,9 ＞ 13,13,12+9 ＞ 2回転 ＞ 47`,
        boost: 2,
        expected: `k48[11]+35$9#+2`,
        note: '複数回転時の変転'
    }, {
        input: `SwordWorld2.5: KeyNo.20c[10] ＞ 2D:[5,5 6,4 4,6 1,2]=10,10,10,3 ＞ 8,8,8,1 ＞ 3回転 ＞ 25`,
        boost: 0,
        expected: `k20[10]+24$11#+0`,
        note: '複数回転時の変転'
    }, {
        input: `SwordWorld2.5: KeyNo.20c[10] ＞ 2D:[5,5 6,4 4,6 1,2]=10,10,10,3 ＞ 8,8,8,** ＞ 3回転 ＞ 24`,
        boost: 0,
        expected: `k20[10]+24$11#+0`,
        note: 'クリティカルしているけど途中で自動失敗時の変転'
    }
];
