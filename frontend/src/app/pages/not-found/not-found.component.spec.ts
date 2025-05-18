import { ComponentFixture, TestBed } from "@angular/core/testing"
import { NotFoundComponent } from "./not-found.component"
import { Router } from "@angular/router"

describe("NotFoundComponent", () => {
  let component: NotFoundComponent
  let fixture: ComponentFixture<NotFoundComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [{ provide: Router, useValue: { url: "/not-found" } }]
    }).compileComponents()

    fixture = TestBed.createComponent(NotFoundComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should display current URL", () => {
    expect(component.router.url).toBe("/not-found")
  })
})
