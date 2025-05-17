import { Frequency } from "../subscriptions.interface"

export interface SubscribeDto {
  readonly email: string
  readonly city: string
  readonly frequency: Frequency
}
