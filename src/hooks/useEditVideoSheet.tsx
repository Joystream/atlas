import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Draft } from '@/hooks'
import { Location } from 'history'
import { absoluteRoutes } from '@/config/routes'
import { useNavigate } from 'react-router-dom'
import { useLocation, useMatch } from 'react-router'
import { RoutingState } from '@/types/routing'

export type EditVideoSheetTab = Draft
type ContextValue = {
  videoTabs: EditVideoSheetTab[]
  addVideoTab: (tab: EditVideoSheetTab) => void
  removeVideoTab: (tab: EditVideoSheetTab) => void
  resetVideoTabs: () => void
  selectedVideoTab: EditVideoSheetTab | undefined
  setSelectedVideoTab: (tab: EditVideoSheetTab | undefined) => void
  sheetState: EditVideoSheetState
  setSheetState: (state: EditVideoSheetState) => void
}
const EditVideoSheetContext = React.createContext<ContextValue | undefined>(undefined)
EditVideoSheetContext.displayName = 'EditVideoSheetContext'

export const EditVideoSheetProvider: React.FC = ({ children }) => {
  const [videoTabs, setVideoTabs] = useState<EditVideoSheetTab[]>([])
  const [selectedVideoTab, setSelectedVideoTab] = useState<EditVideoSheetTab>()
  const [sheetState, setSheetState] = useState<EditVideoSheetState>('closed')

  const addVideoTab = useCallback(
    (tab: EditVideoSheetTab) => {
      setVideoTabs((existingTabs) => {
        if (!existingTabs.find((t) => t.id === tab.id)) {
          return [tab, ...existingTabs]
        }
        return existingTabs
      })
    },
    [setVideoTabs]
  )

  const removeVideoTab = useCallback(
    (tab: EditVideoSheetTab) => {
      setVideoTabs((tabs) => tabs.filter((t) => t.id !== tab.id))
    },
    [setVideoTabs]
  )

  const resetVideoTabs = useCallback(() => setVideoTabs([]), [setVideoTabs])

  return (
    <EditVideoSheetContext.Provider
      value={{
        videoTabs,
        addVideoTab,
        removeVideoTab,
        resetVideoTabs,
        selectedVideoTab,
        setSelectedVideoTab,
        sheetState,
        setSheetState,
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
  const {
    videoTabs,
    addVideoTab,
    removeVideoTab,
    selectedVideoTab,
    resetVideoTabs,
    setSelectedVideoTab,
    sheetState,
    setSheetState,
  } = useEditVideoSheetContext()

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

    if (sheetState === 'minimized' && cachedSheetState === 'open') {
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
