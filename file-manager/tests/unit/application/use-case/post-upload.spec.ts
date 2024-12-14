import { PostUploadUseCase } from "@/application/use-case/file";
import {
  type GetFilesByIdsAndAlbumIdRepository,
  type MarkFilesAsUploadedRepository,
} from "@/application/protocol";
import { getFileMock } from "../mock";

jest.mock("uuid", () => ({
  v4: () => "any-id",
}));

describe("Post Upload Use Case", () => {
  let sut: PostUploadUseCase;
  let mockGetFilesByIdsAndAlbumIdRepository: GetFilesByIdsAndAlbumIdRepository;
  let mockMarkFilesAsUploadedRepository: MarkFilesAsUploadedRepository;

  beforeEach(() => {
    mockGetFilesByIdsAndAlbumIdRepository = {
      getFilesByIdsAndAlbumId: jest
        .fn()
        .mockResolvedValue([getFileMock(), getFileMock()]),
    };
    mockMarkFilesAsUploadedRepository = {
      markAsUploaded: jest.fn().mockResolvedValue(null),
    };

    sut = new PostUploadUseCase(
      mockGetFilesByIdsAndAlbumIdRepository,
      mockMarkFilesAsUploadedRepository,
    );
  });

  it("should perform post upload actions successfully", async () => {
    const result = await sut.execute({
      albumId: "any-album-id",
      userId: "user-id",
      filesIds: ["file-id", "file-id-1"],
    });

    expect(result.ok).toBe(true);
  });

  it("should calls dependencies with correct input", async () => {
    const getFilesByIdsAndAlbumIdSpy = jest.spyOn(
      mockGetFilesByIdsAndAlbumIdRepository,
      "getFilesByIdsAndAlbumId",
    );
    const markFilesAsUploadedSpy = jest.spyOn(
      mockMarkFilesAsUploadedRepository,
      "markAsUploaded",
    );

    await sut.execute({
      albumId: "any-album-id",
      userId: "user-id",
      filesIds: ["file-id", "file-id-1"],
    });

    expect(getFilesByIdsAndAlbumIdSpy).toHaveBeenCalledWith(
      ["file-id", "file-id-1"],
      "any-album-id",
      "user-id",
    );
    expect(markFilesAsUploadedSpy).toHaveBeenCalledWith([
      "file-id",
      "file-id-1",
    ]);
  });

  it("should not perform post upload actions if no file is found", async () => {
    mockGetFilesByIdsAndAlbumIdRepository.getFilesByIdsAndAlbumId = jest
      .fn()
      .mockResolvedValueOnce([]);

    const result = await sut.execute({
      albumId: "any-album-id",
      userId: "user-id",
      filesIds: ["file-id", "file-id-1"],
    });

    expect(result).toEqual({
      ok: false,
      data: {
        message: "Files not found",
      },
    });
  });

  it("should pass along any unknown error", async () => {
    mockGetFilesByIdsAndAlbumIdRepository.getFilesByIdsAndAlbumId = jest
      .fn()
      .mockRejectedValueOnce(new Error("any-error"));

    const result = sut.execute({
      albumId: "any-album-id",
      userId: "user-id",
      filesIds: ["file-id", "file-id-1"],
    });

    await expect(result).rejects.toThrow("any-error");
  });
});
