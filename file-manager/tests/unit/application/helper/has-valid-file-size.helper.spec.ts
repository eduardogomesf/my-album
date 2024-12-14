import { hasValidFileSize } from "@/application/helper";

jest.mock("@/shared/env.ts", () => {
  return {
    ENVS: {
      FILE_CONFIGS: {
        MAX_FILE_SIZE_IN_MB: "5",
      },
    },
  };
});

describe("Has Valid File Size Helper", () => {
  it("should get size as valid since it is smaller than max size", () => {
    const hasValidSize = hasValidFileSize(3145728);
    expect(hasValidSize).toBe(true);
  });

  it("should get size as NOT valid since it is greater than max size", () => {
    const hasValidSize = hasValidFileSize(10485760);
    expect(hasValidSize).toBe(false);
  });
});
