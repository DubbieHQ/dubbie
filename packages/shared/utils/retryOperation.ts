const MAX_RETRIES = 5;
const INITIAL_BACKOFF = 1000;

export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  initialBackoff: number = INITIAL_BACKOFF
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      if (attempt < maxRetries - 1) {
        const backoff = initialBackoff * 2 ** attempt;
        console.log(`Retrying in ${backoff}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoff));
      } else {
        throw new Error("Max retries reached. Unable to complete the request.");
      }
    }
  }
  throw new Error("Max retries reached. Unable to complete the request.");
}
