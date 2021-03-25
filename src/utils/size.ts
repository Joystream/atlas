const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
export const formatBytes = (x: number) => {
  let l = 0

  while (x >= 1024 && ++l) {
    x = x / 1024
  }
  // include a decimal point and a tenths-place digit if presenting
  // less than ten of KB or greater units
  return x.toFixed(x < 10 && l > 0 ? 1 : 0) + units[l]
}
