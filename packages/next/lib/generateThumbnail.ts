export function generateThumbnail(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);

    video.onloadeddata = () => {
      video.currentTime = 1;
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], "thumbnail.jpg", {
              type: "image/jpeg",
            });
            resolve(thumbnailFile);
          } else {
            reject("Failed to create thumbnail blob");
          }
        }, "image/jpeg");
      } else {
        reject("Failed to create drawing context");
      }

      URL.revokeObjectURL(video.src);
    };

    video.onerror = (e) => {
      reject(`Error when loading video file: ${(e as ErrorEvent).message}`);
    };
  });
}
