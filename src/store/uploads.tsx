import create from 'zustand'
import { persist } from 'zustand/middleware'

import { LiaisonJudgement } from '@/api/queries'
import { AssetUploadStatus } from '@/hooks/useUploadsManager/types'
import { ChannelId, VideoId } from '@/joystream-lib'
import { AssetDimensions, ImageCropData } from '@/types/cropper'

type AssetType = 'video' | 'thumbnail' | 'cover' | 'avatar'
type AssetParent = 'video' | 'channel'

export type AssetUpload = {
  contentId: string
  parentObject: {
    type: AssetParent
    id: ChannelId | VideoId
  }
  owner: ChannelId
  type: AssetType
  lastStatus: AssetUploadStatus
  liaisonJudgement?: LiaisonJudgement
  ipfsContentId?: string
  // size in bytes
  size: number
  dimensions?: AssetDimensions
  imageCropData?: ImageCropData
  metadata?: string
  title?: string | null
}
export type InputAssetUpload = Omit<AssetUpload, 'lastStatus' | 'size'>

export type UploadsManagerState = AssetUpload[]

export type StartFileUploadOptions = {
  isReUpload?: boolean
  changeHost?: boolean
}

export type UploadsProgressRecord = Record<string, number>

type AssetFile = {
  contentId: string
  blob: File | Blob
}

export type UploadStoreState = {
  uploadsState: AssetUpload[]
  addAsset: (asset: AssetUpload) => void
  setUploadsProgress: (contentId: string, progress: number) => void
  updateAsset: (contentId: string, lastStatus: AssetUploadStatus) => void
  removeAsset: (contentId: string) => void
  uploadsProgress: UploadsProgressRecord
  notifications: {
    uploading: number
    uploaded: number
  }
  assetsFiles: AssetFile[]
  setAssetsFiles: (assetFile: AssetFile) => void
}

const UPLOADS_LOCAL_STORAGE_KEY = 'uploads'

export const useUploadsManagerStore = create<UploadStoreState>(
  persist(
    (set, get) => ({
      uploadsState: [],
      notifications: {
        uploaded: 0,
        uploading: 0,
      },
      uploadsProgress: {},
      setUploadsProgress: (contentId, progress) => {
        set((state) => ({ ...state, uploadsProgress: { ...state.uploadsProgress, [contentId]: progress } }))
      },
      assetsFiles: [],
      setAssetsFiles: (assetFile) => set((state) => ({ ...state, assetFiles: [...state.assetsFiles, assetFile] })),
      addAsset: (asset) => {
        const state = get()
        set({ ...state, uploadsState: [...state.uploadsState, asset] })
      },
      updateAsset: (contentId, lastStatus?) => {
        const state = get()

        set({
          ...state,
          uploadsState: state.uploadsState.map((asset) => {
            if (asset.contentId !== contentId) {
              return asset
            }
            const assetUpdates = lastStatus ? { lastStatus } : {}
            return { ...asset, ...assetUpdates }
          }),
        })
      },
      removeAsset: (contentId) => {
        set((state) => ({
          ...state,
          uploadsState: state.uploadsState.filter((asset) => asset.contentId !== contentId),
        }))
      },
    }),
    {
      name: UPLOADS_LOCAL_STORAGE_KEY,
      whitelist: ['uploadsState'],
    }
  )
)
