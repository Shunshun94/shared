# ゆとシート自鯖向け拡張機能群

## common.js

他の機能で使う共通のライブラリです。

```javascript
// ログインしているユーザの名前を格納しています
io.github.shunshun94.ytsheet.addSkin.userId;

// 出力メニューにコマンドを追加します
// 詳しい使い方は js doc を参照してください
io.github.shunshun94.ytsheet.addSkin.drawDownloadButton();

// トップメニューにボタンを追加します
// 詳しい使い方は js doc を参照してください
io.github.shunshun94.ytsheet.addSkin.drawTopMenuButton();
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

drawDownloadButton の使い方は [common.js](./common.js) を参照してください。

## store.js

ゆとシート上のキャラクターシートのデータを操作します（現状は魔物シートのみ）。

### 使い方

以下のファイルを読み込ませてください。

```html
<script src="https://shunshun94.github.io/shared/other/io/github/shunshun94/ytsheet/addSkin/store.js"></script>
```

