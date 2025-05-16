import { Test, TestingModule } from "@nestjs/testing"
import { WeatherService } from "./weather.service"
import { ConfigService } from "@nestjs/config"
import { HttpService } from "@nestjs/axios"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"
import { of } from "rxjs"
import { WeatherQueryDto } from "./dto/weather-query.dto"
import { InternalServerErrorException } from "@nestjs/common"

const apiKey = "11a793cb09b54fbb86d171818251305"

describe("WeatherService", () => {
  let service: WeatherService
  let httpService: HttpService
  let cacheManager: Cache

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case "WEATHER_API_URL":
          return "https://api.weatherapi.com"
        case "WEATHER_API_KEY":
          return apiKey
        case "CACHE_TTL":
          return 60000
        default:
          return null
      }
    })
  }

  const mockHttpService = {
    get: jest.fn()
  }

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager }
      ]
    }).compile()

    service = module.get<WeatherService>(WeatherService)
    httpService = module.get<HttpService>(HttpService)
    cacheManager = module.get(CACHE_MANAGER)
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
        "https://api.weatherapi.com/v1/forecast.json",
        {
          params: {
            key: apiKey,
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
        60000
      )
    })

    it("should throw InternalServerErrorException when config is missing", async () => {
      mockConfigService.get.mockReturnValue(null)
      await expect(service.weather(mockDto)).rejects.toThrow(
        InternalServerErrorException
      )
    })

    it("should throw BadRequestException when API call fails", async () => {
      mockCacheManager.get.mockResolvedValue(null)
      mockHttpService.get.mockImplementation(() => {
        throw new Error("API Error")
      })

      await expect(service.weather(mockDto)).rejects.toThrow(
        InternalServerErrorException
      )
    })
  })
})
