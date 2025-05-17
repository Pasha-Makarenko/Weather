import { inject, Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { GetWeatherDto } from "./dto/get-weather.dto"
import { WeatherData } from "./weather.interface"
import { ENDPOINTS } from "../../consts/endpoints"

@Injectable({
  providedIn: "root"
})
export class WeatherService {
  http = inject(HttpClient)

  weather(dto: GetWeatherDto) {
    return this.http.get<WeatherData>(ENDPOINTS.weather(dto.city, dto.days))
  }
}
