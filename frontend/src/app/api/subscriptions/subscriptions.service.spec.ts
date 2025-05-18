import { TestBed } from "@angular/core/testing"
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing"
import { SubscriptionsService } from "./subscriptions.service"
import { ENDPOINTS } from "../../consts/endpoints"
import { SubscribeDto } from "./dto/subscribe.dto"
import { Frequency } from "./subscriptions.interface"

describe("SubscriptionsService", () => {
  let service: SubscriptionsService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SubscriptionsService]
    })

    service = TestBed.inject(SubscriptionsService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it("should be created", () => {
    expect(service).toBeTruthy()
  })

  it("should subscribe", () => {
    const mockDto: SubscribeDto = {
      email: "test@test.com",
      city: "London",
      frequency: Frequency.DAILY
    }

    service.subscribe(mockDto).subscribe()

    const req = httpMock.expectOne(ENDPOINTS.subscribe)
    expect(req.request.method).toBe("POST")
    expect(req.request.body).toEqual(mockDto)
  })

  it("should confirm subscription", () => {
    const token = "test-token"

    service.confirm(token).subscribe()

    const req = httpMock.expectOne(ENDPOINTS.confirm(token))
    expect(req.request.method).toBe("POST")
  })

  it("should unsubscribe", () => {
    const token = "test-token"

    service.unsubscribe(token).subscribe()

    const req = httpMock.expectOne(ENDPOINTS.unsubscribe(token))
    expect(req.request.method).toBe("POST")
  })
})
