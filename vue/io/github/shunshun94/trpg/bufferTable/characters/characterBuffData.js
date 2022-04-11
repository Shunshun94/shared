Vue.component('chracter-buff-data', {
    props: ['buff'],
    template: `<div class="io-github-shunshun94-trpg-bufferTable-characters-list-character-buffs-buff">
        {{name}}（ラウンド{{limitation}}まで）
    </div>`,
    computed: {
        name: function() {return this.buff.name;},
        limitation: function() {return `${Number(this.buff.length) + Number(this.buff.from.round)}${this.buff.from.top_bottom}`;}
    }
});