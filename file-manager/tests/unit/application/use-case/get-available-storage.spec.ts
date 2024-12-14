import { GetAvailableStorageUseCase } from "@/application/use-case";
import { type GetCurrentStorageUsageRepository } from "@/application/protocol";

jest.mock("uuid", () => ({
  v4: () => "any-id",
}));

jest.mock("@/shared/env.ts", () => ({
  ENVS: {
    FILE_CONFIGS: {
      MAX_STORAGE_SIZE_IN_MB: 50,
    },
  },
}));

describe("Get Available Storage Use Case", () => {
  let sut: GetAvailableStorageUseCase;
  let mockGetCurrentStorageUsageRepository: GetCurrentStorageUsageRepository;

  beforeEach(() => {
    mockGetCurrentStorageUsageRepository = {
      getUsage: jest.fn().mockResolvedValue({ usage: 25 * 1024 * 1024 }),
    };

    sut = new GetAvailableStorageUseCase(mockGetCurrentStorageUsageRepository);
  });

  it("should get available storage and its related info", async () => {
    const result = await sut.execute({
      userId: "user-id",
    });

    const maxStorage = 50 * 1024 * 1024;
    const usage = 25 * 1024 * 1024;
    const available = maxStorage - usage;

    expect(result.ok).toBe(true);
    expect(result.data).toEqual({
      available,
      canAddMore: true,
      currentUsage: usage,
      maxStorage,
    });
  });

  it("should calls dependencies with correct input", async () => {
    const getUsageSpy = jest.spyOn(
      mockGetCurrentStorageUsageRepository,
      "getUsage",
    );

    await sut.execute({
      userId: "user-id",
    });

    expect(getUsageSpy).toHaveBeenCalledWith("user-id");
  });

  it("should pass along any unknown error", async () => {
    mockGetCurrentStorageUsageRepository.getUsage = jest
      .fn()
      .mockRejectedValueOnce(new Error("any-error"));

    const result = sut.execute({
      userId: "user-id",
    });

    await expect(result).rejects.toThrow("any-error");
  });
});
