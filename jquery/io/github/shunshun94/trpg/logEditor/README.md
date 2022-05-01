# テキストセッションログエディタ

## 何をするツールなの

エディタで発言の順序を並び替えたり、発言を統合したりするのが大変なのでそれ用のエディタが欲しい。

## 使い方

https://shunshun94.github.io/shared/jquery/io/github/shunshun94/trpg/logEditor/LogEditor.html を開き、
手元にあるココフォリアのセッションログまたはユドナリウムの保存した部屋の zip をドラッグ・ドロップすればログを編集できる。
ないし、このツールで編集したログを保存したモノでもドラッグ・ドロップすれば再編集できる。

## 主な機能

* 内容を書き換える
    * 発言内容
    * 発言者
    * 文字色
* 発言の並び替え
* 発言を複製する
* 発言を結合する（2つ以上の発言を1つの発言だったかのようにする）
* 名前の一括置換
* 名前毎に文字色を一括で変更
* 名前毎に HTML の class を適用
* 編集内容の保存

## 使ったライブラリ

* https://sortablejs.github.io/sortablejs/
* https://github.com/polygonplanet/encoding.js
* https://jquery.com/
* https://github.com/Caligatio/jsSHA
* https://stuk.github.io/jszip/

## オマケ

### CSS 生成ツール

このツールで生成した HTML を
https://shunshun94.github.io/shared/jquery/io/github/shunshun94/trpg/logEditor/LogToCSS.html
にドラッグ・ドロップすると html のクラス情報をもとに CSS を生成する。 

### テーブル形式に変換

対応しているログファイルを
https://shunshun94.github.io/shared/jquery/io/github/shunshun94/trpg/logEditor/logToTableJson.html
にドラッグ・ドロップすると html のクラス情報をもとに CSS を生成する。 
