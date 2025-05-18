import { Test, TestingModule } from "@nestjs/testing"
import { SubscriptionsController } from "./subscriptions.controller"
import { SubscriptionsService } from "./subscriptions.service"
import { CreateSubscriptionDto } from "./dto/create-subscription.dto"
import { Frequency } from "./subscription.model"
import { ConflictException, NotFoundException } from "@nestjs/common"

describe("SubscriptionsController", () => {
  let controller: SubscriptionsController
  let subscriptionsService: jest.Mocked<SubscriptionsService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsService,
          useValue: {
            createSubscription: jest.fn(),
            confirm: jest.fn(),
            unsubscribe: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<SubscriptionsController>(SubscriptionsController)
    subscriptionsService = module.get(
      SubscriptionsService
    ) as jest.Mocked<SubscriptionsService>
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("subscribe", () => {
    const createDto: CreateSubscriptionDto = {
      email: "test@example.com",
      city: "London",
      frequency: Frequency.DAILY
    }

    it("should throw ConflictException if email already exists", async () => {
      subscriptionsService.createSubscription.mockRejectedValue(
        new ConflictException()
      )

      await expect(controller.subscribe(createDto)).rejects.toThrow(
        ConflictException
      )
    })
  })

  describe("confirm", () => {
    it("should throw NotFoundException if token is invalid", async () => {
      subscriptionsService.confirm.mockRejectedValue(new NotFoundException())

      await expect(controller.confirm("invalid-token")).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe("unsubscribe", () => {
    it("should throw NotFoundException if token is invalid", async () => {
      subscriptionsService.unsubscribe.mockRejectedValue(
        new NotFoundException()
      )

      await expect(controller.unsubscribe("invalid-token")).rejects.toThrow(
        NotFoundException
      )
    })
  })
})
