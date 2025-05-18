import { Test, TestingModule } from "@nestjs/testing"
import { SearchController } from "./search.controller"
import { SearchService } from "./search.service"
import { City } from "./search.interface"

describe("SearchController", () => {
  let controller: SearchController
  let searchService: SearchService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: {
            search: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<SearchController>(SearchController)
    searchService = module.get<SearchService>(SearchService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("search", () => {
    it("should call searchService with query param", async () => {
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

      jest.spyOn(searchService, "search").mockResolvedValue(mockCities)

      const result = await controller.search("London")
      expect(result).toEqual(mockCities)
      expect(searchService.search).toHaveBeenCalledWith("London")
    })
  })
})
