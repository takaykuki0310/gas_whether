// LINE Message API チャネルアクセストークン
const LINE_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_ACCESS_TOKEN');
//ユーザーIDを指定
const LINE_USER_ID = PropertiesService.getScriptProperties().getProperty('LINE_USER_ID');
// 通知用のLINE API
var PUSH_API = 'https://api.line.me/v2/bot/message/push';
const WEATHER_APP_ID = PropertiesService.getScriptProperties().getProperty('WEATHER_APP_ID');

var response_weather = UrlFetchApp.fetch('https://api.openweathermap.org/data/2.5/weather?q=Hayama,JP&units=metric&lang=ja&appid='+ WEATHER_APP_ID);
var data = JSON.parse(response_weather.getContentText());

Logger.log(data);

var city = data.name;

// current data
var summary = data.weather[0].description;
var temp = Math.floor(data.main.temp);
var date = new Date(data.dt*1000);

Logger.log(city);
Logger.log(summary);
Logger.log(temp);
Logger.log(date);

var todayWeather = "今日 " + date.getHours() + "時の天気" + city + "：" + summary + " " + temp + "℃";

/**
 * spreadsheetへデータを送る
 */
function getWeatherOfArea() {
 // 今日の日付の取得
  const date = new Date()
 // シート情報の取得
  const mySheet = SpreadsheetApp.openById("1OBaDsdnkGTGGJy52vmNv9kT_IFSnqvdNOSJ1gHtGasE").getActiveSheet()
 // シートに記載のある最終行を取得
  const lastRow = mySheet.getLastRow()
 // シートのB列に日付を「xxxx/xx/xx」の形式で挿入
  mySheet.getRange(lastRow + 1, 2).setValue(Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM/dd'))
 // シートのC列に気温情報を挿入
  mySheet.getRange(lastRow + 1, 3).setValue(data.main.temp)
  mySheet.getRange(lastRow + 1, 4).setValue(data.main.temp_min)
  mySheet.getRange(lastRow + 1, 5).setValue(data.main.temp_max)
  mySheet.getRange(lastRow + 1, 6).setValue(data.main.humidity)
}
/**
 * push
 * botからメッセージを送る
 */
function doPost() {
    // リクエストヘッダ
    var headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: 'Bearer ' + LINE_ACCESS_TOKEN
    };
    // メッセージ
    var postData = {
        to: LINE_USER_ID,
        messages: [
            {
                type: 'text',
                text: todayWeather
            },
        ]
    };
    // POSTオプション作成
    var options = {
        method: 'POST',
        headers: headers,
        payload: JSON.stringify(postData)
    };
    return UrlFetchApp.fetch(PUSH_API, options);
}
