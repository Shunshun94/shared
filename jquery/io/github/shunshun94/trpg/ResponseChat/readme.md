# ResponseChat

## これは何? いつものテンプレで

ResponseChat は、GM としてセッションテンポを向上させたいGM 向けのオンセ支援ツールです。
ユーザーはテキセで高速な返答ができ、素のどどんとふとは違って、
複数人へのレスポンス・複数人としてのアウトプットを高速化する機能が備わっている事が特徴です。

## 設置方法

``` html
<head>
	<link rel="stylesheet" href="https://shunshun94.github.io/shared/jquery/io/github/shunshun94/trpg/ResponseChat/responseChat.css" type="text/css" />
</head>
<body>
	<div id="base"></div>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script src="https://shunshun94.github.io/shared/jquery/com/hiyoko/bcdice-api/BCDice-API.js"></script>
	<script src='https://shunshun94.github.io/shared/jquery/com/hiyoko/dodontof/v2/DodontoF-Client.js'></script>
	<script src='https://shunshun94.github.io/shared/jquery/com/hiyoko/dodontof/v2/DodontoF-chatUtil.js'></script>
	<script src='https://shunshun94.github.io/shared/jquery/com/hiyoko/util/v2/utils.js'></script>
	<script src="https://shunshun94.github.io/shared/other/io/github/shunshun94/trpg/clientSpec.js"></script>
	<script src="https://shunshun94.github.io/shared/external/discord.io/index.js"></script>
	<script src="https://shunshun94.github.io/shared/other/io/github/shunshun94/trpg/discord/client.js"></script>
	<script src="https://shunshun94.github.io/shared/jquery/io/github/shunshun94/trpg/dummy/client.js"></script>
	<script src="https://shunshun94.github.io/shared/jquery/com/hiyoko/components/v1/ApplicationBase.js"></script>
	<script src="https://shunshun94.github.io/shared/other/io/github/shunshun94/trpg/clientFactory.js"></script>
	<script src='https://shunshun94.github.io/shared/jquery/com/hiyoko/dodontof/v2/DodontoF-Chat.js'></script>
	<script src="https://shunshun94.github.io/shared/jquery/io/github/shunshun94/trpg/ResponseChat/responseChat.js"></script>
	<script>
		const query = com.hiyoko.util.getQueries();
		$('#base').append(io.github.shunshun94.trpg.ResponseChat.generateDom('base-chat'));
		const client = io.github.shunshun94.trpg.RoomClientFactory(query);
		new io.github.shunshun94.trpg.ResponseChat($('#base-chat'), {
			displayLimit: 15
		});
		$('#chat').on('tofRoomRequest', (event) => {
			client[event.method].apply(client, event.args).done(event.resolve).fail(event.reject);
		});
	</script>
</body>
```

## 動作サンプル

[サンプル](https://shunshun94.github.io/shared/sample/ResponseChat.html)

## どんな機能が要る

### 複数人へのレスポンス

GM は1人であるにも関わらず PL は複数人いる。
複数人の PL それぞれに対して GM は返答する。
そのため、GM は処理速度の面でボトルネックになりやすい。
この問題を解消するためのアプローチを行う。

#### 誰のどの発言への返答なのかわかりやすくする機能

チャットに表示された発言に対して、
引用や `@発言者` 等と記載した返答を行えるようにする。

どの発言への返答・誰への返答なのか明確にし、
ミスコミュニケーションを減らしたり、 
返答先を明確にするための説明コストを下げたりする。

#### どの発言に返答したのかメモする機能

質疑応答などの場で返答が漏れることがある。
この解消のために既に返答を送った発言が分かるようにする。

未返答の質問が分かるので見落としがなくなる。

#### 返答の文章を即座に入力する機能　

GM をやっていると頻繁に行われる返答がある。
例えば「ダイスを振ってよいか？」に対して「どうぞ」等。

よく使う発言は入力せずともワンクリックで発言できるようにする。

### 複数人としてのアウトプット

PL は通常1つの PC を扱う。
それに対し、GM は1人であるにも関わらず、複数人の NPC を扱うことが多い。
そのため、GM は NPC を使い分けて動かすのに労力がかかり、
ロールの面でボトルネックになりやすい。
この問題を解消するためのアプローチを行う。

#### NPC の名前を即座に入力する機能

GM は一場面で複数の NPC を扱う。
これらの NPC を素早く切り替え、それぞれにスムーズに発言をさせる。

クリックでのキャラクターのスムーズな切り替えを可能とする。

#### NPC の発言メモを容易に取り込む機能

NPC の発言を事前に決めておいても、コピペミスからの編集に手間取ることがしばしばある。

発言メモをそのまま張り付けると整形され、名前欄および発言の入力欄に入力される。

