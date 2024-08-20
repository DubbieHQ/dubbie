export function determineMediaType(fileType: string): "AUDIO" | "VIDEO" {
  const audioTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
  ];
  const videoTypes = ["video/mp4", "video/webm", "video/ogg"];

  if (audioTypes.includes(fileType)) return "AUDIO";
  if (videoTypes.includes(fileType)) return "VIDEO";
  throw new Error("Unsupported media type");
}

export function dataURLToBlob(dataURL: string): Blob {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

export const getMediaDurationFromFile = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const mediaElement = document.createElement(
      file.type.startsWith("audio") ? "audio" : "video",
    );
    mediaElement.preload = "metadata";

    mediaElement.onloadedmetadata = () => {
      resolve(mediaElement.duration);
    };

    mediaElement.onerror = () => {
      reject(new Error("Failed to retrieve media duration"));
    };

    const objectUrl = URL.createObjectURL(file);
    mediaElement.src = objectUrl;
  });
};
