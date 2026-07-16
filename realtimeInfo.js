// realtimeInfo.js
// "화면(DOM/이벤트)"을 책임지는 모듈. weatherAPI.js에서 데이터 조회 함수를 import한다.

import { fetchWeather, CITY_COORDS } from './weatherAPI.js';

const citySelect = document.getElementById('citySelect');
const weatherBox = document.getElementById('weather-box');

// 기온 기준: 10도 미만 추움 / 10~19도 선선함 / 20~27도 쾌적 / 28도 이상 더움
function getTempColor(temp) {
  if (temp < 10) return '#2f6690';
  if (temp < 20) return '#1f8a70';
  if (temp < 28) return '#3b4a63';
  return '#b5651d';
}
 
// 습도 기준: 30% 미만 건조 / 30~60% 쾌적 / 60% 초과 습함
function getHumidityColor(humidity) {
  if (humidity < 30) return '#b5651d';
  if (humidity <= 60) return '#1f8a70';
  return '#2f6690';
}


if (citySelect && weatherBox) {
  citySelect.addEventListener('change', async function () {
    const cityKey = citySelect.value;

    if (!cityKey) {
      weatherBox.innerHTML = '<p class="weather-placeholder">도시를 선택하면 위치와 날씨 정보가 표시됩니다.</p>';
      return;
    }

    // 1단계: 좌표를 먼저 화면에 표시 (아직 날씨는 안 나온 상태)
    const city = CITY_COORDS[cityKey];
    weatherBox.innerHTML =
      '<div class="weather-loc">' + city.name +
      '<p class="weather-loading">로딩 중...</p>';

    // 2단계: fetch + async/await로 실시간 날씨 데이터 요청
    try {
      const info = await fetchWeather(cityKey);
      const tempColor = getTempColor(info.temperature);
      const humidityColor = getHumidityColor(info.humidity);
      weatherBox.innerHTML =
        '<div class="weather-loc">' + info.city +
        '<div class="weather-stats">' +
          '<div class="weather-stat">' +
            '<span class="weather-stat-label">기온: </span>' +
            '<span class="weather-stat-value" style="color:' + tempColor + ';">' + info.temperature + '°C</span>' +
          '</div>' +
          '<div class="weather-stat">' +
            '<span class="weather-stat-label">습도: </span>' +
            '<span class="weather-stat-value" style="color:' + humidityColor + ';">' + info.humidity + '%</span>' +
          '</div>' +
        '</div>';
    } catch (err) {
      weatherBox.innerHTML = '<p class="weather-error">날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>';
    }
  });
}
