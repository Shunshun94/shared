Vue.component('character-manager', {
    props: ['characters'],
    template: `<section id="io-github-shunshun94-trpg-bufferTable-characters">
        <character-adder
            v-on:io-github-shunshun94-trpg-bufferTable-characters-adder-addCharacter="addCharacter"
        ></character-adder>
        <table border="1"  id="io-github-shunshun94-trpg-bufferTable-characters-list">
            <character-status
                v-for="character in characters" v-bind:character="character"
                v-on:io-github-shunshun94-trpg-bufferTable-characters-adder-updateCharacter="updateCharacter"
            ></character-status>
        </table>
    </section>`,
    methods: {
        addCharacter: function(character) {
            const newList = this.characters.slice().concat(character);
            const validateList = newList.map((d)=>{return d.name});
            this.$emit(
                'io-github-shunshun94-trpg-buffertable-characters-updatecharacters',
                newList.filter((c, i) => validateList.indexOf(c.name) === i));
        },
        updateCharacter: function(character) {
            const newList = this.characters.slice();
            newList.forEach((c)=>{
                if(c.name === character.name) {
                    c.buffs = character.buffs;
                }
            });
            this.$emit('io-github-shunshun94-trpg-buffertable-characters-updatecharacters', newList);
        }
    }
});

Vue.component('character-status', {
    props: ['character'],
    computed: {
        url: function() {return this.character.url;},
        buffs: {
            get(   ) {return this.character.buffs.slice();},
            set(val) {
                this.$emit('io-github-shunshun94-trpg-bufferTable-characters-adder-updateCharacter', {
                    name: this.character.name,
                    url: this.character.url,
                    buffs: val
                })
            }
        }
    },
    template: `<tr class="io-github-shunshun94-trpg-bufferTable-characters-list-character">
        <th class="io-github-shunshun94-trpg-bufferTable-characters-list-character-name">
            <a v-bind:href="url" target="_blank">{{character.name}}</a></th>
        <td class="io-github-shunshun94-trpg-bufferTable-characters-list-character-buffs">
            <draggable v-model="buffs" group="buffs" >
                <buff-data
                    v-for="buff in buffs" v-bind:buff="buff"
                ></buff-data>
            </draggable>
        </td>
    </tr>`
});
