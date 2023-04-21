import axios from 'axios'
import { formatDuration } from 'date-fns'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

import { useBasicChannel } from '@/api/hooks/channel'
import { FullMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgAlertsError32 } from '@/assets/icons'
import appScreenshot from '@/assets/images/ypp-authorization/app-screenshot.webp'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { Loader } from '@/components/_loaders/Loader'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useChannelsStorageBucketsCount } from '@/providers/assets/assets.hooks'
import { useBloatFeesAndPerMbFees, useJoystream } from '@/providers/joystream/joystream.hooks'
import { useOverlayManager } from '@/providers/overlayManager'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { SentryLogger } from '@/utils/logs'
import { pluralizeNoun } from '@/utils/misc'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/YppLandingView.hooks'

import { useGetYppChannelRequirements, useYppGoogleAuth } from './YppAuthorizationModal.hooks'
import {
  Anchor,
  CategoriesText,
  Content,
  DescriptionText,
  HeaderIconsWrapper,
  Img,
  StyledSvgAppLogoShort,
} from './YppAuthorizationModal.styles'
import { YppAuthorizationErrorCode, YppAuthorizationStepsType } from './YppAuthorizationModal.types'
import {
  DetailsFormData,
  YppAuthorizationDetailsFormStep,
  YppAuthorizationRequirementsStep,
  YppAuthorizationSelectChannelStep,
  YppAuthorizationSyncStep,
  YppAuthorizationTermsAndConditionsStep,
  YppSyncStepData,
} from './YppAuthorizationSteps'

type FinalFormData = {
  authorizationCode?: string
  userId?: string
  joystreamChannelId?: number
  email?: string
  referrerChannelId?: number
  shouldBeIngested?: boolean
  videoCategoryId?: string
}

export type YppAuthorizationModalProps = {
  currentStep: YppAuthorizationStepsType
  onChangeStep: (step: YppAuthorizationStepsType) => void
  unSyncedChannels?: FullMembershipFieldsFragment['channels']
}

const APP_NAME = atlasConfig.general.appName

