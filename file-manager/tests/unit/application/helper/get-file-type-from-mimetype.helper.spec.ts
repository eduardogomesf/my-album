import { getFileTypeFromMimeType } from "@/application/helper";

describe("Get File Type From Mimetype Helper", () => {
  it("should get the file type as image for image/jpeg mimetype", () => {
    const fileType = getFileTypeFromMimeType("image/jpeg");
    expect(fileType).toBe("image");
  });

  it("should get the file type as image for image/png mimetype", () => {
    const fileType = getFileTypeFromMimeType("image/png");
    expect(fileType).toBe("image");
  });

  it("should get the file type as image for image/gif mimetype", () => {
    const fileType = getFileTypeFromMimeType("image/gif");
    expect(fileType).toBe("image");
  });

  it("should get the file type as video for video/mp4 mimetype", () => {
    const fileType = getFileTypeFromMimeType("video/mp4");
    expect(fileType).toBe("video");
  });
});
