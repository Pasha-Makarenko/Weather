import { Module } from "@nestjs/common"
import { WeatherController } from "./weather.controller"
import { WeatherService } from "./weather.service"
import { HttpModule } from "@nestjs/axios"
import { WeatherTask } from "./weather.task"
import { MailModule } from "../mail/mail.module"
import { SubscriptionsModule } from "../subscriptions/subscriptions.module"

@Module({
  controllers: [WeatherController],
  imports: [HttpModule, MailModule, SubscriptionsModule],
  providers: [WeatherService, WeatherTask],
  exports: [WeatherService, WeatherTask]
})
export class WeatherModule {}
