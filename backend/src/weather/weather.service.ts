import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common"
import { WeatherQueryDto } from "./dto/weather-query.dto"
import { ConfigService } from "@nestjs/config"
import { HttpService } from "@nestjs/axios"
import { WeatherData } from "./weather.interface"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"

@Injectable()
export class WeatherService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async weather(dto: WeatherQueryDto) {
    const url = this.configService.get<string>("WEATHER_API_URL")
    const key = this.configService.get<string>("WEATHER_API_KEY")

    if (!url || !key) {
      throw new InternalServerErrorException("Unable to get data")
    }

    const cacheKey = `weather_${dto.city}_${dto.days}`

    try {
      const cachedData = await this.cacheManager.get<WeatherData>(cacheKey)
      if (cachedData) {
        return cachedData
      }

      const response = await this.httpService
        .get<WeatherData>(url + "/v1/forecast.json", {
          params: {
            key,
            q: dto.city,
            days: dto.days,
            aqi: "no",
            alerts: "no"
          }
        })
        .toPromise()

      const weatherData = response?.data
      const ttl = Number(this.configService.get<number>("CACHE_TTL"))

      if (weatherData) {
        await this.cacheManager.set(cacheKey, weatherData, ttl)
      }

      return weatherData
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
