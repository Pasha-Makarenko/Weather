import { Body, Controller, Param, Post } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { SubscriptionsService } from "./subscriptions.service"
import { CreateSubscriptionDto } from "./dto/create-subscription.dto"
import { Subscription } from "./subscription.model"

@ApiTags("Subscriptions")
@Controller("")
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @ApiOperation({ summary: "Subscribe" })
  @ApiResponse({ status: 201, type: Subscription })
  @Post("subscribe")
  subscribe(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.createSubscription(dto)
  }

  @ApiOperation({ summary: "Confirm subscription" })
  @ApiResponse({ status: 200, type: Subscription })
  @Post("confirm/:token")
  confirm(@Param("token") token: string) {
    return this.subscriptionsService.confirm(token)
  }

  @ApiOperation({ summary: "Unsubscribe" })
  @ApiResponse({ status: 200, type: Subscription })
  @Post("unsubscribe/:token")
  unsubscribe(@Param("token") token: string) {
    return this.subscriptionsService.unsubscribe(token)
  }
}
