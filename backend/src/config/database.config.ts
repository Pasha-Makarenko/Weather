import { SequelizeModuleOptions } from "@nestjs/sequelize"
import { ConfigService } from "@nestjs/config"
import { Subscription } from "../subscriptions/subscription.model"

export const getSequelizeConfig = (
  configService: ConfigService
): SequelizeModuleOptions => ({
  dialect: "postgres",
  host: configService.get<string>("POSTGRES_HOST"),
  port: Number(configService.get<number>("POSTGRES_PORT")),
  username: configService.get<string>("POSTGRES_USER"),
  password: configService.get<string>("POSTGRES_PASSWORD"),
  database: configService.get<string>("POSTGRES_DB"),
  autoLoadModels: true,
  synchronize: process.env.NODE_ENV !== "production",
  models: [Subscription]
})
