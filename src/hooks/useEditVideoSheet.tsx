import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Location } from 'history'
import { absoluteRoutes } from '@/config/routes'
import { useNavigate } from 'react-router-dom'
import { useLocation, useMatch } from 'react-router'
import { RoutingState } from '@/types/routing'
import { useOverlayManager } from '@/hooks/useOverlayManager'
import { createId } from '@/utils/createId'
import { useDrafts } from '@/hooks/useDrafts'
import { useActiveUser } from '@/hooks/useActiveUser'
import { useVideo } from '@/api/hooks'
import { InputFilesState } from '@/shared/components/MultiFileSelect/MultiFileSelect'
import { createUrlFromAsset } from '@/utils/asset'
import { parseISO } from 'date-fns'

export type EditVideoSheetTab = {
  id: string
  isDraft?: boolean
  isNew?: boolean
}

type EditVideoAssetsCache = Record<string, InputFilesState>

type ContextValue = {
  videoTabs: EditVideoSheetTab[]
  addVideoTab: (tab?: EditVideoSheetTab, shouldSelect?: boolean) => void
  removeVideoTab: (tabIdx: number) => void
  updateSelectedVideoTab: (tabUpdates: Partial<EditVideoSheetTab>) => void
  selectedVideoTabIdx: number
  setSelectedVideoTabIdx: (tabIdx: number) => void
  selectedVideoTabCachedAssets: InputFilesState
  setSelectedVideoTabCachedAssets: (files: InputFilesState) => void
  sheetState: EditVideoSheetState
  setSheetState: (state: EditVideoSheetState) => void
}
const EditVideoSheetContext = React.createContext<ContextValue | undefined>(undefined)
EditVideoSheetContext.displayName = 'EditVideoSheetContext'

