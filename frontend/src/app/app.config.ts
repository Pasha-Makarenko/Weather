import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core"
import { provideRouter } from "@angular/router"
import { routes } from "./app.routes"
import { provideHttpClient } from "@angular/common/http"
import { provideStore } from "@ngrx/store"
import { modalReducer } from "./components/modal/state/modal.reducer"
import { homeReducer } from "./pages/home/state/home.reducer"

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      modals: modalReducer,
      home: homeReducer
    })
  ]
}
