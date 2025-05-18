import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal
} from "@angular/core"
import { FormControl, ReactiveFormsModule } from "@angular/forms"
import { debounceTime, distinctUntilChanged } from "rxjs"
import { ModalComponent } from "../modal/modal.component"
import { City } from "../../api/search/search.interface"
import { SearchService } from "../../api/search/search.service"
import { ModalAdapter } from "../modal/state/modal.adapter"
import { WeatherService } from "../../api/weather/weather.service"
import { CityPipe } from "../../pipes/city.pipe"

export interface SearchOptions {
  delay: number
  save: boolean
}

@Component({
  selector: "app-search",
  imports: [ReactiveFormsModule, ModalComponent, CityPipe],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.scss"
})
export class SearchComponent implements OnInit {
  searchService = inject(SearchService)
  weatherService = inject(WeatherService)

  searchId = input<string>()
  modalId = computed(() => this.searchId() + "-modal")
  options = input<SearchOptions | null>(null)
  searchControl = input<FormControl<string | null>>()
  data = signal<City[]>([])
  selectOutput = output<City | null>()

  constructor(protected modalAdapter: ModalAdapter) {
    effect(() => {
      if (this.data().length) {
        this.modalAdapter.open(this.modalId())
      } else {
        this.modalAdapter.close(this.modalId())
      }
    })
  }

  ngOnInit() {
    this.searchControl()
      ?.valueChanges.pipe(
        debounceTime(this.options()!.delay),
        distinctUntilChanged()
      )
      .subscribe(search => {
        this.searchChanges(search)
      })
  }

  select(index: number) {
    const city = this.data()[index]
    this.searchControl()?.setValue(city.name, {
      emitEvent: false
    })
    this.data.set([])

    if (this.options()?.save) {
      this.weatherService.setCity(city, true)
    }

    if (this.selectOutput) {
      this.selectOutput.emit(city)
    }
  }

  searchChanges(search: string | null) {
    if (!search || !this.searchControl() || !this.options()) {
      this.data.set([])
      return
    }

    this.searchService.search(search).subscribe(this.data.set)
  }
}
