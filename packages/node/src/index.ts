import "./sentrySetup";
import { MediaType } from "@dubbie/db";
import cors from "cors";
import express from "express";
import * as Sentry from "@sentry/node";
import { exportMedia } from "./functions/exportMedia";
import { initializeProject } from "./functions/initializeProject";

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(cors());

app.post("/initializeProject", async (req, res) => {
  const { projectId } = req.body;
  if (!projectId) {
    return res.status(400).send("Project ID is required");
  }
  try {
    initializeProject(projectId);
    res.status(200).send("Project initialized");
  } catch (error) {
    console.error("Error initializing project:", error);
    return res.status(500).send("Failed to initialize project");
  }
});

app.post("/exportMedia", async (req, res) => {
  const { projectId, mediaType, includeBGM } = req.body;
  if (!projectId || !mediaType) {
    return res.status(400).send("Project ID and media type are required");
  }
  exportMedia(projectId, mediaType as MediaType, includeBGM);
  res.status(200).send("Media export started");
});

Sentry.setupExpressErrorHandler(app);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Schedule the function to run every 5 minutes
/* setInterval(
  async () => {
    try {
      await checkAndMarkTimedOutProjects();
    } catch (error) {
      console.error("Error in checkAndMarkTimedOutProjects:", error);
    }
  },
  5 * 60 * 1000
);
 */
