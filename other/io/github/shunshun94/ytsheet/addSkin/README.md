# ゆとシート自鯖向け拡張機能群

## common.js

他の機能で使う共通のライブラリです。

```javascript
// ログインしているユーザの名前を格納しています
io.github.shunshun94.ytsheet.addSkin.userId;

// 出力メニューにコマンドを追加します
io.github.shunshun94.ytsheet.addSkin.drawDownloadButton(
    buttonId,        // ボタンに付与する HTML の ID 属性値です
    buttonText,      //  ボタンに表示するテキストです
    onClickFunction, // ボタンを押した際に実行される関数です
    beforeElementId, // この ID を持つ要素の後ろにボタンを配置します。
                     // afterElementId と両方していした場合はこちらが優先されます。
                     // afterElementId もこれも指定しない場合は配置されません
    afterElementId,  // この ID を持つ要素の前にボタンを配置します。
                     // beforeElementId もこれも指定しない場合は配置されません
    popupDescription,// ボタンにカーソルを合わせた際に表示される説明です。省略しても構いません
    smallDescription // ボタンの下に小さく表示される説明です。省略しても構いません
);

// トップメニューにボタンを追加します
io.github.shunshun94.ytsheet.addSkin.drawTopMenuButton(
    buttonHtml, // ボタンの中に書き込まれる HTML です。単純に文字列を書き込むだけでも構いませんが <br/> での改行も可能です
    url         // ボタンをクリックした際に転送される先の URL です
);
```

## store.js

ゆとシート上のキャラクターシートのデータを操作します（現状は魔物シートのみ）。
他の機能から呼び出されて利用されます。

### 使い方

以下のファイルを読み込ませてください。

```html
<script src="https://shunshun94.github.io/shared/other/io/github/shunshun94/ytsheet/addSkin/store.js"></script>
```

## ero.js

エロステ機能を追加します。

### 使い方

以下3つのファイルを読み込ませてください。

```html
<script src="https://shunshun94.github.io/shared/jquery/com/hiyoko/util/v2/utils.js"></script>
<script src="https://shunshun94.github.io/shared/other/io/github/shunshun94/ytsheet/addSkin/common.js"></script>
<script src="https://shunshun94.github.io/shared/other/io/github/shunshun94/ytsheet/addSkin/ero.js"></script>
```

その上で以下 JavaScript を実行します。

```javascript
io.github.shunshun94.ytsheet.addSkin.displayEroEditMenu();
```

`io.github.shunshun94.ytsheet.addSkin.displayEroEditMenu` には引数として判定の関数を指定することで、
ユーザやドメインによって編集ボタンを有効にするか無効にするかを動的に決定できます。

判定の関数は第一引数にユーザの ID、第二引数にアクセスしているページの URL（location.href の値）が与えられます。
返り値として true または false を返してください。false の場合は編集ボタンを表示しません。

## pictExport.js

魔物データの画像出力機能を追加します。

### 使い方

以下3つのファイルを読み込ませてください。

```html
<script src="https://shunshun94.github.io/shared/other/io/github/shunshun94/ytsheet/addSkin/common.js"></script>
<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
<script src="https://shunshun94.github.io/shared/other/io/github/shunshun94/ytsheet/addSkin/pictExport.js"></script>
```

その上で以下 JavaScript を実行します。

```javascript
if(io.github.shunshun94.ytsheet.addSkin.exportPicture.isActive) {
    io.github.shunshun94.ytsheet.addSkin.drawDownloadButton('downloadlist-picture', '画像形式', 
        io.github.shunshun94.ytsheet.addSkin.exportPicture.export, 'downloadlist-zipped');
}
```

## hiyokoFormatCcfoliaJson.js

エネミーデータの駒を出力しますが、駒のサマリ欄に戦闘中参照頻度が高いデータを掲載したりイニシアティブ値を移動力にしたりして出力します。

### 使い方

```html
<script src="https://shunshun94.github.io/shared/other/io/github/shunshun94/ytsheet/addSkin/common.js"></script>
<script src="https://shunshun94.github.io/shared/other/io/github/shunshun94/ytsheet/addSkin/store.js"></script>
<script src="https://shunshun94.github.io/shared/other/io/github/shunshun94/ytsheet/addSkin/hiyokoFormatCcfoliaJson.js"></script>
```

その上で以下 JavaScript を実行します。

```javascript
if( generateType === 'SwordWorld2Enemy' ) {
    io.github.shunshun94.ytsheet.addSkin.drawDownloadButton(
		'downloadlist-hiyoko-ccfolia-json-with-dice-roll',
		'ココフォリア用独自コマデータ',
		(e)=> { io.github.shunshun94.ytsheet.addSkin.HiyokoFormatCcfoliaJson.generate(false); },
		'downloadlist-ccfolia',
		false,
		'剣のかけらの修正値を考慮し、イニシアティブ値とメモ欄をカスタムしたココフォリア用のコマデータを出力します',
		'表示される json をコピーしてココフォリアにはりつけ'
    );
    io.github.shunshun94.ytsheet.addSkin.drawDownloadButton(
		'downloadlist-hiyoko-ccfolia-json-without-dice-roll',
		'ココフォリア用独自コマデータ（固定値使用）',
		(e)=> { io.github.shunshun94.ytsheet.addSkin.HiyokoFormatCcfoliaJson.generate(true); },
		'downloadlist-hiyoko-ccfolia-json-with-dice-roll',
		false,
		'剣のかけらの修正値を考慮し、イニシアティブ値とメモ欄をカスタムしたココフォリア用のコマデータを出力します。命中や回避等のチャットパレットには固定値を用います',
		'表示される json をコピーしてココフォリアにはりつけ'
    );
}
```

