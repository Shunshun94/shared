# ytsheet-session-count.js

## これは何？

ゆとシートのキャラクターシートの json を入れるとその PC がプレイヤーとして参加したセッションの回数を計算してくれるやつ。
オープンキャンペーンなどで利用されることを想定している。

定数を越えた応募があった場合、
プレイヤーとして参加したセッションが少ない人の優先順位を上げ、
プレイヤーとして参加したセッションが多い人の優先順位を下げる傾向にある。
しかし、キャラクターシートからこれを確認するのは面倒なので、なんらかの一覧するアプリとこれを組み合わせ、
一覧でプレイヤーとして参加したセッションの回数を確認できるようにしたい。

## どうやって使うの？

[ytsheet-session-count.js](./ytsheet-session-count.js)の `io.github.shunshun94.trpg.sw2.ytsheet.countSession` を以下の引数を与えて呼び出す。

* 第一引数にキャラクターシートの json
* 第二引数（optional）に用いるコミュニティの名前（現時点では `RaxiaLifeNeo` のみ対応）

キャラクターシートの json については [公式のガイド](https://yutorize.2-d.jp/?ytsheet2-json)を参照すること。

## プレイヤーとして参加したセッションとしてカウントする基準

現時点では「ラクシアらいふ！ねお！」のルールに従って作成している。

[ラクシアらいふ！ねお！の基準](./RaxiaLifeNeo.md)

## 動作テスト

[こちら](./test.html)から確認。

## 活用

* [ytsheetBoard](https://github.com/Shunshun94/GoogleAppScripts/tree/main/ytsheetBoard) で活用
* [sameSessionCount](./sameSessionCount.html) で利用
