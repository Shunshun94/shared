Vue.component('buff-manager', {
    props: ['store'],
    template: `<section id="io-github-shunshun94-trpg-bufferTable-buffstore">
        <buff-adder
            v-on:io-github-shunshun94-trpg-bufferTable-buffstore-adder-addBuff="addBuff"
        ></buff-adder>
        <div id="io-github-shunshun94-trpg-bufferTable-buffstore-store">
            <buff-data
                v-for="buff in store" v-bind:buff="buff"
            ></buff-data>
        </div>
    </section>`,
    methods: {
        addBuff: function(buff) {
            const newList = this.store.slice().concat([buff]);
            this.$emit('io-github-shunshun94-trpg-buffertable-buffstore-updatebuffs', newList);
        }
    }
});
