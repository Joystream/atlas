import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import shallow from 'zustand/shallow'

import { axiosInstance } from '@/api/axios'
import { useFullChannel } from '@/api/hooks/channel'
import { atlasConfig } from '@/config'
import { displayCategoriesLookup } from '@/config/categories'
import { absoluteRoutes } from '@/config/routes'
import { useCreateEditChannelSubmit } from '@/hooks/useChannelFormSubmit'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user/user.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { createId } from '@/utils/createId'
import { imageUrlToBlob } from '@/utils/image'
import { SentryLogger } from '@/utils/logs'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/useGetYppSyncedChannels'

import { YppResponseData, YppSetupForm } from './YppSignUpSetupModal.types'

const YPP_SYNC_URL = atlasConfig.features.ypp.youtubeSyncApiUrl
const DEFAULT_LANGUAGE = atlasConfig.derived.popularLanguagesSelectValues[0].value
const COLLABORATOR_ID = atlasConfig.features.ypp.youtubeCollaboratorMemberId

export const useYppSetupModalHandlers = () => {
  const formRef = useRef<YppSetupForm>({})
  const { displaySnackbar } = useSnackbar()
  const { currentUser } = useAuth()
  const { memberId, refetchUserMemberships, setActiveChannel, channelId, isLoggedIn } = useUser()
  const createOrUpdateChannel = useCreateEditChannelSubmit(undefined)
  const {
    referrerId,
    ytResponseData,
    utmSource,
    utmCampaign,
    utmContent,
    actions: { setYtResponseData, setUtmSource, setUtmCampaign, setUtmContent },
  } = useYppStore((store) => store, shallow)
  console.log('data', channelId)
  const createdChannelId = useRef<string | null>(null)
  //   const client = useApolloClient()
  const setReferrerId = useYppStore((store) => store.actions.setReferrerId)
  const navigate = useNavigate()
  const {
    unsyncedChannels: yppUnsyncedChannels,
    currentChannel: yppCurrentChannel,
    isLoading,
    refetchYppSyncedChannels,
  } = useGetYppSyncedChannels()
  const {
    trackPageView,
    trackYppOptIn,
    identifyUser,
    trackYppReqsNotMet,
    trackClickAuthModalSignUpButton,
    trackClickAuthModalSignInButton,
  } = useSegmentAnalytics()

  const { refetch: refetchChannel } = useFullChannel(
    channelId || '',
    {
      skip: !channelId,
      onError: (error) =>
        SentryLogger.error('Failed to fetch channel', 'UploadStatus', error, {
          channel: { id: channelId },
        }),
    },
    { where: { channel: { isPublic_eq: undefined, isCensored_eq: undefined } } }
  )

  const validateYtChannel = useCallback(
    async (videoUrl: string) => {
      try {
        const res = await axiosInstance.post<YppResponseData>(`${YPP_SYNC_URL}/users`, {
          youtubeVideoUrl: videoUrl,
        })

        formRef.current = {
          ...formRef.current,
          ...res.data,
        }
      } catch (e) {
        // for testing only
        // formRef.current = {
        //   ...formRef.current,
        //   id: '012938',
        //   channelHandle: 'test',
        //   channelTitle: 'test',
        //   channelDescription: 'test',
        //   channelLanguage: 'test',
        //   avatarUrl: 'https://atlas-services.joystream.org/avatars/migrated/151.webp',
        //   bannerUrl: 'test',
        // }
        // console.log('xd')
        // setStep(YppSetupModalStep.ownershipProved)
        displaySnackbar({
          iconType: 'error',
          title: 'Ops, something went wrong',
          description: "We couldn't verify your ownership. Please retry.",
        })
        SentryLogger.error('Error validating YT ownership', 'useYppSetupModalHandlers', e)
        throw e
      }
    },
    [displaySnackbar]
  )

  const updateOrCreateChannel = useCallback(
    async (channelId?: string, onSuccess?: () => void) => {
      try {
        const avatarBlob = formRef.current?.avatarUrl
          ? (await imageUrlToBlob(formRef.current?.avatarUrl).catch((err) =>
              SentryLogger.error('Failed to process YT avatar image', 'handleCreateOrUpdateChannel', err)
            )) ?? null
          : null

        const coverBlob = formRef.current?.bannerUrl
          ? (await imageUrlToBlob(formRef.current?.bannerUrl, 1920, 480).catch((err) =>
              SentryLogger.error('Failed to process YT banner image', 'handleCreateOrUpdateChannel', err)
            )) ?? null
          : null

        const avatarContentId = `local-avatar-${createId()}`
        const coverContentId = `local-cover-${createId()}`

        if (!memberId) {
          throw Error('memberId id was not provided')
        }
        if (!COLLABORATOR_ID) {
          throw Error('Collaborator member id was not provided')
        }

        await createOrUpdateChannel({
          minimized: {
            errorMessage: 'Failed to create or update channel',
          },
          data: {
            collaboratorId: COLLABORATOR_ID,
            metadata: channelId
              ? { ownerAccount: memberId }
              : {
                  ownerAccount: memberId,
                  description: formRef.current?.channelDescription,
                  isPublic: true,
                  language: formRef.current?.channelLanguage || DEFAULT_LANGUAGE,
                  title: formRef.current?.channelTitle || formRef.current?.channelHandle,
                },
            refetchChannel,
            newChannel: !channelId,
            assets: channelId
              ? {}
              : {
                  avatarPhoto: {
                    assetDimensions: { height: 192, width: 192 },
                    contentId: avatarContentId,
                    imageCropData: null,
                    croppedBlob: avatarBlob,
                    originalBlob: avatarBlob,
                  },
                  coverPhoto: {
                    assetDimensions: { width: 1920, height: 480 },
                    contentId: coverContentId,
                    imageCropData: null,
                    croppedBlob: coverBlob,
                    originalBlob: coverBlob,
                  },
                },
          },
          onTxSync: async ({ channelId }) => {
            setActiveChannel(channelId)
            createdChannelId.current = channelId
          },
          onCompleted: async () => {
            await refetchUserMemberships()
            onSuccess?.()
          },
        })
      } catch (error) {
        displaySnackbar({
          title: 'Failed to connect channel to the program',
          description: 'An unexpected error occurred. Please try again.',
          iconType: 'error',
        })
        throw error
      }
    },
    [createOrUpdateChannel, displaySnackbar, memberId, refetchChannel, refetchUserMemberships, setActiveChannel]
  )

  const connectJoyChannelToYpp = useCallback(async () => {
    if (!memberId) {
      throw Error('memberId id was not provided')
    }

    if (!currentUser?.email) {
      throw Error('email was not provided')
    }

    const channelIdInAction = channelId ?? createdChannelId.current

    if (!channelIdInAction) {
      throw Error('channel id was not provided')
    }

    try {
      const channelCreationResponse = await axiosInstance.post(
        `${atlasConfig.features.ypp.youtubeSyncApiUrl}/channels`,
        {
          ...(channelIdInAction ? { joystreamChannelId: parseInt(channelIdInAction) } : {}),
          ...(referrerId ? { referrerChannelId: parseInt(referrerId) } : {}),
          youtubeVideoUrl: formRef.current.videoUrl,
          id: formRef.current?.id,
          email: currentUser.email,
          shouldBeIngested: true,
          videoCategoryId: formRef.current.videoCategoryId,
        }
      )

      await refetchYppSyncedChannels()
      identifyUser({
        name: 'Sign up',
        memberId: memberId,
        email: formRef.current?.email || '',
        isYppFlow: 'true',
        signInType: 'password',
      })
      trackYppOptIn({
        handle: formRef.current?.channelHandle,
        email: currentUser.email,
        category: formRef.current.videoCategoryId
          ? displayCategoriesLookup[formRef.current.videoCategoryId]?.name
          : undefined,
        subscribersCount: channelCreationResponse.data.channel.subscribersCount,
        referrerId: formRef.current.referrerChannelId,
        utmSource: utmSource || undefined,
        utmCampaign: utmCampaign || undefined,
        utmContent: utmContent || undefined,
      })
      setReferrerId(null)
      setYtResponseData(null)

      navigate(absoluteRoutes.studio.yppDashboard())
      displaySnackbar({
        title: 'Sign up successful!',
        description: 'It may take up to 24 hours after sign up for the videos to start syncing.',
        iconType: 'success',
      })
    } catch (e) {
      displaySnackbar({
        title: 'Channel creation or update failed',
        description: 'An unexpected error occurred. Please try again.',
        iconType: 'error',
      })
      throw e
    }
  }, [
    channelId,
    currentUser?.email,
    displaySnackbar,
    identifyUser,
    memberId,
    navigate,
    referrerId,
    refetchYppSyncedChannels,
    setReferrerId,
    setYtResponseData,
    trackYppOptIn,
    utmCampaign,
    utmContent,
    utmSource,
  ])

  return {
    connectJoyChannelToYpp,
    formRef,
    validateYtChannel,
    updateOrCreateChannel,
  }
}
