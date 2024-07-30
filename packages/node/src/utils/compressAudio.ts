import { spawn } from "node:child_process";
import { statSync } from "node:fs";

export async function compressAudio(inputPath: string, outputPath: string): Promise<void> {
  console.log("compressing audio");

  const ffmpegArgs = [
    "-i",
    inputPath,
    "-map",
    "0:a:0",
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

    /*   ffmpeg.stderr.on("data", (data) => {
      console.error(`FFmpeg stderr: ${data}`);
    }); */
    ffmpeg.on("close", (code) => {
      if (code === 0) {
        console.log("audio compressed");
        const stats = statSync(outputPath);
        console.log(`File size: ${stats.size} bytes`);
        resolve();
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });
  });
}
