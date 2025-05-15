import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { MailerService } from "@nestjs-modules/mailer"
import { SendMailDto } from "./dto/send-mail.dto"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService
  ) {}

  async sendMail(dto: SendMailDto) {
    try {
      return await this.mailerService.sendMail({
        to: dto.emails,
        from: this.configService.get<string>("SMTP_USER"),
        subject: dto.subject,
        template: dto.template,
        context: dto.context
      })
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }
}
