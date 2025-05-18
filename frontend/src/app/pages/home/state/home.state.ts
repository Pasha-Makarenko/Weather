import { WeatherData } from "../../../api/weather/weather.interface"

export interface HomeState {
  home: {
    result: WeatherData | null
    isLoading: boolean
    error: string | null
  }
}

export const initialHomeState: HomeState = {
  home: {
    result: null,
    isLoading: false,
    error: null
  }
}
