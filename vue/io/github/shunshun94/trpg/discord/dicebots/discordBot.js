const bot101Url = 'https://shunshun94.github.io/shared/sample/discordBot_101';
const discordBot = Vue.component('discord-bot-info', {
	props: ['discord_bot'],
	template: `<div class="dicebots-discord-bot"><a href="${bot101Url}">Discord の Bot を作ろう！</a>の手順にしたがい Bot を準備してご利用ください<br/>
Discord Bot の Token: <input type="text" @change="$emit('dicebot-discord-update-token', $event.target.value)" v-bind:value="discord_bot.token" /> (利用したトークンはブラウザに保存され、次回起動時には最初から入力されています)<br/>
Discord の部屋 ID: <input type="text" @change="$emit('dicebot-discord-update-room', $event.target.value)" v-bind:value="discord_bot.room" /><br/>
<button @click="$emit('dicebot-discord-create-bot')">Discord の Bot アカウントに接続する</button></div>`
});

/**


*/