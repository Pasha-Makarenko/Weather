import { inject, Injectable } from "@angular/core"
import { AppState } from "../../../app.state"
import { Store } from "@ngrx/store"
import { commonErrors } from "../../../consts/errors/common.errors"
import { WeatherService } from "../../../api/weather/weather.service"
import * as HomeActions from "./home.actions"
import { selectHome } from "./home.selectors"

@Injectable({ providedIn: "root" })
export class HomeAdapter {
  weatherService = inject(WeatherService)

  constructor(private store: Store<AppState>) {}

  select() {
    return this.store.select(selectHome)
  }

  weather(finallyFn?: () => void) {
    if (!this.weatherService.city) {
      return
    }

    this.store.dispatch(HomeActions.getWeatherAction())

    this.weatherService
      .weather({
        city: this.weatherService.city.url,
        days: 14
      })
      .subscribe(
        result => {
          this.store.dispatch(HomeActions.getWeatherSuccessAction({ result }))
        },
        error => {
          this.store.dispatch(
            HomeActions.getWeatherFailureAction({
              error: error?.message || commonErrors.main
            })
          )
        }
      )
      .add(finallyFn)
  }
}
