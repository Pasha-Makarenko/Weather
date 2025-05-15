import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsEnum, IsString } from "class-validator"
import { Frequency } from "../subscription.model"

export class CreateSubscriptionDto {
  @ApiProperty({ example: "example@gmail.com", description: "User email" })
  @IsString({ message: "Must be a string" })
  @IsEmail({}, { message: "Incorrect email" })
  readonly email: string

  @ApiProperty({ example: "London", description: "Weather in current city" })
  @IsString({ message: "Must be a string" })
  readonly city: string

  @ApiProperty({
    example: Frequency.DAILY,
    description: "Send weather frequency"
  })
  @IsEnum(Frequency, { message: "Incorrect frequency" })
  readonly frequency: Frequency
}
