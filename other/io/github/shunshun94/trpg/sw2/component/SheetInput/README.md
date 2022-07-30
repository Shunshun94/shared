# io.github.shunshun94.trpg.sw2.component.SheetInput

## 何

過去に入力したシートをサジェストするキャラシ URL 入力ツール

## 使い方

```html
<div id="sample"></div>
<script>
    io.github.shunshun94.trpg.sw2.component.SheetInput.build(document.getElementById('sample'));
    document.getElementById('sample').addEventListener(
        io.github.shunshun94.trpg.sw2.component.SheetInput.EVENTS.SHEET_URL_INPUT,
        (e)=>{
            alert(`URL: ${e.url} が入力されました`);
            e.resolve();
        }
    );
</script>
```

## オプション

```javascript
{
    // 対象となる要素のクラス名を決めます
    // 指定しない場合、第一引数の要素のクラス名、それがなければ ID 名
    // それもなければ io-github-shunshun94-trpg-sw2-component-SheetInput が使われます
    className: 'io-github-shunshun94-trpg-sw2-component-SheetInput',

    // シートの URL の左に表示される説明の文字列を指定します。
    // 何も指定しなければ キャラクターシートURL： が使われます
    sheetExplanationText: 'キャラクターシートURL：',

    // シートの URL の右に表示されるボタンの文字列を指定します。
    // 何も指定しなければ 実行 が使われます
    executeText: '実行',

    // キャラクターシートの URL をフィルタリングするか決定します。
    // vampireblood を指定するとキャラクター保管所の URL のみがサジェストされ、
    // ytsheet を指定するとゆとシートの URL のみかサジェストされます。
    // 何も指定しない場合、フィルタリングしません
    characterSheetFilter: false
}
```