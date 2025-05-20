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

    const url = this.configService.get<string>(
      this.configService.get<string>("NODE_ENV") === "production"
        ? "API_URL"
        : "CLIENT_URL"
    )

    try {
      await this.mailService.sendMail({
        emails: [dto.email],
        subject: "Confirmation",
        template: MailTemplate.CONFIRM,
        context: {
          confirmUrl: url + "/confirm/" + confirmationToken
        }
      })
    } catch (error) {
      await subscription.destroy()
      throw new InternalServerErrorException(error.message)
    }
  }

  async confirm(confirmationToken: string) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { confirmationToken }
    })

    if (!subscription) {
      throw new NotFoundException("Subscription for this email not found")
    }

    await subscription.update({ isConfirmed: true })
  }

  async unsubscribe(unsubscribeToken: string) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { unsubscribeToken }
    })

    if (!subscription) {
      throw new NotFoundException("Subscription for this email not found")
    }

    await subscription.destroy()
  }

  async getActive(where: Partial<Subscription>) {
    return await this.subscriptionsRepository.findAll({
      where: {
        ...where,
        isConfirmed: true
      }
    })
  }
}
