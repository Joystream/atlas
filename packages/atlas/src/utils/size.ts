const units = [' bytes', 'KB', 'MB', 'GB']
export const formatBytes = (size: number) => {
  let i = 0
  while (size >= 1024 && ++i) {
    size = size / 1024
  }
  // include a decimal point and a tenths-place digit if presenting
  // less than ten of KB or greater units
  return size.toFixed(size < 10 && i > 0 ? 1 : 0) + units[i]
}
