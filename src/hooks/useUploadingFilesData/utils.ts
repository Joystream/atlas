import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import { UploadingFile, StatusType } from './useUploadingFilesData'

export const getUploadingFiles = promisify(() => readFromLocalStorage<UploadingFile[]>('uploadingFiles') || [])

export const getUploadingFile = async (id: string) => {
  const uploadingFiles = await getUploadingFiles()
  return uploadingFiles.find((item) => item.id === id) ?? null
}

export const updateUploadingFileStatus = async (id: string, status: StatusType) => {
  const uploadingFiles = await getUploadingFiles()
  const newUploadingFiles = uploadingFiles.map((fileData) => (fileData.id === id ? { ...fileData, status } : fileData))
  writeToLocalStorage('uploadingFiles', newUploadingFiles)
  return newUploadingFiles.find((fileData) => fileData.id === id)
}

export const addUploadingFileData = async (data: Omit<UploadingFile, 'id'>) => {
  const uploadingFiles = await getUploadingFiles()
  const id = new Date().getTime().toString()
  const newUploadingFileData = { ...data, id }
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
