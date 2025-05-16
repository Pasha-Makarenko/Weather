import { Column, DataType, Index, Model, Table } from "sequelize-typescript"
import { ApiProperty } from "@nestjs/swagger"
import { CreateSubscriptionDto } from "./dto/create-subscription.dto"

export enum Frequency {
  DAILY = "daily",
  HOURLY = "hourly"
}

interface SubscriptionCreationAttributes extends CreateSubscriptionDto {
  readonly confirmationToken: string
  readonly unsubscribeToken: string
}

@Table({ tableName: "subscriptions" })
export class Subscription extends Model<
  Subscription,
  SubscriptionCreationAttributes
> {
  @ApiProperty({ example: "1", description: "Unique identifier" })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string

  @Index
  @ApiProperty({ example: "example@gmail.com", description: "User email" })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string

  @ApiProperty({ example: "London", description: "Weather in current city" })
  @Column({ type: DataType.STRING, allowNull: false })
  declare city: string

  @ApiProperty({
    example: Frequency.DAILY,
    description: "Send weather frequency"
  })
  @Column({
    type: DataType.ENUM(...Object.values(Frequency)),
    defaultValue: Frequency.DAILY
  })
  declare frequency: Frequency

  @ApiProperty({ example: false, description: "Is subscription confirmed" })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isConfirmed: boolean

  @ApiProperty({ example: "123", description: "Confirmation token" })
  @Column({ type: DataType.STRING(64), allowNull: false, unique: true })
  declare confirmationToken: string

  @Index
  @ApiProperty({ example: "123", description: "Unsubscribe token" })
  @Column({ type: DataType.STRING(64), allowNull: false, unique: true })
  declare unsubscribeToken: string
}
