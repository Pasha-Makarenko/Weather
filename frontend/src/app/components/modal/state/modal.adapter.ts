import { Injectable } from "@angular/core"
import { AppState } from "../../../app.state"
import { Store } from "@ngrx/store"
import * as ModalActions from "./modal.actions"
import { selectModals } from "./modal.selectors"

@Injectable({ providedIn: "root" })
export class ModalAdapter {
  constructor(private store: Store<AppState>) {}

  select() {
    return this.store.select(selectModals)
  }

  open(modalId: string) {
    this.store.dispatch(ModalActions.openModal({ modalId }))
  }

  close(modalId: string) {
    this.store.dispatch(ModalActions.closeModal({ modalId }))
  }
}
