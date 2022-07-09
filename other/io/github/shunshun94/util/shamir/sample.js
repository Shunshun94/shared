document.getElementById('generate_share').onclick = (e)=>{
    document.getElementById('share_generated').value = io.github.shunshun94.util.Shamir.calculateSharedSecretFromText(
               document.getElementById( 'seed_str').value,
        Number(document.getElementById('share_num').value),
        Number(document.getElementById( 'seed_num').value)
    ).map((share)=>{return `${share.x},${share.y.join()}`;}).join('\n');

};

document.getElementById('share_generated').onclick = (e)=>{
    io.github.shunshun94.util.insertToClipboard(document.getElementById('share_generated').value).then(alert('クリップボードにシェアをコピーしました！'));
};

document.getElementById('generate_secret').onclick = (e)=>{
    document.getElementById('secret').textContent = io.github.shunshun94.util.Shamir.calculateSecretStringFromShares(
        document.getElementById('inputed_share').value.split('\n').map((line)=>{
            const nums = line.split(',').map(Number);
            return {
                x: nums[0],
                y: nums.slice(1)
            };
        })
    );
};
