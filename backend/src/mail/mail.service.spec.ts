import { Test, TestingModule } from "@nestjs/testing"
import { MailService } from "./mail.service"
import { MailerService } from "@nestjs-modules/mailer"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { SendMailDto } from "./dto/send-mail.dto"
import { InternalServerErrorException } from "@nestjs/common"
import { WeatherData } from "../weather/weather.interface"

describe("MailService", () => {
  let service: MailService
  let mailerService: MailerService
  let config: ConfigService

  const mockMailerService = {
    sendMail: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ".env.test"
        })
      ],
      providers: [
        MailService,
        { provide: MailerService, useValue: mockMailerService }
      ]
    }).compile()

    service = module.get<MailService>(MailService)
    mailerService = module.get<MailerService>(MailerService)
    config = module.get<ConfigService>(ConfigService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("sendMail", () => {
    const sendMailDto: SendMailDto = {
      emails: ["recipient@example.com"],
      subject: "Test Subject",
      template: "test",
      context: { unsubscribeUrl: "123", weather: {} as WeatherData }
    }

    it("should send email successfully", async () => {
      mockMailerService.sendMail.mockResolvedValue(true)

      await service.sendMail(sendMailDto)
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: sendMailDto.emails,
        from: config.get<string>("SMTP_USER"),
        subject: sendMailDto.subject,
        template: sendMailDto.template,
        context: sendMailDto.context
      })
    })

    it("should throw InternalServerErrorException on failure", async () => {
      mockMailerService.sendMail.mockRejectedValue(new Error("SMTP Error"))

      await expect(service.sendMail(sendMailDto)).rejects.toThrow(
        InternalServerErrorException
      )
    })
  })
})
