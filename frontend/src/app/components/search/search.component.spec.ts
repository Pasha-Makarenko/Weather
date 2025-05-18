import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormControl, ReactiveFormsModule } from "@angular/forms"
import { SearchComponent } from "./search.component"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { ModalComponent } from "../modal/modal.component"
import { CityPipe } from "../../pipes/city.pipe"
import { SearchService } from "../../api/search/search.service"
import { City } from "../../api/search/search.interface"
import { provideMockStore } from "@ngrx/store/testing"

describe("SearchComponent", () => {
  let component: SearchComponent
  let fixture: ComponentFixture<SearchComponent>
  let searchService: SearchService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchComponent,
        ModalComponent,
        CityPipe,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [provideMockStore(), SearchService]
    }).compileComponents()

    fixture = TestBed.createComponent(SearchComponent)
    component = fixture.componentInstance
    searchService = TestBed.inject(SearchService)
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should initialize with empty data", () => {
    expect(component.data()).toEqual([])
  })

  it("should call search service on value changes", () => {
    const spy = jest.spyOn(searchService, "search")
    const searchControl = new FormControl<string | null>(null)
    component.searchControl = jest.fn(() => searchControl) as never
    component.options = jest.fn(() => ({ delay: 300, save: true })) as never

    component.ngOnInit()
    searchControl.setValue("London")

    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith("London")
    }, 300)
  })

  it("should select city and emit event", () => {
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

    const emitSpy = jest.spyOn(component.selectOutput, "emit")
    const searchControl = new FormControl<string | null>(null)
    component.searchControl = jest.fn(() => searchControl) as never
    component.options = jest.fn(() => ({ delay: 300, save: true })) as never

    component.data.set(mockCities)
    component.select(0)

    expect(searchControl.value).toBe("London")
    expect(component.data()).toEqual([])
    expect(emitSpy).toHaveBeenCalledWith(mockCities[0])
  })
})
