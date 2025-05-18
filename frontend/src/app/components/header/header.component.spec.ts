import { ComponentFixture, TestBed } from "@angular/core/testing"
import { ReactiveFormsModule } from "@angular/forms"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { HeaderComponent } from "./header.component"
import { ModalComponent } from "../modal/modal.component"
import { SearchComponent } from "../search/search.component"
import { ErrorComponent } from "../error/error.component"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { SubscriptionsService } from "../../api/subscriptions/subscriptions.service"
import { Frequency } from "../../api/subscriptions/subscriptions.interface"
import { provideMockStore } from "@ngrx/store/testing"

describe("HeaderComponent", () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>
  let subscriptionsService: SubscriptionsService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        ModalComponent,
        SearchComponent,
        ErrorComponent,
        FaIconComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [SubscriptionsService, provideMockStore()]
    }).compileComponents()

    fixture = TestBed.createComponent(HeaderComponent)
    component = fixture.componentInstance
    subscriptionsService = TestBed.inject(SubscriptionsService)
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should initialize form with empty values", () => {
    expect(component.subscriptionsFormGroup.value).toEqual({
      email: "",
      city: "",
      frequency: null
    })
  })

  it("should mark form as touched when invalid on submit", () => {
    component.subscribe()
    expect(component.subscriptionsFormGroup.touched).toBeTruthy()
  })

  it("should call subscribe service when form is valid", () => {
    const spy = jest.spyOn(subscriptionsService, "subscribe")

    component.subscriptionsFormGroup.setValue({
      email: "test@test.com",
      city: "London",
      frequency: Frequency.DAILY
    })

    component.subscribe()
    expect(spy).toHaveBeenCalledWith({
      email: "test@test.com",
      city: "London",
      frequency: Frequency.DAILY
    })
  })
})
