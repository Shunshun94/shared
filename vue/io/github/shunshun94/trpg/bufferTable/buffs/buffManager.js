Vue.component('buff-manager', {
    props: ['store'],
    template: `<section id="io-github-shunshun94-trpg-bufferTable-buffstore">
        <buff-adder
            v-on:io-github-shunshun94-trpg-bufferTable-buffstore-adder-addBuff="addBuff"
        ></buff-adder>
    </section>`,
    methods: {
        addBuff: function(buff) {
            console.log(buff);
        }
    }
});
