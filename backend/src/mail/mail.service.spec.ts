import { Test, TestingModule } from "@nestjs/testing"
import { MailService } from "./mail.service"
import { MailerService } from "@nestjs-modules/mailer"
import { ConfigService } from "@nestjs/config"
import { SendMailDto } from "./dto/send-mail.dto"
import { InternalServerErrorException } from "@nestjs/common"
import { WeatherData } from "../weather/weather.interface"

describe("MailService", () => {
  let service: MailService
  let mailerService: MailerService

  const mockMailerService = {
    sendMail: jest.fn()
  }

  const mockConfigService = {
    get: jest.fn().mockReturnValue("test@example.com")
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useValue: mockMailerService },
        { provide: ConfigService, useValue: mockConfigService }
      ]
    }).compile()

    service = module.get<MailService>(MailService)
    mailerService = module.get<MailerService>(MailerService)
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
        from: "test@example.com",
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
