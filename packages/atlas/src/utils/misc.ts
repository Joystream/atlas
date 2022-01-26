export class TimeoutError extends Error {}

export const withTimeout = async <T>(promise: Promise<T>, timeout: number) => {
  const timeoutPromise = new Promise<T>((resolve, reject) => setTimeout(() => reject(new TimeoutError()), timeout))
  return await Promise.race([timeoutPromise, promise])
}
