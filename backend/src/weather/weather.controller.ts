import { Controller, Get, Query } from "@nestjs/common"
import { WeatherQueryDto } from "./dto/weather-query.dto"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { WeatherService } from "./weather.service"

@ApiTags("Weather")
@Controller("weather")
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @ApiOperation({ summary: "Weather" })
  @ApiResponse({ status: 200 })
  @Get()
  async weather(@Query() dto: WeatherQueryDto) {
    return await this.weatherService.weather(dto)
  }
}
