import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { CreateSubscriptionDto } from "./dto/create-subscription.dto"
import { Subscription } from "./subscription.model"
import { generateToken } from "../shared/utils/token.util"

@Injectable()
export class SubscriptionsService {
  constructor(@InjectModel(Subscription) private subscriptionsRepository: typeof Subscription) {
  }

  async createSubscription(dto: CreateSubscriptionDto) {
    const candidate = await this.subscriptionsRepository.findOne({
      where: {
        email: dto.email
      }
    })

    if (candidate) {
      throw new ConflictException("Subscription for this email exists")
    }

    const subscription = await this.subscriptionsRepository.create({
      ...dto,
      confirmationToken: generateToken(),
      unsubscribeToken: generateToken()
    })

    if (!subscription) {
      throw new InternalServerErrorException("Subscription not created")
    }

    return subscription
  }

  async confirm(confirmationToken: string) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { confirmationToken }
    })

    if (!subscription) {
      throw new NotFoundException("Subscription for this email not found")
    }

    await subscription.update({ isConfirmed: true })

    return subscription
  }

  async unsubscribe(unsubscribeToken: string) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { unsubscribeToken }
    })

    if (!subscription) {
      throw new NotFoundException("Subscription for this email not found")
    }

    await subscription.destroy()

    return subscription
  }
}