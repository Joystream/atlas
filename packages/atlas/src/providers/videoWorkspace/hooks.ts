import { parseISO } from 'date-fns'
import { Location } from 'history'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useMatch } from 'react-router'
import { useNavigate } from 'react-router-dom'

import { useFullVideo } from '@/api/hooks/video'
import { displayCategories } from '@/config/categories'
import { cancelledVideoFilter } from '@/config/contentFilter'
import { absoluteRoutes } from '@/config/routes'
import { useGetAssetUrl } from '@/hooks/useGetAssetUrl'
import { useAuthorizedUser } from '@/providers/user/user.hooks'
import { RoutingState } from '@/types/routing'
import { SubtitlesInput } from '@/types/subtitles'
import { SentryLogger } from '@/utils/logs'

import { VideoWorkspaceContext } from './provider'
import { VideoWorkspaceVideoAssets, VideoWorkspaceVideoFormFields } from './types'

import { channelDraftsSelector, useDraftStore } from '../drafts'

export const DEFAULT_LICENSE_ID = 1009

export const useVideoWorkspace = () => {
  const ctx = useContext(VideoWorkspaceContext)
  if (ctx === undefined) {
    throw new Error('useVideoWorkspace must be used within a VideoWorkspaceProvider')
  }
  return ctx
}

export const useVideoWorkspaceData = () => {
  const { editedVideoInfo } = useVideoWorkspace()
  const { channelId } = useAuthorizedUser()
  const drafts = useDraftStore(channelDraftsSelector(channelId))
  const { video, loading, error } = useFullVideo(
    editedVideoInfo?.id ?? '',
    {
      skip: editedVideoInfo?.isDraft,
      onError: (error) => SentryLogger.error('Failed to fetch video', 'useVideoWorkspaceData', error),
    },
    {
      where: {
        ...cancelledVideoFilter,
      },
    }
  )
  const videoUrl = useGetAssetUrl(video?.media?.resolvedUrls, 'video')
  const thumbnailUrl = useGetAssetUrl(video?.thumbnailPhoto?.resolvedUrls, 'image')

  const hasAnyAvailableSubtitles = video?.subtitles?.some((s) => !!s.asset?.isAccepted)

  const subtitlesArray: SubtitlesInput[] | null = useMemo(
    () =>
      video?.subtitles
        .filter((s) => !!s.language)
        .map((s) => ({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          languageIso: s.language!,
          type: s.type === 'closed-captions' ? 'closed-captions' : 'subtitles',
          asset: s.asset,
          id: s.asset?.id,
        })) ?? null,
    [video?.subtitles]
  )

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
          url: videoUrl.url,
        },
        thumbnail: {
          cropId: video?.thumbnailPhoto?.id ?? null,
          url: thumbnailUrl.url,
          originalId: null,
        },
      }

  const normalizedData: VideoWorkspaceVideoFormFields = {
    title: editedVideoInfo.isDraft ? draft?.title ?? '' : video?.title ?? '',
    description: (editedVideoInfo.isDraft ? draft?.description : video?.description) ?? '',
    category:
      (editedVideoInfo.isDraft
        ? draft?.category ?? displayCategories?.[0]?.defaultVideoCategory
        : video?.category?.id) ?? null,
    licenseCode: (editedVideoInfo.isDraft ? draft?.licenseCode : video?.license?.code) ?? DEFAULT_LICENSE_ID,
    licenseCustomText: (editedVideoInfo.isDraft ? draft?.licenseCustomText : video?.license?.customText) ?? null,
    licenseAttribution: (editedVideoInfo.isDraft ? draft?.licenseAttribution : video?.license?.attribution) ?? null,
    language: (editedVideoInfo.isDraft ? draft?.language ?? 'en' : video?.language) ?? null,
    isPublic: (editedVideoInfo.isDraft ? draft?.isPublic : video?.isPublic) ?? true,
    isExplicit: (editedVideoInfo.isDraft ? draft?.isExplicit : video?.isExplicit) ?? false,
    hasMarketing: (editedVideoInfo.isDraft ? draft?.hasMarketing : video?.hasMarketing) ?? false,
    enableComments: (editedVideoInfo.isDraft ? draft?.enableComments : video?.isCommentSectionEnabled) ?? true,
    publishedBeforeJoystream:
      (editedVideoInfo.isDraft
        ? draft?.publishedBeforeJoystream
          ? parseISO(draft.publishedBeforeJoystream)
          : null
        : video?.publishedBeforeJoystream) ?? null,
    assets,
    mintNft: !!video?.nft,
    nftRoyaltiesPercent: video?.nft?.creatorRoyalty || undefined,
    subtitlesArray,
  }

  return {
    tabData: normalizedData,
    loading: editedVideoInfo.isDraft ? false : loading || (hasAnyAvailableSubtitles && !subtitlesArray),
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
