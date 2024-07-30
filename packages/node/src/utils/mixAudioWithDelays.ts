/*
for railway
[phases.setup]
aptPkgs = ["...", "ffmpeg"]
*/

import { spawn } from "node:child_process";
interface AudioFile {
  path: string; //can be a file path or a url
  delay: number;
}

export async function mixAudioWithDelays(
  audioFiles: AudioFile[],
  outputPath: string
): Promise<void> {
  const ffmpegArgs: string[] = [];

  const validAudioFiles = audioFiles.filter((file) => file.path);

  for (const { path, delay } of validAudioFiles) {
    ffmpegArgs.push("-i", path);
  }

  const filterComplex: string[] = [];

  for (let i = 0; i < audioFiles.length; i++) {
    const { delay } = audioFiles[i];
    filterComplex.push(`[${i}:a]adelay=${delay * 1000}|${delay * 1000}[delayed${i}]`);
  }

  filterComplex.push(
    `${audioFiles.map((_, i) => `[delayed${i}]`).join("")}amix=inputs=${audioFiles.length}:duration=longest:dropout_transition=3,loudnorm=I=-14:TP=-1:LRA=11`
  );

  ffmpegArgs.push("-filter_complex", filterComplex.join(";"));
  ffmpegArgs.push("-y", outputPath);

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
