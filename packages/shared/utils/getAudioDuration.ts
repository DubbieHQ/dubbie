import mm from "music-metadata";

export async function getAudioDuration(
  audioUint8Array: Uint8Array,
): Promise<number> {
  try {
    const audioBuffer = Buffer.from(audioUint8Array);
    const metadata = await mm.parseBuffer(audioBuffer);
    return metadata.format.duration || 0;
  } catch (error) {
    console.error("Error calculating audio duration:", error);
    return 0;
  }
}
