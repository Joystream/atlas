import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import appScreenshot from '@/assets/images/ypp-authorization/app-screenshot.webp'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { Loader } from '@/components/_loaders/Loader'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'
import { useUser } from '@/providers/user/user.hooks'

import { RequirmentError, useYppGoogleAuth } from './YppAuthorizationModal.hooks'
import {
  AdditionalSubtitle,
  Content,
  HeaderIconsWrapper,
  Img,
  StyledSvgAppLogoShort,
} from './YppAuthorizationModal.styles'
import { YPP_AUTHORIZATION_STEPS, YPP_AUTHORIZATION_STEPS_WITHOUT_CHANNEL_SELECT } from './YppAuthorizationModal.types'
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

export const YppAuthorizationModal: FC<YppAuthorizationModalProps> = ({ currentStepIdx, setCurrentStepIdx }) => {
  const { activeMembership, setActiveUser } = useUser()
  const channels = activeMembership?.channels
  const channelsLoaded = !!channels
  const hasMoreThanOneChannel = channels && channels.length > 1
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)

  const detailsFormMethods = useForm<DetailsFormData>({
    defaultValues: {
      referrerChannelId: '',
      referrerChannelTitle: '',
      email: '',
    },
  })

  const authorizationSteps = hasMoreThanOneChannel
    ? YPP_AUTHORIZATION_STEPS
    : YPP_AUTHORIZATION_STEPS_WITHOUT_CHANNEL_SELECT // if the user has only a single channel, skip "Select channel" step
  const currentStep = currentStepIdx != null ? authorizationSteps[currentStepIdx] : null

  const goToLoadingStep = useCallback(() => {
    setCurrentStepIdx(authorizationSteps.findIndex((step) => step === 'fetching-data'))
  }, [authorizationSteps, setCurrentStepIdx])

  const { handleAuthorizeClick, ytRequirmentsErrors, ytResponseData } = useYppGoogleAuth({
    closeModal: useCallback(() => setCurrentStepIdx(null), [setCurrentStepIdx]),
    channelsLoaded,
    goToLoadingStep,
    selectedChannelId,
    setSelectedChannelId,
    setCurrentStepIdx,
  })

  useEffect(() => {
    if (ytResponseData?.email) {
      detailsFormMethods.setValue('email', ytResponseData.email)
    }
  }, [detailsFormMethods, ytResponseData?.email])

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

  const goToNextStep = useCallback(
    () => setCurrentStepIdx((prev) => (prev != null ? prev + 1 : null)),
    [setCurrentStepIdx]
  )
  const goToPreviousStep = useCallback(
    () => setCurrentStepIdx((prev) => (prev != null ? prev - 1 : null)),
    [setCurrentStepIdx]
  )

  // if selected channel is not set, default to the first one
  useEffect(() => {
    if (!channels || !channels.length || selectedChannelId) {
      return
    }
    setSelectedChannelId(channels[0].id)
  }, [channels, selectedChannelId, setSelectedChannelId])

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

  const submit = detailsFormMethods.handleSubmit(() => {
    // todo handle
  })

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
            text: 'Authorize with YouTube',
            onClick: handleAuthorizeClick,
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
              submit()
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
          primaryButton: { text: 'Accept terms & sign' },
          additionalSubtitleNode: (
            <AdditionalSubtitle>
              <Text variant="h400" as="span">
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
    handleAuthorizeClick,
    isSelectedChannelValid,
    requirments,
    setActiveUser,
    submit,
  ])

  return (
    <FormProvider {...detailsFormMethods}>
      <DialogModal
        show={currentStepIdx != null}
        dividers
        primaryButton={authorizationStep?.primaryButton}
        secondaryButton={
          currentStepIdx !== 0 && currentStep !== 'fetching-data'
            ? currentStep === 'summary'
              ? { text: 'Close', onClick: () => setCurrentStepIdx(null) }
              : { text: 'Back', onClick: goToPreviousStep }
            : undefined
        }
        additionalActionsNode={
          currentStep !== 'summary' &&
          currentStep !== 'fetching-data' && (
            <Button variant="tertiary" onClick={() => setCurrentStepIdx(null)}>
              Cancel
            </Button>
          )
        }
      >
        <HeaderIconsWrapper>
          {currentStep === 'fetching-data' ? <Loader variant="medium" /> : <StyledSvgAppLogoShort />}
        </HeaderIconsWrapper>
        <Text variant="h500" as="h2" margin={{ top: 6, bottom: 2 }}>
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
