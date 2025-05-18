import { Test, TestingModule } from "@nestjs/testing"
import { WeatherTask } from "./weather.task"
import { SubscriptionsService } from "../subscriptions/subscriptions.service"
import { MailService } from "../mail/mail.service"
import { WeatherService } from "./weather.service"
import { Frequency, Subscription } from "../subscriptions/subscription.model"
import { InternalServerErrorException } from "@nestjs/common"
import { WeatherData } from "./weather.interface"
import { ConfigModule } from "@nestjs/config"

describe("WeatherTask", () => {
  let task: WeatherTask
  let subscriptionsService: SubscriptionsService
  let mailService: MailService
  let weatherService: WeatherService

  const mockSubscription: Subscription = {
    id: "123",
    email: "test@example.com",
    city: "London",
    isConfirmed: true,
    confirmationToken: "token123",
    unsubscribeToken: "token123"
  } as unknown as Subscription

  const mockWeatherData: WeatherData = {
    location: { name: "London" },
    forecast: { forecastday: [] }
  } as unknown as WeatherData

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ".env.test"
        })
      ],
      providers: [
        WeatherTask,
        {
          provide: SubscriptionsService,
          useValue: {
            getActive: jest.fn()
          }
        },
        {
          provide: MailService,
          useValue: {
            sendMail: jest.fn()
          }
        },
        {
          provide: WeatherService,
          useValue: {
            weather: jest.fn()
          }
        }
      ]
    }).compile()

    task = module.get<WeatherTask>(WeatherTask)
    subscriptionsService =
      module.get<SubscriptionsService>(SubscriptionsService)
    mailService = module.get<MailService>(MailService)
    weatherService = module.get<WeatherService>(WeatherService)
  })

  describe("sendWeatherHourly", () => {
    it("should send hourly weather emails", async () => {
      jest
        .spyOn(subscriptionsService, "getActive")
        .mockResolvedValue([mockSubscription])
      jest.spyOn(weatherService, "weather").mockResolvedValue(mockWeatherData)
      jest.spyOn(mailService, "sendMail").mockResolvedValue(true)

      await task.sendWeatherHourly()

      expect(subscriptionsService.getActive).toHaveBeenCalledWith({
        frequency: Frequency.HOURLY
      })
      expect(weatherService.weather).toHaveBeenCalledWith({
        city: "London",
        days: "1"
      })
      expect(mailService.sendMail).toHaveBeenCalled()
    })
  })

  describe("sendWeatherDaily", () => {
    it("should send daily weather emails", async () => {
      jest
        .spyOn(subscriptionsService, "getActive")
        .mockResolvedValue([mockSubscription])
      jest.spyOn(weatherService, "weather").mockResolvedValue(mockWeatherData)
      jest.spyOn(mailService, "sendMail").mockResolvedValue(true)

      await task.sendWeatherDaily()

      expect(subscriptionsService.getActive).toHaveBeenCalledWith({
        frequency: Frequency.DAILY
      })
    })
  })

  describe("sendWeather", () => {
    it("should handle errors gracefully", async () => {
      jest
        .spyOn(subscriptionsService, "getActive")
        .mockResolvedValue([mockSubscription])
      jest
        .spyOn(weatherService, "weather")
        .mockRejectedValue(new Error("API Error"))

      await expect(task.sendWeather(Frequency.DAILY)).rejects.toThrow(
        InternalServerErrorException
      )
    })

    it("should throw if weather data is missing", async () => {
      jest
        .spyOn(subscriptionsService, "getActive")
        .mockResolvedValue([mockSubscription])
      jest.spyOn(weatherService, "weather").mockResolvedValue(undefined)

      await expect(task.sendWeather(Frequency.DAILY)).rejects.toThrow(
        InternalServerErrorException
      )
    })
  })
})
