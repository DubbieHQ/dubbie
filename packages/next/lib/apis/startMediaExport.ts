import { MediaType } from "@dubbie/db";
import { API_ENDPOINT } from "../constants";

export async function startMediaExport(
  projectId: string,
  mediaType: MediaType,
  includeBGM: boolean,
) {
  try {
    const response = await fetch(`${API_ENDPOINT}/exportMedia`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId, mediaType, includeBGM }),
    });

    if (!response.ok) {
      throw new Error("Failed to export media");
    }

    // const data = await response.json();
    // console.log("Media export:", data);
  } catch (error) {
    console.error("Error exporting media:", error);
  }
}
