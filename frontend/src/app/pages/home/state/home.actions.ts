import { createAction, props } from "@ngrx/store"
import { HomeState } from "./home.state"

export const getWeatherAction = createAction("[Home] Get Weather")

export const getWeatherSuccessAction = createAction(
  "[Home] Get Weather Success",
  props<{ result: HomeState["home"]["result"] }>()
)

export const getWeatherFailureAction = createAction(
  "[Home] Get Weather Failure",
  props<{ error: HomeState["home"]["error"] }>()
)
