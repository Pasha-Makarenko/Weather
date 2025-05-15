import { IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class ConfirmContextDto {
  @ApiProperty({ example: "123", description: "Confirmation url" })
  @IsString()
  readonly confirmUrl: string
}