export const EditVideoSheetProvider: React.FC = ({ children }) => {
  const [videoTabs, setVideoTabs] = useState<EditVideoSheetTab[]>([])
  const [selectedVideoTabIdx, setSelectedVideoTabIdx] = useState<number>(-1)
  const [sheetState, setSheetState] = useState<EditVideoSheetState>('closed')
  const [cachedSheetState, setCachedSheetState] = useState<EditVideoSheetState>('closed')
  const [assetsCache, setAssetsCache] = useState<EditVideoAssetsCache>({})

  const { lockScroll, unlockScroll } = useOverlayManager()

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

  const removeVideoTab = useCallback(
    (removedTabIdx: number) => {
      setVideoTabs((tabs) => tabs.filter((_, idx) => idx !== removedTabIdx))

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
    [selectedVideoTabIdx, videoTabs.length]
  )

  const selectedVideoTab = videoTabs[selectedVideoTabIdx]
  const setSelectedVideoTabCachedAssets = useCallback(
    (files: InputFilesState) => {
      setAssetsCache((existingAssets) => ({
        ...existingAssets,
        [selectedVideoTab.id]: files,
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

  useEffect(() => {
    if (sheetState === cachedSheetState) {
      return
    }
    setCachedSheetState(sheetState)

    if (sheetState === 'open') {
      if (videoTabs.length === 0) {
        addVideoTab()
      }
      lockScroll()
    }
    if (sheetState === 'closed' || sheetState === 'minimized') {
      unlockScroll()
    }
    if (sheetState === 'closed') {
      setVideoTabs([])
      setSelectedVideoTabIdx(-1)
    }
  }, [sheetState, cachedSheetState, videoTabs.length, lockScroll, unlockScroll, addVideoTab])

  return (
    <EditVideoSheetContext.Provider
      value={{
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
      }}
    >
      {children}
    </EditVideoSheetContext.Provider>
  )
}

const useEditVideoSheetContext = () => {
  const ctx = useContext(EditVideoSheetContext)
  if (ctx === undefined) {
    throw new Error('useUploadVideoActionSheet must be used within a VideoActionSheetProvider')
  }
  return ctx
}

export type EditVideoSheetState = 'closed' | 'open' | 'minimized'
export const useEditVideoSheet = () => {
  return useEditVideoSheetContext()
}

export type EditVideoFormFields = {
  title: string
  description: string
  language: string | null
  category: string | null
  hasMarketing: boolean | null
  isPublic: boolean
  isExplicit: boolean | null
  publishedBeforeJoystream: Date | null
  assets: InputFilesState
}

export const useEditVideoSheetTabData = (tab?: EditVideoSheetTab) => {
  const {
    activeUser: { channelId },
  } = useActiveUser()
  const { drafts } = useDrafts('video', channelId ?? '')
  const { selectedVideoTabCachedAssets } = useEditVideoSheet()

  const { video, loading, error } = useVideo(tab?.id ?? '', { skip: tab?.isDraft })
  const [cachedDirtyVideoTabsData, setcachedDirtyVideoTabs] = useState<Array<EditVideoFormFields & EditVideoSheetTab>>(
    []
  )

  if (!tab) {
    return {
      updateTabData: () => ({}),
      tabData: null,
      loading: false,
      error: null,
    }
  }

  const dirtyCachedVideoData =
    tab?.isDraft === false ? cachedDirtyVideoTabsData.find((dirtyTab) => dirtyTab.id === tab.id) : undefined
  const videoData = dirtyCachedVideoData ?? {
    ...video,
    category: video?.category?.id,
    language: video?.language?.iso,
  }

  const draft = drafts.find((d) => d.id === tab.id)

  const assets: InputFilesState = tab.isDraft
    ? selectedVideoTabCachedAssets || { video: null, thumbnail: null }
    : {
        video: {
          url: createUrlFromAsset(video?.mediaAvailability, video?.mediaUrls, video?.mediaDataObject),
        },
        thumbnail: {
          url: createUrlFromAsset(
            video?.thumbnailPhotoAvailability,
            video?.thumbnailPhotoUrls,
            video?.thumbnailPhotoDataObject
          ),
        },
      }

  const normalizedData: EditVideoFormFields = {
    title: tab.isDraft ? draft?.title ?? 'New Draft' : videoData?.title ?? '',
    description: (tab.isDraft ? draft?.description : videoData?.description) ?? '',
    category: (tab.isDraft ? draft?.category : videoData?.category) ?? null,
    language: (tab.isDraft ? draft?.language : videoData?.language) ?? 'en',
    isPublic: (tab.isDraft ? draft?.isPublic : videoData?.isPublic) ?? true,
    isExplicit: (tab.isDraft ? draft?.isExplicit : videoData?.isExplicit) ?? null,
    hasMarketing: (tab.isDraft ? draft?.hasMarketing : videoData?.hasMarketing) ?? false,
    publishedBeforeJoystream:
      (tab.isDraft
        ? draft?.publishedBeforeJoystream
          ? parseISO(draft.publishedBeforeJoystream)
          : null
        : videoData?.publishedBeforeJoystream) ?? null,
    assets,
  }

  const updateTabData = (data: EditVideoFormFields) => {
    const index = cachedDirtyVideoTabsData.findIndex((dirtyTab) => dirtyTab.id === tab.id)
    if (index === -1) {
      setcachedDirtyVideoTabs([...cachedDirtyVideoTabsData, { ...data, ...tab }])
    } else {
      const temp = [...cachedDirtyVideoTabsData]
      temp[index] = { ...data, ...tab }
      setcachedDirtyVideoTabs(temp)
    }
  }

  return {
    updateTabData,
    tabData: normalizedData,
    loading: tab.isDraft ? false : loading,
    error,
  }
}

const defaultLocation: Location = {
  pathname: absoluteRoutes.studio.index(),
  key: '',
  search: '',
  hash: '',
  state: null,
}

export const useVideoEditSheetRouting = (): Location => {
  const navigate = useNavigate()

  const location = useLocation() as Location<RoutingState>
  const [cachedLocation, setCachedLocation] = useState<Location>()

  const editVideoMatch = useMatch({ path: absoluteRoutes.studio.editVideo() })
  const { sheetState, setSheetState } = useEditVideoSheet()
  const [cachedSheetState, setCachedSheetState] = useState<EditVideoSheetState>('closed')

  useEffect(() => {
    if (location === cachedLocation) {
      return
    }
    setCachedLocation(location)

    if (editVideoMatch && sheetState !== 'open') {
      // route changed to video edit
      const state: RoutingState = {
        overlaidLocation: cachedLocation ?? defaultLocation,
      }
      navigate(location, { replace: true, state })
      setSheetState('open')
    }
  }, [location, cachedLocation, editVideoMatch, sheetState, setSheetState, navigate])

  useEffect(() => {
    if (sheetState === cachedSheetState) {
      return
    }
    setCachedSheetState(sheetState)

    if (
      (sheetState === 'minimized' && cachedSheetState === 'open') ||
      (sheetState === 'closed' && cachedSheetState !== 'minimized')
    ) {
      // restore the old location when sheet was minimized/closed
      const oldLocation = location.state?.overlaidLocation ?? absoluteRoutes.studio.index()
      navigate(oldLocation)
    }
    if (sheetState === 'open' && !editVideoMatch) {
      // sheetState changed without the route - most likely from the sheet itself, change URL and save current location
      const state: RoutingState = {
        overlaidLocation: location,
      }
      navigate(absoluteRoutes.studio.editVideo(), { state: state })
    }
  }, [sheetState, cachedSheetState, location, navigate, editVideoMatch])

  if (editVideoMatch) {
    return location.state?.overlaidLocation ?? cachedLocation ?? defaultLocation
  }

  return location
}
