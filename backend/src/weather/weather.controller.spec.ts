import { Test, TestingModule } from "@nestjs/testing"
import { WeatherController } from "./weather.controller"
import { WeatherService } from "./weather.service"
import { WeatherQueryDto } from "./dto/weather-query.dto"
import { WeatherData } from "./weather.interface"

describe("WeatherController", () => {
  let controller: WeatherController
  let weatherService: WeatherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: {
            weather: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<WeatherController>(WeatherController)
    weatherService = module.get<WeatherService>(WeatherService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("weather", () => {
    it("should call weatherService with query params", async () => {
      const mockDto: WeatherQueryDto = { city: "London", days: "1" }
      const mockResult = { location: { name: "London" } } as WeatherData

      jest.spyOn(weatherService, "weather").mockResolvedValue(mockResult)

      const result = await controller.weather(mockDto)
      expect(result).toEqual(mockResult)
      expect(weatherService.weather).toHaveBeenCalledWith(mockDto)
    })
  })
})
