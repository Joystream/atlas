import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  getUploadingFiles,
  getUploadingFile as getUploadingFileFn,
  updateUploadingFileStatus as updateUploadingFileStatusFn,
  addUploadingFileData as addUploadingFileDataFn,
  removeUploadingFileData as removeUploadingFileDataFn,
  clearUploadingFilesData as clearUploadingFilesDataFn,
} from './utils'
import { CropData } from '@/components'

type ParentObjectType = 'video' | 'channel'
type UploadingFileType = 'video' | 'thumbnail' | 'cover' | 'avatar'
export type StatusType = 'completed' | 'inProgress' | 'error'
export type UploadingFile = {
  id: string
  hash: string
  storageProvider: string
  type: UploadingFileType
  status: StatusType
  size: number
  cropData?: CropData
  updatedAt: string
  metadata?: string
  parentObject: {
    type: ParentObjectType
    id: string
  }
}

export type RawUploadingFile = Omit<UploadingFile, 'id' | 'updatedAt'>

type UploadingFilesState = {
  uploadingFiles: UploadingFile[]
}

type UploadingFilesContextValue = {
  uploadingFilesState: UploadingFilesState
  fetchUploadingFiles: () => Promise<void>
}

const UploadingFilesContext = React.createContext<undefined | UploadingFilesContextValue>(undefined)
UploadingFilesContext.displayName = 'UploadingFilesContext'

export const UploadingFilesDataProvider: React.FC = ({ children }) => {
  const [uploadingFilesState, setUploadingFilesState] = useState<UploadingFilesState>({
    uploadingFiles: [],
  })

  const fetchUploadingFiles = useCallback(async () => {
    const uploadingFiles = await getUploadingFiles()
    setUploadingFilesState({ uploadingFiles })
  }, [setUploadingFilesState])

  useEffect(() => {
    fetchUploadingFiles()
  }, [fetchUploadingFiles])

  return (
    <UploadingFilesContext.Provider value={{ uploadingFilesState, fetchUploadingFiles }}>
      {children}
    </UploadingFilesContext.Provider>
  )
}

export const useContextUploadingFilesData = () => {
  const ctx = useContext(UploadingFilesContext)
  if (ctx === undefined) {
    throw new Error('useUploadingFiles must be used within a UploadingFilesProvider')
  }
  return ctx
}

export const useUploadingFilesData = () => {
  const { uploadingFilesState, fetchUploadingFiles } = useContextUploadingFilesData()

  const getUploadingFileData = useCallback(async (id: string) => {
    const uploadingFile = await getUploadingFileFn(id)
    return uploadingFile
  }, [])

  const updateUploadingFileStatus = useCallback(
    async (id: string, status: StatusType) => {
      const updatedUploadingFileStatus = await updateUploadingFileStatusFn(id, status)
      fetchUploadingFiles()
      return updatedUploadingFileStatus
    },
    [fetchUploadingFiles]
  )

  const addUploadingFileData = useCallback(
    async (fileData: RawUploadingFile) => {
      const newFileData = await addUploadingFileDataFn(fileData)
      fetchUploadingFiles()
      return newFileData
    },
    [fetchUploadingFiles]
  )

  const removeUploadingFileData = useCallback(
    async (id: string) => {
      await removeUploadingFileDataFn(id)
      fetchUploadingFiles()
    },
    [fetchUploadingFiles]
  )

  const clearUploadingFilesData = useCallback(async () => {
    clearUploadingFilesDataFn()
    fetchUploadingFiles()
  }, [fetchUploadingFiles])

  return {
    uploadingFilesData: uploadingFilesState.uploadingFiles,
    updateUploadingFileStatus,
    addUploadingFileData,
    getUploadingFileData,
    removeUploadingFileData,
    clearUploadingFilesData,
  }
}
