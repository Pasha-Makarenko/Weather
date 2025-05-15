import { Module } from "@nestjs/common"
import { SequelizeModule } from "@nestjs/sequelize"
import { SubscriptionsService } from "./subscriptions.service"
import { Subscription } from "./subscription.model"
import { SubscriptionsController } from "./subscriptions.controller"

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  imports: [SequelizeModule.forFeature([ Subscription ])],
  exports: [SubscriptionsService]
})
export class SubscriptionsModule {}