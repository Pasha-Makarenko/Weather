import { createReducer, on } from "@ngrx/store"
import { initialHomeState } from "./home.state"
import * as HomeActions from "./home.actions"

export const homeReducer = createReducer(
  initialHomeState,
  on(HomeActions.getWeatherAction, state => ({
    ...state,
    home: {
      result: null,
      error: null,
      isLoading: true
    }
  })),
  on(HomeActions.getWeatherSuccessAction, (state, { result }) => ({
    ...state,
    home: {
      result,
      error: null,
      isLoading: false
    }
  })),
  on(HomeActions.getWeatherFailureAction, (state, { error }) => ({
    ...state,
    home: {
      result: null,
      error,
      isLoading: false
    }
  }))
)
