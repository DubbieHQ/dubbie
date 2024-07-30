import admin from "@dubbie/shared/clients/firebaseAdmin";
import * as path from "node:path";
import { v4 as uuidv4 } from "uuid";

export async function uploadAudioArrayToStorage(
  audio: Uint8Array,
  folder: string
): Promise<string> {
  console.log("uploading audio");
  const storageRef = admin.storage().bucket();

  const id = uuidv4();
  const fileRef = storageRef.file(`${folder}/${id}.mp3`);
  await fileRef.save(Buffer.from(audio), {
    contentType: "audio/mpeg",
    public: true,
  });
  // Get the public URL of the uploaded file
  const [url] = await fileRef.getSignedUrl({
    action: "read",
    expires: "03-09-2491",
  });

  console.log("uploaded audio", url);
  return url;
}

export async function uploadFileToStorage(filePath: string, folder: string): Promise<string> {
  try {
    console.log("uploading file to storage");
    const bucket = admin.storage().bucket();
    const originalExtension = path.extname(filePath);
    const randomName = uuidv4() + originalExtension; // Generate a random name with the correct file extension
    const destination = `${folder}/${randomName}`;

    // Determine content type from file extension
    const contentType = determineContentType(filePath);

    await bucket.upload(filePath, {
      destination: destination,
      metadata: {
        contentType: contentType,
      },
    });

    const [url] = await bucket.file(destination).getSignedUrl({
      action: "read",
      expires: "03-01-2500",
    });

    console.log("File uploaded successfully.");

    return url;
  } catch (error) {
    console.error("Error uploading file to Firebase Storage:", error);
    throw error;
  }
}

function determineContentType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case ".mp3":
      return "audio/mpeg";
    case ".mp4":
      return "video/mp4";
    case ".wav":
      return "audio/wav";
    default:
      return "application/octet-stream"; // Default fallback
  }
}
