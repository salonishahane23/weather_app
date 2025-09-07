import { WeatherApiResponse, WeatherData } from "../types/weather.types";


const API_KEY = "ec9495213e63433b84064825250709"; 
const BASE_URL = "https://api.weatherapi.com/v1/current.json";

export async function fetchWeather(city: string): Promise<WeatherData> {
  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${city}&aqi=no`);

    if (!response.ok) {
      throw new Error(`Error fetching weather: ${response.statusText}`);
    }

    const data: WeatherApiResponse = await response.json();

    return {
      city: data.location.name,
      country: data.location.country,
      temperature: data.current.temp_c,
      weatherCode: data.current.condition.code,
      windSpeed: data.current.wind_kph,
      humidity: data.current.humidity,
      precipitation: data.current.precip_mm,
      isDay: data.current.is_day,
      description: data.current.condition.text,
      icon: data.current.condition.icon
    };
  } catch (error) {
    console.error("Weather fetch failed:", error);
    throw error;
  }
}
export const convertTemperature = (tempC: number, toCelsius: boolean): number => {
  return toCelsius ? tempC : (tempC * 9) / 5 + 32;
};

