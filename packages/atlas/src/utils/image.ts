import axios from 'axios'

import { atlasConfig } from '@/config'

export const validateImage = async (fileOrUrl: File | string): Promise<File | string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const fileURL = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl)
    img.src = fileURL
    img.onload = () => resolve(fileOrUrl)
    img.onerror = () => reject(new Error('Image could not be loaded'))
  })
}

export const uploadAvatarImage = async (croppedBlob: Blob) => {
  const formData = new FormData()
  formData.append('file', croppedBlob, `upload.${croppedBlob.type === 'image/webp' ? 'webp' : 'jpg'}`)
  try {
    const response = await axios.post<{ fileName: string }>(atlasConfig.features.members.avatarServiceUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return atlasConfig.features.members.avatarServiceUrl + '/' + response.data.fileName
  } catch (error) {
    throw new UploadAvatarServiceError(error?.message)
  }
}

export class UploadAvatarServiceError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'UploadAvatarServiceError'
  }
}

const resizeImage = (image: HTMLImageElement, targetWidth: number, targetHeight: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight

  const ctx = canvas.getContext('2d')
  if (ctx) {
    const imageWidth = image.width
    const imageHeight = image.height

    // Calculate the coordinates to center the image
    const x = Math.max(0, (targetWidth - imageWidth) / 2)
    const y = Math.max(0, (targetHeight - imageHeight) / 2)

    ctx.drawImage(image, x, y, imageWidth, imageHeight)
  }

  return canvas
}

export const imageUrlToBlob = async (imageUrl: string, width = 192, height = 192): Promise<Blob> => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'blob',
      headers: {
        Accept: 'image/*',
      },
    })

    const contentType: string | undefined = response.headers['content-type']
    if (contentType && !contentType.startsWith('image/')) {
      throw new Error('Invalid image URL')
    }

    const img = new Image()
    img.src = URL.createObjectURL(response.data)

    return new Promise<Blob>((resolve, reject) => {
      img.onload = () => {
        const resizedCanvas = resizeImage(img, width, height)
        resizedCanvas.toBlob((blob: Blob | null) => {
          if (blob) {
            resolve(blob)
            img.remove()
          } else {
            reject(new Error('Failed to create Blob'))
            img.remove()
          }
        })
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
        img.remove()
      }
    })
  } catch (error) {
    throw new Error('Failed to fetch or process image')
  }
}
