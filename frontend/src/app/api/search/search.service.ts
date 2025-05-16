import { inject, Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { City } from "./search.interface"
import { ENDPOINTS } from "../../consts/endpoints"

@Injectable({
  providedIn: "root"
})
export class SearchService {
  http = inject(HttpClient)

  search(city: string) {
    return this.http.get<City[]>(ENDPOINTS.search(city))
  }
}
