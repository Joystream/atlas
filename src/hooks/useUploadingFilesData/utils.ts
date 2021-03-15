import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import { UploadingFile, StatusType, RawUploadingFile } from './useUploadingFilesData'

export const getUploadingFiles = promisify(() => readFromLocalStorage<UploadingFile[]>('uploadingFiles') || [])

export const getUploadingFile = async (id: string) => {
  const uploadingFiles = await getUploadingFiles()
  return uploadingFiles.find((item) => item.id === id) ?? null
}

export const updateUploadingFileStatus = async (id: string, status: StatusType) => {
  const uploadingFiles = await getUploadingFiles()
  const updatedAt = new Date().toISOString()
  const newUploadingFiles = uploadingFiles.map((fileData) =>
    fileData.id === id ? { ...fileData, updatedAt, status } : fileData
  )
  writeToLocalStorage('uploadingFiles', newUploadingFiles)
  return newUploadingFiles.find((fileData) => fileData.id === id)
}

export const addUploadingFileData = async (data: RawUploadingFile) => {
  const uploadingFiles = await getUploadingFiles()
  const id = new Date().getTime().toString()
  const updatedAt = new Date().toISOString()
  const newUploadingFileData = { ...data, id, updatedAt }
  uploadingFiles.unshift(newUploadingFileData)
  writeToLocalStorage('uploadingFiles', uploadingFiles)
  return newUploadingFileData
}

export const removeUploadingFileData = async (id: string) => {
  const uploadingFiles = await getUploadingFiles()
  const newuploadingFiles = uploadingFiles.filter((fileData) => fileData.id !== id)
  writeToLocalStorage('uploadingFiles', newuploadingFiles)
}

export const clearUploadingFilesData = () => {
  writeToLocalStorage('uploadingFiles', [])
}
