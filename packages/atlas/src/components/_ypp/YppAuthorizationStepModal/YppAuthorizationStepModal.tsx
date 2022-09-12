import { FC, useMemo } from 'react'

import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import appScreenshot from '@/assets/images/ypp-authorization/app-screenshot.webp'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { DialogModal, DialogModalProps } from '@/components/_overlays/DialogModal'

import { AdditionalSubtitle, Content, Img, StyledSvgAtlasLogoShort } from './YppAuthorizationStepModal.styles'

import { DetailsFormDialog } from '../DetailsFormDialog'
import { RequirementsDialog } from '../RequirementsDialog'
import { SelectChannelDialog } from '../SelectChannelDialog'
import { TermsAndConditionsDialog } from '../TermsAndConditionsDialog'

type Step = 'select-channel' | 'requirements' | 'details' | 'terms-and-conditions' | 'summary' | 'connect-with-yt'

export type YppAuthorizationStepModalProps = {
  onPrimaryClick?: () => void
  onBackClick?: () => void
  onCancelClick?: () => void
  step: Step
  channels: BasicChannelFieldsFragment[]
} & Pick<DialogModalProps, 'show'>

export const YppAuthorizationStepModal: FC<YppAuthorizationStepModalProps> = ({
  show,
  onBackClick,
  onCancelClick,
  channels,
  step,
}) => {
  const isSummary = step === 'summary'
  const isConnectWithYt = step === 'connect-with-yt'
  const authorizationStep = useMemo(() => {
    switch (step) {
      case 'select-channel':
        return {
          title: 'Select channel',
          description: 'Select the Atlas channel you want your YouTube channel to be connected with.',
          primaryButton: { text: 'Select channel' },
          component: <SelectChannelDialog channels={channels} />,
        }
      case 'requirements':
        return {
          title: 'Requirements',
          description:
            'Before you can apply to the program, make sure both your Atlas and YouTube channels meet the below conditions.',
          primaryButton: {
            text: 'Authorize with YouTube',
          },
          component: <RequirementsDialog />,
        }
      case 'details':
        return {
          title: 'Details',
          description: 'We need your email address to send you payment information. No spam or marketing materials.',
          primaryButton: {
            text: 'Continue',
          },
          component: <DetailsFormDialog />,
        }
      case 'terms-and-conditions':
        return {
          title: 'Terms & conditions',
          description:
            'Once automatic YouTube videos sync is available, in order for it to work, your Atlas channel [NEEDS TO DO WHAT?]. This is purely a technical measure and does not affect ownership and rights to the content uploaded to you Atlas channel.',
          primaryButton: { text: 'Accept terms & sign' },
          additionalSubtitleNode: (
            <AdditionalSubtitle>
              <Text variant="h400" as="span">
                Automatic YouTube sync
              </Text>{' '}
              <Text variant="t100" as="span" color="colorText">
                Coming later this year
              </Text>
            </AdditionalSubtitle>
          ),
          component: <TermsAndConditionsDialog />,
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
                <Button variant="primary" _textOnly>
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
      secondaryButton={{ text: !isSummary ? 'Back' : 'Close', onClick: onBackClick }}
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
      <StyledSvgAtlasLogoShort />
      <Text variant="h500" as="h2" margin={{ top: 6, bottom: 2 }}>
        {authorizationStep?.title}
      </Text>
      {authorizationStep?.additionalSubtitleNode}
      <Text variant="t200" as="p" color="colorText">
        {authorizationStep?.description}
      </Text>
      <Content>{authorizationStep?.component}</Content>
    </DialogModal>
  )
}
