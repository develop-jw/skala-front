// weatherAPI.js
// 날씨 "데이터"를 책임지는 모듈 (DOM은 다루지 않는다)
// Open-Meteo(무료, API 키 불필요) API를 fetch + async/await로 호출한다.

export const CITY_COORDS = {
  pangyo: { name: '판교', lat: 37.3947, lon: 127.1112 },
  gwangju: { name: '광주', lat: 35.1595, lon: 126.8526 },
  ulsan: { name: '울산', lat: 35.5384, lon: 129.3114 }
};

export async function fetchWeather(cityKey) {
  const city = CITY_COORDS[cityKey];
  if (!city) {
    throw new Error('지원하지 않는 도시입니다.');
  }

  const url =
    'https://api.open-meteo.com/v1/forecast?latitude=' +
    city.lat +
    '&longitude=' +
    city.lon +
    '&current=temperature_2m,relative_humidity_2m';

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('날씨 정보를 불러오지 못했습니다.');
  }

  const data = await response.json();

  return {
    city: city.name,
    lat: city.lat,
    lon: city.lon,
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m
  };
}
