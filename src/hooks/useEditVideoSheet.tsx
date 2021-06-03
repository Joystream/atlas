import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Location } from 'history'
import { absoluteRoutes } from '@/config/routes'
import { useNavigate } from 'react-router-dom'
import { useLocation, useMatch } from 'react-router'
import { RoutingState } from '@/types/routing'
import { useOverlayManager, useDrafts, useAuthorizedUser } from '@/hooks'
import { createId } from '@/utils/createId'
import { useVideo } from '@/api/hooks'
import { InputFilesState } from '@/shared/components/MultiFileSelect/MultiFileSelect'
import { parseISO } from 'date-fns'
import { useAsset } from './useAsset'

export type EditVideoSheetTab = {
  id: string
  isDraft?: boolean
  isNew?: boolean
}

type EditVideoAssetsCache = Record<string, InputFilesState>
type EditVideoTabCachedDirtyFormData = Record<string, Partial<EditVideoFormFields>>

type ContextValue = {
  videoTabs: EditVideoSheetTab[]
  addVideoTab: (tab?: EditVideoSheetTab, shouldSelect?: boolean) => void
  removeVideoTab: (tabIdx: number) => void
  updateSelectedVideoTab: (tabUpdates: Partial<EditVideoSheetTab>) => void
  selectedVideoTabIdx: number
  setSelectedVideoTabIdx: (tabIdx: number) => void
  selectedVideoTabCachedDirtyFormData: Partial<EditVideoFormFields> | undefined
  setSelectedVideoTabCachedDirtyFormData: (formData: Partial<EditVideoFormFields>) => void
  selectedVideoTabCachedAssets: InputFilesState
  setSelectedVideoTabCachedAssets: (files: InputFilesState) => void
  sheetState: EditVideoSheetState
  setSheetState: (state: EditVideoSheetState) => void
  anyVideoTabsCachedAssets: boolean
  hasVideoTabAnyCachedAssets: (tabIdx: number) => boolean
}
const EditVideoSheetContext = React.createContext<ContextValue | undefined>(undefined)
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
  licenseCode: number | null
  licenseCustomText: string | null
  licenseAttribution: string | null
  hasMarketing: boolean | null
  isPublic: boolean
  isExplicit: boolean | null
  publishedBeforeJoystream: Date | null
  assets: InputFilesState
}

export const useEditVideoSheetTabData = (tab?: EditVideoSheetTab) => {
  const { activeChannelId } = useAuthorizedUser()
  const { drafts } = useDrafts('video', activeChannelId)
  const { selectedVideoTabCachedAssets } = useEditVideoSheet()
  const { getAssetUrl } = useAsset()

  const { video, loading, error } = useVideo(tab?.id ?? '', { skip: tab?.isDraft })

  if (!tab) {
    return {
      tabData: null,
      loading: false,
      error: null,
    }
  }

  const videoData = {
    ...video,
    category: video?.category?.id,
    language: video?.language?.iso,
  }

  const draft = drafts.find((d) => d.id === tab.id)

  const assets: InputFilesState = tab.isDraft
    ? selectedVideoTabCachedAssets || { video: null, thumbnail: null }
    : {
        video: {
          url: getAssetUrl(video?.mediaAvailability, video?.mediaUrls, video?.mediaDataObject),
        },
        thumbnail: {
          url: getAssetUrl(
            video?.thumbnailPhotoAvailability,
            video?.thumbnailPhotoUrls,
            video?.thumbnailPhotoDataObject
          ),
        },
      }

  const normalizedData: EditVideoFormFields = {
    title: tab.isDraft ? draft?.title ?? 'New Draft' : video?.title ?? '',
    description: (tab.isDraft ? draft?.description : video?.description) ?? '',
    category: (tab.isDraft ? draft?.category : video?.category?.id) ?? null,
    licenseCode: (tab.isDraft ? draft?.licenseCode : video?.license?.code) ?? null,
    licenseCustomText: (tab.isDraft ? draft?.licenseCustomText : video?.license?.customText) ?? null,
    licenseAttribution: (tab.isDraft ? draft?.licenseAttribution : video?.license?.attribution) ?? null,
    language: (tab.isDraft ? draft?.language : video?.language?.iso) ?? 'en',
    isPublic: (tab.isDraft ? draft?.isPublic : video?.isPublic) ?? true,
    isExplicit: (tab.isDraft ? draft?.isExplicit : video?.isExplicit) ?? null,
    hasMarketing: (tab.isDraft ? draft?.hasMarketing : video?.hasMarketing) ?? false,
    publishedBeforeJoystream:
      (tab.isDraft
        ? draft?.publishedBeforeJoystream
          ? parseISO(draft.publishedBeforeJoystream)
          : null
        : videoData?.publishedBeforeJoystream) ?? null,
    assets,
  }

  return {
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
