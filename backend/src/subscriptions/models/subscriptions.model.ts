import { Column, DataType, Model, Table } from "sequelize-typescript"
import { ApiProperty } from "@nestjs/swagger"

export enum Frequency {
  DAILY = "daily",
  HOURLY = "hourly"
}

@Table({ tableName: "subscriptions" })
export class SubscriptionsModel extends Model<SubscriptionsModel> {
  @ApiProperty({ example: 1, description: "Unique identifier" })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: number

  @ApiProperty({ example: "example@gmail.com", description: "User email" })
  @Column({ type: DataType.STRING, allowNull: false })
  email: string

  @ApiProperty({ example: "London", description: "Weather in current city" })
  @Column({ type: DataType.STRING, allowNull: false })
  city: string

  @ApiProperty({
    example: Frequency.DAILY,
    description: "Send weather frequency"
  })
  @Column({
    type: DataType.ENUM(...Object.values(Frequency)),
    defaultValue: Frequency.DAILY
  })
  frequency: Frequency

  @ApiProperty({ example: false, description: "Is subscription confirmed" })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isConfirmed: boolean

  @ApiProperty({ example: "123", description: "Confirmation token" })
  @Column({ type: DataType.STRING, allowNull: false })
  confirmationToken: string

  @ApiProperty({ example: "123", description: "Unsubscribe token" })
  @Column({ type: DataType.STRING, allowNull: false })
  unsubscribeToken: string
}
