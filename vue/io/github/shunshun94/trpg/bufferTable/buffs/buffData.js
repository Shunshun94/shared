Vue.component('buff-data', {
    props: ['buff'],
    template: `<div class="io-github-shunshun94-trpg-bufferTable-buff">
        {{name}}（ラウンド{{limitation}}まで）<button @click="copyBuff">複製</button><button @click="removeBuff">削除</button>
    </div>`,
    computed: {
        name: function() {return this.buff.name;},
        limitation: function() {return `${Number(this.buff.length) + Number(this.buff.from.round)}${this.buff.from.top_bottom}`;}
    },
    methods: {
        copyBuff: function(e) {
            const data = JSON.parse(JSON.stringify(this.buff));
            this.$emit('io-github-shunshun94-trpg-bufferTable-buffstore-adder-addBuff', data);
        },
        removeBuff: function(e) {
            this.$emit('io-github-shunshun94-trpg-bufferTable-buffstore-adder-removeBuff', this.buff.id);
        }
    }
});