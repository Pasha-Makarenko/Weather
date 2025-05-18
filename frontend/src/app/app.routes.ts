import { Routes } from "@angular/router"
import { HomeComponent } from "./pages/home/home.component"
import { inject } from "@angular/core"
import { SubscriptionsService } from "./api/subscriptions/subscriptions.service"
import { ROUTES } from "./consts/routes"
import { NotFoundComponent } from "./pages/not-found/not-found.component"

export const routes: Routes = [
  {
    path: ROUTES.home,
    component: HomeComponent
  },
  {
    path: ROUTES.confirmByToken,
    redirectTo: redirectData => {
      const subscriptionsService = inject(SubscriptionsService)

      subscriptionsService
        .confirm(redirectData.params["token"])
        .subscribe(res => {
          console.log(res)
        })

      return ROUTES.home
    }
  },
  {
    path: ROUTES.unsubscribeByToken,
    redirectTo: redirectData => {
      const subscriptionsService = inject(SubscriptionsService)

      subscriptionsService
        .unsubscribe(redirectData.params["token"])
        .subscribe(res => {
          console.log(res)
        })

      return ROUTES.home
    }
  },
  {
    path: ROUTES.other,
    component: NotFoundComponent
  }
]
