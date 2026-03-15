import { useEffect, useState } from 'react';
import {
  fetchWeatherByCoords,
  searchLocationByName,
  weatherCodeToIcon,
  weatherCodeToText,
} from '../../services/weatherApi';
import ForecastDisplay from './ForecastDisplay';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState('Tagum');
  const [displayLocation, setDisplayLocation] = useState('Davao del Norte');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDefaultWeather = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchWeatherByCoords(7.4467, 125.8094);
      setWeather(data);
      setDisplayLocation('Davao del Norte');
    } catch (err) {
      setError('Failed to load weather data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!locationName.trim()) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const geo = await searchLocationByName(locationName);

      if (!geo.results || geo.results.length === 0) {
        setError('No location found.');
        setLoading(false);
        return;
      }

      const place = geo.results[0];
      const weatherData = await fetchWeatherByCoords(place.latitude, place.longitude);

      setWeather(weatherData);
      setDisplayLocation(`${place.name}, ${place.country}`);
    } catch (err) {
      setError('Weather search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await fetchWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          setWeather(data);
          setDisplayLocation('Your Current Location');
        } catch (err) {
          setError('Unable to fetch weather for your location.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Location access denied.');
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    loadDefaultWeather();
  }, []);

  return (
    <div className="card weather-card">
      <div className="card-body">
        <h5 className="card-title">Weather Forecast</h5>

        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search city"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary w-100" onClick={handleSearch}>
              Search
            </button>
          </div>
          <div className="col-md-3">
            <button className="btn btn-outline-secondary w-100" onClick={handleUseMyLocation}>
              My Location
            </button>
          </div>
        </div>

        {loading && <p>Loading weather...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && weather?.current && (
          <>
            <div className="current-weather-box p-3 mb-3">
              <h6 className="mb-2">{displayLocation}</h6>
              <div className="d-flex align-items-center gap-3">
                <div className="display-4">{weatherCodeToIcon(weather.current.weather_code)}</div>
                <div>
                  <h3 className="mb-1">{weather.current.temperature_2m}°C</h3>
                  <div>{weatherCodeToText(weather.current.weather_code)}</div>
                  <small>
                    Humidity: {weather.current.relative_humidity_2m}% | Wind:{' '}
                    {weather.current.wind_speed_10m} km/h
                  </small>
                </div>
              </div>
            </div>

            <ForecastDisplay weather={weather} />
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;