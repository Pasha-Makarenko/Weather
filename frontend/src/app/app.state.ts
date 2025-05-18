import { ModalState } from "./components/modal/state/modal.state"
import { HomeState } from "./pages/home/state/home.state"

export interface AppState {
  modals: ModalState
  home: HomeState
}
