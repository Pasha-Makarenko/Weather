import { Validators } from "@angular/forms"

export const subscriptionsFormValidators = () => ({
  email: [Validators.required, Validators.email],
  city: [Validators.required],
  frequency: [Validators.required]
})
