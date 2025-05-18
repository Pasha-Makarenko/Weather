import { CityPipe } from "./city.pipe"
import { City } from "../api/search/search.interface"

describe("CityPipe", () => {
  const pipe = new CityPipe()
  const mockCity: City = {
    id: 1,
    name: "London",
    region: "London",
    country: "UK",
    lat: 51.51,
    lon: -0.13,
    url: "london-uk"
  }

  it("create an instance", () => {
    expect(pipe).toBeTruthy()
  })

  it("should return empty string for null city", () => {
    expect(pipe.transform(null, "")).toBe("")
  })

  it("should format city name only", () => {
    expect(pipe.transform(mockCity, "$n")).toBe("London")
  })

  it("should format city with region", () => {
    expect(pipe.transform(mockCity, "$n ($r)")).toBe("London (London)")
  })

  it("should format city with country", () => {
    expect(pipe.transform(mockCity, "$n ($c)")).toBe("London (UK)")
  })

  it("should handle unknown placeholders", () => {
    expect(pipe.transform(mockCity, "$n ($x)")).toBe("London ($x)")
  })
})
