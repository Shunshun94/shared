const main = new Vue({
    el: '#buffer-table',
    data: {
        characters: {},
        effects: {},
        mapping: {}
    },
    methods: {
        updateCharacters: function(characters) {
            this.characters = characters;
        }
    }

});