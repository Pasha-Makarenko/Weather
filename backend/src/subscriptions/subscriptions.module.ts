import { Module } from "@nestjs/common"
import { SequelizeModule } from "@nestjs/sequelize"
import { SubscriptionsService } from "./subscriptions.service"
import { Subscription } from "./subscription.model"
import { SubscriptionsController } from "./subscriptions.controller"
import { MailModule } from "../mail/mail.module"
import { ConfigModule } from "@nestjs/config"

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([Subscription]),
    MailModule
  ],
  exports: [SubscriptionsService]
})
export class SubscriptionsModule {}
