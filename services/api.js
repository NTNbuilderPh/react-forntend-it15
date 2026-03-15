import axios from 'axios';

export const fetchWeatherByCoords = async (latitude = 7.4467, longitude = 125.8094) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Manila`;

  const response = await axios.get(url);
  return response.data;
};

export const searchLocationByName = async (name) => {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`;

  const response = await axios.get(url);
  return response.data;
};

export const weatherCodeToText = (code) => {
  const map = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    80: 'Rain showers',
    95: 'Thunderstorm',
  };

  return map[code] || 'Unknown';
};

export const weatherCodeToIcon = (code) => {
  if (code === 0) return '☀️';
  if ([1, 2].includes(code)) return '🌤️';
  if (code === 3) return '☁️';
  if ([45, 48].includes(code)) return '🌫️';
  if ([51, 53, 55].includes(code)) return '🌦️';
  if ([61, 63, 65, 80].includes(code)) return '🌧️';
  if (code === 95) return '⛈️';
  return '🌡️';
};