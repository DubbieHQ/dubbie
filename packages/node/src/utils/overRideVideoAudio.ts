import { spawn } from "node:child_process";

export async function overRideVideoAudio({
  videoURL,
  audioURL,
  outputPath,
}: {
  videoURL: string;
  audioURL: string;
  outputPath: string;
}): Promise<void> {
  const ffmpegArgs = [
    "-i",
    videoURL, // Input video URL
    "-i",
    audioURL, // Input audio URL
    "-map",
    "0:v", // Map video from the first input
    "-map",
    "1:a", // Map audio from the second input
    "-c:v",
    "copy", // Copy the video codec
    "-y",
    outputPath, // Specify the output path and overwrite if necessary
  ];

  await new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", ffmpegArgs);

    ffmpeg.stderr.on("data", (data) => {
      console.error(`FFmpeg stderr: ${data}`);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });
  });
}
