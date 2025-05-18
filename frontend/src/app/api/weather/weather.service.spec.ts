import { TestBed } from "@angular/core/testing"
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing"
import { WeatherService } from "./weather.service"
import { CookieService } from "ngx-cookie-service"
import { ENDPOINTS } from "../../consts/endpoints"
import { City } from "../search/search.interface"

describe("WeatherService", () => {
  let service: WeatherService
  let httpMock: HttpTestingController
  let cookieService: CookieService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WeatherService,
        { provide: CookieService, useValue: { get: jest.fn(), set: jest.fn() } }
      ]
    })

    service = TestBed.inject(WeatherService)
    httpMock = TestBed.inject(HttpTestingController)
    cookieService = TestBed.inject(CookieService)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it("should be created", () => {
    expect(service).toBeTruthy()
  })

  it("should get weather data", () => {
    const mockData = { location: { name: "London" }, current: { temp_c: 15 } }
    const city = "London"
    const days = 3

    service.weather({ city, days }).subscribe(data => {
      expect(data).toEqual(mockData)
    })

    const req = httpMock.expectOne(ENDPOINTS.weather(city, days))
    expect(req.request.method).toBe("GET")
    req.flush(mockData)
  })

  it("should set and load city from cookies", () => {
    const mockCity: City = {
      id: 1,
      name: "Paris",
      region: "Ile-de-France",
      country: "France",
      lat: 48.8566,
      lon: 2.3522,
      url: "paris-france"
    }

    service.setCity(mockCity, true)
    expect(service.city).toEqual(mockCity)
    expect(cookieService.set).toHaveBeenCalledWith(
      "city",
      JSON.stringify(mockCity)
    )
    ;(cookieService.get as jest.Mock).mockReturnValue(JSON.stringify(mockCity))
    service.loadCity()
    expect(service.city).toEqual(mockCity)
  })
})
