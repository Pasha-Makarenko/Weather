import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal
} from "@angular/core"
import { FormControl, ReactiveFormsModule } from "@angular/forms"
import { debounceTime, distinctUntilChanged } from "rxjs"
import { ModalComponent } from "../modal/modal.component"
import { City } from "../../api/search/search.interface"
import { SearchService } from "../../api/search/search.service"
import { ModalAdapter } from "../modal/state/modal.adapter"

export interface SearchOptions {
  delay: number
}

@Component({
  selector: "app-search",
  imports: [ReactiveFormsModule, ModalComponent],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.scss"
})
export class SearchComponent {
  searchService = inject(SearchService)

  searchId = input<string>()
  modalId = computed(() => this.searchId() + "-modal")
  options = input<SearchOptions | null>(null)
  searchControl = input<FormControl<string | null>>()
  data = signal<City[]>([])
  isSelect = signal(false)

  constructor(protected modalAdapter: ModalAdapter) {
    effect(() => {
      this.searchControl()
        ?.valueChanges.pipe(
          debounceTime(this.options()!.delay),
          distinctUntilChanged()
        )
        .subscribe(search => {
          this.searchChanges(search)
        })

      if (this.data().length) {
        this.modalAdapter.open(this.modalId())
      } else {
        this.modalAdapter.close(this.modalId())
      }
    })
  }

  select(city: string) {
    this.searchControl()?.setValue(city)
    this.data.set([])
    this.isSelect.set(true)
  }

  searchChanges(search: string | null) {
    if (!search || !this.searchControl() || !this.options()) {
      this.data.set([])
      return
    }

    this.searchService.search(search).subscribe(this.data.set)
  }

  focusIn() {
    if (this.data().length) {
      this.modalAdapter.open(this.modalId())
    }
  }

  focusOut() {
    setTimeout(() => {
      if (!this.isSelect()) {
        this.modalAdapter.close(this.modalId())
      }
      this.isSelect.set(false)
    }, 100)
  }
}
