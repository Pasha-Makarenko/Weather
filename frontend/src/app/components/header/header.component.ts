import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"
import { ModalAdapter } from "../modal/state/modal.adapter"
import { ModalComponent } from "../modal/modal.component"

@Component({
  selector: "app-header",
  imports: [RouterLink, ModalComponent],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss"
})
export class HeaderComponent {
  constructor(protected modalAdapter: ModalAdapter) {}
}
