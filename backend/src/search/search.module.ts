import { Module } from "@nestjs/common"
import { SearchController } from "./search.controller"
import { SearchService } from "./search.service"
import { HttpModule } from "@nestjs/axios"

@Module({
  controllers: [SearchController],
  imports: [HttpModule],
  providers: [SearchService],
  exports: [SearchService]
})
export class SearchModule {}
