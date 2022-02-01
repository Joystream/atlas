import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { createId } from '@/utils/createId'

import {
  ContextValue,
  VideoWorkspaceAssets,
  VideoWorkspaceAssetsCache,
  VideoWorkspaceFormFields,
  VideoWorkspaceState,
  VideoWorkspaceTab,
  VideoWorkspaceTabCachedDirtyFormData,
} from './types'

import { useOverlayManager } from '../overlayManager'

export const VideoWorkspaceContext = React.createContext<ContextValue | undefined>(undefined)
VideoWorkspaceContext.displayName = 'VideoWorkspaceContext'

const generateTab = () => ({
  id: createId(),
  isDraft: true,
  isNew: true,
})

export const VideoWorkspaceProvider: React.FC = ({ children }) => {
  const [videoTab, setVideoTab] = useState<VideoWorkspaceTab>(generateTab())
  const [videoWorkspaceState, setVideoWorkspaceState] = useState<VideoWorkspaceState>('closed')
  const [cachedVideoWorkspaceState, setCachedVideoWorkspaceState] = useState<VideoWorkspaceState>('closed')
  const [assetsCache, setAssetsCache] = useState<VideoWorkspaceAssetsCache>({})
  const [videoTabsCachedDirtyFormData, _setVideoTabsCachedDirtyFormData] =
    useState<VideoWorkspaceTabCachedDirtyFormData>({})
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()
  const addVideoTab = useCallback((tab?: VideoWorkspaceTab) => {
    if (!tab) {
      return
    }
    setVideoTab(tab)
  }, [])

  const setSelectedVideoTabCachedAssets = useCallback(
    (assets: VideoWorkspaceAssets | null) => {
      if (!videoTab) {
        return
      }
      setAssetsCache((existingAssets) => ({
        ...existingAssets,
        [videoTab?.id]: assets,
      }))
    },
    [videoTab]
  )
  const selectedVideoTabCachedAssets = assetsCache[videoTab?.id || '']
  const updateSelectedVideoTab = useCallback((tabUpdates: Partial<VideoWorkspaceTab>) => {
    setVideoTab((prevState) => ({ ...prevState, ...tabUpdates }))
  }, [])

  const setSelectedVideoTabCachedDirtyFormData = useCallback(
    (data: Partial<VideoWorkspaceFormFields>) => {
      if (!videoTab) {
        return
      }
      _setVideoTabsCachedDirtyFormData((currentMap) => ({
        ...currentMap,
        [videoTab.id]: { ...data },
      }))
    },
    [videoTab]
  )

  const selectedVideoTabCachedDirtyFormData = useMemo(
    () => (videoTab ? videoTabsCachedDirtyFormData[videoTab?.id] : {}),
    [videoTab, videoTabsCachedDirtyFormData]
  )

  useEffect(() => {
    if (videoWorkspaceState === cachedVideoWorkspaceState) {
      return
    }
    setCachedVideoWorkspaceState(videoWorkspaceState)

    if (videoWorkspaceState === 'open') {
      incrementOverlaysOpenCount()
    }
    if (videoWorkspaceState === 'closed') {
      decrementOverlaysOpenCount()
      setVideoTab(generateTab())
      setAssetsCache({})
      _setVideoTabsCachedDirtyFormData({})
    }
  }, [
    videoWorkspaceState,
    cachedVideoWorkspaceState,
    videoTab,
    incrementOverlaysOpenCount,
    decrementOverlaysOpenCount,
    addVideoTab,
  ])

  const anyVideoTabsCachedAssets = Object.values(assetsCache).some(
    (val) => val?.thumbnail.cropContentId || val?.video.contentId
  )

  const hasVideoTabAnyCachedAssets = useCallback(() => {
    const tabId = videoTab?.id
    return !!assetsCache[tabId]?.thumbnail || !!assetsCache[tabId]?.video
  }, [assetsCache, videoTab])

  const value = useMemo(
    () => ({
      hasVideoTabAnyCachedAssets,
      anyVideoTabsCachedAssets,
      videoTab,
      addVideoTab,
      updateSelectedVideoTab,
      videoWorkspaceState,
      setVideoWorkspaceState,
      selectedVideoTabCachedAssets,
      setSelectedVideoTabCachedAssets,
      selectedVideoTabCachedDirtyFormData,
      setSelectedVideoTabCachedDirtyFormData,
    }),
    [
      addVideoTab,
      anyVideoTabsCachedAssets,
      hasVideoTabAnyCachedAssets,
      selectedVideoTabCachedAssets,
      selectedVideoTabCachedDirtyFormData,
      setSelectedVideoTabCachedAssets,
      setSelectedVideoTabCachedDirtyFormData,
      updateSelectedVideoTab,
      videoTab,
      videoWorkspaceState,
    ]
  )

  return <VideoWorkspaceContext.Provider value={value}>{children}</VideoWorkspaceContext.Provider>
}
