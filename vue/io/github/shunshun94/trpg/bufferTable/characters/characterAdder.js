Vue.component('character-adder', {
    props: ['characters'],
    data: function() {
        return {
            charcterList: com.hiyoko.util.mapToArray(JSON.parse(localStorage.getItem('com-hiyoko-sample-sw2sheetparse-index') || '{}'), function(v, k) {
                return {url: k, name: v};
            })
        };
    },
    template: `<section id="io-github-shunshun94-trpg-bufferTable-characters-adder">
        <p>キャラクターシートURL：<input type="text"
            id="io-github-shunshun94-trpg-bufferTable-characters-adder-sheetUrl"
            list="io-github-shunshun94-trpg-bufferTable-characters-adder-suggest"/>
        <button
            id="io-github-shunshun94-trpg-bufferTable-characters-adder-exec"
            @click="addCharacter"
        >追加</button></p>
        <datalist
            id="io-github-shunshun94-trpg-bufferTable-characters-adder-suggest"
        >
            <character-suggestion
                v-for="character in charcterList" :key="character.url" v-bind:character="character"
            ></character-suggestion>
        </datalist>
    </section>`,
    methods: {
        addCharacter: function(e) {
            
        }
    }
});

Vue.component('character-suggestion', {
    props: ['character'],
    template: `<option v-bind:value="url">{{name}}</option>`,
    computed: {
        url: function() {return this.character.url},
        name: function() {return this.character.name},
    }
});
