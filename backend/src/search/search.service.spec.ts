import { Test, TestingModule } from "@nestjs/testing"
import { SearchService } from "./search.service"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { HttpService } from "@nestjs/axios"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { of } from "rxjs"
import { Cache } from "cache-manager"
import { City } from "./search.interface"

describe("SearchService", () => {
  let service: SearchService
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
          envFilePath: ".env.file"
        })
      ],
      providers: [
        SearchService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager }
      ]
    }).compile()

    service = module.get<SearchService>(SearchService)
    httpService = module.get<HttpService>(HttpService)
    cacheManager = module.get(CACHE_MANAGER)
    config = module.get<ConfigService>(ConfigService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("search", () => {
    const mockCities: City[] = [
      {
        id: 1,
        name: "London",
        region: "City of London",
        country: "UK",
        lat: 51.52,
        lon: -0.11,
        url: "london-city-of-london-greater-london-united-kingdom"
      }
    ]

    it("should return cached data if available", async () => {
      mockCacheManager.get.mockResolvedValue(mockCities)

      const result = await service.search("London")
      expect(result).toEqual(mockCities)
      expect(cacheManager.get).toHaveBeenCalledWith("search_London")
      expect(httpService.get).not.toHaveBeenCalled()
    })

    it("should fetch from API and cache result when no cache", async () => {
      mockCacheManager.get.mockResolvedValue(null)
      const mockResponse = { data: mockCities }
      mockHttpService.get.mockReturnValue(of(mockResponse))

      const result = await service.search("London")
      expect(result).toEqual(mockCities)
      expect(httpService.get).toHaveBeenCalledWith(
        config.get<string>("WEATHER_API_URL") + "/v1/search.json",
        {
          params: {
            key: config.get<string>("WEATHER_API_KEY"),
            q: "London"
          }
        }
      )
      expect(cacheManager.set).toHaveBeenCalledWith(
        "search_London",
        mockCities,
        Number(config.get<number>("SEARCH_CACHE_TTL"))
      )
    })
  })
})
