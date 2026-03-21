# ゆとシート自鯖向け拡張機能群

## ero.js

エロステ機能を追加します。

### 使い方

以下2つのファイルを読み込ませてください

```html
<script src="https://shunshun94.github.io/shared/jquery/com/hiyoko/util/v2/utils.js"></script>
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
