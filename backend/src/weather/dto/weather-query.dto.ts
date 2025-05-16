import { IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class WeatherQueryDto {
  @ApiProperty({ example: "London", description: "Weather in current city" })
  @IsString({ message: "Must be a string" })
  readonly city: string

  @ApiProperty({ example: "1", description: "Days count" })
  @IsString({ message: "Must be a string" })
  readonly days: string
}
