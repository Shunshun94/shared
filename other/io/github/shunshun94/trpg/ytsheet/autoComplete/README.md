# io.github.shunshun94.trpg.ytsheet.AutoComplete

## 何をしてくれるものなのか

[ゆとシート2](https://github.com/yutorize/ytsheet2)に自動補完を付ける。

## 使い方例

ソード・ワールド2.5のキャラクターシートの装飾品について自動補完するソースコード例です。

```javascript
const autoCompleteParam = [{
    element:document.getElementById('accessories'), columns: ['Note']
}];

// 自動補完を有効にする
io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting.initialize(autoCompleteParam);

// ユーザが入力した情報を保存する
io.github.shunshun94.trpg.ytsheet.AutoComplete.Learning.learn(autoCompleteParam);

// 自動補完の補完内容を保存した情報で更新する
io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting.updateDataListHtml(autoCompleteParam);
```

## 引数の説明

以下のように定義されるオブジェクトの配列が引数となります。

```typescript
{
    element:          Node,
    columns:          Array<string>,
    key:              string | null,
    name:             string | null,
    isPositionStrict: boolean
}
```

| 要素名 | 要否 | 説明 |
| ------ | ---- | ---- |
| element          | 必須 | 自動補完される要素群の親要素を指定します |
| columns          | 必須 | 自動補完される要素群の補完対象となる要素の名称を配列で指定します |
| key              | 任意 | 自動補完される要素群のユーザが入力する要素の名称を指定します。指定しない場合 `Name` が使われます |
| name             | 任意 | 自動補完される要素群につける名前を指定します。指定しない場合、 `element` で指定した要素の ID が使われます |
| isPositionStrict | 任意 | `true` にした場合、入力時のサジェストを部位ごとに制限します。指定しない場合 `False` となります |

`columns` と `key` の「要素の名称」はわかりにくいので以下で解説します。

### 要素の「名称」とは

わかりにくい概念なので最初に例として提示したソード・ワールド2.5の装飾品よりも複雑な、ソード・ワールド2.5の防具を例に説明します。
（防具はカスタマイズする場合がそれなりにあるため、自動補完したいというシチュエーションは稀だと思われますが……）

防具は ID `armours` の要素の子要素に記載されます。
各防具は「名前」「必筋」「回避力」「防護点」「専用」「備考」の情報を持ちます。
これに対して「名前」を入力したら「必筋」「回避力」「防護点」「備考」を補完したい場合を考えます。

#### key (自動補完される要素群のユーザが入力する要素の名称) について

鎧の名前の入力欄の要素を見ると `armour1Name` の name を持っています。
同じように盾の名前の入力欄の要素を見ると `shield1Name` の name を持っています。
このように、防具の名前の入力欄は `{防具の種類}Name` という name を持っています。

防具の名前の入力欄はユーザが入力する要素となります。
上述の引数における "自動補完される要素群のユーザが入力する要素の名称" はそれらの要素が持つ name から防具の種類を除いたものとなります。
すなわち、 `Name` となります。

#### columns (自動補完される要素群の補完対象となる要素の名称) について

名前に必要筋力の欄を見ると鎧は `armour1Reqd` の name を、盾は `shield1Reqd` の name を持っています。
このように、防具の名前の入力欄は `{防具の種類}Reqd` という name を持っています。

同様に確認していくと回避力は `{防具の種類}Eva`、防護点は `{防具の種類}Def`、備考は `{防具の種類}Note` となります。
"自動補完される要素群の補完対象となる要素の名称" 上述の key と同様にそれらの要素が持つ name から防具の種類を除いたものとなります。
よって、必要筋力は `Reqd`、回避力は `Eva`、防護点は `Def`、備考は `Note` となります。

### isPositionStrict を true にした場合の挙動

装飾品はディスプレイサー・ガジェットやスマルティエの銀鈴がありますから頭部の装飾品であっても腰や背中でもサジェストしてほしいものだと考えられます。
しかし、防具について鎧を盾の欄に記入したりすることはありませんから鎧は鎧の欄でだけ、盾は盾の欄でだけサジェストしてほしいものです。
`isPositionStrict` を `true` にすることで鎧は鎧の欄だけ、盾は盾の欄だけでサジェストするといった制御を行います。
この値が `false` の場合、どこの部位であっても全ての部位でサジェストされます。

### 防具の自動補完を行う場合の引数

よって、防具の自動補完を行う場合の引数は次のようになります。
ただし、key と name は入力を上述の表の通り省略することが可能です。

```javascript
{
    element:          document.getElementById('armours'),
    columns:          ['Reqd', 'Eva', 'Def', 'Note'],
    key:              'Name',
    name:             'armours',
    isPositionStrict: true
}
```

このドキュメント冒頭に示した例と併せて次のようにすれば実行が可能です。

```javascript
const autoCompleteParam = [{
    element:          document.getElementById('accessories'),
    columns:          ['Note']
}, {
    element:          document.getElementById('armours'),
    columns:          ['Reqd', 'Eva', 'Def', 'Note'],
    isPositionStrict: true
}];

// 自動補完を有効にする
io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting.initialize(autoCompleteParam);

// ユーザが入力した情報を保存する
io.github.shunshun94.trpg.ytsheet.AutoComplete.Learning.learn(autoCompleteParam);

// 自動補完の補完内容を保存した情報で更新する
io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting.updateDataListHtml(autoCompleteParam);
```

## その他詳細な話

### データの格納

データは `localStorage` に保存されます。
`localStorage` のキーは次のように命名されます。

`ytsheet-autocomplete-${システム名}-${自動補完される要素の名前}`

例えば `ytsheet-autocomplete-sw2.5-armours` や `ytsheet-autocomplete-sw2.5-accessories` のようになります。

### サジェストの方法

自動補完される要素群のユーザが入力する要素（引数の `key` で指定される要素）への入力は
`datalist` 要素を用いてサジェストされます。
`datalist` 要素の id は `isPositionStrict` が `false` の場合は `ytsheet-autocomplete-${システム名}-${自動補完される要素の名前}-list`、
`isPositionStrict` が `true` の場合は `ytsheet-autocomplete-${システム名}-${自動補完される要素の名前}-${部位名}list` となります。