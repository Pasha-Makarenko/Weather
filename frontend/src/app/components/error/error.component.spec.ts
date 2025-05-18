import { ComponentFixture, TestBed } from "@angular/core/testing"
import { ErrorComponent } from "./error.component"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"

describe("ErrorComponent", () => {
  let component: ErrorComponent
  let fixture: ComponentFixture<ErrorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorComponent, FaIconComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(ErrorComponent)
    component = fixture.componentInstance
    component.message = "Test error message"
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should display error message", () => {
    const element = fixture.nativeElement.querySelector("p")
    expect(element.textContent).toContain("Test error message")
  })
})
