// Logging utility for form URL accesses

export interface FormUrlLog {
  url: string;
  timestamp: number;
  formTitle?: string;
  questionCount?: number;
}

// Logs form URL access to the backend API
export async function logFormUrl(
  url: string,
  formTitle?: string,
  questionCount?: number
): Promise<void> {
  try {
    await fetch("/api/log-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        formTitle,
        questionCount,
        timestamp: Date.now(),
      }),
    });
    // No need to handle response - fire-and-forget
  } catch (error) {
    // Log error silently
    console.error("Failed to log form URL:", error);
  }
}