import { environment } from "../../environments/environment"

export const BASE_API_URL = environment.apiUrl + "/api"

export const ENDPOINTS = {
  subscribe: `${BASE_API_URL}/subscribe`,
  confirm: (token: string) => `${BASE_API_URL}/confirm/${token}`,
  unsubscribe: (token: string) => `${BASE_API_URL}/unsubscribe/${token}`,
  weather: (city: string, days: number | string) =>
    `${BASE_API_URL}/weather?city=${city}&days=${days}`,
  search: (city: string) => `${BASE_API_URL}/search?city=${city}`
}
