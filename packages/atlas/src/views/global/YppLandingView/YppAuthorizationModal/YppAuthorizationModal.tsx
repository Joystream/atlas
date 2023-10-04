import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import shallow from 'zustand/shallow'

import { axiosInstance } from '@/api/axios'
import { useBasicChannel, useFullChannel } from '@/api/hooks/channel'
import { FullMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgAlertsError32 } from '@/assets/icons'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { GoogleButton } from '@/components/_buttons/GoogleButton'
import { Loader } from '@/components/_loaders/Loader'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { displayCategoriesLookup } from '@/config/categories'
import { absoluteRoutes } from '@/config/routes'
import { useCreateEditChannelSubmit } from '@/hooks/useChannelFormSubmit'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user/user.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { createId } from '@/utils/createId'
import { imageUrlToBlob } from '@/utils/image'
import { SentryLogger } from '@/utils/logs'

import {
  Anchor,
  Content,
  HeaderIconsWrapper,
  RequirementsButtonSkeleton,
  StyledSvgAppLogoShort,
} from './YppAuthorizationModal.styles'
import {
  DetailsFormData,
  YppAuthorizationDetailsFormStep,
  YppAuthorizationRequirementsStep,
  YppAuthorizationSelectChannelStep,
  YppSyncStepData,
} from './YppAuthorizationSteps'
import { useYppGoogleAuth } from './useYppGoogleAuth'

import { useGetYppSyncedChannels } from '../useGetYppSyncedChannels'

type FinalFormData = {
  authorizationCode?: string
  userId?: string
  joystreamChannelId?: number
  email?: string
  referrerChannelId?: number
  shouldBeIngested?: boolean
  videoCategoryId?: string
  channelLanguage?: string
}

export type YppAuthorizationModalProps = {
  unSyncedChannels?: FullMembershipFieldsFragment['channels']
}

const stepToPageName = {
  'ypp-select-channel': 'YPP Select Channel modal',
  'ypp-requirements': 'YPP Requirements modal',
  'ypp-fetching-data': 'Fetching Channel Data From Google',
  'ypp-sync-options': 'YPP Category And Referrer Modal',
  'ypp-channel-already-registered': 'YPP channel already registered modal',
  'ypp-speaking-to-backend': 'YPP processing modal',
}

const APP_NAME = atlasConfig.general.appName
const COLLABORATOR_ID = atlasConfig.features.ypp.youtubeCollaboratorMemberId
const DEFAULT_LANGUAGE = atlasConfig.derived.popularLanguagesSelectValues[0].value

