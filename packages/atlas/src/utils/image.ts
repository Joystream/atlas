import axios from 'axios'

import { AVATAR_SERVICE_URL } from '@/config/urls'

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
    const response = await axios.post<{ fileName: string }>(AVATAR_SERVICE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return AVATAR_SERVICE_URL + '/' + response.data.fileName
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
