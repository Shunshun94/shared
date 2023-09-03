# ユドナリウムの駒データをココフォリア用の駒データから作るやつ

## 概要

ココフォリアのクリップボード API 用の JSON 文字列をペーストすると   
ユドナリウムに駒を作るための XML を出力するツール。

## 利用する

1. [https://shunshun94.github.io/shared/other/io/github/shunshun94/trpg/Ccfolia2Udonarium/](https://shunshun94.github.io/shared/other/io/github/shunshun94/trpg/Ccfolia2Udonarium/) にアクセスする　
2. ココフォリア用の駒データをアクセスした画面に貼り付ける
3. ファイルのダウンロードを促されるので任意の場所に保存する
4. ダウンロードしたファイルをユドナリウムにドラッグ＆ドロップする

## 試す

以下の内容コピーし、[https://shunshun94.github.io/shared/other/io/github/shunshun94/trpg/Ccfolia2Udonarium/](https://shunshun94.github.io/shared/other/io/github/shunshun94/trpg/Ccfolia2Udonarium/)に貼り付けるとファイルがダウンロードされる。   
ダウンロードされたファイルをユドナリウムにドラッグ＆ドロップすることでコマが作成される。

```json
{"kind":"character","data":{"name":"木下 実樹","initiative":60,"externalUrl":"https://iachara.com/char/384188/view","iconUrl":"https://image.iaproject.app/384188.gif","commands":"CC<={SAN} 【SAN値チェック】\nCC<=80 【アイデア】\nCC<=60 【幸運】\nCC<=65 【知識】\nCC<=50 【目星】\nCC<=55 【聞き耳】\nCC<=51 【図書館】\nCC<=30 【回避】\nCC<=0 【近接戦闘】\nCC<=20 【投擲】\nCC<=20 【拳銃】\nCC<=0 【射撃】\nCC<=50 【応急手当】\nCC<=1 【鍵開け】\nCC<=10 【手さばき】\nCC<=20 【隠密】\nCC<=1 【精神分析】\nCC<=10 【追跡】\nCC<=20 【登攀】\nCC<=5 【鑑定】\nCC<=20 【運転】\nCC<=35 【機械修理】\nCC<=1 【重機械操作】\nCC<=5 【乗馬】\nCC<=20 【水泳】\nCC<=5 【製作】\nCC<=1 【操縦】\nCC<=20 【跳躍】\nCC<=35 【電気修理】\nCC<=10 【ナビゲート】\nCC<=5 【変装】\nCC<=5 【言いくるめ】\nCC<=20 【信用】\nCC<=40 【説得】\nCC<=65 【母国語(日本語)】\nCC<=15 【威圧】\nCC<=55 【魅惑】\nCC<=41 【言語(英語)】\nCC<=1 【医学】\nCC<=14 【オカルト】\nCC<=0 【クトゥルフ神話】\nCC<=35 【芸術(観劇)】\nCC<=30 【経理】\nCC<=1 【考古学】\nCC<=5 【コンピューター】\nCC<=1 【科学】\nCC<=20 【心理学】\nCC<=1 【人類学】\nCC<=1 【電子工学】\nCC<=10 【自然】\nCC<=5 【法律】\nCC<=15 【歴史】\nCC<=10 【サバイバル】\nCC<=35 【芸術：眼鏡】\n1d3なし 【ダメージ判定】\n1d4なし 【ダメージ判定】\n1d6なし 【ダメージ判定】\nCC<=50 【STR】\nCC<=60 【CON】\nCC<=65 【POW】\nCC<=60 【DEX】\nCC<=60 【APP】\nCC<=55 【SIZ】\nCC<=80 【INT】\nCC<=65 【EDU】\n","status":[{"label":"HP","value":11,"max":11},{"label":"MP","value":13,"max":13},{"label":"SAN","value":65,"max":65}]}}
```

## トラブルシューティング

ブラウザが「クリップボードにコピーしたテキストや画像へのアクセス」だとか「クリップボードを共有しますか？」だとか問うてくることがある。   
これが出たら「許可する」を選択することでこのツールにココフォリアの駒情報を送信することができるので許可する。

なお、このツールは受信した駒情報を外部に送信したりはしておらず、ユーザの手元で完結するように作られているため、   
駒の情報が作者のサーバに保存されたりすることはない。

## 動作確認

以下のユドナリウムで駒を作れること、チャットパレットからダイスを振れることを確認している。

* [ユドナリウム](https://udonarium.app/)
* [ウドなり](https://udo.museru.com/)
* [Udonarium-2d](https://udonarium2d.netlify.app/)
* [Udonarium with Fly](https://nanasunana.github.io/)
* [UdonariumLily](https://cylinder-lily.com/)
