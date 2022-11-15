import axios from 'axios'
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useBasicChannel } from '@/api/hooks/channel'
import appScreenshot from '@/assets/images/ypp-authorization/app-screenshot.webp'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { Loader } from '@/components/_loaders/Loader'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useChannelsStorageBucketsCount } from '@/providers/assets/assets.hooks'
import { useBloatFeesAndPerMbFees, useFee, useJoystream } from '@/providers/joystream/joystream.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { SentryLogger } from '@/utils/logs'

import { useYppGoogleAuth } from './YppAuthorizationModal.hooks'
import {
  AdditionalSubtitle,
  Content,
  HeaderIconsWrapper,
  Img,
  StyledSvgAppLogoShort,
} from './YppAuthorizationModal.styles'
import {
  RequirmentError,
  YPP_AUTHORIZATION_STEPS,
  YPP_AUTHORIZATION_STEPS_WITHOUT_CHANNEL_SELECT,
  YppAuthorizationStepsType,
} from './YppAuthorizationModal.types'
import {
  DetailsFormData,
  YppAuthorizationDetailsFormStep,
  YppAuthorizationRequirementsStep,
  YppAuthorizationSelectChannelStep,
  YppAuthorizationTermsAndConditionsStep,
} from './YppAuthorizationSteps'

export type YppAuthorizationModalProps = {
  currentStepIdx: number | null
  setCurrentStepIdx: Dispatch<SetStateAction<number | null>>
}

type FinalFormData = {
  authorizationCode?: string
  userId?: string
  email?: string
  joystreamChannelId?: number
  referrerChannelId?: number
}

