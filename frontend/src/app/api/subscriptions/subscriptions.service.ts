import { inject, Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { ENDPOINTS } from "../../consts/endpoints"
import { SubscribeDto } from "./dto/subscribe.dto"

@Injectable({
  providedIn: "root"
})
export class SubscriptionsService {
  http = inject(HttpClient)

  subscribe(dto: SubscribeDto) {
    return this.http.post(ENDPOINTS.subscribe, dto)
  }

  confirm(token: string) {
    return this.http.post(ENDPOINTS.confirm(token), {})
  }

  unsubscribe(token: string) {
    return this.http.post(ENDPOINTS.unsubscribe(token), {})
  }
}
