const tests = [
    {
        input: `SwordWorld2.5: KeyNo.20c[10]+9 ＞ 2D:[1,2]=3 ＞ 1+9 ＞ 10`,
        boost: 0,
        expected: `k20[10]+9$11#+0r0`,
        note: '通常の変転'
    }, {
        input: `SwordWorld2.5: KeyNo.20c[10]+9 ＞ 2D:[1,2]=3 ＞ 1+9 ＞ 10`,
        boost: 1,
        expected: `k20[10]+9$12#+0r0`,
        note: 'ブーストあり(+1)'
    }, {
        input: `SwordWorld2.5: KeyNo.20c[10]+9 ＞ 2D:[1,2]=3 ＞ 1+9 ＞ 10`,
        boost: 2,
        expected: `k20[10]+9$12#+0r0`,
        note: 'ブーストがあってもダイス目が12を超えることはない'
    }, {
        input: `SwordWorld2.5: KeyNo.20c[10]+9 ＞ 2D:[2,2]=4 ＞ 2+9 ＞ 11`,
        boost: 2,
        expected: `k20[10]+9$12#+0r0`,
        note: 'ブーストあり(+2)'
    }, {
        input: `SwordWorld2.5: KeyNo.20c[9]+9 ＞ 2D:[1,2]=3 ＞ 1+9 ＞ 10`,
        boost: 0,
        expected: `k20[9]+9$11#+0r0`,
        note: '通常の変転(クリティカルが9の場合)'
    }, {
        input: `SwordWorld2.5: KeyNo.48c[11]a[+2]+9 ＞ 2D:[1,1]=2 ＞ ** ＞ 自動的失敗`,
        boost: 0,
        expected: `k48[11]+9$12#+2r0`,
        note: '自動失敗時の変転'
    }, {
        input: `SwordWorld2.5: KeyNo.48c[11]a[+2] ＞ 2D:[1,1]=2 ＞ ** ＞ 自動的失敗`,
        boost: 0,
        expected: `k48[11]+0$12#+2r0`,
        note: '自動失敗時の変転(追加ダメージなし)'
    }, {
        input: `SwordWorld2.5: KeyNo.48c[11]a[+2]+9 ＞ 2D:[5,2]=9 ＞ 12+9 ＞ 21`,
        boost: 2,
        expected: `k48[11]+9$9#+2r0`,
        note: '必殺攻撃時の変転'
    }, {
        input: `SwordWorld2.5: KeyNo.48c[11]a[+2]+9 ＞ 2D:[4,5 5,4 1,6]=11,11,9 ＞ 13,13,12+9 ＞ 2回転 ＞ 47`,
        boost: 2,
        expected: `k48[11]+35$9#+2r0`,
        note: '複数回転時の変転'
    }, {
        input: `SwordWorld2.5: KeyNo.20c[10] ＞ 2D:[5,5 6,4 4,6 1,2]=10,10,10,3 ＞ 8,8,8,1 ＞ 3回転 ＞ 25`,
        boost: 0,
        expected: `k20[10]+24$11#+0r0`,
        note: '複数回転時の変転'
    }, {
        input: `SwordWorld2.5: KeyNo.20c[10] ＞ 2D:[5,5 6,4 4,6 1,2]=10,10,10,3 ＞ 8,8,8,** ＞ 3回転 ＞ 24`,
        boost: 0,
        expected: `k20[10]+24$11#+0r0`,
        note: 'クリティカルしているけど途中で自動失敗時の変転'
    }, {
        input: `KeyNo.30c[10]r[5]a[+1] ＞ 2D:[5,6 4,1]=12,6 ＞ 10,10 ＞ 1回転 ＞ 20`,
        boost: 0,
        expected: `k35[10]+10$9#+1r5`,
        note: '首切り刀の変転（1回転後）'
    }, {
        input: `KeyNo.30c[10]r[5]a[+1]+8 ＞ 2D:[6,6 6,6 5,5 6,6 6,6 4,5 6,6 4,2]=12,12,11,12,12,10,12,7 ＞ 10,12,12,14,15,14,18,13+8 ＞ 7回転 ＞ 116`,
        boost: 0,
        expected: `k65[10]+103$8#+1r5`,
        note: '首切り刀の変転（たくさん回転後）'
    }, {
        input: `KeyNo.30c[10]r[5] ＞ 2D:[3,3]=6 ＞ 6`,
        boost: 0,
        expected: `k30[10]+0$8#+0r5`,
        note: '首切り刀の変転（無回転）'
    }, {
        input: `SwordWorld2.5: KeyNo.20c[10]gf ＞ 2D:[2,2]=4 ＞ 2 ＞ 2`,
        boost: 0,
        expected: `k20[10]+0$10#+0r0gf`,
        note: 'グレイテストフォーチュンの変転'
    }, {
        input: `KeyNo.30c[13]+9 ＞ 2D:[3,1]=4 ＞ (4+9)/2+5 ＞ 12`,
        boost: 0,
        expected: `k30[13]+10$10#+0r0`,
        note: '半減ダメージの変転（回転なし）'
    }, {
        input: `KeyNo.30c[9]+9 ＞ 2D:[4,6 6,5 6,5 6,5 3,3]=10,11,11,11,6 ＞ (10,10,10,10,6+9)/2+5 ＞ 4回転 ＞ 33`,
        boost: 0,
        expected: `k30[9]+30$8#+0r0`,
        note: '半減ダメージの変転（回転あり）'
    }
];
