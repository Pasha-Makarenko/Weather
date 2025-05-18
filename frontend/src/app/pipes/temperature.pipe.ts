import { Pipe, PipeTransform } from "@angular/core"

export enum TemperatureUnit {
  CELSIUS = "c",
  FAHRENHEIT = "f"
}

const degSymbol = "°"

@Pipe({
  name: "temperature"
})
export class TemperaturePipe implements PipeTransform {
  transform(value: number | string, unit?: TemperatureUnit): string {
    let result = value + degSymbol

    switch (unit) {
      case TemperatureUnit.CELSIUS:
        result += "C"
        break
      case TemperatureUnit.FAHRENHEIT:
        result += "F"
        break
    }

    return result
  }
}
