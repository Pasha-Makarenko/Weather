import { Pipe, PipeTransform } from "@angular/core"

export enum SpeedUnit {
  KILOMETRES = "k",
  MIlES = "m"
}

@Pipe({
  name: "speed"
})
export class SpeedPipe implements PipeTransform {
  transform(value: number | string, unit: SpeedUnit): string {
    let result = value.toString()

    switch (unit) {
      case SpeedUnit.KILOMETRES:
        result += " k/h"
        break
      case SpeedUnit.MIlES:
        result += " m/h"
        break
    }

    return result
  }
}
