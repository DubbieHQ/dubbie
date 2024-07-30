import { type FileMetadata } from "@google-cloud/storage";
import admin from "../clients/firebaseAdmin";

const bucket = admin.storage().bucket();

export async function getFirebaseFileMetadata(
  fileUrl: string,
): Promise<FileMetadata> {
  const urlParts = fileUrl.split("/");
  const path = decodeURIComponent(urlParts[urlParts.length - 1].split("?")[0]);
  const file = bucket.file(path);
  const [metadata] = await file.getMetadata();
  console.log("metadata", metadata);
  return metadata;
}
