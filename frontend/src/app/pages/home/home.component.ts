import { Component, computed, inject, signal } from "@angular/core"
import { WeatherService } from "../../api/weather/weather.service"
import { HomeAdapter } from "./state/home.adapter"
import { HomeState, initialHomeState } from "./state/home.state"
import { SearchComponent } from "../../components/search/search.component"
import { FormControl } from "@angular/forms"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { ErrorComponent } from "../../components/error/error.component"
import { DatePipe } from "@angular/common"
import { TemperaturePipe, TemperatureUnit } from "../../pipes/temperature.pipe"
import { CityPipe } from "../../pipes/city.pipe"
import { WeatherHour } from "../../api/weather/weather.interface"
import { SpeedPipe, SpeedUnit } from "../../pipes/speed.pipe"

@Component({
  selector: "app-home",
  imports: [
    SearchComponent,
    FaIconComponent,
    ErrorComponent,
    DatePipe,
    TemperaturePipe,
    CityPipe,
    SpeedPipe
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss"
})
export class HomeComponent {
  weatherService = inject(WeatherService)
  searchControl = new FormControl<string | null>(
    this.weatherService.city?.name || null
  )
  data = signal<HomeState["home"]>(initialHomeState.home)
  searchIcon = faSearch
  dayIndex = signal<number>(0)
  currentDay = computed(
    () => this.data().result?.forecast.forecastday[this.dayIndex()].day || null
  )
  currentDate = computed(
    () => this.data().result?.forecast.forecastday[this.dayIndex()].date || null
  )
  hourStep = 3
  hours = computed<WeatherHour[]>(
    () =>
      this.data().result?.forecast.forecastday[this.dayIndex()].hour.filter(
        (_, i) => i % this.hourStep === 0
      ) || []
  )
  tempUnit = signal<TemperatureUnit>(TemperatureUnit.CELSIUS)
  speedUnit = computed(() =>
    this.tempUnit() === TemperatureUnit.CELSIUS
      ? SpeedUnit.KILOMETRES
      : SpeedUnit.MIlES
  )

  constructor(protected homeAdapter: HomeAdapter) {
    this.homeAdapter.select().subscribe(this.data.set)
    this.homeAdapter.weather()
  }

  protected readonly console = console
  protected readonly TemperatureUnit = TemperatureUnit
  protected readonly SpeedUnit = SpeedUnit
}
