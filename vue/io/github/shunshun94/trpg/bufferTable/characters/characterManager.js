Vue.component('character-manager', {
    props: ['characters'],
    template: `<section id="io-github-shunshun94-trpg-bufferTable-characters">
        <character-adder
            v-on:io-github-shunshun94-trpg-bufferTable-characters-adder-addCharacter="addCharacter"
        ></character-adder>
        <table border="1"  id="io-github-shunshun94-trpg-bufferTable-characters-list">
            <character-status
                v-for="character in characters" v-bind:character="character"
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
        }
    }
});

Vue.component('character-status', {
    props: ['character'],
    template: `<tr class="io-github-shunshun94-trpg-bufferTable-characters-list-character">
        <th class="io-github-shunshun94-trpg-bufferTable-characters-list-character-name">{{character.name}}</th>
        <td class="io-github-shunshun94-trpg-bufferTable-characters-list-character-buffs"></td>
    </tr>`
});
