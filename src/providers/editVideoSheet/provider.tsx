import React, { useCallback, useEffect, useState } from 'react'

import { InputFilesState } from '@/shared/components'
import { createId } from '@/utils/createId'

import {
  ContextValue,
  EditVideoAssetsCache,
  EditVideoFormFields,
  EditVideoSheetState,
  EditVideoSheetTab,
  EditVideoTabCachedDirtyFormData,
} from './types'

import { useOverlayManager } from '..'

export const EditVideoSheetContext = React.createContext<ContextValue | undefined>(undefined)
EditVideoSheetContext.displayName = 'EditVideoSheetContext'

export const EditVideoSheetProvider: React.FC = ({ children }) => {
  const [videoTabs, setVideoTabs] = useState<EditVideoSheetTab[]>([])
  const [selectedVideoTabIdx, setSelectedVideoTabIdx] = useState<number>(-1)
  const [sheetState, setSheetState] = useState<EditVideoSheetState>('closed')
  const [cachedSheetState, setCachedSheetState] = useState<EditVideoSheetState>('closed')
  const [assetsCache, setAssetsCache] = useState<EditVideoAssetsCache>({})
  const [videoTabsCachedDirtyFormData, _setVideoTabsCachedDirtyFormData] = useState<EditVideoTabCachedDirtyFormData>({})
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()

  const addVideoTab = useCallback(
    (tab?: EditVideoSheetTab, shouldSelect = true) => {
      const tabToAdd: EditVideoSheetTab = tab ?? {
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
    (files: InputFilesState) => {
      setAssetsCache((existingAssets) => ({
        ...existingAssets,
        [selectedVideoTab?.id]: files,
      }))
    },
    [selectedVideoTab?.id]
  )
  const selectedVideoTabCachedAssets = assetsCache[selectedVideoTab?.id]
  const updateSelectedVideoTab = useCallback(
    (tabUpdates: Partial<EditVideoSheetTab>) => {
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
      // if there are no other tabs, close the sheet
      if (videoTabs.length <= 1) {
        setSheetState('closed')
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
    (data: Partial<EditVideoFormFields>) => {
      _setVideoTabsCachedDirtyFormData((currentMap) => ({
        ...currentMap,
        [selectedVideoTab.id]: { ...data },
      }))
    },
    [selectedVideoTab?.id]
  )

  const selectedVideoTabCachedDirtyFormData = videoTabsCachedDirtyFormData[selectedVideoTab?.id]

  useEffect(() => {
    if (sheetState === cachedSheetState) {
      return
    }
    setCachedSheetState(sheetState)

    if (sheetState === 'open') {
      if (videoTabs.length === 0) {
        addVideoTab()
      }
      incrementOverlaysOpenCount()
    }
    if (sheetState === 'closed' || sheetState === 'minimized') {
      decrementOverlaysOpenCount()
    }
    if (sheetState === 'closed') {
      setVideoTabs([])
      setSelectedVideoTabIdx(-1)
      setAssetsCache({})
      _setVideoTabsCachedDirtyFormData({})
    }
  }, [
    sheetState,
    cachedSheetState,
    videoTabs.length,
    incrementOverlaysOpenCount,
    decrementOverlaysOpenCount,
    addVideoTab,
  ])

  const anyVideoTabsCachedAssets = Object.values(assetsCache).some((val) => val.thumbnail || val.video)

  const hasVideoTabAnyCachedAssets = (tabIdx: number) => {
    const tabId = videoTabs[tabIdx].id
    return !!assetsCache[tabId]?.thumbnail || !!assetsCache[tabId]?.video
  }

  return (
    <EditVideoSheetContext.Provider
      value={{
        hasVideoTabAnyCachedAssets,
        anyVideoTabsCachedAssets,
        videoTabs,
        addVideoTab,
        removeVideoTab,
        updateSelectedVideoTab,
        selectedVideoTabIdx,
        setSelectedVideoTabIdx,
        sheetState,
        setSheetState,
        selectedVideoTabCachedAssets,
        setSelectedVideoTabCachedAssets,
        selectedVideoTabCachedDirtyFormData,
        setSelectedVideoTabCachedDirtyFormData,
      }}
    >
      {children}
    </EditVideoSheetContext.Provider>
  )
}
