import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { CreateSubscriptionDto } from "./dto/create-subscription.dto"
import { Subscription } from "./subscription.model"
import { generateToken } from "../shared/utils/token.util"
import { MailService } from "../mail/mail.service"
import { MailTemplate } from "../mail/dto/send-mail.dto"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription)
    private subscriptionsRepository: typeof Subscription,
    private configService: ConfigService,
    private mailService: MailService
  ) {}

  async createSubscription(dto: CreateSubscriptionDto) {
    const candidate = await this.subscriptionsRepository.findOne({
      where: {
        email: dto.email
      }
    })

    if (candidate) {
      throw new ConflictException("Subscription for this email exists")
    }

    const confirmationToken = generateToken()
    const unsubscribeToken = generateToken()

    const subscription = await this.subscriptionsRepository.create({
      ...dto,
      confirmationToken,
      unsubscribeToken
    })

    if (!subscription) {
      throw new InternalServerErrorException("Subscription not created")
    }

    const baseUrl = this.configService.get("API_URL")

    try {
      await this.mailService.sendMail({
        emails: [dto.email],
        subject: "Confirmation",
        template: MailTemplate.CONFIRM,
        context: {
          confirmUrl: baseUrl + "/api/confirm/" + confirmationToken
        }
      })
    } catch (error) {
      await subscription.destroy()
      throw new InternalServerErrorException(error.message)
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
