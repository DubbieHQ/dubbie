import { readFileSync, writeFileSync, existsSync } from "node:fs";

/**
 * Appends a key-value pair to a JSON file.
 * @param filePath - The path to the JSON file.
 * @param key - The key to add.
 * @param value - The value to add.
 */
export function appendToJsonFile(filePath: string, key: string, value: any): void {
  let jsonContent: Record<string, any> = {};

  if (existsSync(filePath)) {
    try {
      const fileContent = readFileSync(filePath, "utf-8");
      jsonContent = JSON.parse(fileContent);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error reading JSON file: ${error.message}`);
      } else {
        console.error("Unknown error occurred while reading JSON file.");
      }
      return;
    }
  }

  jsonContent[key] = value;

  try {
    writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));
    console.log(`Appended ${key}: ${value} to ${filePath}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error writing to JSON file: ${error.message}`);
    } else {
      console.error("Unknown error occurred while writing to JSON file.");
    }
  }
}
