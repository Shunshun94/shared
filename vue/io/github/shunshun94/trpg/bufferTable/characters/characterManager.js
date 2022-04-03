Vue.component('character-manager', {
    props: ['characters'],
    template: `<section id="io-github-shunshun94-trpg-bufferTable-characters">
        <character-adder
            v-on:io-github-shunshun94-trpg-bufferTable-characters-adder-addCharacter="addCharacter"
        ></character-adder>
        <table border="1"  id="io-github-shunshun94-trpg-bufferTable-characters-list">
            <character-status
                v-for="name in characters" v-bind:name="name"
            ></character-status>
        </table>
    </section>`,
    methods: {
        addCharacter: function(character) {
            const newList = this.characters.slice();
            newList.push(character);
            this.$emit(
                'io-github-shunshun94-trpg-buffertable-characters-updatecharacters',
                newList.filter((name, i, list) => list.indexOf(name) === i));
        }
    }
});

Vue.component('character-status', {
    props: ['name'],
    template: `<tr class="io-github-shunshun94-trpg-bufferTable-characters-list-character">
        <th class="io-github-shunshun94-trpg-bufferTable-characters-list-character-name">{{name}}</th>
        <td class="io-github-shunshun94-trpg-bufferTable-characters-list-character-buffs"></td>
    </tr>`
});
