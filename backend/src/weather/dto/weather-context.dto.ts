import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"
import { WeatherData } from "../weather.interface"

export class WeatherContextDto {
  @ApiProperty({ example: "123", description: "Unsubscription url" })
  @IsString()
  readonly unsubscribeUrl: string

  @ApiProperty({ example: {}, description: "Weather data" })
  readonly weather: WeatherData
}
