import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import { useChannel, useVideos } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { useUser } from '@/hooks'
import { useSnackbar, useUploadsManagerStore } from '@/store'

import { AssetUploadWithProgress, UploadManagerValue } from './types'

type GroupByParentObjectIdAcc = {
  [key: string]: AssetUploadWithProgress[]
}

const UploadManagerContext = React.createContext<UploadManagerValue | undefined>(undefined)
UploadManagerContext.displayName = 'UploadManagerContext'

export const UploadManagerProvider: React.FC = ({ children }) => {
  const navigate = useNavigate()

  const displaySnackbar = useSnackbar((state) => state.displaySnackbar)
  const { updateAsset, uploadsState, uploadsProgress } = useUploadsManagerStore()

  // \/ workaround for now to not show completed uploads but not delete them since we may want to show history of uploads in the future
  const [ignoredAssetsIds, setIgnoredAssetsIds] = useState<string[]>([])
  const { activeChannelId } = useUser()
  const { loading: channelLoading } = useChannel(activeChannelId ?? '')
  const { loading: videosLoading } = useVideos(
    {
      where: {
        id_in: uploadsState.filter((item) => item.parentObject?.type === 'video').map((item) => item.parentObject.id),
      },
    },
    { skip: !uploadsState.length }
  )

  // Will set all incomplete assets' status to missing on initial mount
  const isInitialMount = useRef(true)
  useEffect(() => {
    if (!isInitialMount.current) {
      return
    }
    isInitialMount.current = false

    let missingAssetsCount = 0
    uploadsState.forEach((asset) => {
      if (asset.lastStatus !== 'completed') {
        updateAsset(asset.contentId, 'missing')
        missingAssetsCount++
      } else {
        setIgnoredAssetsIds((ignored) => [...ignored, asset.contentId])
      }
    })

    if (missingAssetsCount > 0) {
      displaySnackbar({
        title: `(${missingAssetsCount}) Asset${missingAssetsCount > 1 ? 's' : ''} waiting to resume upload`,
        description: 'Reconnect files to fix the issue',
        actionText: 'See',
        onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
        iconType: 'warning',
      })
    }
  }, [updateAsset, uploadsState, displaySnackbar, navigate])

  const filteredUploadStateWithProgress: AssetUploadWithProgress[] = uploadsState
    .filter((asset) => asset.owner === activeChannelId && !ignoredAssetsIds.includes(asset.contentId))
    .map((asset) => ({
      ...asset,
      progress: uploadsProgress[asset.contentId] ?? 0,
    }))

  // Grouping all assets by parent id (videos, channel)
  const groupedUploadsState = Object.values(
    filteredUploadStateWithProgress.reduce((acc: GroupByParentObjectIdAcc, asset) => {
      if (!asset) {
        return acc
      }
      const key = asset.parentObject.id
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(asset)
      return acc
    }, {})
  )

  const isLoading = channelLoading || videosLoading

  return (
    <UploadManagerContext.Provider
      value={{
        // startFileUpload,
        isLoading,
        uploadsState: groupedUploadsState,
      }}
    >
      {children}
    </UploadManagerContext.Provider>
  )
}

export const useUploadsManager = () => {
  const ctx = useContext(UploadManagerContext)
  if (ctx === undefined) {
    throw new Error('useUploadsManager must be used within a UploadManagerProvider')
  }
  return ctx
}
