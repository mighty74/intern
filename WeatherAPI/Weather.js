async function callApi(){
    const res = await window.fetch("http://api.openweathermap.org/data/2.5/weather?q=Osaka,JP&appid=50cc7d23ef8c9d0cb72009b52020bd12&lang=ja&units=metric");
    const weathers = await res.json();
    // console.log(weathers.main.temp);
    document.getElementById('temp').innerHTML = weathers.main.temp ;
}

callApi();