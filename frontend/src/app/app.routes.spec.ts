import { TestBed } from "@angular/core/testing"
import { Router } from "@angular/router"
import { RouterTestingModule } from "@angular/router/testing"
import { routes } from "./app.routes"
import { SubscriptionsService } from "./api/subscriptions/subscriptions.service"
import { HttpClientTestingModule } from "@angular/common/http/testing"

describe("App Routes", () => {
  let router: Router
  let subscriptionsService: SubscriptionsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ],
      providers: [SubscriptionsService]
    })

    router = TestBed.inject(Router)
    subscriptionsService = TestBed.inject(SubscriptionsService)
  })

  it("should navigate to home", async () => {
    await router.navigate(["/"])
    expect(router.url).toBe("/")
  })

  it("should redirect confirm route and call service", async () => {
    const spy = jest.spyOn(subscriptionsService, "confirm")
    await router.navigate(["/confirm/test-token"])
    expect(spy).toHaveBeenCalledWith("test-token")
    expect(router.url).toBe("/")
  })

  it("should redirect unsubscribe route and call service", async () => {
    const spy = jest.spyOn(subscriptionsService, "unsubscribe")
    await router.navigate(["/unsubscribe/test-token"])
    expect(spy).toHaveBeenCalledWith("test-token")
    expect(router.url).toBe("/")
  })

  it("should navigate to not-found for unknown routes", async () => {
    await router.navigate(["/unknown"])
    expect(router.url).toBe("/unknown")
  })
})
