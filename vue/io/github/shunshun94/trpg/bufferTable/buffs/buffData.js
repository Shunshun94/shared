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
            const newBuff = {};
            this.$emit('io-github-shunshun94-trpg-bufferTable-buffstore-adder-addBuff', Object.assign(newBuff, this.buff));
        }
    }
});