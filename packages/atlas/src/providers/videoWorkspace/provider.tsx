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

export const VideoWorkspaceProvider: React.FC = ({ children }) => {
  const [videoTabs, setVideoTabs] = useState<VideoWorkspaceTab[]>([])
  const [selectedVideoTabIdx, setSelectedVideoTabIdx] = useState<number>(-1)
  const [videoWorkspaceState, setVideoWorkspaceState] = useState<VideoWorkspaceState>('closed')
  const [cachedVideoWorkspaceState, setCachedVideoWorkspaceState] = useState<VideoWorkspaceState>('closed')
  const [assetsCache, setAssetsCache] = useState<VideoWorkspaceAssetsCache>({})
  const [videoTabsCachedDirtyFormData, _setVideoTabsCachedDirtyFormData] =
    useState<VideoWorkspaceTabCachedDirtyFormData>({})
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()

  const addVideoTab = useCallback(
    (tab?: VideoWorkspaceTab, shouldSelect = true) => {
      const tabToAdd: VideoWorkspaceTab = tab ?? {
        id: createId(),
        isDraft: true,
        isNew: true,
      }

      if (videoTabs.find((t) => t.id === tabToAdd.id)) {
        return
      }

      setVideoTabs([...videoTabs, tabToAdd])

      if (shouldSelect) {
        const newTabIdx = videoTabs.length
        setSelectedVideoTabIdx(newTabIdx)
      }
    },
    [videoTabs]
  )

  const selectedVideoTab = videoTabs[selectedVideoTabIdx]
  const setSelectedVideoTabCachedAssets = useCallback(
    (assets: VideoWorkspaceAssets | null) => {
      setAssetsCache((existingAssets) => ({
        ...existingAssets,
        [selectedVideoTab?.id]: assets,
      }))
    },
    [selectedVideoTab?.id]
  )
  const selectedVideoTabCachedAssets = assetsCache[selectedVideoTab?.id]
  const updateSelectedVideoTab = useCallback(
    (tabUpdates: Partial<VideoWorkspaceTab>) => {
      setVideoTabs((tabs) => tabs.map((tab, idx) => (idx !== selectedVideoTabIdx ? tab : { ...tab, ...tabUpdates })))
    },
    [selectedVideoTabIdx]
  )

  const removeVideoTab = useCallback(
    (removedTabIdx: number) => {
      const tabId = videoTabs[removedTabIdx].id
      setVideoTabs((tabs) => tabs.filter((_, idx) => idx !== removedTabIdx))
      const existingAssetsCopy = { ...assetsCache }
      delete existingAssetsCopy[tabId]
      setAssetsCache(existingAssetsCopy)
      // if there are no other tabs, close the videoWorkspace
      if (videoTabs.length <= 1) {
        setVideoWorkspaceState('closed')
      } else {
        let newSelectedIdx

        if (removedTabIdx === selectedVideoTabIdx) {
          // removing currently selected tab
          newSelectedIdx = selectedVideoTabIdx === 0 ? 0 : selectedVideoTabIdx - 1
        } else {
          // removing some other tab, make sure the index updates if needed
          newSelectedIdx = selectedVideoTabIdx > removedTabIdx ? selectedVideoTabIdx - 1 : selectedVideoTabIdx
        }

        setSelectedVideoTabIdx(newSelectedIdx)
      }
    },
    [assetsCache, selectedVideoTabIdx, videoTabs]
  )

  const setSelectedVideoTabCachedDirtyFormData = useCallback(
    (data: Partial<VideoWorkspaceFormFields>) => {
      _setVideoTabsCachedDirtyFormData((currentMap) => ({
        ...currentMap,
        [selectedVideoTab.id]: { ...data },
      }))
    },
    [selectedVideoTab?.id]
  )

  const selectedVideoTabCachedDirtyFormData = videoTabsCachedDirtyFormData[selectedVideoTab?.id]

  useEffect(() => {
    if (videoWorkspaceState === cachedVideoWorkspaceState) {
      return
    }
    setCachedVideoWorkspaceState(videoWorkspaceState)

    if (videoWorkspaceState === 'open') {
      if (videoTabs.length === 0) {
        addVideoTab()
      }
      incrementOverlaysOpenCount()
    }
    if (videoWorkspaceState === 'closed' || videoWorkspaceState === 'minimized') {
      decrementOverlaysOpenCount()
    }
    if (videoWorkspaceState === 'closed') {
      setVideoTabs([])
      setSelectedVideoTabIdx(-1)
      setAssetsCache({})
      _setVideoTabsCachedDirtyFormData({})
    }
  }, [
    videoWorkspaceState,
    cachedVideoWorkspaceState,
    videoTabs.length,
    incrementOverlaysOpenCount,
    decrementOverlaysOpenCount,
    addVideoTab,
  ])

  const anyVideoTabsCachedAssets = Object.values(assetsCache).some(
    (val) => val?.thumbnail.cropContentId || val?.video.contentId
  )

  const hasVideoTabAnyCachedAssets = useCallback(
    (tabIdx: number) => {
      const tabId = videoTabs[tabIdx].id
      return !!assetsCache[tabId]?.thumbnail || !!assetsCache[tabId]?.video
    },
    [assetsCache, videoTabs]
  )

  const value = useMemo(
    () => ({
      hasVideoTabAnyCachedAssets,
      anyVideoTabsCachedAssets,
      videoTabs,
      addVideoTab,
      removeVideoTab,
      updateSelectedVideoTab,
      selectedVideoTabIdx,
      setSelectedVideoTabIdx,
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
      removeVideoTab,
      selectedVideoTabCachedAssets,
      selectedVideoTabCachedDirtyFormData,
      selectedVideoTabIdx,
      setSelectedVideoTabCachedAssets,
      setSelectedVideoTabCachedDirtyFormData,
      updateSelectedVideoTab,
      videoTabs,
      videoWorkspaceState,
    ]
  )

  return <VideoWorkspaceContext.Provider value={value}>{children}</VideoWorkspaceContext.Provider>
}
