import { Test, TestingModule } from "@nestjs/testing"
import { WeatherService } from "./weather.service"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { HttpService } from "@nestjs/axios"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"
import { of } from "rxjs"
import { WeatherQueryDto } from "./dto/weather-query.dto"
import { BadRequestException } from "@nestjs/common"

describe("WeatherService", () => {
  let service: WeatherService
  let httpService: HttpService
  let cacheManager: Cache
  let config: ConfigService

  const mockHttpService = {
    get: jest.fn()
  }

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ".env.test"
        })
      ],
      providers: [
        WeatherService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager }
      ]
    }).compile()

    service = module.get<WeatherService>(WeatherService)
    httpService = module.get<HttpService>(HttpService)
    cacheManager = module.get(CACHE_MANAGER)
    config = module.get<ConfigService>(ConfigService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("weather", () => {
    const mockWeatherData = {
      location: { name: "London" },
      forecast: { forecastday: [] }
    }
    const mockDto: WeatherQueryDto = { city: "London", days: "1" }

    it("should return cached data if available", async () => {
      mockCacheManager.get.mockResolvedValue(mockWeatherData)

      const result = await service.weather(mockDto)
      expect(result).toEqual(mockWeatherData)
      expect(cacheManager.get).toHaveBeenCalledWith("weather_London_1")
      expect(httpService.get).not.toHaveBeenCalled()
    })

    it("should fetch from API and cache result when no cache", async () => {
      mockCacheManager.get.mockResolvedValue(null)
      const mockResponse = { data: mockWeatherData }
      mockHttpService.get.mockReturnValue(of(mockResponse))

      const result = await service.weather(mockDto)
      expect(result).toEqual(mockWeatherData)
      expect(httpService.get).toHaveBeenCalledWith(
        config.get<string>("WEATHER_API_URL") + "/v1/forecast.json",
        {
          params: {
            key: config.get<string>("WEATHER_API_KEY"),
            q: "London",
            days: "1",
            aqi: "no",
            alerts: "no"
          }
        }
      )
      expect(cacheManager.set).toHaveBeenCalledWith(
        "weather_London_1",
        mockWeatherData,
        Number(config.get<number>("WEATHER_CACHE_TTL"))
      )
    })

    it("should throw BadRequestException when API call fails", async () => {
      mockCacheManager.get.mockResolvedValue(null)
      mockHttpService.get.mockImplementation(() => {
        throw new Error("API Error")
      })

      await expect(service.weather(mockDto)).rejects.toThrow(
        BadRequestException
      )
    })
  })
})
