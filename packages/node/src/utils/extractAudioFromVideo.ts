import { spawn } from "node:child_process";
import { statSync } from "node:fs";

export async function extractAudioFromVideo(videoUrl: string, outputPath: string): Promise<void> {
  console.log("videoUrl", videoUrl);
  console.log("extracting audio from video");

  const ffmpegArgs = [
    "-i",
    videoUrl,
    "-vn",
    "-acodec",
    "libopus",
    "-b:a",
    "12k",
    "-ac",
    "1",
    "-application",
    "voip",
    outputPath,
    "-y",
  ];

  await new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", ffmpegArgs);

    /*     ffmpeg.stderr.on("data", (data) => {
      console.error(`FFmpeg stderr: ${data}`);
    }); */
    ffmpeg.on("close", (code) => {
      if (code === 0) {
        console.log("audio extracted");
        const stats = statSync(outputPath);
        console.log(`File size: ${stats.size} bytes`);
        resolve();
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });
  });
}
