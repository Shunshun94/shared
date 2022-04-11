Vue.component('character-save-manager', {
    template: `<div id="io-github-shunshun94-trpg-bufferTable-characters-savemanager">
        <button @click="saveAsTable">表の HTML をクリップボードにコピー</button><br/>
        <button @click="saveAsJson">表を json として保存</button>:<a href="https://shunshun94.github.io/shared/jquery/io/github/shunshun94/trpg/sw2_PCLister/lister.html" target="_blank">ソードワールド2.X PC 能力比較・一覧</a>にドラッグ・ドロップでインポートが可能です
    </div>`,
    methods: {
        saveAsTable: function(e) {
            this.$emit('io-github-shunshun94-trpg-bufferTable-characters-savemanager-getTable');
        },
        saveAsJson: function(e) {
            this.$emit('io-github-shunshun94-trpg-bufferTable-characters-savemanager-getJson');
        }
    }
});
