# DatetimePicker

## これなに

[DiscordForumSummary](https://github.com/Shunshun94/GoogleAppScripts/tree/main/DiscordForumSummary)で卓の日程をフォーラムのタイトルから取得するために作った何か。日時の記載が「3/5」とか「03/12」とか「03・13」とか「１１／１８」とか「5月６日」とかでもなんかがんばってとってくる。

## どの程度のバリエーションに対応しているの？

[これくらい](https://shunshun94.github.io/shared/other/io/github/shunshun94/util/DatetimePicker/test.html)。動作チェックを兼ねているページです。

## どうやってつかうの？

```javascript
io.github.shunshun94.util.DateTimePicker.pick('3月7日だよ');
// 結果
// {
//  "dateRegExp": ["3月7日", "3", "7"],
//  "timeRegExp": null,
//  "text": "03/07",
//  "datetimeRevmoed": "だよ"
//}
```
