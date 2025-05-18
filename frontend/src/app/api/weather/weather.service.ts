import { inject, Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { GetWeatherDto } from "./dto/get-weather.dto"
import { WeatherData } from "./weather.interface"
import { ENDPOINTS } from "../../consts/endpoints"
import { BehaviorSubject } from "rxjs"
import { CookieService } from "ngx-cookie-service"
import { City } from "../search/search.interface"

@Injectable({
  providedIn: "root"
})
export class WeatherService {
  http = inject(HttpClient)
  cookieService = inject(CookieService)

  private citySubject = new BehaviorSubject<City | null>(null)

  get city() {
    return this.citySubject.value
  }

  setCity(city: City, load?: boolean) {
    this.citySubject.next(city)

    if (load) {
      this.loadCity(city)
    }
  }

  constructor() {
    this.loadCity()
  }

  weather(dto: GetWeatherDto) {
    return this.http.get<WeatherData>(ENDPOINTS.weather(dto.city, dto.days))
  }

  loadCity(city?: City) {
    if (!city) {
      const stringCity = this.cookieService.get("city")

      if (stringCity) {
        this.citySubject.next(JSON.parse(stringCity))
      }
      return
    }

    this.cookieService.set("city", JSON.stringify(city))
  }
}
