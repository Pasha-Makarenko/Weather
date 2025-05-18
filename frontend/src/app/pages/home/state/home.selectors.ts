import { AppState } from "../../../app.state"
import { createSelector } from "@ngrx/store"

export const selectHomeState = (state: AppState) => state.home

export const selectHome = createSelector(selectHomeState, state => state.home)
