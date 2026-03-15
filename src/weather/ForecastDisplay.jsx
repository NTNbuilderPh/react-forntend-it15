import { weatherCodeToIcon, weatherCodeToText } from '../../services/weatherApi';

const ForecastDisplay = ({ weather }) => {
  if (!weather?.daily) return null;

  const { time, weather_code, temperature_2m_max, temperature_2m_min } = weather.daily;

  const forecastDays = time.slice(0, 5).map((date, index) => ({
    date,
    code: weather_code[index],
    max: temperature_2m_max[index],
    min: temperature_2m_min[index],
  }));

  return (
    <div className="row g-3 mt-2">
      {forecastDays.map((day, index) => (
        <div className="col-6 col-md-4 col-lg-2" key={index}>
          <div className="forecast-card text-center p-3">
            <div className="fw-bold small">{day.date}</div>
            <div className="fs-3">{weatherCodeToIcon(day.code)}</div>
            <div className="small">{weatherCodeToText(day.code)}</div>
            <div className="small mt-1">
              <strong>{day.max}°C</strong> / {day.min}°C
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForecastDisplay;