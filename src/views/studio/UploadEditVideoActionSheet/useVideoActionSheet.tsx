import { Draft } from '@/hooks'
import React, { useCallback, useContext, useState } from 'react'
export type TabType = Draft
type ContextValue = {
  videoTabs: TabType[]
  setVideoTabs: React.Dispatch<React.SetStateAction<TabType[]>>
  selectedVideoTab: TabType | undefined
  setSelectedVideoTab: React.Dispatch<React.SetStateAction<TabType | undefined>>
}
const VideoActionSheetContext = React.createContext<ContextValue | undefined>(undefined)
VideoActionSheetContext.displayName = 'VideoActionSheetContext'

export const VideoActionSheetProvider: React.FC = ({ children }) => {
  const [videoTabs, setVideoTabs] = useState<TabType[]>([])
  const [selectedVideoTab, setSelectedVideoTab] = useState<TabType>()

  return (
    <VideoActionSheetContext.Provider value={{ videoTabs, setVideoTabs, selectedVideoTab, setSelectedVideoTab }}>
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

export const useUploadVideoActionSheet = () => {
  const { videoTabs, setVideoTabs, selectedVideoTab, setSelectedVideoTab } = useVideoActionSheetContext()

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
    videoTabs,
    addVideoTab,
    removeVideoTab,
    resetVideoTabs,
    selectedVideoTab,
    setSelectedVideoTab,
  } as const
}
