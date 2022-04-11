const main = new Vue({
    el: '#buffer-table',
    data: {
        characters: [],
        store: [],
        mapping: {}
    },
    methods: {
        updateCharacters: function(characters) {
            this.characters = characters;
        },
        updateBuffs: function(buffs) {
            this.store = buffs;
        }
    }
});