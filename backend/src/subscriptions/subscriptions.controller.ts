import { Body, Controller, HttpCode, Param, Post } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { SubscriptionsService } from "./subscriptions.service"
import { CreateSubscriptionDto } from "./dto/create-subscription.dto"

@ApiTags("Subscriptions")
@Controller("")
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @ApiOperation({ summary: "Subscribe" })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Post("subscribe")
  async subscribe(@Body() dto: CreateSubscriptionDto) {
    await this.subscriptionsService.createSubscription(dto)
  }

  @ApiOperation({ summary: "Confirm subscription" })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Post("confirm/:token")
  async confirm(@Param("token") token: string) {
    await this.subscriptionsService.confirm(token)
  }

  @ApiOperation({ summary: "Unsubscribe" })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Post("unsubscribe/:token")
  async unsubscribe(@Param("token") token: string) {
    await this.subscriptionsService.unsubscribe(token)
  }
}
