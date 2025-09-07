import React, { useState } from "react";
import SearchInput from "./components/SearchInput/SearchInput";
import WeatherCard from "./components/WeatherCard/WeatherCard";
import { fetchWeather } from "./utils/weatherApi";
import { WeatherData } from "./types/weather.types";
import './styles/variables.css';
import './styles/global.css';
import './App.css';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isCelsius, setIsCelsius] = useState(true);

  const handleSearch = async (city: string) => {
    try {
      const data = await fetchWeather(city);
      setWeather(data);
    } catch (error) {
      console.error(error);
      setWeather(null);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">🌦 Weather App</h1>
      <SearchInput onSearch={handleSearch} />
      <WeatherCard weather={weather} isCelsius={isCelsius} setIsCelsius={setIsCelsius} />
    </div>
  );
};

export default App;