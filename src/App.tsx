import React, { useState } from "react";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  precipitation: number;
  isDay: number;
}

function App() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isCelsius, setIsCelsius] = useState<boolean>(true);

  const getWeatherCode = (code: number): string => {
    const weatherCodes: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      95: "Thunderstorm",
      96: "Thunderstorm with hail",
      99: "Thunderstorm with heavy hail"
    };
    return weatherCodes[code] || "Unknown";
  };

  const convertTemp = (tempC: number): number => {
    return isCelsius ? tempC : (tempC * 9/5) + 32;
  };

  const getWeather = async (): Promise<void> => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found!");
        setWeather(null);
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m&timezone=auto`
      );
      const weatherData = await weatherResponse.json();

      const currentWeather = weatherData.current_weather;
      const currentHour = new Date().getHours();
      
      const humidity = weatherData.hourly.relative_humidity_2m[currentHour] || 0;
      const precipitation = weatherData.hourly.precipitation_probability[currentHour] || 0;

      setWeather({
        city: name,
        country: country,
        temperature: currentWeather.temperature,
        weatherCode: currentWeather.weathercode,
        windSpeed: currentWeather.windspeed,
        humidity: humidity,
        precipitation: precipitation,
        isDay: currentWeather.is_day
      });
      
    } catch (err) {
      console.error(err);
      setError("Error fetching weather data. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      getWeather();
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "#f0f0f0",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "500px",
        margin: "0 auto",
        textAlign: "center"
      }}>
        <h1 style={{ 
          color: "#171515ff", 
          fontSize: "2rem", 
          marginBottom: "30px"
        }}>
          Weather App
        </h1>
        
        <div style={{
          background: "white",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}>
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ 
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              marginRight: "10px",
              width: "200px"
            }}
          />
          <button 
            onClick={getWeather} 
            disabled={loading}
            style={{ 
              padding: "10px 20px",
              fontSize: "16px",
              border: "none",
              borderRadius: "5px",
              background: loading ? "#ccc" : "#0a2139ff",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Loading..." : "Get Weather"}
          </button>

          {error && (
            <p style={{ color: "red", marginTop: "10px" }}>
              {error}
            </p>
          )}
        </div>

        {weather && (
          <div style={{
            background: "white",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ margin: "0 0 10px 0" }}>
              {weather.city}, {weather.country}
            </h2>
            <p style={{ color: "#666", margin: "0 0 20px 0" }}>
              {getWeatherCode(weather.weatherCode)}
            </p>

            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              marginBottom: "20px",
              gap: "10px"
            }}>
              <span style={{ fontSize: "3rem", fontWeight: "bold" }}>
                {Math.round(convertTemp(weather.temperature))}°
              </span>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <button
                  onClick={() => setIsCelsius(true)}
                  style={{
                    background: isCelsius ? "#007bff" : "white",
                    color: isCelsius ? "white" : "#007bff",
                    border: "1px solid #007bff",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  °C
                </button>
                <button
                  onClick={() => setIsCelsius(false)}
                  style={{
                    background: !isCelsius ? "#007bff" : "white",
                    color: !isCelsius ? "white" : "#007bff",
                    border: "1px solid #007bff",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  °F
                </button>
              </div>
            </div>

            <div style={{ 
              display: "flex",
              justifyContent: "space-around",
              textAlign: "center"
            }}>
              <div>
                <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>Precipitation</p>
                <p style={{ margin: "5px 0", fontSize: "18px", fontWeight: "bold" }}>{weather.precipitation}%</p>
              </div>
              <div>
                <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>Humidity</p>
                <p style={{ margin: "5px 0", fontSize: "18px", fontWeight: "bold" }}>{weather.humidity}%</p>
              </div>
              <div>
                <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>Wind</p>
                <p style={{ margin: "5px 0", fontSize: "18px", fontWeight: "bold" }}>{weather.windSpeed} km/h</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;