import { parseISO } from 'date-fns'
import { Location } from 'history'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useMatch } from 'react-router'
import { useNavigate } from 'react-router-dom'

import { useVideo } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { RoutingState } from '@/types/routing'
import { SentryLogger } from '@/utils/logs'

import { VideoWorkspaceContext } from './provider'
import { VideoWorkspaceAssets, VideoWorkspaceFormFields, VideoWorkspaceState, VideoWorkspaceTab } from './types'

import { channelDraftsSelector, useDraftStore } from '../drafts'
import { useAuthorizedUser } from '../user'

export const DEFAULT_LICENSE_ID = 1002

export const useVideoWorkspace = () => {
  const ctx = useContext(VideoWorkspaceContext)
  if (ctx === undefined) {
    throw new Error('useVideoWorkspace must be used within a VideoWorkspaceProvider')
  }
  return ctx
}

export const useVideoWorkspaceTabData = (tab?: VideoWorkspaceTab) => {
  const { activeChannelId } = useAuthorizedUser()
  const drafts = useDraftStore(channelDraftsSelector(activeChannelId))
  const { selectedVideoTabCachedAssets } = useVideoWorkspace()
  const { video, loading, error } = useVideo(tab?.id ?? '', {
    skip: tab?.isDraft,
    onError: (error) => SentryLogger.error('Failed to fetch video', 'useVideoWorkspaceTabData', error),
  })

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

  const assets: VideoWorkspaceAssets = tab.isDraft
    ? selectedVideoTabCachedAssets || {
        video: { contentId: null },
        thumbnail: {
          cropContentId: null,
          originalContentId: null,
        },
      }
    : {
        video: {
          contentId: video?.mediaDataObject?.joystreamContentId ?? null,
        },
        thumbnail: {
          cropContentId: video?.thumbnailPhotoDataObject?.joystreamContentId ?? null,
          originalContentId: null,
        },
      }

  const normalizedData: VideoWorkspaceFormFields = {
    title: tab.isDraft ? draft?.title ?? '' : video?.title ?? '',
    description: (tab.isDraft ? draft?.description : video?.description) ?? '',
    category: (tab.isDraft ? draft?.category : video?.category?.id) ?? null,
    licenseCode: (tab.isDraft ? draft?.licenseCode : video?.license?.code) ?? DEFAULT_LICENSE_ID,
    licenseCustomText: (tab.isDraft ? draft?.licenseCustomText : video?.license?.customText) ?? null,
    licenseAttribution: (tab.isDraft ? draft?.licenseAttribution : video?.license?.attribution) ?? null,
    language: (tab.isDraft ? draft?.language : video?.language?.iso) ?? 'en',
    isPublic: (tab.isDraft ? draft?.isPublic : video?.isPublic) ?? true,
    isExplicit: (tab.isDraft ? draft?.isExplicit : video?.isExplicit) ?? false,
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

const WORKSPACE_MATCH = { path: absoluteRoutes.studio.videoWorkspace() }
export const useVideoWorkspaceRouting = (): Location => {
  const navigate = useNavigate()

  const location = useLocation()
  const locationState = location.state as RoutingState
  const [cachedLocation, setCachedLocation] = useState<Location>()

  const videoWorkspaceMatch = useMatch(WORKSPACE_MATCH)
  const { videoWorkspaceState, setVideoWorkspaceState } = useVideoWorkspace()
  const [cachedVideoWorkspaceState, setCachedVideoWorkspaceState] = useState<VideoWorkspaceState>('closed')

  useEffect(() => {
    if (location === cachedLocation) {
      return
    }
    setCachedLocation(location)

    if (videoWorkspaceMatch && videoWorkspaceState !== 'open') {
      // route changed to video edit
      const state: RoutingState = {
        overlaidLocation: cachedLocation ?? defaultLocation,
      }
      navigate(location, { replace: true, state })
      setVideoWorkspaceState('open')
    }
  }, [location, cachedLocation, videoWorkspaceMatch, videoWorkspaceState, setVideoWorkspaceState, navigate])

  useEffect(() => {
    if (videoWorkspaceState === cachedVideoWorkspaceState) {
      return
    }
    setCachedVideoWorkspaceState(videoWorkspaceState)

    if (
      (videoWorkspaceState === 'minimized' && cachedVideoWorkspaceState === 'open') ||
      (videoWorkspaceState === 'closed' && cachedVideoWorkspaceState !== 'minimized')
    ) {
      // restore the old location when videoWorkspace was minimized/closed
      const oldLocation = locationState?.overlaidLocation ?? absoluteRoutes.studio.index()
      navigate(oldLocation)
    }
    if (videoWorkspaceState === 'open' && !videoWorkspaceMatch) {
      // videoWorkspaceState changed without the route - most likely from the videoWorkspace itself, change URL and save current location
      const state: RoutingState = {
        overlaidLocation: location,
      }
      navigate(absoluteRoutes.studio.videoWorkspace(), { state: state })
    }
  }, [videoWorkspaceState, cachedVideoWorkspaceState, location, locationState, navigate, videoWorkspaceMatch])

  if (videoWorkspaceMatch) {
    return locationState?.overlaidLocation ?? cachedLocation ?? defaultLocation
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
