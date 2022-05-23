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
import { VideoWorkspaceVideoAssets, VideoWorkspaceVideoFormFields } from './types'

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

export const useVideoWorkspaceData = () => {
  const { editedVideoInfo } = useVideoWorkspace()
  const { activeChannelId } = useAuthorizedUser()
  const drafts = useDraftStore(channelDraftsSelector(activeChannelId))
  const { video, loading, error } = useVideo(editedVideoInfo?.id ?? '', {
    skip: editedVideoInfo?.isDraft,
    onError: (error) => SentryLogger.error('Failed to fetch video', 'useVideoWorkspaceData', error),
  })

  if (!editedVideoInfo) {
    return {
      tabData: null,
      loading: false,
      error: null,
    }
  }

  const draft = drafts.find((d) => d.id === editedVideoInfo.id)

  const assets: VideoWorkspaceVideoAssets = editedVideoInfo.isDraft
    ? {
        video: {
          id: null,
        },
        thumbnail: {
          cropId: null,
          originalId: null,
        },
      }
    : {
        video: {
          id: video?.media?.id ?? null,
        },
        thumbnail: {
          cropId: video?.thumbnailPhoto?.id ?? null,
          originalId: null,
        },
      }

  const normalizedData: VideoWorkspaceVideoFormFields = {
    title: editedVideoInfo.isDraft ? draft?.title ?? '' : video?.title ?? '',
    description: (editedVideoInfo.isDraft ? draft?.description : video?.description) ?? '',
    category: (editedVideoInfo.isDraft ? draft?.category : video?.category?.id) ?? null,
    licenseCode: (editedVideoInfo.isDraft ? draft?.licenseCode : video?.license?.code) ?? DEFAULT_LICENSE_ID,
    licenseCustomText: (editedVideoInfo.isDraft ? draft?.licenseCustomText : video?.license?.customText) ?? null,
    licenseAttribution: (editedVideoInfo.isDraft ? draft?.licenseAttribution : video?.license?.attribution) ?? null,
    language: (editedVideoInfo.isDraft ? draft?.language : video?.language?.iso) ?? 'en',
    isPublic: (editedVideoInfo.isDraft ? draft?.isPublic : video?.isPublic) ?? true,
    isExplicit: (editedVideoInfo.isDraft ? draft?.isExplicit : video?.isExplicit) ?? false,
    hasMarketing: (editedVideoInfo.isDraft ? draft?.hasMarketing : video?.hasMarketing) ?? false,
    isCommentSectionEnabled: video?.isCommentSectionEnabled,
    publishedBeforeJoystream:
      (editedVideoInfo.isDraft
        ? draft?.publishedBeforeJoystream
          ? parseISO(draft.publishedBeforeJoystream)
          : null
        : video?.publishedBeforeJoystream) ?? null,
    assets,
    mintNft: !!video?.nft,
    nftRoyaltiesPercent: video?.nft?.creatorRoyalty || undefined,
  }

  return {
    tabData: normalizedData,
    loading: editedVideoInfo.isDraft ? false : loading,
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
  const { isWorkspaceOpen, setIsWorkspaceOpen } = useVideoWorkspace()
  const [cachedIsWorkspaceOpen, setCachedIsWorkspaceOpen] = useState(false)

  useEffect(() => {
    if (location === cachedLocation) {
      return
    }
    setCachedLocation(location)

    if (videoWorkspaceMatch && !isWorkspaceOpen) {
      // route changed to video edit
      const state: RoutingState = {
        overlaidLocation: cachedLocation ?? defaultLocation,
      }
      navigate(location, { replace: true, state })
      setIsWorkspaceOpen(true)
    }
  }, [location, cachedLocation, videoWorkspaceMatch, navigate, isWorkspaceOpen, setIsWorkspaceOpen])

  useEffect(() => {
    if (isWorkspaceOpen === cachedIsWorkspaceOpen) {
      return
    }
    setCachedIsWorkspaceOpen(isWorkspaceOpen)

    if (!isWorkspaceOpen) {
      // restore the old location when videoWorkspace was closed
      const oldLocation = locationState?.overlaidLocation ?? absoluteRoutes.studio.index()
      navigate(oldLocation)
    }
    if (isWorkspaceOpen && !videoWorkspaceMatch) {
      // isWorkspaceOpen changed without the route change, change URL and save current location
      const state: RoutingState = {
        overlaidLocation: location,
      }
      navigate(absoluteRoutes.studio.videoWorkspace(), { state: state })
    }
  }, [cachedIsWorkspaceOpen, isWorkspaceOpen, location, locationState, navigate, videoWorkspaceMatch])

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
