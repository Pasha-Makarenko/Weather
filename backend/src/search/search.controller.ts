import { Controller, Get, Query } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { SearchService } from "./search.service"

@ApiTags("Search")
@Controller("search")
export class SearchController {
  constructor(private searchService: SearchService) {}

  @ApiOperation({ summary: "Search" })
  @ApiResponse({ status: 200 })
  @Get()
  async search(@Query("city") city: string) {
    return await this.searchService.search(city)
  }
}
