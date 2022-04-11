var updateBuffStorage = (buffInfo) => {
    let flag = true;
    const baseData = JSON.parse(localStorage.getItem('io-github-shunshun94-trpg-sw2_pclister-buffs') || '[]').map((buff)=>{
        if(buff[0] === buffInfo.name) {
            for(var i = buff.length; i < 12; i++) {
                buff.push(0);
            }
            buff[12] = buffInfo.length;
            flag = false;
        }
        return buff;
    });
    if(flag) {
        baseData.push([
            buffInfo.name,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            buffInfo.length
        ]);
    }
    localStorage.setItem('io-github-shunshun94-trpg-sw2_pclister-buffs', JSON.stringify(baseData));
};

Vue.component('buff-adder', {
    data: function() {
        return {
            buffInfo: {
                name: '',
                length: 18,
                from: {
                    round: 1,
                    top_bottom: '表'
                }
            },
            buffList: com.hiyoko.util.mapToArray(JSON.parse(localStorage.getItem('io-github-shunshun94-trpg-sw2_pclister-buffs') || '[]'), function(v) {
                return {
                    name: v[0],
                    length: v[12] || 18
                };
            })
        };
    },
    template: `<section id="io-github-shunshun94-trpg-buffstore-buffs-adder">
        <p>名称：<input type="text"
            v-model="buffInfo.name"
            @input="onInputBuffName"
            id="io-github-shunshun94-trpg-buffstore-buffs-adder-name"
            list="io-github-shunshun94-trpg-buffstore-buffs-adder-name-suggest"/><br/>
        効果時間：<select
            v-model="buffInfo.length"
            id="io-github-shunshun94-trpg-buffstore-buffs-adder-length">
            <option value="18">3分(18ラウンド)</option>
            <option value="3">30秒(3ラウンド)</option>
            <option value="1">10秒(1ラウンド)</option>
            <option value="6">1分(6ラウンド)</option>
            <option value="9">1分半(9ラウンド)</option> <!-- 錬体の極意を考えるとこれも必要 -->
            <option value="360">1時間以上(360ラウンド)</option>
        </select><br/>
        タイミング：<input
            type="number"
            min="0"
            v-model="buffInfo.from.round"
            id="io-github-shunshun94-trpg-buffstore-buffs-adder-from"/>
        <select
            v-model="buffInfo.from.top_bottom"
            id="io-github-shunshun94-trpg-buffstore-buffs-adder-topBottom">
            <option value="表">表</option>
            <option value="裏">裏</option>
        </select>
        <button
            id="io-github-shunshun94-trpg-buffstore-buffs-adder-exec"
            @click="addBuff"
        >追加</button></p>
        <datalist id="io-github-shunshun94-trpg-buffstore-buffs-adder-name-suggest">
            <buff-suggestion
                v-for="buff in buffList" :key="buff.name" v-bind:buff="buff"
            ></buff-suggestion>
        </datalist>
    </section>`,
    methods: {
        addBuff: function(e) {
            const data = JSON.parse(JSON.stringify(this.buffInfo));
            updateBuffStorage(this.buffInfo);
            this.$emit('io-github-shunshun94-trpg-bufferTable-buffstore-adder-addBuff', data);
        },
        onInputBuffName: function(e) {
            const data = this.buffList.filter((buff)=>{return buff.name === this.buffInfo.name;});
            if(data.length) {
                this.buffInfo.length = Number(data[0].length);
            }
        }
    }
});

Vue.component('buff-suggestion', {
    props: ['buff'],
    template: `<option v-bind:value="name">{{name}}</option>`,
    computed: {
        name: function() {return this.buff.name},
    }
});
