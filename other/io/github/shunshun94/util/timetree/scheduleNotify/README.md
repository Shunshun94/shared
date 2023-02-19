# Share Schedule

## 概要

### 何をするもの

[GAS](https://workspace.google.co.jp/intl/ja/products/apps-script/) を使って
TimeTree と Google Calendar のスケジュールを Slack / EMail に定期的に送信する。

### 経緯

TimeTree が唐突に見れなくなって困ったとのことで、復旧までの間見れるようにするために用意した。
ただし、これは修正済みの問題でそう頻繁に再発するとは考えていない。

[TimeTree 不具合のお知らせ](https://support.timetreeapp.com/hc/ja/articles/360000329822-%E4%B8%8D%E5%85%B7%E5%90%88%E3%81%AE%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B)

## 使い方

GAS として動かす

### トリガーの設定

実行する関数に `execute` を、
イベントのソースに `時間主導型` を
時間ベースのトリガーのタイプに `週ベースのタイマー` を選択する。

曜日と時刻は任意だが、週の始まりの前日、午後10～11時にしておくと便利だろう。

### 環境変数の設定

以下の環境変数を設定する必要がある。

#### `TIMETREE_TOKEN`

[TimeTree | Dev](https://developers.timetreeapp.com/ja/docs/api/overview#application-types) 掲載の手順に従い、
Personal access token を発行し、その値を入力する。

TimeTree に登録されたスケジュールを取得しない場合はこの入力は不要である。

なお、この token にはデータの読み取り: カレンダーと予定の読み取りを許可する必要がある。

#### `GOOGLE_CALENDAR_IDs`

Google Calendar の ID を入力する。
Google Calendar の ID はカレンダーの持ち主のメールアドレスとなる。
複数を入力したい場合、カンマ区切りで入力する。

Google Calendar に登録されたスケジュールを取得しない場合はこの入力は不要である。

#### `SLACK_INCOMING_WEBHOOK`

スケジュールのサマリーを送信する Slack の Incoming Webhook の URL を入力する。
Incoming Webhook の URL の取得手順は [Sending messages using Incoming Webhooks | Slack](https://api.slack.com/messaging/webhooks) に掲載されている。

Slack にスケジュールのサマリーを送信しない場合はこの入力は不要である。

#### `EMAIL_ADDRESS`

スケジュールのサマリーを受信するメールアドレスを入力する。

メールアドレスにスケジュールのサマリーを送信しない場合はこの入力は不要である。

#### `SLACK_SCHEDULE_ICON`

`SLACK_INCOMING_WEBHOOK` を入力した場合に、bot の発言のアイコンを設定する。
`:morning:` のように Slack のリアクションを指定する。

指定しない場合 `:カニ:` が使われる。
