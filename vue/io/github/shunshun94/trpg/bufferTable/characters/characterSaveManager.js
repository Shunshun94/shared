Vue.component('character-save-manager', {
    template: `<div id="io-github-shunshun94-trpg-bufferTable-characters-savemanager">
        <button @click="saveAsTable">表の HTML をクリップボードにコピー</button><br/>
        <button @click="saveAsJson">表を json として保存</button>
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