export const YppAuthorizationModal: FC<YppAuthorizationModalProps> = ({ currentStepIdx, setCurrentStepIdx }) => {
  const { activeMembership, setActiveUser, memberId } = useUser()
  const channels = activeMembership?.channels
  const channelsLoaded = !!channels
  const hasMoreThanOneChannel = channels && channels.length > 1
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)
  const [finalFormData, setFinalFormData] = useState<FinalFormData | null>(null)

  const smMatch = useMediaMatch('sm')

  const detailsFormMethods = useForm<DetailsFormData>({
    defaultValues: {
      referrerChannelId: '',
      referrerChannelTitle: '',
      email: '',
    },
  })
  const { dataObjectStateBloatBondValue } = useBloatFeesAndPerMbFees()
  const channelBucketsCount = useChannelsStorageBucketsCount(selectedChannelId)

  const { joystream, proxyCallback } = useJoystream()
  const youtubeCollaboratorMemberId = atlasConfig.features.ypp.youtubeCollaboratorMemberId || ''

  const referrerId = useYppStore((store) => store.referrerId)
  const setReferrerId = useYppStore((store) => store.actions.setReferrerId)

  const { channel: channel } = useBasicChannel(referrerId || '', {
    skip: !referrerId,
  })

  const { fullFee: updateChannelFee } = useFee(
    'updateChannelTx',
    selectedChannelId && memberId
      ? [
          selectedChannelId,
          memberId,
          { ownerAccount: memberId },
          {},
          [],
          dataObjectStateBloatBondValue.toString(),
          channelBucketsCount.toString(),
          youtubeCollaboratorMemberId,
        ]
      : undefined
  )

  const handleTransaction = useTransaction()
  const { displaySnackbar } = useSnackbar()

  const authorizationSteps = hasMoreThanOneChannel
    ? YPP_AUTHORIZATION_STEPS
    : YPP_AUTHORIZATION_STEPS_WITHOUT_CHANNEL_SELECT // if the user has only a single channel, skip "Select channel" step
  const currentStep = currentStepIdx != null ? authorizationSteps[currentStepIdx] : null

  const goToStep = useCallback(
    (particularStep: YppAuthorizationStepsType) => {
      setCurrentStepIdx(authorizationSteps.findIndex((step) => step === particularStep))
    },
    [authorizationSteps, setCurrentStepIdx]
  )

  const goToNextStep = useCallback(
    () => setCurrentStepIdx((prev) => (prev != null ? prev + 1 : null)),
    [setCurrentStepIdx]
  )
  const goToPreviousStep = useCallback(
    () => setCurrentStepIdx((prev) => (prev != null ? prev - 1 : null)),
    [setCurrentStepIdx]
  )

  const { handleAuthorizeClick, ytRequirmentsErrors, ytResponseData, setYtRequirmentsErrors } = useYppGoogleAuth({
    closeModal: useCallback(() => setCurrentStepIdx(null), [setCurrentStepIdx]),
    channelsLoaded,
    goToStep,
    selectedChannelId,
    setSelectedChannelId,
  })

  const handleClose = useCallback(() => {
    setYtRequirmentsErrors([])
    setReferrerId(null)
    setCurrentStepIdx(null)
  }, [setCurrentStepIdx, setReferrerId, setYtRequirmentsErrors])

  const handleSubmitDetailsForm = detailsFormMethods.handleSubmit((data) => {
    setFinalFormData(() => ({
      ...(selectedChannelId ? { joystreamChannelId: parseInt(selectedChannelId) } : {}),
      authorizationCode: ytResponseData?.authorizationCode,
      userId: ytResponseData?.userId,
      email: data.email,
      ...(data.referrerChannelId ? { referrerChannelId: parseInt(data.referrerChannelId) } : {}),
    }))
    goToStep('terms-and-conditions')
  })

  const handleAcceptTermsAndSubmit = useCallback(async () => {
    if (!joystream || !selectedChannelId || !memberId) {
      return
    }
    try {
      await axios.post(`${atlasConfig.features.ypp.youtubeSyncApiUrl}/channels`, finalFormData)
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
          goToNextStep()
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
    }
  }, [
    channelBucketsCount,
    dataObjectStateBloatBondValue,
    displaySnackbar,
    finalFormData,
    goToNextStep,
    handleTransaction,
    joystream,
    memberId,
    proxyCallback,
    selectedChannelId,
    youtubeCollaboratorMemberId,
  ])

  useEffect(() => {
    if (channel?.title && referrerId) {
      detailsFormMethods.setValue('referrerChannelId', referrerId)
      detailsFormMethods.setValue('referrerChannelTitle', channel.title)
    }
  }, [channel, detailsFormMethods, referrerId])

  useEffect(() => {
    if (ytResponseData?.email) {
      detailsFormMethods.setValue('email', ytResponseData.email)
    }
  }, [detailsFormMethods, ytResponseData?.email])

  // if selected channel is not set, default to the first one
  useEffect(() => {
    if (!channels || !channels.length || selectedChannelId) {
      return
    }
    setSelectedChannelId(channels[0].id)
  }, [channels, selectedChannelId, setSelectedChannelId])

  const selectedChannel = useMemo(() => {
    if (!channels || !selectedChannelId) {
      return null
    }
    return channels.find((channel) => channel.id === selectedChannelId)
  }, [channels, selectedChannelId])

  const isSelectedChannelValid = useMemo(
    () =>
      (selectedChannel &&
        !!selectedChannel.avatarPhoto &&
        !!selectedChannel.coverPhoto &&
        !!selectedChannel.description) ??
      false,
    [selectedChannel]
  )

  const requirments = useMemo(
    () => [
      { text: 'Your Atlas channel avatar, cover image, and description are set', fulfilled: isSelectedChannelValid },
      {
        text: 'Your YouTube channel is at least 3 months old',
        fulfilled: !ytRequirmentsErrors.some((error) => error === RequirmentError.CHANNEL_CRITERIA_UNMET_CREATION_DATE),
      },
      {
        text: 'Your YouTube channel has at least 10 videos, all published at least 1 month ago',
        fulfilled: !ytRequirmentsErrors.some((error) => error === RequirmentError.CHANNEL_CRITERIA_UNMET_VIDEOS),
      },
      {
        text: 'Your YouTube channel has at least 50 subscribers',
        fulfilled: !ytRequirmentsErrors.some((error) => error === RequirmentError.CHANNEL_CRITERIA_UNMET_SUBSCRIBERS),
      },
    ],
    [isSelectedChannelValid, ytRequirmentsErrors]
  )

  const isChannelFulfillRequirements = requirments.every((req) => req.fulfilled)

  const authorizationStep = useMemo(() => {
    switch (currentStep) {
      case 'select-channel':
        return {
          title: 'Select channel',
          description: 'Select the Atlas channel you want your YouTube channel to be connected with.',
          primaryButton: {
            text: 'Select channel',
            onClick: goToNextStep,
            disabled: !selectedChannel,
          },
          component: (
            <YppAuthorizationSelectChannelStep
              channels={channels}
              selectedChannelId={selectedChannelId}
              onSelectChannel={setSelectedChannelId}
            />
          ),
        }
      case 'requirements':
        return {
          title: 'Requirements',
          description:
            'Before you can apply to the program, make sure both your Atlas and YouTube channels meet the below conditions.',
          primaryButton: {
            text: isChannelFulfillRequirements ? 'Authorize with YouTube' : 'Close',
            onClick: isChannelFulfillRequirements ? handleAuthorizeClick : handleClose,
            disabled: !isSelectedChannelValid,
          },
          component: (
            <YppAuthorizationRequirementsStep
              requirments={requirments}
              onChangeChannel={() => selectedChannel && setActiveUser({ channelId: selectedChannel.id })}
              isChannelValid={isSelectedChannelValid}
            />
          ),
        }
      case 'fetching-data':
        return {
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
          description: 'We need your email address to send you payment information. No spam or marketing materials.',
          primaryButton: {
            onClick: () => {
              handleSubmitDetailsForm()
            },
            text: 'Continue',
          },
          component: <YppAuthorizationDetailsFormStep />,
        }
      case 'terms-and-conditions':
        return {
          title: 'Terms & conditions',
          // TODO: add proper copy once it's available in figma https://www.figma.com/file/oQqFqdAiPu16eeE2aA5AD5?node-id=1637:118716#267556722
          description:
            'Once automatic YouTube videos sync is available, in order for it to work, your Atlas channel [NEEDS TO DO WHAT?]. This is purely a technical measure and does not affect ownership and rights to the content uploaded to you Atlas channel.',
          primaryButton: {
            text: 'Accept terms & sign',
            onClick: handleAcceptTermsAndSubmit,
          },
          additionalSubtitleNode: (
            <AdditionalSubtitle>
              <Text variant={smMatch ? 'h400' : 'h300'} as="h3" margin={{ bottom: 4 }}>
                Transaction fee
              </Text>
              <Text variant="t200" as="p" color="colorText" margin={{ bottom: 6 }}>
                Applying for the program requires requires a blockchain transaction, which comes with a fee of{' '}
                <NumberFormat as="span" variant="t200" value={updateChannelFee} withToken /> . Transaction fees are
                covered from your membership account balance.
              </Text>
              <Text variant={smMatch ? 'h400' : 'h300'} as="span">
                Automatic YouTube sync
              </Text>{' '}
              <Text variant="t100" as="span" color="colorTextMuted">
                Coming later this year
              </Text>
            </AdditionalSubtitle>
          ),
          component: <YppAuthorizationTermsAndConditionsStep />,
        }
      case 'summary':
        return {
          title: 'Congratulations!',
          description: (
            <>
              Congratulations! You just received 200 JOY as your Atlas channel is now officially enrolled in the YouTube
              Partner Program and tied with a YouTube channel.{' '}
              <Text variant="t200" as="p" margin={{ top: 2 }} color="colorText">
                All information around your activity in the program can be found in the{' '}
                <Button variant="primary" _textOnly to={absoluteRoutes.studio.yppDashboard()}>
                  YPP page in Studio
                </Button>
                .
              </Text>
            </>
          ),
          primaryButton: { text: 'Go to dashboard' },
          component: <Img src={appScreenshot} />,
        }
    }
  }, [
    currentStep,
    goToNextStep,
    selectedChannel,
    channels,
    selectedChannelId,
    isChannelFulfillRequirements,
    handleAuthorizeClick,
    handleClose,
    isSelectedChannelValid,
    requirments,
    handleAcceptTermsAndSubmit,
    smMatch,
    updateChannelFee,
    setActiveUser,
    handleSubmitDetailsForm,
  ])

  return (
    <FormProvider {...detailsFormMethods}>
      <DialogModal
        show={currentStepIdx != null}
        dividers
        additionalActionsNodeMobilePosition="bottom"
        primaryButton={authorizationStep?.primaryButton}
        secondaryButton={
          currentStepIdx !== 0 && currentStep !== 'fetching-data'
            ? currentStep === 'summary'
              ? { text: 'Close', onClick: handleClose }
              : { text: 'Back', onClick: goToPreviousStep }
            : undefined
        }
        additionalActionsNode={
          currentStep !== 'summary' &&
          currentStep !== 'fetching-data' && (
            <Button variant="tertiary" onClick={handleClose}>
              Cancel
            </Button>
          )
        }
      >
        <HeaderIconsWrapper>
          {currentStep === 'fetching-data' ? <Loader variant="medium" /> : <StyledSvgAppLogoShort />}
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
