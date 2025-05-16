import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common"
import { WeatherQueryDto } from "./dto/weather-query.dto"
import { ConfigService } from "@nestjs/config"
import { HttpService } from "@nestjs/axios"
import { WeatherData } from "./weather.interface"

@Injectable()
export class WeatherService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService
  ) {}

  async weather(dto: WeatherQueryDto) {
    const url = this.configService.get<string>("WEATHER_API_URL")
    const key = this.configService.get<string>("WEATHER_API_KEY")

    if (!url || !key) {
      throw new InternalServerErrorException("Unable to get data")
    }

    try {
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

      return response?.data
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
