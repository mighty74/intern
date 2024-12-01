const text = document.querySelectorAll('button')[0].innerText;
console.log(text);// ふつうのボタン
// 文字を変える
document.querySelector('.success').innerText = '文字が変わるボタン';
// 色を変える
document.getElementById('cancel').style.color = '#f06955';
// 非表示にする
document.getElementById('delete').style.display = 'none';
