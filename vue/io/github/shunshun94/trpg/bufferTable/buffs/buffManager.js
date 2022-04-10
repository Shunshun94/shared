

Vue.component('buff-manager', {
    props: ['store'],
    computed: {
        computedStore: {
            get: function(   ){return this.store.slice(); },
            set: function(val){
                this.$emit('io-github-shunshun94-trpg-buffertable-buffstore-updatebuffs', val);
            }
        }
    },
    template: `<section id="io-github-shunshun94-trpg-bufferTable-buffstore">
        <buff-adder
            v-on:io-github-shunshun94-trpg-bufferTable-buffstore-adder-addBuff="addBuff"
        ></buff-adder>
        <div id="io-github-shunshun94-trpg-bufferTable-buffstore-store">
            <draggable v-model="computedStore" group="buffs" >
                <buff-data
                    v-for="buff in computedStore" v-bind:buff="buff"
                    v-on:io-github-shunshun94-trpg-bufferTable-buffstore-adder-addBuff="addBuff"
                ></buff-data>
            </draggable>
        </div>
    </section>`,
    methods: {
        addBuff: function(buff) {
            const newList = this.store.slice().concat([buff]);
            this.$emit('io-github-shunshun94-trpg-buffertable-buffstore-updatebuffs', newList);
        }
    }
});
