Vue.component('character-manager', {
    props: ['characters'],
    template: `<section id="io-github-shunshun94-trpg-bufferTable-characters">
        <character-adder
            v-on:io-github-shunshun94-trpg-bufferTable-characters-adder-addCharacter="addCharacter"
        ></character-adder>
    </section>`,
    methods: {
        addCharacter: function(character) {

        }
    }
});