export function handleError(error: unknown, context: string): { message: string } {
  let message = "An unexpected error occurred";
  
  if (error instanceof Error) {
    message = error.message;
    console.error(`[${context}] Error:`, error.message, error.stack);
  } else {
    console.error(`[${context}] Unknown error:`, error);
  }

  return { message };
}