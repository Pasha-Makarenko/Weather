import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { SequelizeModule } from "@nestjs/sequelize"
import { getSequelizeConfig } from "./config/database.config"
import { config } from "./config/config"
import { SubscriptionsModule } from "./subscriptions/subscriptions.module"
import { MailModule } from "./mail/mail.module"
import { WeatherModule } from "./weather/weather.module"
import { CacheModule } from "@nestjs/cache-manager"
import { getCacheConfig } from "./config/cache.config"
import { ScheduleModule } from "@nestjs/schedule"
import { SearchModule } from "./search/search.module"
import { dynamicServeStatic } from "./config/serve-static.config"

@Module({
  imports: [
    ConfigModule.forRoot(config),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getSequelizeConfig,
      inject: [ConfigService]
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: getCacheConfig,
      inject: [ConfigService]
    }),
    ScheduleModule.forRoot(),
    ...dynamicServeStatic(),
    MailModule,
    SubscriptionsModule,
    WeatherModule,
    SearchModule
  ]
})
export class AppModule {}
