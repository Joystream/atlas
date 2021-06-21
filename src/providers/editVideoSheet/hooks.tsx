import { parseISO } from 'date-fns'
import { Location } from 'history'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useMatch } from 'react-router'
import { useNavigate } from 'react-router-dom'

import { useVideo } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/hooks'
import { InputFilesState } from '@/shared/components/MultiFileSelect/MultiFileSelect'
import { RoutingState } from '@/types/routing'

import { EditVideoSheetContext } from './provider'
import { EditVideoFormFields, EditVideoSheetState, EditVideoSheetTab } from './types'

import { useAuthorizedUser, useDrafts } from '..'

export const useEditVideoSheet = () => {
  const ctx = useContext(EditVideoSheetContext)
  if (ctx === undefined) {
    throw new Error('useUploadVideoActionSheet must be used within a VideoActionSheetProvider')
  }
  return ctx
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

const defaultLocation: Location = {
  pathname: absoluteRoutes.studio.index(),
  key: '',
  search: '',
  hash: '',
  state: null,
}
