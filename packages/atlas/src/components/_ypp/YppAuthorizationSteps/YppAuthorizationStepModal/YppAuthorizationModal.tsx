import { FC, useMemo } from 'react'

import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import appScreenshot from '@/assets/images/ypp-authorization/app-screenshot.webp'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgLogoYoutube } from '@/components/_icons'
import { DialogModal, DialogModalProps } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'

import {
  AdditionalSubtitle,
  Content,
  HeaderIconsWrapper,
  Img,
  StyledSvgAtlasLogoShort,
  StyledSvgControlsConnect,
} from './YppAuthorizationModal.styles'

import { YppAuthorizationDetailsFormStep } from '../YppAuthorizationDetailsFormStep'
import { YppAuthorizationRequirementsStep } from '../YppAuthorizationRequirementsStep'
import { YppAuthorizationSelectChannelStep } from '../YppAuthorizationSelectChannelStep'
import { YppAuthorizationTermsAndConditionsStep } from '../YppAuthorizationTermsAndConditionsStep'

type Step = 'select-channel' | 'requirements' | 'details' | 'terms-and-conditions' | 'summary' | 'connect-with-yt'

export type YppAuthorizationModalProps = {
  onPrimaryClick?: () => void
  onBackClick?: () => void
  onCancelClick?: () => void
  step: Step
  channels: BasicChannelFieldsFragment[]
} & Pick<DialogModalProps, 'show'>

export const YppAuthorizationModal: FC<YppAuthorizationModalProps> = ({
  show,
  onBackClick,
  onCancelClick,
  channels,
  step,
}) => {
  const isSummary = step === 'summary'
  const isConnectWithYt = step === 'connect-with-yt'
  const isSelectChannel = step === 'select-channel'
  const authorizationStep = useMemo(() => {
    switch (step) {
      case 'select-channel':
        return {
          title: 'Select channel',
          description: 'Select the Atlas channel you want your YouTube channel to be connected with.',
          primaryButton: { text: 'Select channel' },
          component: <YppAuthorizationSelectChannelStep channels={channels} />,
        }
      case 'requirements':
        return {
          title: 'Requirements',
          description:
            'Before you can apply to the program, make sure both your Atlas and YouTube channels meet the below conditions.',
          primaryButton: {
            text: 'Authorize with YouTube',
          },
          component: <YppAuthorizationRequirementsStep />,
        }
      case 'details':
        return {
          title: 'Details',
          description: 'We need your email address to send you payment information. No spam or marketing materials.',
          primaryButton: {
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
      case 'connect-with-yt':
        return {
          title: 'Connect with YouTube?',
          description:
            'Reupload and backup your YouTube videos to receive to receive a guaranteed payout in the YouTube Partner Program.',
          primaryButton: {
            text: 'Authorize with YouTube',
          },
        }
    }
  }, [channels, step])
  return (
    <DialogModal
      show={show}
      dividers
      primaryButton={authorizationStep?.primaryButton}
      secondaryButton={
        !isSelectChannel ? { text: !isSummary && !isConnectWithYt ? 'Back' : 'Close', onClick: onBackClick } : undefined
      }
      additionalActionsNode={
        isConnectWithYt ? (
          <Button variant="tertiary">Learn more</Button>
        ) : (
          !isSummary && (
            <Button variant="tertiary" onClick={onCancelClick}>
              Cancel
            </Button>
          )
        )
      }
    >
      <HeaderIconsWrapper>
        {isConnectWithYt && (
          <>
            <SvgLogoYoutube />
            <StyledSvgControlsConnect fill="yellow" />
          </>
        )}
        <StyledSvgAtlasLogoShort />
      </HeaderIconsWrapper>
      <Text variant="h500" as="h2" margin={{ top: 6, bottom: 2 }}>
        {authorizationStep?.title}
      </Text>
      {authorizationStep?.additionalSubtitleNode}
      <Text variant="t200" as="p" color="colorText">
        {authorizationStep?.description}
      </Text>
      {authorizationStep?.component && <Content>{authorizationStep?.component}</Content>}
    </DialogModal>
  )
}
