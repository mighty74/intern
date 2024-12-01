const SPOT_SEARCH_URL = 'https://api-service.instruction.cld.dev.navitime.co.jp/beginner/v1/spot';
const ROUTE_SEARCH_URL = 'https://api-service.instruction.cld.dev.navitime.co.jp/beginner/v1/route_transit';
const ROUTE_SHAPE_URL = 'https://api-service.instruction.cld.dev.navitime.co.jp/beginner/v1/shape_transit';
const state = {};
let staticPin = [];
let infoWindow = [];
let json;
let goal = "";
let isDraw = false;
let start_point_info = ['', ''];
let goal_point_info = ['', ''];

(() => {
  window.addEventListener("load", () => {
    state.map = new navitime.geo.Map(
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
  //こう書くと綺麗になる
  //$('#search_result').text("「" + formElements.search.value + "」の検索結果");
  const search_result = $('#search_result')[0];
  search_result.innerText = "「" + formElements.search.value + "」の検索結果";
  $('#route_start')[0].innerText = '発:' + start_point_info[0];
  $('#route_goal')[0].innerText = "着:" + goal_point_info[0];
  const route_result = $('#route_result');
  if(route_result.children('input')){
    route_result.children('input').remove();
  }
  route_result.append('<input class="routeOther_search_button" type="button" name="submit" value="検索">');
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
  json = response.data;
  const num = json.items.length;
  const $spotContainer = $('#spot_container');
  //コンソールに表示
  console.log(json);
  // #spot_containerの要素をからにする
  $('.card').remove();
  //pinを消す
  pinClear()
  // json.items.forEach(item => {
    // json.items[i] -> item になる
  // })
  for(let i = 0; i < num; i++){
    // #spot_containerに要素を追加
    $spotContainer
    .append(`<div class="card">
        <div class="contain">
          <img class="image" height="100px" width="140px" alt="none" />
          <div class="contain_text">
            <h5>${json.items[i].name}</h5>
            <p>${json.items[i].address_name}</p>
            <input class="route_search_start_button" type="button" name="submit" value="出発地">
            <input class="route_search_goal_button" type="button" name="submit" value="目的地">
          </div>
        </div>
      </div>`);

    let msg = '';
    let phoneAddress = '';
    if(json.items[i].details){
      const img = json.items[i].details[0].images?.[0]?.path ?? './assets/img/noimage.jpg';
      $('.card').eq(i).children('.contain').children('img').attr('src', img);
      const activeTime = json.items[i].details[0].texts?.[0]?.value ?? '記載無し';
      msg = '</br>営業時間:' + activeTime;
    }
    const phoneText = json.items[i].phone ?? '-'
    phoneAddress = '</br>電話番号:' + phoneText;

    const pos = new navitime.geo.LatLng(json.items[i].coord.lat, json.items[i].coord.lon)
    const pin = new navitime.geo.overlay.Pin({
      icon:'./assets/img/a-2.png',
      position:pos,
      draggable:false,
      map:state.map,
      title:json.items[i].name
    });
    const window = new navitime.geo.overlay.InfoWindow({
      map:state.map,
      position:pos,
      content:json.items[i].name + '</br>住所:' + json.items[i].address_name + phoneAddress + msg
    })
    staticPin.push(pin);
    window.setVisible(false);
    infoWindow.push(window);

  }


/**
* ルート検索に成功した時に実行される関数。
*/
function routeSerchSuccessHandler(response) {
  console.log('test');
  //GeoJSON形式のオブジェクトをデータから取得
  routeJson = response.data;
  console.log(routeJson);
  let fares = "0";
  let transit_count = "0";

  $('#route_time')[0].innerText = routeJson.items[0].summary.move.from_time.substr( 11, 5 ) + '→' + routeJson.items[0].summary.move.to_time.substr( 11, 5 );
  $('.subject')[0].innerText = "総移動距離";
  $('.date')[0].innerText = Math.round(routeJson.items[0].summary.move.distance *10 ) / 1000 + 'km';
  $('.subject')[1].innerText = "料金";
  if(routeJson.items[0].summary.move.fare != undefined){
    fares = routeJson.items[0].summary.move.fare.unit_0;
  }
  $('.date')[1].innerText = fares + '円';
  $('.subject')[2].innerText = "乗換回数";
  if(routeJson.items[0].summary.move.transit_count != undefined){
    transit_count = routeJson.items[0].summary.move.transit_count;
  }
  $('.date')[2].innerText = transit_count + '回';

}





/**
* ルートシェイプ検索に成功した時に実行される関数。
*/
function routeShapeSuccessHandler(response) {
  //GeoJSON形式のオブジェクトをデータから取得
  const geojson = response.data;
  //以下ルート図示
  const options = {
    map: state.map,
    unit: 'degree',
    allRoute: true,
    arrow: true,
    originalColor: true
  };
  state.renderer = new navitime.geo.route.Renderer(geojson, options);
  state.renderer.draw(); // ルートを地図上に描画する
  isDraw = true;
}


/**
* カードがクリックされた時の動作
*/
$('.card').on('click', function () {
  const index = $('.card').index(this);
  //console.log(staticPin[index]);
  switchPin(index)
  panTo(index)
});

/**
 * 出発地が選択されたとき
 */
$('.route_search_start_button').on('click', function () {
  const index = $('.route_search_start_button').index(this);
  start_point_info = [json.items[index].name ,json.items[index].coord.lat + ',' + json.items[index].coord.lon];
  $('#route_start')[0].innerText = "発:" + start_point_info[0];
  if($('#route_start_box').children('input')){
    $('#route_start_box').children('input').remove();
  }
  $('#route_start_box').append('<input id="start_remove_botton" class="remove_button" type="button" name="submit" value="×">');

  $('#start_remove_botton').on('click', function () {
    console.log("a");
    $('#route_start')[0].innerText = "発:";
    start_point_info = ['', ''];
    $('#route_start_box').children('input').remove();
  });
});

/**
 * 目的地が選択されたとき
 */
$('.route_search_goal_button').on('click', function () {
  const index = $('.route_search_goal_button').index(this);
  goal_point_info = [json.items[index].name ,json.items[index].coord.lat + ',' + json.items[index].coord.lon];
  $('#route_goal')[0].innerText = "着:" + goal_point_info[0];
  if($('#route_goal_box').children('input')){
    $('#route_goal_box').children('input').remove();
  }
  $('#route_goal_box').append('<input id="goal_remove_botton" class="remove_button" type="button" name="submit" value="×">');

  $('#goal_remove_botton').on('click', function () {
    console.log("b");
    $('#route_goal')[0].innerText = "着:";
    goal_point_info = ['', ''];
    $('#route_goal_box').children('input').remove();
  });
});

//動かない
// $('.remove_button').on('click', function () {
//   console.log("a");
//   const index = $('.remove_button').index(this);
//   alert(index);
// });


$('.routeOther_search_button').on('click', function () {
  if(isDraw){
    state.renderer.destroy();
  }
  let time = new Date();
  let now = time.toISOString().split('.').shift();
  //たたくAPIを表示
  if(start_point_info[0] == '' || goal_point_info[0] == ''){
    return 0;
  }
  axios.get(ROUTE_SEARCH_URL + '?start=' + start_point_info[1] + '&goal=' + goal_point_info[1] + '&start_time=' + now)
      .then(routeSerchSuccessHandler)
      .catch(function (error) {
          console.log('status code', error.status);
      });
  axios.get(ROUTE_SHAPE_URL + '?start=' + start_point_info[1] + '&goal=' + goal_point_info[1] + '&start_time=' + now + '&options=transport_shape')
      .then(routeShapeSuccessHandler)
      .catch(function (error) {
          console.log('status code', error.status);
      });
});


/**
* ルート検索がクリックされた時の動作
*/
$('.route_search_button').on('click', function () {
  if(isDraw){
    state.renderer.destroy();
  }
  const index = $('.route_search_button').index(this);
  goal = json.items[index].name;
  console.log(json);
  //出発時刻（後々変更したい）
  let time = new Date();
  let now = time.toISOString().split('.').shift();
  //たたくAPIを表示
  console.log(ROUTE_SEARCH_URL + '?start=' + json.items[index].coord.lat + ',' + json.items[index].coord.lon + '&goal=35.664159,139.718117&start_time=' + now);
  axios.get(ROUTE_SEARCH_URL + '?start=' + json.items[index].coord.lat + ',' + json.items[index].coord.lon + '&goal=35.664159,139.718117&start_time=' + now)
      .then(routeSerchSuccessHandler)
      .catch(function (error) {
          console.log('status code', error.status);
      });
  axios.get(ROUTE_SHAPE_URL + '?start=' + json.items[index].coord.lat + ',' + json.items[index].coord.lon + '&goal=35.664159,139.718117&start_time=' + now + '&options=transport_shape')
      .then(routeShapeSuccessHandler)
      .catch(function (error) {
          console.log('status code', error.status);
      });
});




/**
 * pin,windowのスイッチャー
 */
function switchPin(index){
  for(let i = 0; i < json.count.limit; i++){
    if(infoWindow[i].getVisible()){
      infoWindow[i].setVisible(false);
      staticPin[i].setVisible(true);
    }
  }
  staticPin[index].setVisible(!staticPin[index].getVisible());
  infoWindow[index].setVisible(!infoWindow[index].getVisible());
}

/**
 * mapの中心点の移動関数
 */
function panTo(index){
  state.map.panTo(new navitime.geo.LatLng(json.items[index].coord.lat, json.items[index].coord.lon), 15);
}

/**
 * 時刻の桁のフォーマットを行う
 */
function timeFormatter(time){
  if(time < 10){
    time = "0" + time;
  }
  return time;
}

/**
 * pin,window削除する
 */
function pinClear(){
  for(let i = 0; i < staticPin.length; i++){
    staticPin[i].setMap();
    infoWindow[i].setMap();
  }
  staticPin = [];
  infoWindow = [];
}

}
