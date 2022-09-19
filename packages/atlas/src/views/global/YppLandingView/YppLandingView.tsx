import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ParallaxProvider } from 'react-scroll-parallax'

import { useBasicChannel } from '@/api/hooks/channel'
import { Button } from '@/components/_buttons/Button'
import { SvgActionNewTab } from '@/components/_icons'
import { ReferralBanner } from '@/components/_ypp/ReferralBanner'
import { Step, YppAuthorizationModal } from '@/components/_ypp/YppAuthorizationModal'
import { GOOGLE_CONSOLE_CLIENT_ID, GOOGLE_OAUTH_ENDPOINT, JOYSTREAM_DISCORD_URL } from '@/config/env'
import { QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { useAsset } from '@/providers/assets/assets.hooks'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user/user.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'

import { YppCardsSections } from './YppCardsSections'
import { YppFooter } from './YppFooter'
import { YppHero } from './YppHero'
import { BannerContainer } from './YppLandingView.styles'
import { YppRewardSection } from './YppRewardSection'
import { YppThreeStepsSection } from './YppThreeStepsSection'

export const SNACKBAR_TIMEOUT = 5000

export const YppLandingView: FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [authorizationStep, setAuthorizationStep] = useState<Step | null>(null)
  const headTags = useHeadTags('Youtube Partner Program')

  const queryReferrerId = useRouterQuery(QUERY_PARAMS.REFERRER_ID)
  const setReferrerId = useYppStore((state) => state.actions.setReferrerId)
  // persist referrer id in store
  useEffect(() => {
    if (queryReferrerId) {
      setReferrerId(queryReferrerId)
    }
  }, [queryReferrerId, setReferrerId])

  const storeReferrerId = useYppStore((state) => state.referrerId)
  const referrerId = queryReferrerId || storeReferrerId
  const { loading: loadingReferrerChannel, channel: referrerChannel } = useBasicChannel(referrerId || '', {
    skip: !referrerId,
  })
  const { isLoadingAsset: isLoadingReferrerAvatar, url: referrerChannelUrl } = useAsset(referrerChannel?.avatarPhoto)
  const shouldShowReferrerBanner = referrerId && (loadingReferrerChannel || referrerChannel)

  const { activeMembership } = useUser()
  const navigate = useNavigate()
  const previousStep = useRef<Step | null>(null)
  const { displaySnackbar } = useSnackbar()
  const [openConfirmationModal, closeConfirmationModal] = useConfirmationModal()
  const [searchParams, setSearchParams] = useSearchParams()

  const channels = activeMembership?.channels
  const foundSelectedChannel = channels?.find((channel) => channel.id === selectedChannel)
  const isChannelValid =
    foundSelectedChannel &&
    !!foundSelectedChannel.avatarPhoto &&
    !!foundSelectedChannel.coverPhoto &&
    !!foundSelectedChannel.description

  const params = {
    client_id: GOOGLE_CONSOLE_CLIENT_ID,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
    include_granted_scopes: 'true',
    prompt: 'consent',
    redirect_uri: `${window.location.origin}${window.location.pathname}`,
  }

  const handleDeleteSearchParam = useCallback(
    (param: string) => {
      searchParams.delete(param)
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  // after returning from google authentication page, open the appropriate authentication modal step
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      previousStep.current = 'requirements'
      setAuthorizationStep('details')
    }
  }, [searchParams])

  // after returning from google authentication page with error, open the appropriate confirmation modal
  useEffect(() => {
    const error = searchParams.get('error')
    if (error && error !== 'access_denied') {
      openConfirmationModal({
        title: 'Authorization failed',
        // TODO: set proper variables
        description: (
          <>
            The YouTube channel you selected is already enrolled in the YouTube Partner Program and is tied to the{' '}
            {'{channel_name}'} Atlas channel which belongs to {'{member_name}'}. If you believe this is a mistake, try
            again or reach out on the{' '}
            <Button _textOnly variant="primary" to={JOYSTREAM_DISCORD_URL}>
              #XYZ channel on our Discord server
            </Button>
            .
          </>
        ),
        type: 'destructive',
        primaryButton: {
          text: 'Select another channel',
          onClick: () => {
            closeConfirmationModal()
            handleDeleteSearchParam('error')
            setAuthorizationStep('select-channel')
          },
          variant: 'primary',
        },
        additionalActionsNode: (
          <Button
            variant="tertiary"
            onClick={() => {
              closeConfirmationModal()
              handleDeleteSearchParam('error')
            }}
          >
            Cancel
          </Button>
        ),
      })
    }
  }, [closeConfirmationModal, handleDeleteSearchParam, openConfirmationModal, searchParams, setSearchParams])

  // show snackbar if user's channel doesn't meet requirements
  useEffect(() => {
    if (authorizationStep === 'requirements' && !isChannelValid) {
      displaySnackbar({
        title: 'Your Atlas channel doesn’t meet conditions',
        description:
          'Your Atlas channel must have a custom avatar, cover image, and description set in order to be enrolled in the program.',
        iconType: 'error',
        actionText: 'Edit channel',
        actionIcon: <SvgActionNewTab />,
        actionIconPlacement: 'right',
        onActionClick: () => navigate(absoluteRoutes.studio.editChannel()),
        timeout: SNACKBAR_TIMEOUT,
      })
    }
  }, [authorizationStep, displaySnackbar, isChannelValid, navigate])

  const handleSignUpClick = () => {
    if (!channels?.length) {
      navigate(absoluteRoutes.studio.signIn())
    }
    if (channels && channels?.length > 1) {
      setAuthorizationStep('select-channel')
      return
    }
    setAuthorizationStep('requirements')
  }

  const handleSetStep = (selectedStep: Step) => {
    previousStep.current = authorizationStep
    setAuthorizationStep(selectedStep)
  }

  const handleBackClick = () => {
    setAuthorizationStep(previousStep.current)
  }

  return (
    <>
      {headTags}
      <YppAuthorizationModal
        show={!!authorizationStep}
        step={authorizationStep}
        channels={channels}
        selectedChannel={selectedChannel}
        authorizationUrl={`${GOOGLE_OAUTH_ENDPOINT}?${new URLSearchParams(params).toString()}`}
        isChannelValid={isChannelValid}
        onCancelClick={() => setAuthorizationStep(null)}
        onSelectStep={handleSetStep}
        onBackClick={handleBackClick}
        onSelectChannel={setSelectedChannel}
      />
      <ParallaxProvider>
        {shouldShowReferrerBanner && (
          <BannerContainer>
            <ReferralBanner
              channelId={referrerId}
              channelTitle={referrerChannel?.title}
              channelAvatarUrl={referrerChannelUrl}
              channelLoading={isLoadingReferrerAvatar || loadingReferrerChannel}
            />
          </BannerContainer>
        )}
        <YppHero onSignUpClick={handleSignUpClick} />
        <YppRewardSection />
        <YppThreeStepsSection />
        <YppCardsSections />
        <YppFooter />
      </ParallaxProvider>
    </>
  )
}
