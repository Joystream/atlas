import { Draft } from '@/hooks'
import React, { useCallback, useContext, useState } from 'react'
export type TabType = Draft
type ContextValue = {
  videoTabs: TabType[]
  setVideoTabs: React.Dispatch<React.SetStateAction<TabType[]>>
  selectedVideoTab: TabType | undefined
  setSelectedVideoTab: React.Dispatch<React.SetStateAction<TabType | undefined>>
  sheetState: SheetState
  setSheetState: React.Dispatch<React.SetStateAction<SheetState>>
}
const VideoActionSheetContext = React.createContext<ContextValue | undefined>(undefined)
VideoActionSheetContext.displayName = 'VideoActionSheetContext'

export const VideoActionSheetProvider: React.FC = ({ children }) => {
  const [videoTabs, setVideoTabs] = useState<TabType[]>([])
  const [selectedVideoTab, setSelectedVideoTab] = useState<TabType>()
  const [sheetState, setSheetState] = useState<SheetState>('closed')

  return (
    <VideoActionSheetContext.Provider
      value={{ videoTabs, setVideoTabs, selectedVideoTab, setSelectedVideoTab, sheetState, setSheetState }}
    >
      {children}
    </VideoActionSheetContext.Provider>
  )
}

export const useVideoActionSheetContext = () => {
  const ctx = useContext(VideoActionSheetContext)
  if (ctx === undefined) {
    throw new Error('useUploadVideoActionSheet must be used within a VideoActionSheetProvider')
  }
  return ctx
}

export type SheetState = 'closed' | 'open' | 'minimized'
export const useUploadVideoActionSheet = () => {
  const {
    videoTabs,
    setVideoTabs,
    selectedVideoTab,
    setSelectedVideoTab,
    sheetState,
    setSheetState,
  } = useVideoActionSheetContext()

  const addVideoTab = useCallback(
    (tab: TabType) => {
      if (!videoTabs.find((t) => t.id === tab.id)) setVideoTabs([tab, ...videoTabs])
    },
    [setVideoTabs, videoTabs]
  )

  const removeVideoTab = useCallback(
    (tab: TabType) => {
      setVideoTabs((tabs) => tabs.filter((t) => t.id !== tab.id))
    },
    [setVideoTabs]
  )

  const resetVideoTabs = useCallback(() => setVideoTabs([]), [setVideoTabs])

  return {
    sheetState,
    setSheetState,
    videoTabs,
    addVideoTab,
    removeVideoTab,
    resetVideoTabs,
    selectedVideoTab,
    setSelectedVideoTab,
  } as const
}
