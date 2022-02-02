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
  const [_videoTabCachedDirtyFormData, _setVideoTabCachedDirtyFormData] =
    useState<VideoWorkspaceTabCachedDirtyFormData>({})
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()
  const addVideoTab = useCallback((tab?: VideoWorkspaceTab) => {
    if (!tab) {
      return
    }
    setVideoTab(tab)
  }, [])

  const setVideoTabCachedAssets = useCallback(
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
  const videoTabCachedAssets = assetsCache[videoTab?.id || '']
  const updateVideoTab = useCallback((tabUpdates: Partial<VideoWorkspaceTab>) => {
    setVideoTab((prevState) => ({ ...prevState, ...tabUpdates }))
  }, [])

  const setVideoTabCachedDirtyFormData = useCallback(
    (data: Partial<VideoWorkspaceFormFields>) => {
      if (!videoTab) {
        return
      }
      _setVideoTabCachedDirtyFormData((currentMap) => ({
        ...currentMap,
        [videoTab.id]: { ...data },
      }))
    },
    [videoTab]
  )

  const videoTabCachedDirtyFormData = useMemo(
    () => (videoTab ? _videoTabCachedDirtyFormData[videoTab?.id] : {}),
    [videoTab, _videoTabCachedDirtyFormData]
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
      _setVideoTabCachedDirtyFormData({})
    }
  }, [
    videoWorkspaceState,
    cachedVideoWorkspaceState,
    videoTab,
    incrementOverlaysOpenCount,
    decrementOverlaysOpenCount,
    addVideoTab,
  ])

  const anyVideoTabCachedAssets = Object.values(assetsCache).some(
    (val) => val?.thumbnail.cropContentId || val?.video.contentId
  )

  const hasVideoTabAnyCachedAssets = useCallback(() => {
    const tabId = videoTab?.id
    return !!assetsCache[tabId]?.thumbnail || !!assetsCache[tabId]?.video
  }, [assetsCache, videoTab])

  const value = useMemo(
    () => ({
      hasVideoTabAnyCachedAssets,
      anyVideoTabCachedAssets,
      videoTab,
      addVideoTab,
      updateVideoTab,
      videoWorkspaceState,
      setVideoWorkspaceState,
      videoTabCachedAssets,
      setVideoTabCachedAssets,
      videoTabCachedDirtyFormData,
      setVideoTabCachedDirtyFormData,
    }),
    [
      addVideoTab,
      anyVideoTabCachedAssets,
      hasVideoTabAnyCachedAssets,
      setVideoTabCachedAssets,
      setVideoTabCachedDirtyFormData,
      updateVideoTab,
      videoTab,
      videoTabCachedAssets,
      videoTabCachedDirtyFormData,
      videoWorkspaceState,
    ]
  )

  return <VideoWorkspaceContext.Provider value={value}>{children}</VideoWorkspaceContext.Provider>
}
