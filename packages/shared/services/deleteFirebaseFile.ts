import { getStorage, ref, deleteObject } from "firebase/storage";
import { app } from "../clients/firebaseApp";

export async function deleteFirebaseFile(fileUrl: string): Promise<void> {
  try {
    const storage = getStorage(app);
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Failed to delete Firebase file:", error);
  }
}
