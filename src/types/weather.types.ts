export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  precipitation: number;
  isDay: number;
  description?: string;
  icon?: string;
}

export interface WeatherApiResponse {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    humidity: number;
    precip_mm: number;
    is_day: number;
  };
}
