const SPOT_SEARCH_URL = 'https://api-service.instruction.cld.dev.navitime.co.jp/beginner/v1/spot';


(() => {
  window.addEventListener("load", () => {
    new navitime.geo.Map(
      "map",
      new navitime.geo.LatLng("35.667399", "139.714888"),
      15
    );
  });
})();


/**
* ボタンがクリックされた時に第2引数で渡された関数を実行し、API通信する。
*/
$('#search_button').on('click', function () {
  //ボタンクリックしたときにコンソールに表示
  console.log("search_button on click");
  //formのデータを取得
  const formElements = document.forms.form;
  //input text のデータをコンソールに表示
  console.log('Text: ', formElements.search.value);
  //検索内容を表示する
  const search_result = $('#search_result')[0];
  search_result.innerText = "「" + formElements.search.value + "」の検索結果"
  //たたくAPIを表示
  console.log(SPOT_SEARCH_URL + '?word=' + formElements.search.value + '&options=detail');
  axios.get(SPOT_SEARCH_URL + '?word=' + formElements.search.value + '&options=detail')
      .then(serchSuccessHandler)
      .catch(function (error) {
          console.log('status code', error.status);
      });
});


/**
* スポット検索に成功した時に実行される関数。
*/
function serchSuccessHandler(response) {
  //GeoJSON形式のオブジェクトをデータから取得
  const json = response.data;
  const num = json.count.limit;
  const $spotContainer = $('#spot_container');
  //コンソールに表示
  console.log(json);
  // #spot_containerの要素をからにする
  $('.card').remove();
  for(let i = 0; i < num; i++){
    // #spot_containerに要素を追加
    $spotContainer
    .append(`<div class="card">
        <div class="contain">
          <img class="image" height="100px" width="140px" alt="none" />
          <div class="contain_text">
            <h5>${json.items[i].name}</h5>
            <p>${json.items[i].address_name}</p>
          </div>
        </div>
      </div>`)
    if(json.items[i].details != undefined){
      if(json.items[i].details[0].images != undefined){
        $('.card').eq(i).children('.contain').children('img').attr('src', json.items[i].details[0].images[0].path);
      }
    }

  }

}
