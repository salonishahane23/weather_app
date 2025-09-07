import React from "react";
import "./WeatherCard.css";
import { WeatherData } from "../../types/weather.types";
import { convertTemperature } from "../../utils/weatherApi";

interface WeatherCardProps {
  weather: WeatherData | null;
  isCelsius: boolean;
  setIsCelsius: React.Dispatch<React.SetStateAction<boolean>>;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, isCelsius, setIsCelsius }) => {
  if (!weather) {
    return <p className="no-data">Search for a city to see the weather</p>;
  }

  const displayedTemp = convertTemperature(weather.temperature, isCelsius);

  return (
    <div className="weather-card">
      <div className="weather-header">
        {weather.city}, {weather.country}
      </div>
      <p className="weather-sub">{weather.description}</p>
      
      <div className="weather-temp-box">
        {weather.icon && <img src={weather.icon} alt={weather.description} />}
        <div className="weather-temp">
          {displayedTemp.toFixed(1)}°{isCelsius ? "C" : "F"}
        </div>
        <div className="unit-toggle">
          <button
            className={`unit-btn ${isCelsius ? 'active' : ''}`}
            onClick={() => setIsCelsius(true)}
          >
            °C
          </button>
          <button
            className={`unit-btn ${!isCelsius ? 'active' : ''}`}
            onClick={() => setIsCelsius(false)}
          >
            °F
          </button>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <p>💨 Wind</p>
          <p>{weather.windSpeed} kph</p>
        </div>
        <div className="detail-item">
          <p>💧 Humidity</p>
          <p>{weather.humidity}%</p>
        </div>
        <div className="detail-item">
          <p>🌧 Precipitation</p>
          <p>{weather.precipitation} mm</p>
        </div>
        <div className="detail-item">
          <p>{weather.isDay ? "☀️ Daytime" : "🌙 Night"}</p>
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;