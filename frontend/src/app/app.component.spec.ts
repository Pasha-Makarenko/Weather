import { ComponentFixture, TestBed } from "@angular/core/testing"
import { AppComponent } from "./app.component"
import { HeaderComponent } from "./components/header/header.component"
import { provideMockStore } from "@ngrx/store/testing"
import { ReactiveFormsModule } from "@angular/forms"
import { HttpClientTestingModule } from "@angular/common/http/testing"

describe("AppComponent", () => {
  let fixture: ComponentFixture<AppComponent>
  let component: AppComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HeaderComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [provideMockStore()]
    }).compileComponents()

    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
  })

  it("should create the app", () => {
    expect(component).toBeTruthy()
  })

  it(`should have as title 'Weather'`, () => {
    expect(component.title).toEqual("Weather")
  })
})
