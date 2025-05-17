import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { HttpService } from "@nestjs/axios"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"
import { City } from "./search.interface"

@Injectable()
export class SearchService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async search(city: string) {
    const url = this.configService.get<string>("WEATHER_API_URL")
    const key = this.configService.get<string>("WEATHER_API_KEY")

    if (!url || !key) {
      throw new InternalServerErrorException("Unable to get data")
    }

    const cacheKey = `search_${city}`

    try {
      const cachedData = await this.cacheManager.get<City[]>(cacheKey)
      if (cachedData) {
        return cachedData
      }

      const response = await this.httpService
        .get<City[]>(url + "/v1/search.json", {
          params: {
            key,
            q: city
          }
        })
        .toPromise()

      const searchData = response?.data
      const ttl = Number(this.configService.get<number>("SEARCH_CACHE_TTL"))

      if (searchData) {
        await this.cacheManager.set(cacheKey, searchData, ttl)
      }

      return searchData
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
