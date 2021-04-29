import React, { useCallback, useContext, useState } from 'react'
import axios from 'axios'
import * as rax from 'retry-axios'
import { useSnackbar } from '@/hooks/useSnackbar/useSnackbar'
import { ChannelId } from '@/joystream-lib'
import { useUploadsManagerStore } from './store'
import { InputAssetUpload, AssetUploadWithProgress, UploadManagerValue, UploadsProgressRecord } from './types'
import { createStorageNodeUrl } from '@/utils/asset'
import { useSnackbar } from '@/hooks/useSnackbar'

const RETRIES_COUNT = 5

const UploadManagerContext = React.createContext<UploadManagerValue | undefined>(undefined)
UploadManagerContext.displayName = 'UploadManagerContext'

export const UploadManagerProvider: React.FC = ({ children }) => {
  const { uploadsState, addAsset, updateAsset } = useUploadsManagerStore()
  const { displaySnackbar } = useSnackbar()
  const [uploadsProgress, setUploadsProgress] = useState<UploadsProgressRecord>({})
  const { displaySnackbar } = useSnackbar()

  const startFileUpload = useCallback(
    async (file: File | Blob, asset: InputAssetUpload, storageMetadata: string) => {
      const setAssetUploadProgress = (progress: number) => {
        setUploadsProgress((prevState) => ({ ...prevState, [asset.contentId]: progress }))
      }
      rax.attach()
      try {
        addAsset({ ...asset, lastStatus: 'inProgress', size: file.size })
        setAssetUploadProgress(0)
        const assetUrl = createStorageNodeUrl(asset.contentId, storageMetadata)

        await axios.put(assetUrl.toString(), file, {
          headers: {
            // workaround for a bug in the storage node
            'Content-Type': '',
          },
          raxConfig: {
            retry: RETRIES_COUNT,
            noResponseRetries: RETRIES_COUNT,
            onRetryAttempt: (err) => {
              const cfg = rax.getConfig(err)
              if (cfg?.currentRetryAttempt === 1) {
                updateAsset(asset.contentId, 'reconnecting')
              }

              if (cfg?.currentRetryAttempt === RETRIES_COUNT) {
                throw Error('Reconnection failed')
              }
            },
          },
          onUploadProgress: ({ loaded, total }: ProgressEvent) => {
            updateAsset(asset.contentId, 'inProgress')
            setAssetUploadProgress((loaded / total) * 100)
          },
        })

        // TODO: remove assets from the same parent if all finished
        updateAsset(asset.contentId, 'completed')
        setAssetUploadProgress(100)
        displaySnackbar({ title: 'Asset uploaded', iconType: 'success' })
      } catch (e) {
        console.error('Upload failed')
        console.error(e)
        if (e.message === 'Reconnection failed') {
          updateAsset(asset.contentId, 'reconnectionError')
          displaySnackbar({
            title: 'Asset failing to reconnect',
            description: 'Host is not responding',
            actionText: 'Go to uploads',
            iconType: 'info',
          })
        } else {
          updateAsset(asset.contentId, 'error')
        }
      }
    },
    [addAsset, displaySnackbar, updateAsset]
  )

  const uploadsStateWithProgress: AssetUploadWithProgress[] = uploadsState.map((asset) => ({
    ...asset,
    progress: uploadsProgress[asset.contentId] ?? 0,
  }))

  return (
    <UploadManagerContext.Provider
      value={{
        startFileUpload,
        uploadsState: uploadsStateWithProgress,
      }}
    >
      {children}
    </UploadManagerContext.Provider>
  )
}

const useUploadsManagerContext = () => {
  const ctx = useContext(UploadManagerContext)
  if (ctx === undefined) {
    throw new Error('useUploadsManager must be used within a UploadManagerProvider')
  }
  return ctx
}

export const useUploadsManager = (channelId: ChannelId) => {
  const { uploadsState, ...rest } = useUploadsManagerContext()
  return {
    uploadsState: uploadsState.filter((asset) => asset.owner === channelId),
    ...rest,
  }
}
