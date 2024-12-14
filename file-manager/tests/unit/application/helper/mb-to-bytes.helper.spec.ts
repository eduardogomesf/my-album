import { megaBytesToBytes } from "@/application/helper";

describe("MB To Bytes Helper", () => {
  it("should convert 5 MB to bytes correctly", () => {
    const valueInBytes = megaBytesToBytes(5);
    expect(valueInBytes).toBe(5242880);
  });

  it("should convert 100 MB to bytes correctly", () => {
    const valueInBytes = megaBytesToBytes(100);
    expect(valueInBytes).toBe(104857600);
  });

  it("should convert 78 MB to bytes correctly", () => {
    const valueInBytes = megaBytesToBytes(78);
    expect(valueInBytes).toBe(81788928);
  });
});
