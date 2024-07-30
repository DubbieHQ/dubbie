import { API_ENDPOINT } from "../constants";

export async function initializeProject(projectId: string) {
  try {
    const response = await fetch(`${API_ENDPOINT}/initializeProject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId }),
    });

    if (!response.ok) {
      throw new Error("Failed to initialize project");
    }

    const responseText = await response.text();
    console.log("Project initialization:", responseText);
  } catch (error) {
    console.error("Error initializing project:", error);
  }
}
