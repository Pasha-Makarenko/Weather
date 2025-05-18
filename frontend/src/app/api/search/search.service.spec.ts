import { TestBed } from "@angular/core/testing"
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing"
import { SearchService } from "./search.service"
import { City } from "./search.interface"
import { ENDPOINTS } from "../../consts/endpoints"

describe("SearchService", () => {
  let service: SearchService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchService]
    })

    service = TestBed.inject(SearchService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it("should be created", () => {
    expect(service).toBeTruthy()
  })

  it("should search for cities", () => {
    const mockCities: City[] = [
      {
        id: 1,
        name: "London",
        region: "England",
        country: "United Kingdom",
        lat: 51.5074,
        lon: -0.1278,
        url: "london-united-kingdom"
      }
    ]
    const searchTerm = "London"

    service.search(searchTerm).subscribe(cities => {
      expect(cities).toEqual(mockCities)
    })

    const req = httpMock.expectOne(ENDPOINTS.search(searchTerm))
    expect(req.request.method).toBe("GET")
    req.flush(mockCities)
  })
})
