import { Component, inject, signal } from "@angular/core"
import { ModalAdapter } from "../modal/state/modal.adapter"
import { ModalComponent } from "../modal/modal.component"
import { faCloudBolt } from "@fortawesome/free-solid-svg-icons"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { subscriptionsFormValidators } from "./subscriptions-form.validators"
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms"
import { Frequency } from "../../api/subscriptions/subscriptions.interface"
import { invalid } from "../../utils/error/invalid"
import { message } from "../../utils/error/message"
import { subscriptionsErrors } from "../../consts/errors/subscriptions-errors"
import { ErrorComponent } from "../error/error.component"
import { SubscribeDto } from "../../api/subscriptions/dto/subscribe.dto"
import { SubscriptionsService } from "../../api/subscriptions/subscriptions.service"
import { SearchComponent } from "../search/search.component"

@Component({
  selector: "app-header",
  imports: [
    ModalComponent,
    FaIconComponent,
    ReactiveFormsModule,
    ErrorComponent,
    SearchComponent
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss"
})
export class HeaderComponent {
  subscriptionsService = inject(SubscriptionsService)

  icon = faCloudBolt
  modalId = "subscriptions"
  searchId = "subscriptions"
  subscriptionsSubmitError = signal<string | null>(null)
  validators = subscriptionsFormValidators()
  subscriptionsFormGroup = new FormGroup({
    email: new FormControl<string>("", this.validators.email),
    city: new FormControl<string>("", this.validators.city),
    frequency: new FormControl<Frequency | null>(
      null,
      this.validators.frequency
    )
  })

  constructor(protected modalAdapter: ModalAdapter) {
    this.modalAdapter.select().subscribe(state => {
      if (state[this.modalId] && !state[this.modalId].isOpen) {
        this.subscriptionsFormGroup.reset()
      }
    })
  }

  subscribe() {
    if (this.subscriptionsFormGroup.invalid) {
      this.subscriptionsFormGroup.markAsTouched()
      this.subscriptionsFormGroup.controls.email.markAsTouched()
      this.subscriptionsFormGroup.controls.city.markAsTouched()
      this.subscriptionsFormGroup.controls.frequency.markAsTouched()
      return
    }

    const dto: SubscribeDto = {
      email: this.subscriptionsFormGroup.value.email!,
      city: this.subscriptionsFormGroup.value.city!,
      frequency: this.subscriptionsFormGroup.value.frequency!
    }

    this.subscriptionsService.subscribe(dto).subscribe(
      () => {
        this.modalAdapter.close(this.modalId)
      },
      () => {
        this.subscriptionsSubmitError.set(subscriptionsErrors.submitInvalid)
      }
    )
  }

  protected readonly invalid = invalid
  protected readonly message = message
  protected readonly subscriptionsErrors = subscriptionsErrors
  protected readonly Frequency = Frequency
}
