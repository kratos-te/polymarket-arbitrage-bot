/**
 * Retry utility function for instant retries on failure
 * @param fn - The async function to retry
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param operationName - Name of the operation for logging
 * @returns Promise that resolves with the function result or rejects after all retries fail
 */
export async function retryWithInstantRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    operationName: string = "Operation"
): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const result = await fn();
            if (attempt > 0) {
                console.log(`✅ ${operationName} succeeded on retry attempt ${attempt}`);
            }
            return result;
        } catch (error: any) {
            lastError = error;
            
            // Don't retry on authentication errors
            if (error?.status === 401 || error?.data?.error?.includes("Unauthorized")) {
                throw error;
            }
            
            // Don't retry on validation errors (these are not transient)
            if (error?.message?.includes("Cannot") || error?.message?.includes("invalid") || error?.message?.includes("missing")) {
                throw error;
            }
            
            if (attempt < maxRetries) {
                console.log(`🔄 ${operationName} failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying instantly...`);
            } else {
                console.error(`❌ ${operationName} failed after ${maxRetries + 1} attempts`);
            }
        }
    }
    
    throw lastError;
}
