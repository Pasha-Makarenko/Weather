import { TemperaturePipe, TemperatureUnit } from "./temperature.pipe"

describe("TemperaturePipe", () => {
  const pipe = new TemperaturePipe()

  it("create an instance", () => {
    expect(pipe).toBeTruthy()
  })

  it("should format temperature in Celsius", () => {
    expect(pipe.transform(20, TemperatureUnit.CELSIUS)).toBe("20°C")
  })

  it("should format temperature in Fahrenheit", () => {
    expect(pipe.transform(68, TemperatureUnit.FAHRENHEIT)).toBe("68°F")
  })

  it("should format without unit if not specified", () => {
    expect(pipe.transform(20)).toBe("20°")
  })

  it("should handle string input", () => {
    expect(pipe.transform("25", TemperatureUnit.CELSIUS)).toBe("25°C")
  })
})
