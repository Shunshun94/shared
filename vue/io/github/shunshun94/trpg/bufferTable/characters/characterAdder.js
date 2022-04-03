const isVampireBlood = (url) => {
    return url.startsWith('https://charasheet.vampire-blood.net/');
};
const getJsonpUrl = (url) => {
    if(isVampireBlood(url)) {
        const validatedUrl = /https:\/\/charasheet.vampire-blood.net\/[a-fm0-9]+/.exec(url)[0];
        return `${validatedUrl}.js`;
    } else {
        return `${url}&mode=json`;
    }
};
Vue.component('character-adder', {
    data: function() {
        return {
            characterSheetUrl: '',
            charcterList: com.hiyoko.util.mapToArray(JSON.parse(localStorage.getItem('com-hiyoko-sample-sw2sheetparse-index') || '{}'), function(v, k) {
                return {url: k, name: v};
            })
        };
    },
    template: `<section id="io-github-shunshun94-trpg-bufferTable-characters-adder">
        <p>キャラクターシートURL：<input type="text"
            v-model="characterSheetUrl"
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
            const jsonAccessUrl = getJsonpUrl(this.characterSheetUrl); 
            axios.get(jsonAccessUrl, {
                adapter: axiosJsonpAdapter,
                callbackParamName: 'callback'
            }).then(function (response) {
                this.characterSheetUrl = '';
                if(response.data.type === 'm') {
                    const count = Number(response.data.statusNum) + 1;
                    const name = response.data.monsterName;
                    const result = [];

                    for(let i = 1; i < count; i++) {
                        result.push({
                            name: `${name}: ${response.data[`status${i}Style`]}`
                        });
                    }
                    this.$emit('io-github-shunshun94-trpg-bufferTable-characters-adder-addCharacter', result);
                } else {
                    this.$emit('io-github-shunshun94-trpg-bufferTable-characters-adder-addCharacter', [{
                        name: response.data.pc_name  || response.data.characterName
                    }]);
                }
            }.bind(this));
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
