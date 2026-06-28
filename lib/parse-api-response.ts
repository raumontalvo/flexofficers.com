export async function parseApiJsonResponse<T extends Record<string, unknown>>(
  response: Response
): Promise<T | null> {
  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid response from server.");
  }
}
