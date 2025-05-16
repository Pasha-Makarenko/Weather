import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HeaderComponent } from "./header.component"
import { ModalAdapter } from "../modal/state/modal.adapter"
import { AuthService } from "../../api/auth/auth.service"
import { RouterTestingModule } from "@angular/router/testing"
import { ModalComponent } from "../modal/modal.component"
import { By } from "@angular/platform-browser"
import { of } from "rxjs"
import { User } from "../../api/auth/auth.interface"

describe("HeaderComponent", () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>
  let authService: AuthService
  let modalAdapter: ModalAdapter

  const mockUser: User = {
    user_id: 1,
    email: "quinceney@gmail.com",
    username: "pc",
    is_active: true
  }

  const mockAuthService = {
    me: null,
    logout: jest.fn()
  }

  const mockModalAdapter = {
    open: jest.fn(),
    close: jest.fn(),
    select: jest.fn(() => of({}))
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule, ModalComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ModalAdapter, useValue: mockModalAdapter }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(HeaderComponent)
    component = fixture.componentInstance
    authService = TestBed.inject(AuthService)
    modalAdapter = TestBed.inject(ModalAdapter)

    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should display login link when user is not logged in", () => {
    authService.me = null
    fixture.detectChanges()

    const loginLink = fixture.debugElement.query(
      By.css(".nav-header__link.button")
    )
    expect(loginLink).toBeTruthy()
    expect(loginLink.nativeElement.textContent.trim()).toBe("Login")
  })

  it("should display user avatar when user is logged in", () => {
    authService.me = mockUser
    fixture.detectChanges()

    const avatarButton = fixture.debugElement.query(By.css(".user-nav__avatar"))
    expect(avatarButton).toBeTruthy()
    expect(avatarButton.nativeElement.querySelector("img")).toBeTruthy()
  })

  it("should open modal when avatar is clicked", () => {
    authService.me = mockUser
    fixture.detectChanges()

    const avatarButton = fixture.debugElement.query(By.css(".user-nav__avatar"))
    avatarButton.triggerEventHandler("click", null)

    expect(modalAdapter.open).toHaveBeenCalledWith("header")
  })

  it("should contain modal with user options", () => {
    authService.me = mockUser
    fixture.detectChanges()

    const modal = fixture.debugElement.query(By.directive(ModalComponent))
    expect(modal).toBeTruthy()

    const modalInstance = modal.componentInstance as ModalComponent
    expect(modalInstance.modalId).toBe("header")
    expect(modalInstance.options.closeOutside).toBe(true)
  })

  it("should call logout when logout button is clicked", () => {
    authService.me = mockUser
    fixture.detectChanges()

    const logoutButton = fixture.debugElement.query(
      By.css(".modal-nav__item[type='button']")
    )
    logoutButton.triggerEventHandler("click", null)

    expect(authService.logout).toHaveBeenCalled()
  })

  it("should display correct routes in navigation", () => {
    const navLinks = fixture.debugElement.queryAll(By.css(".nav-header__link"))
    expect(navLinks.length).toBeGreaterThan(0)

    const portfoliosLink = navLinks.find(
      link => link.nativeElement.textContent.trim() === "Portfolios"
    )
    expect(portfoliosLink).toBeTruthy()
  })

  it("should display logo with correct text", () => {
    const logo = fixture.debugElement.query(By.css(".header__logo"))
    expect(logo).toBeTruthy()

    const logoText = logo.query(By.css("span"))
    expect(logoText.nativeElement.textContent.trim()).toBe(
      "Crypto Portfolio Tracker"
    )
  })
})
