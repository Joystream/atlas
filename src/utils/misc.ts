export const withTimeout = async <T>(promise: Promise<T>, timeout: number) => {
  const timeoutPromise = new Promise<T>((resolve, reject) => setTimeout(() => reject(new Error('Timed out!')), timeout))
  return await Promise.race([timeoutPromise, promise])
}