export const YppAuthorizationModal: FC<YppAuthorizationModalProps> = ({
  currentStep,
  onChangeStep,
  unSyncedChannels,
}) => {
  const { setActiveUser, memberId, activeMembership } = useUser()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { decrementOverlaysOpenCount } = useOverlayManager()
  const { refetchYppSyncedChannels } = useGetYppSyncedChannels()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const channelsLoaded = !!unSyncedChannels
  const hasMoreThanOneChannel = unSyncedChannels && unSyncedChannels.length > 1
  const [finalFormData, setFinalFormData] = useState<FinalFormData | null>(null)
  const [isFetchingData, setIsFetchingData] = useState(false)
  const selectedChannelId = useYppStore((store) => store.selectedChannelId)
  const referrerId = useYppStore((store) => store.referrerId)
  const setSelectedChannelId = useYppStore((store) => store.actions.setSelectedChannelId)
  const setReferrerId = useYppStore((store) => store.actions.setReferrerId)
  const setShouldContinueYppFlow = useYppStore((store) => store.actions.setShouldContinueYppFlow)
  const { data: fetchedChannelRequirements } = useGetYppChannelRequirements()
  const { mutateAsync: yppChannelMutation } = useMutation('ypp-channels-post', (finalFormData: FinalFormData | null) =>
    axios.post(`${atlasConfig.features.ypp.youtubeSyncApiUrl}/channels`, finalFormData)
  )

  const smMatch = useMediaMatch('sm')

  const detailsFormMethods = useForm<DetailsFormData & YppSyncStepData>({
    defaultValues: {
      referrerChannelId: '',
      referrerChannelTitle: '',
      email: '',
      shouldBeIngested: true,
    },
  })
  const { dataObjectStateBloatBondValue } = useBloatFeesAndPerMbFees()
  const channelBucketsCount = useChannelsStorageBucketsCount(selectedChannelId)

  const { joystream, proxyCallback } = useJoystream()
  const youtubeCollaboratorMemberId = atlasConfig.features.ypp.youtubeCollaboratorMemberId

  const { extendedChannel } = useBasicChannel(referrerId || '', {
    skip: !referrerId,
  })

  const channel = extendedChannel?.channel

  const handleTransaction = useTransaction()
  const { displaySnackbar } = useSnackbar()

  const {
    handleAuthorizeClick,
    ytRequirementsErrors,
    ytResponseData,
    setYtRequirementsErrors,
    alreadyRegisteredChannel,
  } = useYppGoogleAuth({
    closeModal: useCallback(() => onChangeStep(null), [onChangeStep]),
    channelsLoaded,
    onChangeStep: onChangeStep,
  })

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [currentStep])

  const handleClose = useCallback(() => {
    setYtRequirementsErrors([])
    setReferrerId(null)
    onChangeStep(null)
    setSelectedChannelId(null)
    setShouldContinueYppFlow(false)
  }, [onChangeStep, setReferrerId, setSelectedChannelId, setShouldContinueYppFlow, setYtRequirementsErrors])

  const handleGoBack = useCallback(() => {
    if (currentStep === 'ypp-sync') {
      onChangeStep('details')
    }
    if (currentStep === 'terms-and-conditions') {
      onChangeStep('ypp-sync')
    }
    if (currentStep === 'details' || currentStep === 'channel-already-registered') {
      onChangeStep('requirements')
    }
    if (currentStep === 'requirements' && hasMoreThanOneChannel) {
      setYtRequirementsErrors([])
      onChangeStep('select-channel')
    }
  }, [currentStep, hasMoreThanOneChannel, onChangeStep, setYtRequirementsErrors])

  const handleSelectChannel = useCallback(
    (selectedChannelId: string) => {
      setYtRequirementsErrors([])
      setSelectedChannelId(selectedChannelId)
    },
    [setSelectedChannelId, setYtRequirementsErrors]
  )

  const handleSubmitDetailsForm = detailsFormMethods.handleSubmit((data) => {
    setFinalFormData(() => ({
      ...(selectedChannelId ? { joystreamChannelId: parseInt(selectedChannelId) } : {}),
      authorizationCode: ytResponseData?.authorizationCode,
      userId: ytResponseData?.userId,
      email: data.email,
      shouldBeIngested: data.shouldBeIngested,
      videoCategoryId: data.videoCategoryId,
      ...(data.referrerChannelId ? { referrerChannelId: parseInt(data.referrerChannelId) } : {}),
    }))
    onChangeStep(currentStep === 'details' ? 'ypp-sync' : 'terms-and-conditions')
  })

  const handleAcceptTermsAndSubmit = useCallback(async () => {
    if (!joystream || !selectedChannelId || !memberId) {
      return
    }
    try {
      if (!youtubeCollaboratorMemberId) {
        throw Error('Collaborator member id was not provided')
      }
      setIsSubmitting(true)
      await yppChannelMutation(finalFormData)
      const completed = await handleTransaction({
        txFactory: async (updateStatus) => {
          return (await joystream.extrinsics).updateChannel(
            selectedChannelId,
            memberId,
            { ownerAccount: memberId },
            {},
            [],
            dataObjectStateBloatBondValue.toString(),
            channelBucketsCount.toString(),
            youtubeCollaboratorMemberId,
            proxyCallback(updateStatus)
          )
        },
      })
      if (completed) {
        setTimeout(() => {
          onChangeStep('summary')
        }, 2000)
      }
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
      setIsSubmitting(false)
    }
  }, [
    joystream,
    selectedChannelId,
    memberId,
    yppChannelMutation,
    finalFormData,
    handleTransaction,
    dataObjectStateBloatBondValue,
    channelBucketsCount,
    youtubeCollaboratorMemberId,
    proxyCallback,
    onChangeStep,
    displaySnackbar,
  ])

  useEffect(() => {
    if (channel?.title && referrerId) {
      detailsFormMethods.setValue('referrerChannelId', referrerId)
      detailsFormMethods.setValue('referrerChannelTitle', channel.title)
    }
  }, [channel, detailsFormMethods, referrerId])

  useEffect(() => {
    if (ytResponseData?.email && ytResponseData.email.includes('@gmail.com')) {
      detailsFormMethods.setValue('email', ytResponseData.email)
    }
  }, [detailsFormMethods, ytResponseData?.email])

  const selectedChannel = useMemo(() => {
    if (!unSyncedChannels || !selectedChannelId) {
      return null
    }
    return unSyncedChannels.find((channel) => channel.id === selectedChannelId)
  }, [unSyncedChannels, selectedChannelId])

  const handleGoToDashboard = useCallback(() => {
    decrementOverlaysOpenCount()
    setActiveUser({ channelId: selectedChannel?.id })
  }, [decrementOverlaysOpenCount, selectedChannel?.id, setActiveUser])

  const convertHoursRequirementTime = (hours: number) => {
    if (hours > 24 * 30) {
      return formatDuration({ months: Math.round(hours / (24 * 30)) })
    }
    if (hours > 24) {
      return formatDuration({ days: Math.round(hours / 24) })
    }
    return formatDuration({ hours: hours })
  }

  const requirements = useMemo(
    () => [
      ...(atlasConfig.general.appContentFocus
        ? [
            {
              text: (
                <>
                  The main topic of your videos is{' '}
                  <Text variant="t200-strong" as="span">
                    {atlasConfig.general.appContentFocus}
                  </Text>
                  <CategoriesText variant="t100" as="span" color="colorTextMuted">
                    {atlasConfig.general.appName} video categories:{' '}
                    {atlasConfig.content.categories.map((category) => category.name).join(', ')}
                  </CategoriesText>
                </>
              ),
              fulfilled: true,
            },
          ]
        : []),
      {
        text: `Your YouTube channel is at least ${convertHoursRequirementTime(
          fetchedChannelRequirements?.MINIMUM_CHANNEL_AGE_HOURS || 0
        )} old`,
        fulfilled: !ytRequirementsErrors.some(
          (error) => error === YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_CREATION_DATE
        ),
      },
      {
        text: `Your YouTube channel has at least ${pluralizeNoun(
          fetchedChannelRequirements?.MINIMUM_VIDEO_COUNT ?? 0,
          'video',
          true
        )}, all published at least ${convertHoursRequirementTime(
          fetchedChannelRequirements?.MINIMUM_VIDEO_AGE_HOURS || 0
        )} ago`,
        fulfilled: !ytRequirementsErrors.some(
          (error) => error === YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_VIDEOS
        ),
      },
      {
        text: `Your YouTube channel has at least ${pluralizeNoun(
          fetchedChannelRequirements?.MINIMUM_SUBSCRIBERS_COUNT ?? 0,
          'subscriber',
          true
        )} and subscriptions are made public.`,
        fulfilled: !ytRequirementsErrors.some(
          (error) => error === YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_SUBSCRIBERS
        ),
      },
    ],
    [fetchedChannelRequirements, ytRequirementsErrors]
  )

  const verifyChannelRequirements = useCallback(async () => {
    const channels = activeMembership?.channels

    if (!channels?.length) {
      navigate(absoluteRoutes.studio.newChannel())
      return
    }
    setIsFetchingData(true)
    const { data } = await refetchYppSyncedChannels().finally(() => {
      setIsFetchingData(false)
    })
    if (data?.currentChannel) {
      navigate(absoluteRoutes.studio.ypp())
      return
    }

    if (data?.unsyncedChannels?.length) {
      setSelectedChannelId(data?.unsyncedChannels[0].id)
    }
    if (data?.unsyncedChannels?.length && data?.unsyncedChannels.length > 1) {
      onChangeStep('select-channel')
      return
    }

    handleAuthorizeClick(data?.unsyncedChannels?.[0].id)
  }, [
    activeMembership?.channels,
    handleAuthorizeClick,
    navigate,
    onChangeStep,
    refetchYppSyncedChannels,
    setSelectedChannelId,
  ])

  const authorizationStep = useMemo(() => {
    switch (currentStep) {
      case 'requirements':
        return {
          title: 'Requirements',
          description: `Before you can apply to the program, make sure your YouTube channel meets the below conditions.`,
          primaryButton: {
            text: isFetchingData
              ? 'Please wait...'
              : activeMembership?.channels.length
              ? 'Continue'
              : 'Create new channel',
            disabled: isFetchingData,
            onClick: () => verifyChannelRequirements(),
          },
          component: <YppAuthorizationRequirementsStep requirements={requirements} />,
        }
      case 'select-channel':
        return {
          title: 'Select channel',
          description: `Select the ${APP_NAME} channel you want your YouTube channel to be connected with.`,
          primaryButton: {
            text: 'Authorize with YouTube',
            onClick: () => handleAuthorizeClick(),
            disabled: !selectedChannel,
          },
          component: (
            <YppAuthorizationSelectChannelStep
              channels={unSyncedChannels}
              selectedChannelId={selectedChannelId}
              onSelectChannel={handleSelectChannel}
            />
          ),
        }
      case 'fetching-data':
        return {
          headerIcon: <Loader variant="medium" />,
          title: 'Waiting for YouTube...',
          description: "Please wait and don't close this tab as we're pulling your channel information from YouTube.",
          primaryButton: {
            text: 'Waiting...',
            disabled: true,
          },
        }
      case 'details':
        return {
          title: 'Details',
          description: 'Provide additional information to set up your program membership.',
          primaryButton: {
            onClick: () => handleSubmitDetailsForm(),
            text: 'Continue',
          },
          component: <YppAuthorizationDetailsFormStep />,
        }
      case 'ypp-sync':
        return {
          title: 'YouTube Sync',
          description: `With YouTube Sync enabled, ${APP_NAME} will import videos from your YouTube channel over to Joystream. This can be changed later.`,
          primaryButton: {
            onClick: () => handleSubmitDetailsForm(),
            text: 'Continue',
          },
          component: <YppAuthorizationSyncStep />,
        }
      case 'terms-and-conditions':
        return {
          title: null,
          description: ``,
          primaryButton: {
            text: isSubmitting ? 'Please wait...' : 'Accept terms & sign',
            disabled: isSubmitting,
            onClick: handleAcceptTermsAndSubmit,
          },
          additionalSubtitleNode: null,
          component: <YppAuthorizationTermsAndConditionsStep />,
        }
      case 'summary':
        return {
          title: 'Congratulations!',
          description: (
            <DescriptionText variant="t200" as="span" color="inherit">
              Your channel is now successfully enrolled to {APP_NAME} YouTube Partnership Program! Go to Dashboard for
              more information.
            </DescriptionText>
          ),
          primaryButton: {
            text: 'Go to dashboard',
            to: absoluteRoutes.studio.yppDashboard(),
            onClick: handleGoToDashboard,
          },
          component: <Img src={appScreenshot} />,
        }
      case 'channel-already-registered':
        return {
          headerIcon: <SvgAlertsError32 />,
          title: 'Authorization failed',
          primaryButton: {
            text: 'Select another channel',
            onClick: () => handleAuthorizeClick(),
          },
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
    currentStep,
    isFetchingData,
    activeMembership?.channels.length,
    requirements,
    handleAuthorizeClick,
    selectedChannel,
    unSyncedChannels,
    selectedChannelId,
    handleSelectChannel,
    isSubmitting,
    handleAcceptTermsAndSubmit,
    handleGoToDashboard,
    alreadyRegisteredChannel?.channelTitle,
    alreadyRegisteredChannel?.ownerMemberHandle,
    verifyChannelRequirements,
    handleSubmitDetailsForm,
  ])

  const secondaryButton = useMemo(() => {
    if (currentStep === 'select-channel' || (currentStep === 'requirements' && !hasMoreThanOneChannel)) return
    if (currentStep === 'summary') {
      return {
        text: 'Close',
        onClick: handleClose,
      }
    }

    return {
      text: 'Back',
      disabled: isSubmitting,
      onClick: handleGoBack,
    }
  }, [currentStep, hasMoreThanOneChannel, handleGoBack, isSubmitting, handleClose])

  return (
    <FormProvider {...detailsFormMethods}>
      <DialogModal
        contentRef={contentRef}
        show={currentStep != null}
        dividers
        additionalActionsNodeMobilePosition="bottom"
        primaryButton={authorizationStep?.primaryButton}
        secondaryButton={secondaryButton}
        additionalActionsNode={
          currentStep !== 'summary' &&
          currentStep !== 'fetching-data' && (
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
        {authorizationStep?.additionalSubtitleNode}
        <Text variant="t200" as="p" color="colorText">
          {authorizationStep?.description}
        </Text>
        {authorizationStep?.component ? <Content>{authorizationStep.component}</Content> : null}
      </DialogModal>
    </FormProvider>
  )
}
