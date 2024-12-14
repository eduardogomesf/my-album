import { PreUploadAnalysisUseCase } from "@/application/use-case/file";
import {
  type GenerateUploadUrlService,
  type GetCurrentStorageUsageRepository,
  type SaveFileRepository,
  type GetAlbumByIdRepository,
} from "@/application/protocol";
import { getAlbumByIdMock } from "../mock";

jest.mock("uuid", () => ({
  v4: () => "any-id",
}));

jest.mock("@/shared/env.ts", () => ({
  ENVS: {
    FILE_CONFIGS: {
      MAX_STORAGE_SIZE_IN_MB: 10,
      ALLOWED_EXTENSIONS: ["png"],
      MAX_FILE_SIZE_IN_MB: 2,
    },
  },
}));

describe("Pre Upload Analysis Use Case", () => {
  let sut: PreUploadAnalysisUseCase;
  let getAlbumByIdRepository: GetAlbumByIdRepository;
  let getCurrentStorageUsageRepository: GetCurrentStorageUsageRepository;
  let generateUploadUrlService: GenerateUploadUrlService;
  let saveFileRepository: SaveFileRepository;

  beforeEach(() => {
    getAlbumByIdRepository = {
      getById: jest.fn().mockResolvedValue(getAlbumByIdMock()),
    };
    getCurrentStorageUsageRepository = {
      getUsage: jest.fn().mockResolvedValue({
        usage: 15728640,
      }),
    };
    generateUploadUrlService = {
      generateUploadUrl: jest.fn().mockResolvedValue({
        url: "any-url",
        fields: { a: "a", b: "b" },
      }),
    };
    saveFileRepository = {
      save: jest.fn().mockResolvedValue(null),
    };

    sut = new PreUploadAnalysisUseCase(
      getAlbumByIdRepository,
      getCurrentStorageUsageRepository,
      generateUploadUrlService,
      saveFileRepository,
    );
  });

  it("should complete pre upload analysis successfully", async () => {
    getCurrentStorageUsageRepository.getUsage = jest
      .fn()
      .mockResolvedValueOnce({ usage: 9437184 }); // 9 MB

    const getByIdSpy = jest.spyOn(getAlbumByIdRepository, "getById");
    const getUsageSpy = jest.spyOn(
      getCurrentStorageUsageRepository,
      "getUsage",
    );
    const generateUploadUrlSpy = jest.spyOn(
      generateUploadUrlService,
      "generateUploadUrl",
    );
    const saveSpy = jest.spyOn(saveFileRepository, "save");

    const result = await sut.execute({
      albumId: "any-album-id",
      userId: "user-id",
      files: [
        {
          id: "file-1", // Allowed
          originalName: "me.png",
          size: 1048576, // 1 MB
          mimetype: "image/png",
        },
        {
          id: "file-2", // Block due to invalid extension
          originalName: "docs.pdf",
          size: 1048576,
          mimetype: "application/pdf",
        },
        {
          id: "file-3", // Block due to file size
          originalName: "wallpaper.png",
          size: 3145728,
          mimetype: "image/png",
        },
        {
          id: "file-4", // Block due to max storage size reached on file-1
          originalName: "me.png",
          size: 1048576,
          mimetype: "image/png",
        },
      ],
    });

    expect(result.message).toBeUndefined();
    expect(result.ok).toBe(true);
    expect(result.data).toEqual([
      {
        allowed: false,
        id: "file-3",
        reason: "The file is too large. Max 2 MB",
      },
      {
        allowed: true,
        fields: { a: "a", b: "b" },
        fileId: "any-id",
        id: "file-1",
        uploadUrl: "any-url",
      },
      { allowed: false, id: "file-2", reason: "Invalid extension" },
      { allowed: false, id: "file-4", reason: "No free space available" },
    ]);
    expect(getByIdSpy).toHaveBeenCalledWith("any-album-id", "user-id");
    expect(getUsageSpy).toHaveBeenCalledWith("user-id");
    expect(generateUploadUrlSpy).toHaveBeenCalledWith({
      id: "any-id",
      originalName: "me.png",
      size: 1048576,
      mimetype: "image/png",
      userId: "user-id",
    });
    expect(saveSpy).toHaveBeenCalledWith({
      id: "any-id",
      albumId: "any-album-id",
      type: "image",
      mimeType: "image/png",
      name: "me.png",
      extension: "png",
      size: 1048576,
      uploaded: false,
      createdAt: null,
      updatedAt: null,
    });
    expect(generateUploadUrlSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it("should not perform pre upload analysis if file list is empty", async () => {
    const result = await sut.execute({
      albumId: "any-album-id",
      userId: "user-id",
      files: [],
    });

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Files not found");
  });

  it("should not perform pre upload analysis if album does not exist", async () => {
    getAlbumByIdRepository.getById = jest.fn().mockResolvedValueOnce(null);

    const result = await sut.execute({
      albumId: "any-album-id",
      userId: "user-id",
      files: [null as any],
    });

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Album not found");
  });

  it("should not perform pre upload analysis if album is deleted", async () => {
    getAlbumByIdRepository.getById = jest.fn().mockResolvedValueOnce({
      ...getAlbumByIdMock(),
      status: "DELETED",
    });

    const result = await sut.execute({
      albumId: "any-album-id",
      userId: "user-id",
      files: [null as any],
    });

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Album is deleted. Please restore it first");
  });

  it("should stop pre upload analysis at the beginning if user has reached storage limit", async () => {
    getCurrentStorageUsageRepository.getUsage = jest
      .fn()
      .mockResolvedValue(10485760);

    const result = await sut.execute({
      albumId: "any-album-id",
      userId: "user-id",
      files: [null as any],
    });

    expect(result.ok).toBe(false);
    expect(result.message).toBe("No free space available");
  });

  it("should pass along any unknown error", async () => {
    getAlbumByIdRepository.getById = jest
      .fn()
      .mockRejectedValueOnce(new Error("any-error"));

    const result = sut.execute({
      albumId: "any-album-id",
      userId: "user-id",
      files: [null as any],
    });

    await expect(result).rejects.toThrow("any-error");
  });
});
