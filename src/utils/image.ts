export const validateImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const fileURL = URL.createObjectURL(file)
    img.src = fileURL
    img.onload = () => resolve(file)
    img.onerror = () => reject(new Error('Image could not be loaded'))
  })
}
