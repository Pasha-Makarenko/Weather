import { IsEmail, IsEnum, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { ConfirmContextDto } from "../../subscriptions/dto/confirm-context.dto"
import { WeatherContextDto } from "../../weather/dto/weather-context.dto"

export enum MailTemplate {
  CONFIRM = "confirm",
  WEATHER = "weather"
}

export class SendMailDto {
  @ApiProperty({
    example: ["example@gmail.com"],
    description: "User email list"
  })
  @IsEmail({}, { each: true })
  readonly emails: string[]

  @ApiProperty({ example: "Confirm subscription", description: "Mail subject" })
  @IsString()
  readonly subject: string

  @ApiProperty({ example: MailTemplate.CONFIRM, description: "Template type" })
  @IsEnum(MailTemplate)
  readonly template: string

  @ApiProperty({ example: ConfirmContextDto, description: "Mail context" })
  @Type(dto => {
    if (!dto?.object.template) {
      throw new Error(`Unknown template: ${dto?.object.template}`)
    }

    if (dto?.object.template === MailTemplate.WEATHER) return WeatherContextDto
    return ConfirmContextDto
  })
  readonly context: ConfirmContextDto | WeatherContextDto
}
