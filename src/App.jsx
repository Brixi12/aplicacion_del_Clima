import React, { useState } from 'react';
import './App.css';

const API_KEY = "4490f3b5fd564a37ac8143640232405";
const API_WEATHER = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&aqi=no`;

function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    condition: "",
    conditionText: "",
    icon: "",
  });

  const [searchHistory, setSearchHistory] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);

    try {
      if (!city.trim()) throw { message: "El campo ciudad es obligatorio" };

      const res = await fetch(`${API_WEATHER}&q=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (data.error) {
        throw { message: data.error.message };
      }

      const newWeather = {
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        condition: data.current.condition.code,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon,
      };

      setWeather(newWeather);
      setSearchHistory([...searchHistory, newWeather]);
    } catch (error) {
      setError({ error: true, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Weather App</h1>
      <form className="form" autoComplete="off" onSubmit={onSubmit}>
        <input
          type="text"
          className="city-input"
          placeholder="Ciudad"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          type="submit"
          className="search-button"
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
        {error.error && <p className="error">{error.message}</p>}
      </form>

      {weather.city && (
        <div className="weather-info">
          <h2>{weather.city}, {weather.country}</h2>
          <img src={weather.icon} alt={weather.conditionText} />
          <h3>{weather.temperature} °C</h3>
          <h4>{weather.conditionText}</h4>
        </div>
      )}

      {searchHistory.length > 0 && (
        <div className="search-history">
          <h2 className="history-title">Historial de búsquedas</h2>
          {searchHistory.map((weatherData, index) => (
            <div className="history-card" key={index}>
              <h3>{weatherData.city}, {weatherData.country}</h3>
              <img src={weatherData.icon} alt={weatherData.conditionText} />
              <p>{weatherData.temperature} °C</p>
              <p>{weatherData.conditionText}</p>
            </div>
          ))}
        </div>
      )}

      <p className="footer">
        {/* Otros elementos */}
      </p>
    </div>
  );
}

export default App;