export const YppAuthorizationModal: FC<YppAuthorizationModalProps> = ({ unSyncedChannels }) => {
  const { memberId, refetchUserMemberships, setActiveChannel, channelId, isLoggedIn } = useUser()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const createdChannelId = useRef<string | null>(null)
  const {
    unsyncedChannels: yppUnsyncedChannels,
    currentChannel: yppCurrentChannel,
    isLoading,
    refetchYppSyncedChannels,
  } = useGetYppSyncedChannels()

  const setYppModalOpenName = useYppStore((state) => state.actions.setYppModalOpenName)
  const yppModalOpenName = useYppStore((state) => state.yppModalOpenName)

  const contentRef = useRef<HTMLDivElement | null>(null)
  const channelsLoaded = !!unSyncedChannels
  const [finalFormData, setFinalFormData] = useState<FinalFormData | null>(null)
  const selectedChannelId = useYppStore((store) => store.selectedChannelId)
  const setSelectedChannelId = useYppStore((store) => store.actions.setSelectedChannelId)
  const {
    referrerId,
    ytResponseData,
    utmSource,
    utmCampaign,
    actions: { setYtResponseData, setUtmSource, setUtmCampaign },
  } = useYppStore((store) => store, shallow)
  const setReferrerId = useYppStore((store) => store.actions.setReferrerId)
  const setShouldContinueYppFlowAfterLogin = useYppStore((store) => store.actions.setShouldContinueYppFlowAfterLogin)
  const { mutateAsync: yppSignChannelMutation } = useMutation(
    'ypp-channels-post',
    (finalFormData: FinalFormData | null) =>
      axiosInstance.post(`${atlasConfig.features.ypp.youtubeSyncApiUrl}/channels`, finalFormData)
  )

  const { setAuthModalOpenName } = useAuthStore(
    (state) => ({
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )

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

  const smMatch = useMediaMatch('sm')

  const detailsFormMethods = useForm<DetailsFormData & YppSyncStepData>({
    defaultValues: {
      referrerChannelId: '',
      referrerChannelTitle: '',
      shouldBeIngested: true,
    },
  })

  const { extendedChannel } = useBasicChannel(referrerId || '', {
    skip: !referrerId,
  })
  const {
    trackPageView,
    trackYppOptIn,
    identifyUser,
    trackYppReqsNotMet,
    trackClickAuthModalSignUpButton,
    trackClickAuthModalSignInButton,
  } = useSegmentAnalytics()

  const channel = extendedChannel?.channel

  const { displaySnackbar } = useSnackbar()

  const { handleAuthorizeClick, ytRequirementsErrors, setYtRequirementsErrors, alreadyRegisteredChannel } =
    useYppGoogleAuth({
      channelsLoaded,
    })

  useEffect(() => {
    if (searchParams.get('utm_source')) {
      setUtmSource(searchParams.get('utm_source'))
    }
    if (searchParams.get('utm_campaign')) {
      setUtmCampaign(searchParams.get('utm_campaign'))
    }
  }, [searchParams, setUtmCampaign, setUtmSource])

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
    yppModalOpenName && trackPageView(stepToPageName[yppModalOpenName])
  }, [trackPageView, yppModalOpenName])

  const handleClose = useCallback(() => {
    setYtRequirementsErrors([])
    setReferrerId(null)
    setYppModalOpenName(null)
    setSelectedChannelId(null)
    setShouldContinueYppFlowAfterLogin(false)
  }, [
    setYppModalOpenName,
    setReferrerId,
    setSelectedChannelId,
    setShouldContinueYppFlowAfterLogin,
    setYtRequirementsErrors,
  ])

  const handleGoBack = useCallback(() => {
    if (yppModalOpenName === 'ypp-sync-options') {
      setYppModalOpenName(null)
    }
    if (yppModalOpenName === 'ypp-sync-options' || yppModalOpenName === 'ypp-channel-already-registered') {
      setYppModalOpenName('ypp-select-channel')
    }
  }, [yppModalOpenName, setYppModalOpenName])

  const handleSelectChannel = useCallback(
    (selectedChannelId: string) => {
      setYtRequirementsErrors([])
      setSelectedChannelId(selectedChannelId)
    },
    [setSelectedChannelId, setYtRequirementsErrors]
  )

  const createOrUpdateChannel = useCreateEditChannelSubmit()

  const handleCreateOrUpdateChannel = detailsFormMethods.handleSubmit(async (data) => {
    setFinalFormData(() => ({
      ...(selectedChannelId ? { joystreamChannelId: parseInt(selectedChannelId) } : {}),
      authorizationCode: ytResponseData?.authorizationCode,
      userId: ytResponseData?.userId,
      shouldBeIngested: data.shouldBeIngested,
      videoCategoryId: data.videoCategoryId,
      ...(data.referrerChannelId ? { referrerChannelId: parseInt(data.referrerChannelId) } : {}),
    }))
    setIsSubmitting(true)

    setYppModalOpenName('ypp-speaking-to-backend')

    try {
      const avatarBlob = ytResponseData?.avatarUrl
        ? (await imageUrlToBlob(ytResponseData?.avatarUrl).catch((err) =>
            SentryLogger.error('Failed to process YT avatar image', 'handleCreateOrUpdateChannel', err)
          )) ?? null
        : null

      const coverBlob = ytResponseData?.bannerUrl
        ? (await imageUrlToBlob(ytResponseData?.bannerUrl, 1920, 480).catch((err) =>
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
          metadata: selectedChannelId
            ? { ownerAccount: memberId }
            : {
                ownerAccount: memberId,
                description: ytResponseData?.channelDescription,
                isPublic: true,
                language: ytResponseData?.channelLanguage || DEFAULT_LANGUAGE,
                title: ytResponseData?.channelTitle || ytResponseData?.channelHandle,
              },
          refetchChannel,
          newChannel: !selectedChannelId,
          assets: selectedChannelId
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

          const channelId = selectedChannelId || createdChannelId.current

          const channelCreationResponse = await yppSignChannelMutation({
            ...(channelId ? { joystreamChannelId: parseInt(channelId) } : {}),
            ...(data.referrerChannelId ? { referrerChannelId: parseInt(data.referrerChannelId) } : {}),
            authorizationCode: ytResponseData?.authorizationCode,
            userId: ytResponseData?.userId,
            email: ytResponseData?.email,
            shouldBeIngested: data.shouldBeIngested,
            videoCategoryId: data.videoCategoryId,
          })

          await refetchYppSyncedChannels()
          identifyUser({
            name: 'Sign up',
            memberId: memberId,
            email: ytResponseData?.email || '',
            isYppFlow: 'true',
            signInType: 'password',
          })
          trackYppOptIn({
            handle: ytResponseData?.channelHandle,
            email: ytResponseData?.email,
            category: data.videoCategoryId ? displayCategoriesLookup[data.videoCategoryId]?.name : undefined,
            subscribersCount: channelCreationResponse.data.channel.subscribersCount,
            referrerId: data.referrerChannelId,
            utmSource: utmSource || undefined,
            utmCampaign: utmCampaign || undefined,
          })
          setReferrerId(null)
          setYtResponseData(null)

          navigate(absoluteRoutes.studio.ypp())
          displaySnackbar({
            title: 'Sign up successful!',
            description:
              'We will start importing your YouTube videos once your channel is verified. It could take up to 24 hours after verification for your videos to start showing on the "My videos" page. You can check your channel\'s sync status on the dashboard page',
            iconType: 'success',
          })
        },
      })
    } catch (error) {
      displaySnackbar({
        title: 'Authorization failed',
        description: 'An unexpected error occurred. Please try again.',
        iconType: 'error',
      })
      SentryLogger.error('Failed to submit form data', 'YppAuthorizationModal', error, {
        ypp: {
          formData: finalFormData,
        },
      })
    } finally {
      setYppModalOpenName(null)
      setIsSubmitting(false)
    }
  })

  useEffect(() => {
    if (channel?.title && referrerId) {
      detailsFormMethods.setValue('referrerChannelId', referrerId)
      detailsFormMethods.setValue('referrerChannelTitle', channel.title)
    }
  }, [channel, detailsFormMethods, referrerId])

  useEffect(() => {
    if (ytRequirementsErrors?.length) {
      trackPageView('YPP Reqs Not Met')
      trackYppReqsNotMet(ytRequirementsErrors, utmSource, utmCampaign)
    }
  }, [trackPageView, trackYppReqsNotMet, utmCampaign, utmSource, ytRequirementsErrors])

  const selectedChannel = useMemo(() => {
    if (!unSyncedChannels || !selectedChannelId) {
      return null
    }
    return unSyncedChannels.find((channel) => channel.id === selectedChannelId)
  }, [unSyncedChannels, selectedChannelId])

  const authorizationStep = useMemo(() => {
    switch (yppModalOpenName) {
      case 'ypp-requirements': {
        const getPrimaryButton = () => {
          if (isLoading) {
            return <RequirementsButtonSkeleton />
          }

          if (yppCurrentChannel) {
            navigate(absoluteRoutes.studio.ypp())
          }

          if (yppUnsyncedChannels?.length) {
            setSelectedChannelId(yppUnsyncedChannels[0].id)
          }

          if (ytRequirementsErrors.length) {
            return {
              text: 'Close',
              onClick: handleClose,
            }
          }

          if (yppUnsyncedChannels && yppUnsyncedChannels.length > 1) {
            return {
              text: 'Select channel',
              onClick: () => setYppModalOpenName('ypp-select-channel'),
            }
          }

          // non signed users
          return {
            text: 'Create account',
            onClick: () => {
              trackClickAuthModalSignUpButton(utmSource, utmCampaign)
              setSelectedChannelId(yppUnsyncedChannels?.[0]?.id ?? '')
              handleAuthorizeClick(yppUnsyncedChannels?.[0]?.id)
            },
          }
        }

        return {
          headerIcon: ytRequirementsErrors.length ? <SvgAlertsError32 /> : undefined,
          title: ytRequirementsErrors.length ? 'Authorization failed' : 'Requirements',
          description: ytRequirementsErrors.length
            ? 'Looks like the YouTube channel you selected does not meet all conditions to be enrolled in the program. You can select another one or try again at a later time.'
            : 'Before you can apply to the program, make sure your YouTube channel meets the below conditions.',
          primaryButton: getPrimaryButton(),
          component: <YppAuthorizationRequirementsStep requirmentsErrorCodes={ytRequirementsErrors} />,
        }
      }

      case 'ypp-select-channel':
        return {
          title: 'Select channel',
          description: `Select the ${APP_NAME} channel you want your YouTube channel to be connected with.`,
          primaryButton: {
            text: 'Continue',
            disabled: !selectedChannel,
            onClick: () => handleAuthorizeClick(),
          },
          component: (
            <YppAuthorizationSelectChannelStep
              channels={unSyncedChannels}
              selectedChannelId={selectedChannelId}
              onSelectChannel={handleSelectChannel}
            />
          ),
        }
      case 'ypp-fetching-data':
        return {
          headerIcon: <Loader variant="medium" />,
          title: 'Waiting for YouTube...',
          description: "Please wait and don't close this tab as we're pulling your channel information from YouTube.",
          primaryButton: {
            text: 'Waiting...',
            disabled: true,
          },
        }

      case 'ypp-sync-options':
        return {
          title: 'YouTube Auto Sync',
          description: 'Gleev automatically syncs all your YouTube videos.',
          primaryButton: {
            onClick: () => handleCreateOrUpdateChannel(),
            text: 'Continue',
          },
          component: <YppAuthorizationDetailsFormStep />,
        }
      case 'ypp-speaking-to-backend':
        return {
          headerIcon: <Loader variant="medium" />,
          title: 'Speaking with backend...',
          description:
            'Please wait while the server is processing the request. It may take up to 15 seconds on a slow network.',
          primaryButton: {
            text: 'Waiting...',
            disabled: true,
          },
        }
      case 'ypp-channel-already-registered':
        return {
          headerIcon: <SvgAlertsError32 />,
          title: 'Authorization failed',
          primaryButton: <GoogleButton onClick={() => handleAuthorizeClick()} />,
          description: (
            <>
              The YouTube channel you selected is already enrolled in the YouTube Partner Program and is tied to the{' '}
              {alreadyRegisteredChannel?.channelTitle} {APP_NAME} channel which belongs to{' '}
              {alreadyRegisteredChannel?.ownerMemberHandle}. If you believe this is a mistake, try again or reach out{' '}
              <Text variant="t200" as="span" color="colorTextPrimary">
                <Anchor href={atlasConfig.general.joystreamDiscordUrl} target="_blank">
                  our Discord server.
                </Anchor>
              </Text>
            </>
          ),
        }
    }
  }, [
    yppModalOpenName,
    selectedChannel,
    unSyncedChannels,
    selectedChannelId,
    handleSelectChannel,
    alreadyRegisteredChannel?.channelTitle,
    alreadyRegisteredChannel?.ownerMemberHandle,
    ytRequirementsErrors,
    isLoading,
    yppCurrentChannel,
    yppUnsyncedChannels,
    navigate,
    setSelectedChannelId,
    handleClose,
    setYppModalOpenName,
    trackClickAuthModalSignUpButton,
    utmSource,
    utmCampaign,
    handleAuthorizeClick,
    handleCreateOrUpdateChannel,
  ])

  const isLoadingModal = yppModalOpenName === 'ypp-fetching-data' || yppModalOpenName === 'ypp-speaking-to-backend'

  const secondaryButton: DialogButtonProps | undefined = useMemo(() => {
    if (isLoadingModal || ytRequirementsErrors.length) return

    if (yppModalOpenName === 'ypp-requirements' && isLoggedIn) return

    if (yppModalOpenName === 'ypp-requirements' && !isLoggedIn) {
      return {
        text: 'Sign in',
        onClick: () => {
          trackClickAuthModalSignInButton(utmSource, utmCampaign)
          setShouldContinueYppFlowAfterLogin(true)
          setYppModalOpenName(null)
          setAuthModalOpenName('logIn')
        },
      }
    }

    if (yppModalOpenName === 'ypp-select-channel') {
      return {
        text: 'Create new channel',
        onClick: () => {
          setYppModalOpenName(null)
          handleAuthorizeClick()
        },
      }
    }

    return {
      text: 'Back',
      disabled: isSubmitting,
      onClick: handleGoBack,
    }
  }, [
    isLoadingModal,
    ytRequirementsErrors.length,
    yppModalOpenName,
    isLoggedIn,
    isSubmitting,
    handleGoBack,
    trackClickAuthModalSignInButton,
    utmSource,
    utmCampaign,
    setShouldContinueYppFlowAfterLogin,
    setYppModalOpenName,
    setAuthModalOpenName,
    handleAuthorizeClick,
  ])

  return (
    <FormProvider {...detailsFormMethods}>
      <DialogModal
        contentRef={contentRef}
        show={yppModalOpenName !== null}
        dividers={!isLoadingModal}
        additionalActionsNodeMobilePosition="bottom"
        primaryButton={authorizationStep?.primaryButton}
        secondaryButton={secondaryButton}
        additionalActionsNode={
          !isLoadingModal &&
          !ytRequirementsErrors.length && (
            <Button variant="tertiary" disabled={isSubmitting} onClick={handleClose}>
              Cancel
            </Button>
          )
        }
      >
        <HeaderIconsWrapper>
          {authorizationStep?.headerIcon ? authorizationStep.headerIcon : <StyledSvgAppLogoShort />}
        </HeaderIconsWrapper>
        <Text variant={smMatch ? 'h500' : 'h400'} as="h2" margin={{ top: 6, bottom: 2 }}>
          {authorizationStep?.title}
        </Text>
        <Text variant="t200" as="p" color="colorText">
          {authorizationStep?.description}
        </Text>
        {authorizationStep?.component ? <Content>{authorizationStep.component}</Content> : null}
      </DialogModal>
    </FormProvider>
  )
}
