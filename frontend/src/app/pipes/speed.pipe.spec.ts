import { SpeedPipe, SpeedUnit } from "./speed.pipe"

describe("SpeedPipe", () => {
  const pipe = new SpeedPipe()

  it("create an instance", () => {
    expect(pipe).toBeTruthy()
  })

  it("should format speed in kilometres", () => {
    expect(pipe.transform(10, SpeedUnit.KILOMETRES)).toBe("10 k/h")
  })

  it("should format speed in miles", () => {
    expect(pipe.transform(10, SpeedUnit.MIlES)).toBe("10 m/h")
  })

  it("should handle string input", () => {
    expect(pipe.transform("15", SpeedUnit.KILOMETRES)).toBe("15 k/h")
  })
})
