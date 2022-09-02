/////// карта

let myMap;
let latCity;
let lonCity;
let apiKey = 'e3b7f8c1b9e59ceff04bd80e7a9b441b';

const weatherBlock = document.querySelector('#weather'); //блок погода

//Загрузка API и готовность DOM
ymaps.ready(init);

function init() {
    myMap = new ymaps.Map("map", {
        center: [52.4239, 31.0132],
        zoom: 11,
        controls: ['fullscreenControl']
    }, {
        searchControlProvider: 'yandex#map'
    });
     
    let searchControl = new ymaps.control.SearchControl({
        options: {
            fitMaxWidth: false
        }
    });
    myMap.controls.add(searchControl);
 
    searchControl.events.add('resultselect', function(e) {
        let searchRequestString = searchControl.getRequestString();// получить строку запроса
         
        let results = searchControl.getResultsArray();
        let selected = e.get('index');
        let point = results[selected].geometry.getCoordinates();
        
        latCity = point[0];
        lonCity = point[1];

        let url = `http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latCity}&lon=${lonCity}&lang=ru&appid=${apiKey}`;

        weather(url)
    });

    let geolocation = ymaps.geolocation;
    geolocation.get({
        // Выставляем опцию для определения положения по ip
        provider: 'yandex',
        // Карта автоматически отцентрируется по положению пользователя.
        mapStateAutoApply: true,
        // Включим автоматическое геокодирование результата.
        autoReverseGeocode: true
    }).then(function(result) {
        let userAddress = result.geoObjects.get(0).properties.get('text');
        let userCoodinates = result.geoObjects.get(0).geometry.getCoordinates();
        result.geoObjects.get(0).properties.set({
            balloonContentBody: 'Адрес: ' + userAddress +
                                '<br/>Координаты:' + userCoodinates
        });
        myMap.geoObjects.add(result.geoObjects);

        latCity = userCoodinates[0];
        lonCity = userCoodinates[1];

        let url = `http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latCity}&lon=${lonCity}&lang=ru&appid=${apiKey}`;

        weather(url);
    })
}

function weather(url) {
    async function loadWeather(e) {
        weatherBlock.innerHTML = `
            <div class= "weather_loading">
                <img src="./Image/Waitt.gif" alt="Loading..."
            </div>`;
        const response = await fetch(url, {
            method: 'GET',
            });
    
        const responseResult = await response.json();
        if(response.ok) {
            getWeather(responseResult);
        } else {
            weatherBlock.innerHTML = responseResult.message;
        }
    }

    function getWeather(data) {
    console.log(data);

        // обработка данных
        const location = data.name;
        const temp = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const weatherStatus = data.weather[0].description;
        const weatherIcon = data.weather[0].icon;
        const wind = data.wind.speed;
        const humidity = data.main.humidity;

        const nowTime = new Date().toLocaleTimeString();
        const nowDay = new Date().toLocaleDateString();

        let sunRise = data.sys.sunrise;
        let datesr = new Date((sunRise + data.timezone)*1000);
        datesr = datesr.getUTCHours() + ":" + datesr.getMinutes() + ":" + datesr.getSeconds();

        let sunSet = data.sys.sunset;
        let datess = new Date((sunSet + + data.timezone)*1000);
        datess = datess.getUTCHours() + ":" + datess.getMinutes() + ":" + datess.getSeconds();



        // добавление данных 
        const template = `
            <div class="weather_header">
                <div class="weather_main">
                    <div class="weather_city">${location}</div>
                    <div class="weather_status">${weatherStatus}</div>
                </div>
                <div class="weather_icon">
                    <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="${weatherStatus}">
                </div>
            </div>
            <div class="weather_descryption">
                <div class="weather_basic">
                    <div class="weather_temp">${temp}</div>
                    <div class="now_data">${nowDay}, ${nowTime}</div>
                </div>
                <div class="weather_additionally">
                    <div class="weather_feels_like">Ощущается: ${feelsLike}</div>
                    <div class="weather_wind">Ветер: ${wind} км/ч</div>
                    <div class="weather_humidity">Влажность: ${humidity} %</div>
                    <div class="weather_sunrise">Восход солнца: ${datesr}</div>
                    <div class="weather_sunset">Закат солнца: ${datess}</div>
                    
                </div>
            </div>
            `;
        weatherBlock.innerHTML = template;
    }

    if(weatherBlock) {
        loadWeather();
    }
}

// цитаты 
let quoteText = document.getElementById('quoteText');
let quoteAuthor = document.getElementById('quoteAuthor')
let buttonNext = document.getElementById('next');

const url = "https://api.quotable.io/random";

let getQuote = () => {
  fetch(url)
    .then((data) => data.json())
    .then((item) => {
        quoteText.innerText = item.content;
        quoteAuthor.innerText = item.author;
    });
};

window.addEventListener("load", getQuote);
buttonNext.addEventListener("click", getQuote);

///////////

// яндекс карты ключ API
//eb7826b7-046c-442a-b1bb-361dc0a1bf60

// погода OpenWeather key
// e3b7f8c1b9e59ceff04bd80e7a9b441b
