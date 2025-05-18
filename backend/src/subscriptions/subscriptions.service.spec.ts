import { Test, TestingModule } from "@nestjs/testing"
import { SubscriptionsService } from "./subscriptions.service"
import { getModelToken } from "@nestjs/sequelize"
import { Frequency, Subscription } from "./subscription.model"
import { MailService } from "../mail/mail.service"
import { ConfigModule } from "@nestjs/config"
import { CreateSubscriptionDto } from "./dto/create-subscription.dto"
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common"

describe("SubscriptionsService", () => {
  let service: SubscriptionsService
  let subscriptionModel: typeof Subscription
  let mailService: MailService

  const mockSubscription: Subscription = {
    id: "1",
    email: "test@example.com",
    city: "London",
    frequency: Frequency.DAILY,
    isConfirmed: false,
    confirmationToken: "token123",
    unsubscribeToken: "token456",
    save: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn()
  } as unknown as Subscription

  const mockMailService = {
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
        SubscriptionsService,
        {
          provide: getModelToken(Subscription),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn()
          }
        },
        { provide: MailService, useValue: mockMailService }
      ]
    }).compile()

    service = module.get<SubscriptionsService>(SubscriptionsService)
    subscriptionModel = module.get<typeof Subscription>(
      getModelToken(Subscription)
    )
    mailService = module.get<MailService>(MailService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("createSubscription", () => {
    const createDto: CreateSubscriptionDto = {
      email: "test@example.com",
      city: "London",
      frequency: Frequency.DAILY
    }

    it("should create a new subscription", async () => {
      jest.spyOn(subscriptionModel, "findOne").mockResolvedValue(null)
      jest
        .spyOn(subscriptionModel, "create")
        .mockResolvedValue(mockSubscription)
      mockMailService.sendMail.mockResolvedValue(true)

      await service.createSubscription(createDto)

      expect(subscriptionModel.findOne).toHaveBeenCalledWith({
        where: { email: createDto.email }
      })
      expect(subscriptionModel.create).toHaveBeenCalledWith({
        ...createDto,
        confirmationToken: expect.any(String),
        unsubscribeToken: expect.any(String)
      })
      expect(mailService.sendMail).toHaveBeenCalled()
    })

    it("should throw ConflictException if email exists", async () => {
      jest
        .spyOn(subscriptionModel, "findOne")
        .mockResolvedValue(mockSubscription)

      await expect(service.createSubscription(createDto)).rejects.toThrow(
        ConflictException
      )
    })

    it("should throw InternalServerErrorException if email fails", async () => {
      jest.spyOn(subscriptionModel, "findOne").mockResolvedValue(null)
      jest
        .spyOn(subscriptionModel, "create")
        .mockResolvedValue(mockSubscription)
      mockMailService.sendMail.mockRejectedValue(new Error("Email failed"))

      await expect(service.createSubscription(createDto)).rejects.toThrow(
        InternalServerErrorException
      )
      expect(mockSubscription.destroy).toHaveBeenCalled()
    })
  })

  describe("confirm", () => {
    it("should throw NotFoundException if token invalid", async () => {
      jest.spyOn(subscriptionModel, "findOne").mockResolvedValue(null)

      await expect(service.confirm("invalid")).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe("unsubscribe", () => {
    it("should remove subscription", async () => {
      jest
        .spyOn(subscriptionModel, "findOne")
        .mockResolvedValue(mockSubscription)

      await service.unsubscribe("token456")
      expect(mockSubscription.destroy).toHaveBeenCalled()
    })

    it("should throw NotFoundException if token invalid", async () => {
      jest.spyOn(subscriptionModel, "findOne").mockResolvedValue(null)

      await expect(service.unsubscribe("invalid")).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe("getActive", () => {
    it("should return active subscriptions", async () => {
      const activeSub = {
        ...mockSubscription,
        isConfirmed: true
      } as Subscription
      jest.spyOn(subscriptionModel, "findAll").mockResolvedValue([activeSub])

      const result = await service.getActive({ frequency: Frequency.DAILY })
      expect(result).toEqual([activeSub])
      expect(subscriptionModel.findAll).toHaveBeenCalledWith({
        where: { frequency: "daily", isConfirmed: true }
      })
    })
  })
})
