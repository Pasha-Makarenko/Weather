import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { Frequency } from "../subscriptions/subscription.model"
import { MailService } from "../mail/mail.service"
import { SubscriptionsService } from "../subscriptions/subscriptions.service"
import { MailTemplate } from "../mail/dto/send-mail.dto"
import { WeatherService } from "./weather.service"

@Injectable()
export class WeatherTask {
  constructor(
    private subscriptionsService: SubscriptionsService,
    private mailService: MailService,
    private weatherService: WeatherService
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendWeatherHourly() {
    await this.sendWeather(Frequency.HOURLY)
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async sendWeatherDaily() {
    await this.sendWeather(Frequency.DAILY)
  }

  async sendWeather(frequency: Frequency) {
    const subscriptions = await this.subscriptionsService.getActive({
      frequency
    })

    for (const sub of subscriptions) {
      try {
        const weather = await this.weatherService.weather({
          city: sub.city,
          days: "1"
        })

        if (!weather) {
          throw new BadRequestException("Unable to get data")
        }

        await this.mailService.sendMail({
          emails: [sub.email],
          subject: "Weather",
          template: MailTemplate.WEATHER,
          context: {
            unsubscribeUrl: sub.unsubscribeToken,
            weather
          }
        })
      } catch (error) {
        throw new InternalServerErrorException(error.message)
      }
    }
  }
}
